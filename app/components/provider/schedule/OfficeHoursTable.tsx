import { Table } from "~/components/common/Table";
import { DayOfWeek, ScheduleTimeslot } from "./types";

interface OfficeHoursTableProps {
    timeslots: Partial<ScheduleTimeslot>[];
    onRemove: (slotId: string) => void;
}

export default function OfficeHoursTable({ timeslots, onRemove }: OfficeHoursTableProps) {
    if (timeslots.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <h4 className="font-bold mb-2">Added Office Hours:</h4>
            <Table
                columns={[
                    {
                        header: "ID",
                        accessor: (slot) => slot.id || "N/A"
                    },
                    {
                        header: "Day",
                        accessor: (slot) => DayOfWeek[slot.day_of_week!]
                    },
                    {
                        header: "Start Time",
                        accessor: (slot) => slot.start_time
                    },
                    {
                        header: "End Time",
                        accessor: (slot) => slot.end_time
                    },
                    {
                        header: "Duration",
                        accessor: (slot) => `${slot.slot_duration_minutes} min`
                    },
                    {
                        header: "Action",
                        accessor: (slot) => (
                            <button
                                className="btn btn-sm btn-error"
                                onClick={() => onRemove(slot?.id)}
                            >
                                Remove
                            </button>
                        )
                    }
                ]}
                data={timeslots.map((slot, index) => ({
                    ...slot,
                    id: slot.id || `timeslot-${index}`
                }))}
                emptyMessage="No office hours added yet."
            />
        </div>
    );
}
