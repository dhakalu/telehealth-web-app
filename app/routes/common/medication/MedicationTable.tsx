import { Table, Column } from "~/components/common/Table";
import { Medication } from "./types";
import { formatDate } from "~/utils/dateUtils";

const columns: Column<Medication>[] = [
  { header: "Name", accessor: (med) => med.name },
  { header: "Direction", accessor: (med) => med.direction },
  { header: "Prescribed By", accessor: (med) => med.prescribed_by },
  { header: "Dosage", accessor: (med) => med.dosage },
  { header: "Frequency", accessor: (med) => med.frequency },
  { header: "Status", accessor: (med) => med.status },
  { header: "Notes", accessor: (med) => med.notes },
  { header: "Start Date", accessor: (med) => formatDate(med?.start_date) },
  { header: "End Date", accessor: (med) => formatDate(med?.end_date) },
];

export function MedicationTable({ medications }: { medications: Medication[] }) {
  return <Table columns={columns} data={medications} emptyMessage="No medications found." />;
}