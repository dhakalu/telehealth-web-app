export enum DayOfWeek {
    "Sunday" = 0,
    "Monday" = 1,
    "Tuesday" = 2,
    "Wednesday" = 3,
    "Thursday" = 4,
    "Friday" = 5,
    "Saturday" = 6
}

export enum ExceptionType {
    HOLIDAY = "HOLIDAY",
    VACATION = "VACATION",
    SPECIAL_HOURS = "SPECIAL_HOURS"
}

export interface OfficeSchedule {
    id: string;
    practitioner_id: string;
    name: string;
    location_name: string;
    timezone: string;
    is_active: boolean;
    effective_from: string | null;
    effective_to: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    timeslots?: ScheduleTimeslot[];
    exceptions?: ScheduleException[];
}

export interface ScheduleTimeslot {
    id: string;
    office_schedule_id: string;
    day_of_week: number;
    start_time: string; // Format: "HH:MM:SS"
    end_time: string; // Format: "HH:MM:SS"
    slot_duration_minutes: number;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface ScheduleException {
    id: string;
    office_schedule_id: string;
    exception_date: string; // Format: "YYYY-MM-DD"
    exception_type: ExceptionType;
    start_time: string | null; // Format: "HH:MM:SS" or null for all-day
    end_time: string | null; // Format: "HH:MM:SS" or null for all-day
    reason: string;
    created_at: string;
    updated_at: string;
}
