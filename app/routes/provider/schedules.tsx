import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { OfficeSchedule } from "~/components/provider/schedule/types";
import { useToast } from "~/hooks/useToast";
import { User } from "../provider/complete-profile";

// Loader function to get the user
export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);

    return Response.json({ user, baseUrl: API_BASE_URL });
};

export default function ScheduleManagement() {
    const { user, baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();
    const [schedules, setSchedules] = useState<OfficeSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    const toast = useToast();

    // Fetch schedules
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${baseUrl}/office-hours/practitioner/${user.sub}/schedules`);
                setSchedules(response.data);
            } catch (error) {
                console.error("Failed to fetch schedules:", error);
                toast.error("Failed to fetch office schedules");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [user.sub, baseUrl]);

    const handleCreateButtonClick = () => {
        navigate("create");
    }


    // Handle schedule deletion
    const handleDeleteSchedule = async (scheduleId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this schedule? This will also delete all associated timeslots and exceptions.");

        if (confirmDelete) {
            try {
                await axios.delete(`${baseUrl}/office-hours/schedule/${scheduleId}`);
                setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
                toast.success("Schedule deleted successfully");
            } catch (error) {
                console.error("Failed to delete schedule:", error);
                toast.error("Failed to delete schedule");
            }
        }
    };

    // Handle schedule activation/deactivation
    const handleToggleActive = async (schedule: OfficeSchedule) => {
        try {
            const updatedSchedule = { ...schedule, is_active: !schedule.is_active };
            await axios.put(`${baseUrl}/office-hours/schedule/${schedule.id}`, updatedSchedule);

            setSchedules(prev =>
                prev.map(s => s.id === schedule.id ? { ...s, is_active: !s.is_active } : s)
            );

            toast.success(`Schedule ${updatedSchedule.is_active ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error("Failed to update schedule:", error);
            toast.error("Failed to update schedule");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Office Schedule Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={handleCreateButtonClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Add Schedule
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p>Loading schedules...</p>
                </div>
            ) : schedules.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No Schedules Found</h3>
                    <p className="text-gray-500 mb-6">You haven't created any office schedules yet.</p>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateButtonClick}
                    >
                        Create Your First Schedule
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className={`card bg-base-100 shadow-xl ${!schedule.is_active ? 'opacity-75' : ''}`}
                        >
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <h2 className="card-title">{schedule.name}</h2>
                                    <div className="badge badge-lg badge-outline mr-2">{schedule.is_active ? 'Active' : 'Inactive'}</div>
                                </div>

                                <p className="text-sm">{schedule.location_name || "No location specified"}</p>

                                <div className="text-sm mt-2">
                                    <p><strong>Timezone:</strong> {schedule.timezone}</p>
                                    <p><strong>Office Hours:</strong> {schedule.timeslots?.length || 0} time slots defined</p>
                                    <p><strong>Exceptions:</strong> {schedule.exceptions?.length || 0} exceptions defined</p>
                                    {schedule.effective_from && (
                                        <p><strong>Effective From:</strong> {new Date(schedule.effective_from).toLocaleDateString()}</p>
                                    )}
                                    {schedule.effective_to && (
                                        <p><strong>Effective To:</strong> {new Date(schedule.effective_to).toLocaleDateString()}</p>
                                    )}
                                </div>

                                <div className="card-actions justify-end mt-4">

                                    <Button
                                        size="sm"
                                        onClick={() => navigate(`${schedule.id}`)}
                                        buttonType="primary"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        buttonType={schedule.is_active ? 'warning' : 'success'}
                                        onClick={() => handleToggleActive(schedule)}
                                    >
                                        {schedule.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        buttonType="error"
                                        onClick={() => handleDeleteSchedule(schedule.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
