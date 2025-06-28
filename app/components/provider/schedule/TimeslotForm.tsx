import { useState } from "react";
import { Input } from "~/components/common/Input";
import { DayOfWeek, ScheduleTimeslot } from "./types";

interface TimeslotFormProps {
    onAddTimeslot: (timeslot: Partial<ScheduleTimeslot>) => void;
}

export default function TimeslotForm({ onAddTimeslot }: TimeslotFormProps) {
    const [timeslot, setTimeslot] = useState<Partial<ScheduleTimeslot>>({
        day_of_week: 1, // Default to Monday
        start_time: "09:00:00",
        end_time: "17:00:00",
        slot_duration_minutes: 30,
        is_available: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setTimeslot(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : name === "day_of_week" || name === "slot_duration_minutes"
                    ? parseInt(value, 10)
                    : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!timeslot.day_of_week && timeslot.day_of_week !== 0) {
            alert("Please select a day of week");
            return;
        }

        if (!timeslot.start_time) {
            alert("Please enter a start time");
            return;
        }

        if (!timeslot.end_time) {
            alert("Please enter an end time");
            return;
        }

        if (timeslot.start_time >= timeslot.end_time) {
            alert("Start time must be before end time");
            return;
        }

        // Add the timeslot
        onAddTimeslot(timeslot);

        // Reset form
        setTimeslot({
            day_of_week: 1, // Default to Monday
            start_time: "09:00:00",
            end_time: "17:00:00",
            slot_duration_minutes: 30,
            is_available: true
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2 text-base-content">
                <label htmlFor="day_of_week" className="block mb-1 font-medium">
                    Day of Week
                </label>
                <select
                    id="day_of_week"
                    name="day_of_week"
                    value={timeslot.day_of_week}
                    onChange={handleChange}
                    className="select w-full border px-4 py-2 rounded"
                >
                    {Object.entries(DayOfWeek)
                        .filter(([key]) => !isNaN(Number(key))) // Filter out reverse mappings
                        .map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                </select>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                    <Input
                        label="Start Time"
                        type="time"
                        name="start_time"
                        value={timeslot.start_time?.substring(0, 5) || ""} // Remove seconds for time input
                        onChange={(e) => {
                            const timeWithSeconds = e.target.value + ":00";
                            handleChange({
                                ...e,
                                target: {
                                    ...e.target,
                                    value: timeWithSeconds
                                }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        required
                    />                </div>

                <div className="flex-1 min-w-[180px]">
                    <Input
                        label="End Time"
                        type="time"
                        name="end_time"
                        value={timeslot.end_time?.substring(0, 5) || ""} // Remove seconds for time input
                        onChange={(e) => {
                            const timeWithSeconds = e.target.value + ":00"; // Add seconds back
                            handleChange({
                                ...e,
                                target: {
                                    ...e.target,
                                    value: timeWithSeconds
                                }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        required
                    />
                </div>
            </div>

            <div className="mb-2 text-base-content">
                <label htmlFor="slot_duration_minutes" className="block mb-1 font-medium">
                    Appointment Duration (minutes)
                </label>
                <select
                    id="slot_duration_minutes"
                    name="slot_duration_minutes"
                    value={timeslot.slot_duration_minutes}
                    onChange={handleChange}
                    className="select w-full border px-4 py-2 rounded"
                >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                </select>
            </div>

            <div className="mb-2 text-base-content">
                <div className="flex items-center">
                    <label htmlFor="is_available" className="block font-medium flex-grow cursor-pointer">
                        Is Available
                    </label>
                    <input
                        id="is_available"
                        type="checkbox"
                        name="is_available"
                        checked={timeslot.is_available}
                        onChange={handleChange}
                        className="checkbox"
                    />
                </div>
            </div>

            <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                    Add Office Hours
                </button>
            </div>
        </form>
    );
}
