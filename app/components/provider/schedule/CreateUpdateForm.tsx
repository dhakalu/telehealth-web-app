import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "~/components/common/Input";
import { useToast } from "~/hooks/useToast";
import ExceptionForm from "./ExceptionForm";
import ExceptionsTable from "./ExceptionsTable";
import OfficeHoursTable from "./OfficeHoursTable";
import TimeslotForm from "./TimeslotForm";
import { OfficeSchedule, ScheduleException, ScheduleTimeslot } from "./types";

interface CreateUpdateFormProps {
    baseUrl: string;
    practitionerId: string;
    scheduleId?: string; // Optional, if editing an existing schedule
    onScheduleCreated?: (schedule: OfficeSchedule) => void;
}

export default function CreateUpdateForm({
    baseUrl,
    practitionerId,
    onScheduleCreated,
    scheduleId,
}: CreateUpdateFormProps) {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<"schedule" | "timeslots" | "exceptions">("schedule");
    const [loading, setLoading] = useState(false);

    const [schedule, setSchedule] = useState<Partial<OfficeSchedule>>({
        practitioner_id: practitionerId,
        name: "Primary Schedule",
        location_name: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to browser timezone
        is_active: true
    });

    const [timeslots, setTimeslots] = useState<ScheduleTimeslot[]>([]);
    const [exceptions, setExceptions] = useState<ScheduleException[]>([]);

    // Fetch schedule details when scheduleId is provided
    useEffect(() => {
        if (scheduleId) {
            // If scheduleId prop is provided, set it as the ID in our state
            setSchedule(prevSchedule => ({ ...prevSchedule, id: scheduleId }));
            fetchScheduleDetails();
        }
    }, [scheduleId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch schedule details, timeslots, and exceptions
    const fetchScheduleDetails = async () => {
        if (!scheduleId) return;

        setLoading(true);
        try {
            // Fetch schedule details
            const scheduleResponse = await axios.get(`${baseUrl}/office-hours/schedule/${scheduleId}`);
            const scheduleData = scheduleResponse.data;

            // The schedule response includes timeslots and exceptions
            setSchedule(scheduleData);

            // Set timeslots and exceptions if they exist in the response
            if (scheduleData.timeslots) {
                console.log("Setting timeslots:", scheduleData.timeslots);
                setTimeslots(scheduleData.timeslots);
            }

            // Fetch exceptions for this schedule (there is a specific endpoint for this)
            const exceptionsResponse = await axios.get(`${baseUrl}/office-hours/schedule/${scheduleId}/exceptions`);
            if (exceptionsResponse.data) {
                setExceptions(exceptionsResponse.data);
            }

        } catch (error) {
            console.error("Failed to fetch schedule details:", error);
            toast.error("Failed to load schedule details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Schedule form handlers
    const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setSchedule(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value
        }));
    };

    // Add a new timeslot to the list
    const addTimeslot = async (timeslot: Partial<ScheduleTimeslot>) => {
        await addTimeslotToDatabase(timeslot);
        // The state is updated within the addTimeslotToDatabase function if successful
    };

    // Remove a timeslot from the list
    const removeTimeslot = async (slotId: string) => {
        console.log("Removing timeslot with ID:", slotId);
        // if (!schedule.id) return;
        try {
            if (slotId) {
                await axios.delete(`${baseUrl}/office-hours/timeslot/${slotId}`);
            }
            setTimeslots(prev => prev.filter(slot => slot.id !== slotId));
            toast.success("Office hours removed successfully!");
        } catch (error) {
            console.error("Failed to remove office hours:", error);
            toast.error("Failed to remove office hours. Please try again.");
        }
    };

    // Add a new exception to the list
    const addException = async (exception: Partial<ScheduleException>) => {
        await addExceptionToDatabase(exception);
        // The state is updated within the addExceptionToDatabase function if successful
    };

    // Remove an exception from the list
    const removeException = async (exceptionId: string) => {
        try {
            await axios.delete(`${baseUrl}/office-hours/exception/${exceptionId}`);
            setExceptions(prev => prev.filter((e) => e.id !== exceptionId));
            toast.success("Exception removed successfully!");
        } catch (error) {
            console.error("Failed to remove exception:", error);
            toast.error("Failed to remove exception. Please try again.");
        }
    };

    // Create or update the schedule
    const saveSchedule = async () => {
        try {
            setLoading(true);

            // convert effective_from and effective_to to ISO strings if they are provided
            const updatedSchedule = { ...schedule };
            if (updatedSchedule.effective_from) {
                updatedSchedule.effective_from = new Date(updatedSchedule.effective_from).toISOString();
            }
            if (updatedSchedule.effective_to) {
                updatedSchedule.effective_to = new Date(updatedSchedule.effective_to).toISOString();
            }

            // If we already have a schedule ID, update the existing schedule
            if (schedule.id) {
                const response = await axios.put(`${baseUrl}/office-hours/schedule/${schedule.id}`, updatedSchedule);
                setSchedule(response.data || updatedSchedule);
                toast.success("Schedule updated successfully!");
                return;
            }

            // Create a new schedule
            const scheduleResponse = await axios.post(`${baseUrl}/office-hours/schedule`, updatedSchedule);
            const createdSchedule = scheduleResponse.data;

            // Update the form with the new schedule data (including the ID)
            setSchedule(createdSchedule);

            toast.success("Schedule created successfully!");

            // Call the callback with the created schedule
            if (onScheduleCreated) {
                onScheduleCreated(createdSchedule);
            }

            // Switch to the timeslots tab
            setActiveTab("timeslots");

        } catch (error) {
            console.error("Failed to save schedule:", error);
            toast.error("Failed to save schedule. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Add a timeslot to the database
    const addTimeslotToDatabase = async (timeslot: Partial<ScheduleTimeslot>) => {
        if (!schedule.id) {
            toast.error("Please save the schedule first");
            setActiveTab("schedule");
            return false;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${baseUrl}/office-hours/schedule/${schedule.id}/timeslot`, {
                ...timeslot,
                office_schedule_id: schedule.id
            });

            // Add to local state
            setTimeslots(prev => [...prev, response.data]);

            toast.success("Office hours added successfully!");
            return true;
        } catch (error) {
            console.error("Failed to add office hours:", error);
            toast.error("Failed to add office hours. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Add an exception to the database
    const addExceptionToDatabase = async (exception: Partial<ScheduleException>) => {
        if (!schedule.id) {
            toast.error("Please save the schedule first");
            setActiveTab("schedule");
            return false;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${baseUrl}/office-hours/schedule/${schedule.id}/exception`, {
                ...exception,
                office_schedule_id: schedule.id
            });

            // Add to local state
            setExceptions(prev => [...prev, response.data]);

            toast.success("Exception added successfully!");
            return true;
        } catch (error) {
            console.error("Failed to add exception:", error);
            toast.error("Failed to add exception. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-10">
            <div>
                <h3 className="font-bold text-lg mb-4">{schedule.id ? "Update Office Schedule" : "Create Office Schedule"}</h3>

                {/* Tab buttons */}
                <div className="tabs mb-4">
                    <button
                        className={`tab tab-bordered ${activeTab === "schedule" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("schedule")}
                    >
                        Schedule {schedule.id && <span className="ml-2 badge badge-sm badge-success">✓</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "timeslots" ? "tab-active" : ""}`}
                        onClick={() => schedule.id ? setActiveTab("timeslots") : toast.info("Please save the schedule first")}
                        disabled={!schedule.id}
                    >
                        Office Hours {timeslots.length > 0 && <span className="ml-2 badge badge-sm badge-success">{timeslots.length}</span>}
                    </button>
                    <button
                        className={`tab tab-bordered ${activeTab === "exceptions" ? "tab-active" : ""}`}
                        onClick={() => schedule.id ? setActiveTab("exceptions") : toast.info("Please save the schedule first")}
                        disabled={!schedule.id}
                    >
                        Exceptions {exceptions.length > 0 && <span className="ml-2 badge badge-sm badge-success">{exceptions.length}</span>}
                    </button>
                </div>

                {/* Schedule Form */}
                <div className={activeTab === "schedule" ? "block" : "hidden"}>
                    <form onSubmit={(e) => { e.preventDefault(); saveSchedule(); }} className="space-y-4">
                        <Input
                            label="Schedule Name"
                            type="text"
                            name="name"
                            value={schedule.name || ""}
                            onChange={handleScheduleChange}
                            placeholder="Primary Schedule"
                            wrapperClass="mb-4"
                            required
                        />

                        <Input
                            label="Location Name"
                            type="text"
                            name="location_name"
                            value={schedule.location_name || ""}
                            onChange={handleScheduleChange}
                            placeholder="Main Office"
                            wrapperClass="mb-4"
                        />

                        <div className="mb-4">
                            <label htmlFor="timezone" className="block mb-1 font-medium">
                                Timezone
                            </label>
                            <select
                                id="timezone"
                                name="timezone"
                                value={schedule.timezone || "UTC"}
                                onChange={handleScheduleChange}
                                className="select w-full border px-4 py-2 rounded"
                            >
                                {/* Include major timezones */}
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="America/Anchorage">Alaska Time (AKT)</option>
                                <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
                                <option value="UTC">UTC</option>
                                <option value="Europe/London">London (GMT/BST)</option>
                                <option value="Europe/Paris">Central European (CET/CEST)</option>
                                <option value="Asia/Tokyo">Japan (JST)</option>
                                <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                            </select>
                        </div>

                        <div className="mb-4 flex items-center">
                            <label htmlFor="is_active" className="font-medium flex-grow cursor-pointer">
                                Active
                            </label>
                            <input
                                id="is_active"
                                type="checkbox"
                                name="is_active"
                                checked={schedule.is_active || false}
                                onChange={handleScheduleChange}
                                className="checkbox"
                            />
                        </div>

                        <Input
                            label="Effective From"
                            type="datetime-local"
                            name="effective_from"
                            value={schedule.effective_from?.slice(0, 16) || ""}
                            onChange={handleScheduleChange}
                            wrapperClass="mb-4"
                        />

                        <Input
                            label="Effective To"
                            type="datetime-local"
                            name="effective_to"
                            value={schedule.effective_to?.slice(0, 16) || ""}
                            onChange={handleScheduleChange}
                            wrapperClass="mb-4"
                        />

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {schedule.id ? "Update Schedule" : "Create Schedule & Continue"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Timeslots form */}
                <div className={activeTab === "timeslots" ? "block" : "hidden"}>
                    {!schedule.id ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the schedule first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <TimeslotForm onAddTimeslot={addTimeslot} />
                            <OfficeHoursTable timeslots={timeslots} onRemove={removeTimeslot} />
                        </>
                    )}
                </div>

                {/* Exceptions form */}
                <div className={activeTab === "exceptions" ? "block" : "hidden"}>
                    {!schedule.id ? (
                        <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please save the schedule first.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ExceptionForm onAddException={addException} />
                            <ExceptionsTable exceptions={exceptions} onRemove={removeException} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
