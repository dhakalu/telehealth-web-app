import { useEffect } from "react";
import { getHourFraction } from "./calendarUtils";
import { SCROLL_OFFSET } from "./DayView";

export function useAutoScrollToNow(ref: React.RefObject<HTMLDivElement>, date: Date, hourHeight: number, enabled: boolean = true) {
    useEffect(() => {
        if (!enabled) return;
        const now = new Date();
        const isToday =
            now.getFullYear() === date.getFullYear() &&
            now.getMonth() === date.getMonth() &&
            now.getDate() === date.getDate();
        if (isToday && ref.current) {
            const nowHourFraction = getHourFraction(now);
            const nowTop = nowHourFraction * hourHeight;
            ref.current.scrollTop = Math.max(0, nowTop - SCROLL_OFFSET);
        }
    }, [date, hourHeight, enabled, ref]);
}