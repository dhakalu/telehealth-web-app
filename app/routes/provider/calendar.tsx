import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
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
            appointments: response.data,
            baseUrl: API_BASE_URL
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

// This helper function has been removed as it's not needed anymore

export default function Calendar() {
    const { appointments = [] } = useLoaderData<{
        user: User,
        baseUrl: string,
        appointments: Appointment[],
        error?: string
    }>();

    const [view, setView] = useState<"daily" | "weekly">("daily");
    const scrollAbleAreaRef = useRef<HTMLDivElement>(null);
    const [calendarAppointments, setCalendarAppointments] = useState<CalendarAppointment[]>([]);

    // Selected date state (defaults to today)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    // Selected week start date state (defaults to Sunday of current week)
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(getSundayOfCurrentWeek());

    // Navigation functions
    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
    };

    const goToPreviousDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
    };

    const goToNextWeek = () => {
        const nextWeekStart = new Date(selectedWeekStart);
        nextWeekStart.setDate(selectedWeekStart.getDate() + 7);
        setSelectedWeekStart(nextWeekStart);
    };

    const goToPreviousWeek = () => {
        const prevWeekStart = new Date(selectedWeekStart);
        prevWeekStart.setDate(selectedWeekStart.getDate() - 7);
        setSelectedWeekStart(prevWeekStart);
    };

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
        <div className="flex justify-between items-center p-2">
            <div className="flex items-center">
                <div className="dropdown">
                    <Button buttonType="secondary" aria-label="change view" className="m-1" type="button">
                        {view === "daily" ? "Daily View" : "Weekly View"}
                    </Button>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                        <li>
                            <Button
                                ghost
                                buttonType="neutral"
                                className={view === "daily" ? "active" : ""}
                                onClick={() => setView("daily")}
                            >
                                Daily View
                            </Button>
                        </li>
                        <li>
                            <Button
                                ghost
                                buttonType="neutral"
                                className={view === "weekly" ? "active" : ""}
                                onClick={() => setView("weekly")}
                            >
                                Weekly View
                            </Button>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <Button
                        buttonType="neutral"
                        size="sm"
                        className="btn-circle"
                        onClick={view === "daily" ? goToPreviousDay : goToPreviousWeek}
                        aria-label="Previous"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Button>

                    <Button
                        buttonType="neutral"
                        size="sm"
                        onClick={() => {
                            setSelectedDate(new Date());
                            setSelectedWeekStart(getSundayOfCurrentWeek());
                        }}
                    >
                        Today
                    </Button>

                    <Button
                        buttonType="neutral"
                        size="sm"
                        className="btn-circle"
                        onClick={view === "daily" ? goToNextDay : goToNextWeek}
                        aria-label="Next"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>

                <div className="ml-4 text-lg font-medium">
                    {view === "daily"
                        ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
                        : `${selectedWeekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(selectedWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        }`
                    }
                </div>
            </div>
        </div>
        <div ref={scrollAbleAreaRef} className="overflow-y-auto">
            {view === "daily" ? (
                <DayView
                    date={selectedDate}
                    appointments={calendarAppointments}
                    disableScroll
                    externalScrollRef={scrollAbleAreaRef}
                />
            ) : (
                <div>
                    <WeekView scrollRef={scrollAbleAreaRef} weekStartDate={selectedWeekStart} appointments={calendarAppointments} />
                </div>
            )}
        </div>
    </div>
}