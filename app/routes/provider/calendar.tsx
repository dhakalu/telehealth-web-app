import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import DayView from "~/components/common/calendar/DayView";
import WeekView from "~/components/common/calendar/WeekView";
import { User } from "../provider/complete-profile";

// Type definitions for appointments from the API
type AppointmentStatus = "booked" | "canceled" | "completed";

interface Appointment {
    id: string;
    patient_id: string;
    provider_id: string;
    title: string;
    description: string;
    time_range: [string, string]; // ISO strings
    status: AppointmentStatus;
    created_at: string;
    updated_at: string;
}

// For calendar display
interface CalendarAppointment {
    id: string;
    title: string;
    start: Date;
    end: Date;
    status?: AppointmentStatus;
}

// Loader function to get the user and appointments data
export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);

    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/provider/${user.sub}`);
        return Response.json({
            user,
            appointments: response.data
        });
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        return Response.json({
            user,
            appointments: [],
            error: "Failed to fetch appointments"
        });
    }
};

function getSundayOfCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
}

export default function Calendar() {
    const { appointments = [] } = useLoaderData<{
        user: User,
        appointments: Appointment[],
        error?: string
    }>();

    const [view, setView] = useState<"daily" | "weekly">("daily");
    const scrollAbleAreaRef = useRef<HTMLDivElement>(null);
    const [calendarAppointments, setCalendarAppointments] = useState<CalendarAppointment[]>([]);

    // Transform appointments for calendar display
    useEffect(() => {
        if (!appointments || appointments.length === 0) return;

        const transformed: CalendarAppointment[] = appointments.map((appt: Appointment) => ({
            id: appt.id,
            title: appt.title || "Appointment", // Fallback title if none provided
            start: new Date(appt.time_range[0]),
            end: new Date(appt.time_range[1]),
            status: appt.status
        }));

        setCalendarAppointments(transformed);
    }, [appointments]);

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
        <div ref={scrollAbleAreaRef} className="overflow-y-auto">
            {view === "daily" ? (
                <DayView
                    date={new Date()}
                    appointments={calendarAppointments}
                    disableScroll
                    externalScrollRef={scrollAbleAreaRef}
                />
            ) : (
                <div>
                    <WeekView scrollRef={scrollAbleAreaRef} weekStartDate={getSundayOfCurrentWeek()} appointments={calendarAppointments} />
                </div>
            )}
        </div>
    </div>
}