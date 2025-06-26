import React, { useEffect, useRef } from "react";

type Appointment = {
    id: string;
    title: string;
    start: Date;
    end: Date;
};

type DayViewProps = {
    date: Date;
    appointments: Appointment[];
    workingHours?: { start: number; end: number }; // 24h format
};

const HOURS_IN_DAY = 24;
const HOUR_HEIGHT = 72; // px, adjust as needed

function getHourFraction(date: Date) {
    return date.getHours() + date.getMinutes() / 60;
}

const DayView: React.FC<DayViewProps> = ({
    date,
    appointments,
    workingHours = { start: 8, end: 17 },
}) => {

    const scrollRef = useRef<HTMLDivElement>(null);

    const now = new Date();
    const isToday =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();
    const nowHourFraction = getHourFraction(now);
    const nowTop = nowHourFraction * HOUR_HEIGHT;

    useEffect(() => {
        if (isToday && scrollRef.current) {
            scrollRef.current.scrollTop = Math.max(0, nowTop - 200);
        }
    }, [isToday, nowTop]);

    const hours = Array.from({ length: HOURS_IN_DAY }, (_, i) => i);

    type CalendarEvent = Appointment & { type: "appointment" | "non-working" };

    // Non-working hours blocks
    const nonWorkingBlocks: CalendarEvent[] = [];
    if (workingHours.start > 0) {
        nonWorkingBlocks.push({
            id: "non-working-before",
            title: "Non-working hours",
            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0),
            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), workingHours.start, 0),
            type: "non-working",
        });
    }
    if (workingHours.end < 24) {
        nonWorkingBlocks.push({
            id: "non-working-after",
            title: "Non-working hours",
            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), workingHours.end, 0),
            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59),
            type: "non-working",
        });
    }

    // Convert appointments to CalendarEvent
    const appointmentEvents: CalendarEvent[] = appointments.map((app) => ({
        ...app,
        type: "appointment",
    }));

    // All events to render as overlays
    const allEvents: CalendarEvent[] = [
        ...nonWorkingBlocks,
        ...appointmentEvents,
    ];

    return (
        <div className="max-h-full border border-base-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 bg-base-200 border-b border-base-300">
                <strong>
                    {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </strong>
            </div>
            <div className="relative" ref={scrollRef} style={{ maxHeight: 700, overflowY: "auto" }}>
                {/* Hour grid */}
                <div>
                    {hours.map((hour) => (
                        <div
                            key={hour}
                            className="flex items-center border-b border-base-300 min-h-12"
                            style={{ height: `${HOUR_HEIGHT}px` }}
                        >
                            <div className="w-30 flex items-center text-base-content/60 select-none">
                                <span>
                                    {new Date(0, 0, 0, hour).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </span>
                                <span className="border-l border-base-300 h-full mx-3"></span>

                            </div>
                            <div className="flex-1 py-2 min-h-10 bg-base-100"></div>
                        </div>
                    ))}
                </div>
                {/* curent time overlay */}
                {isToday && (
                    <div
                        className="absolute left-24 right-0 z-20 pointer-events-none"
                        style={{
                            top: nowTop,
                            height: 0,
                        }}
                    >
                        <div className="border-t-2 border-red-500 w-full relative">
                            <span className="absolute -left-20 -top-2 text-xs text-red-500 bg-white px-1 rounded">
                                Now
                            </span>
                        </div>
                    </div>
                )}
                {/* Events overlay */}
                <div className="absolute left-24 top-0 right-0 bottom-0 pointer-events-none">
                    {allEvents.map((event) => {
                        const startHour = getHourFraction(event.start);
                        const endHour = getHourFraction(event.end);
                        const top = startHour * HOUR_HEIGHT;
                        const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 32);

                        let eventClass = "";
                        if (event.type === "appointment") {
                            eventClass = "bg-primary text-primary-content";
                        } else if (event.type === "non-working") {
                            eventClass = "bg-error text-error-content";
                        } else {
                            eventClass = "bg-base-300/80 text-base-content/60";
                        }

                        return (
                            <div
                                key={event.id}
                                className={`absolute left-2 right-2 ${eventClass} rounded px-2 py-1 text-sm shadow pointer-events-auto border border-base-200`}
                                style={{
                                    top,
                                    height,
                                }}
                                title={
                                    event.type === "appointment"
                                        ? `${event.title} (${event.start.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })} - ${event.end.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })})`
                                        : event.title
                                }
                            >
                                {event.title}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DayView;
