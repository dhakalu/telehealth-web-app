import { useState } from "react";
import { Input } from "~/components/common/Input";
import { ExceptionType, ScheduleException } from "./types";

interface ExceptionFormProps {
    onAddException: (exception: Partial<ScheduleException>) => void;
}

export default function ExceptionForm({ onAddException }: ExceptionFormProps) {
    const [exception, setException] = useState<Partial<ScheduleException>>({
        exception_date: new Date().toISOString().split('T')[0],
        exception_type: ExceptionType.HOLIDAY,
        start_time: null,
        end_time: null,
        reason: ""
    });

    const [isAllDay, setIsAllDay] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setException(prev => ({
            ...prev,
            [name]: name === "exception_type" ? value as ExceptionType : value
        }));
    };

    const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setIsAllDay(isChecked);

        if (isChecked) {
            setException(prev => ({
                ...prev,
                start_time: null,
                end_time: null
            }));
        } else {
            setException(prev => ({
                ...prev,
                start_time: "09:00:00",
                end_time: "17:00:00"
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!exception.exception_date) {
            alert("Please select a date");
            return;
        }

        if (!exception.exception_type) {
            alert("Please select an exception type");
            return;
        }

        if (!isAllDay) {
            if (!exception.start_time || !exception.end_time) {
                alert("Please enter both start and end times");
                return;
            }

            if (exception.start_time >= exception.end_time) {
                alert("Start time must be before end time");
                return;
            }
        }

        if (!exception.reason) {
            alert("Please enter a reason for the exception");
            return;
        }

        // Add the exception
        onAddException(exception);

        // Reset form
        setException({
            exception_date: new Date().toISOString().split('T')[0],
            exception_type: ExceptionType.HOLIDAY,
            start_time: null,
            end_time: null,
            reason: ""
        });
        setIsAllDay(true);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Exception Date"
                type="date"
                name="exception_date"
                value={exception.exception_date || ""}
                onChange={handleChange}
                wrapperClass="mb-4"
                required
            />

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Exception Type</span>
                </label>
                <select
                    name="exception_type"
                    value={exception.exception_type}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                >
                    <option value={ExceptionType.HOLIDAY}>Holiday</option>
                    <option value={ExceptionType.VACATION}>Vacation</option>
                    <option value={ExceptionType.SPECIAL_HOURS}>Special Hours</option>
                </select>
            </div>

            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text">All Day Exception</span>
                    <input
                        type="checkbox"
                        checked={isAllDay}
                        onChange={handleAllDayChange}
                        className="checkbox"
                    />
                </label>
            </div>

            {!isAllDay && (
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[180px]">
                        <Input
                            label="Start Time"
                            type="time"
                            name="start_time"
                            value={exception.start_time?.substring(0, 5) || ""}
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
                            required={!isAllDay}
                        />
                    </div>

                    <div className="flex-1 min-w-[180px]">
                        <Input
                            label="End Time"
                            type="time"
                            name="end_time"
                            value={exception.end_time?.substring(0, 5) || ""}
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
                            required={!isAllDay}
                        />
                    </div>
                </div>
            )}

            <Input
                label="Reason"
                name="reason"
                value={exception.reason || ""}
                onChange={handleChange}
                placeholder="Enter reason for the exception"
                required
                textarea={true}
                className="h-24"
            />

            <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                    Add Exception
                </button>
            </div>
        </form>
    );
}
