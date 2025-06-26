// Types
export type Appointment = {
    id: string;
    title: string;
    start: Date;
    end: Date;
};

export type CalendarEvent = Appointment & { type: "appointment" | "non-working" };

// Constants
export const HOURS_IN_DAY = 24;
export const SCROLL_OFFSET = 200;
export const DEFAULT_HOUR_HEIGHT = 72;
export const DEFAULT_MAX_HEIGHT = 700;

// Utilities
export function getHourFraction(date: Date) {
    return date.getHours() + date.getMinutes() / 60;
}

export function getNonWorkingBlocks(date: Date, workingHours: { start: number; end: number }) {
    const blocks: CalendarEvent[] = [];
    if (workingHours.start > 0) {
        blocks.push({
            id: "non-working-before",
            title: "Non-working hours",
            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0),
            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), workingHours.start, 0),
            type: "non-working",
        });
    }
    if (workingHours.end < 24) {
        blocks.push({
            id: "non-working-after",
            title: "Non-working hours",
            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), workingHours.end, 0),
            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59),
            type: "non-working",
        });
    }
    return blocks;
}

export function getAllEvents(date: Date, appointments: Appointment[], workingHours: { start: number; end: number }) {
    return [
        ...getNonWorkingBlocks(date, workingHours),
        ...appointments.map(app => ({ ...app, type: "appointment" as const })),
    ];
}