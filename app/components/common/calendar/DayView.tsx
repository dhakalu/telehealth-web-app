import React, { useRef } from "react";
import { HourGrid } from "./HourGrid";
import { CalendarEvent, getAllEvents } from "./calendarUtils";
import { useAutoScrollToNow } from "./useAutoScrollToNow";

export type Appointment = {
    id: string;
    title: string;
    start: Date;
    end: Date;
};

type DayViewProps = {
    date: Date;
    appointments: Appointment[];
    workingHours?: { start: number; end: number }; // 24h format
    hourHeight?: number;     // px, for responsive hour block height
    disableScroll?: boolean;
    externalScrollRef?: React.MutableRefObject<null | HTMLDivElement>
};

export const HOURS_IN_DAY = 24;
export const SCROLL_OFFSET = 200; // px, offset for auto-scroll to current time
export const DEFAULT_HOUR_HEIGHT = 72;

export function getHourFraction(date: Date) {
    return date.getHours() + date.getMinutes() / 60;
}

const DayView: React.FC<DayViewProps> = ({
    date,
    appointments,
    workingHours = { start: 8, end: 17 },
    hourHeight = DEFAULT_HOUR_HEIGHT,
    externalScrollRef
}) => {
    const localScrollRef = useRef<HTMLDivElement>(null);


    const scrollRef = externalScrollRef ?? localScrollRef;
    useAutoScrollToNow(scrollRef, date, hourHeight);

    const now = new Date();
    const isToday =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();
    const nowHourFraction = getHourFraction(now);
    const nowTop = nowHourFraction * hourHeight;



    const allEvents: CalendarEvent[] = getAllEvents(date, appointments, workingHours);


    return (
        <div className="max-h-full border border-base-200 rounded-lg shadow-sm">
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
            <div className="relative">
                <HourGrid />
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
                            <span className="absolute -left-20 -top-2 text-xs text-red-500 px-1 rounded">
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
                        const top = startHour * hourHeight;
                        const height = Math.max((endHour - startHour) * hourHeight, 32);

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
