import React from "react";
import { DEFAULT_HOUR_HEIGHT, HOURS_IN_DAY } from "./DayView";

export const HourGrid: React.FC<{ hourHeight?: number }> = ({ hourHeight = DEFAULT_HOUR_HEIGHT }) => (
    <div>
        {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
            <div
                key={hour}
                className="flex items-center border-b border-base-300 min-h-12"
                style={{ height: `${hourHeight}px` }}
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
);