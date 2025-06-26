import React, { useEffect } from "react";
import { Appointment, DEFAULT_HOUR_HEIGHT, getHourFraction, SCROLL_OFFSET } from "./DayView";
import { HourGrid } from "./HourGrid";

export type WeekViewProps = {
    weekStartDate: Date;
    appointments: Appointment[];
    workingHours?: { start: number; end: number };
    hourHeight?: number;
    scrollRef: React.MutableRefObject<null | HTMLDivElement>
};

const HOURS_IN_DAY = 24;

function getWeekDates(weekStartDate: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStartDate);
        d.setDate(weekStartDate.getDate() + i);
        return d;
    });
}

function filterAppointmentsForDay(appointments: Appointment[], day: Date) {
    return appointments.filter((a) =>
        a.start.getFullYear() === day.getFullYear() &&
        a.start.getMonth() === day.getMonth() &&
        a.start.getDate() === day.getDate()
    );
}

const WeekView: React.FC<WeekViewProps> = ({
    weekStartDate,
    appointments,
    workingHours = { start: 8, end: 17 },
    hourHeight = DEFAULT_HOUR_HEIGHT,
    scrollRef
}) => {
    const weekDates = getWeekDates(weekStartDate);

    useEffect(() => {
        const now = new Date();
        const nowHourFraction = getHourFraction(now);
        const nowTop = nowHourFraction * hourHeight;
        if (scrollRef.current) {
            scrollRef.current.scrollTop = Math.max(0, nowTop - SCROLL_OFFSET);
        }
    }, [hourHeight, scrollRef, weekStartDate]);

    const hours = Array.from({ length: HOURS_IN_DAY }, (_, i) => i);



    return (
        <div className="flex w-full border border-base-200 rounded-lg shadow-sm">
            {/* Hour grid column */}
            <div className="flex flex-col w-20 bg-base-100 border-r border-base-300 select-none">
                <div className="h-12" />
                <HourGrid />
            </div>
            {/* Scrollable week grid */}
            <div
                className="flex-1 flex relative"
            >
                {weekDates.map((date) => {
                    const dayAppointments = filterAppointmentsForDay(appointments, date);
                    const nonWorkingBlocks = [];
                    if (workingHours.start > 0) {
                        nonWorkingBlocks.push({
                            id: "non-working-before",
                            title: "Non-working hours",
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), workingHours.start, 0),
                            type: "non-working",
                        });
                    }
                    if (workingHours.end < HOURS_IN_DAY) {
                        nonWorkingBlocks.push({
                            id: "non-working-after",
                            title: "Non-working hours",
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), workingHours.end, 0),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59),
                            type: "non-working",
                        });
                    }
                    const allEvents = [
                        ...nonWorkingBlocks,
                        ...dayAppointments.map(app => ({ ...app, type: "appointment" })),
                    ];
                    return (
                        <div key={date.toISOString()}
                            className="flex-1 min-w-0 sm:min-w-[160px] border-r border-base-300 last:border-r-0 relative"
                            style={{ flexBasis: 0, flexShrink: 1 }}
                        >
                            {/* Day header */}
                            <div className="h-12 flex items-center justify-center bg-base-200 border-b border-base-300 text-sm font-semibold">
                                {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                            </div>
                            {/* Hour slots (for background) */}
                            <div className="absolute top-12 left-0 right-0" style={{ zIndex: 0 }}>
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="border-b border-base-300 min-h-12"
                                        style={{ height: `${hourHeight}px` }}
                                    />
                                ))}
                            </div>
                            {/* Events overlay */}
                            <div className="absolute top-12 left-0 right-0 bottom-0 pointer-events-none" style={{ zIndex: 1 }}>
                                {allEvents.map((event) => {
                                    const startHour = getHourFraction(event.start);
                                    const endHour = getHourFraction(event.end);
                                    const top = startHour * hourHeight;
                                    const height = Math.max((endHour - startHour) * hourHeight, 32);

                                    let eventClass = "";
                                    if (event.type === "appointment") {
                                        eventClass = "bg-primary text-primary-content";
                                    } else if (event.type === "non-working") {
                                        eventClass = "bg-error text-error-content";
                                    }
                                    return (
                                        <div
                                            key={event.id}
                                            className={`absolute left-2 right-2 ${eventClass} rounded px-2 py-1 text-xs shadow pointer-events-auto border border-base-200`}
                                            style={{ top, height }}
                                            title={`${event.title} (${event.start.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })} - ${event.end.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })})`}
                                        >
                                            {event.title}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Current time line overlay */}
                            {(() => {
                                const now = new Date();
                                if (
                                    now.getFullYear() === date.getFullYear() &&
                                    now.getMonth() === date.getMonth() &&
                                    now.getDate() === date.getDate()
                                ) {
                                    const nowHourFraction = getHourFraction(now);
                                    const nowTop = nowHourFraction * hourHeight;
                                    return (
                                        <div
                                            className="absolute left-0 right-0 z-20 pointer-events-none"
                                            style={{ top: 12 + nowTop, height: 0 }}
                                        >
                                            <div className="border-t-2 border-red-500 w-full relative">
                                                <span className="absolute -left-10 -top-2 text-xs text-red-500 bg-white px-1 rounded">
                                                    Now
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekView;
