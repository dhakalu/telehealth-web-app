import { useState } from "react";
import DayView from "~/components/common/calendar/DayView";
import WeekView from "~/components/common/calendar/WeekView";


function getSundayOfCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
}

const sampleAppts = [
    {
        id: "i",
        title: "Upen Dhakal",
        start: new Date("2025-06-25T12:00:00"),
        end: new Date("2025-06-25T15:00:00"),
    },
    {
        id: "ii",
        title: "John Done",
        start: new Date("2025-06-26T08:00:00"),
        end: new Date("2025-06-26T15:00:00"),
    },
]


export default function Calendar() {

    const [view, setView] = useState<"daily" | "weekly">("daily")



    return <div className="h-full flex-col flex">
        <div className="">
            <div className="dropdown">
                <button aria-label="change view" className="btn m-1" type="button">
                    {view === "daily" ? "Daily View" : "Weekly View"}
                </button>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <button
                            className={view === "daily" ? "active" : ""}
                            onClick={() => setView("daily")}
                        >
                            Daily View
                        </button>
                    </li>
                    <li>
                        <button
                            className={view === "weekly" ? "active" : ""}
                            onClick={() => setView("weekly")}
                        >
                            Weekly View
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div className="overflow-hidden">
            {view === "daily" ? (
                <DayView
                    date={new Date()}
                    appointments={sampleAppts}
                />
            ) : (
                <div>
                    <WeekView weekStartDate={getSundayOfCurrentWeek()} appointments={sampleAppts} />
                </div>
            )}
        </div>
    </div>
}