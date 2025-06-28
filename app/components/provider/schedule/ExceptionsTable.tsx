import { Table } from "~/components/common/Table";
import { ScheduleException } from "./types";

interface ExceptionsTableProps {
    exceptions: ScheduleException[];
    onRemove: (id: string) => void;
}

export default function ExceptionsTable({ exceptions, onRemove }: ExceptionsTableProps) {
    if (exceptions.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <h4 className="font-bold mb-2">Added Exceptions:</h4>
            <Table
                columns={[
                    {
                        header: "Date",
                        accessor: (exc) => exc.exception_date
                    },
                    {
                        header: "Type",
                        accessor: (exc) => exc.exception_type
                    },
                    {
                        header: "Time",
                        accessor: (exc) => (
                            exc.start_time && exc.end_time
                                ? `${exc.start_time} - ${exc.end_time}`
                                : "All Day"
                        )
                    },
                    {
                        header: "Reason",
                        accessor: (exc) => exc.reason
                    },
                    {
                        header: "Action",
                        accessor: (exc) => (
                            <button
                                className="btn btn-sm btn-error"
                                onClick={() => onRemove(exc.id)}
                            >
                                Remove
                            </button>
                        )
                    }
                ]}
                data={exceptions as ScheduleException[]}
                emptyMessage="No exceptions added yet."
            />
        </div>
    );
}
