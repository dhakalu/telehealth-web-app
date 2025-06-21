import { Medication } from "./types";

type MedicationTableProps = {
  medications: Medication[];
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}


export function MedicationTable({ medications }: MedicationTableProps) {
  if (!medications || medications.length === 0) {
    return <div>No medications found.</div>;
  }

  return (
    <table className="min-w-full border border-gray-200 mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-3 py-2 border">Name</th>
          <th className="px-3 py-2 border">Direction</th>
          <th className="px-3 py-2 border">Prescribed By</th>
          <th className="px-3 py-2 border">Dosage</th>
          <th className="px-3 py-2 border">Frequency</th>
          <th className="px-3 py-2 border">Status</th>
          <th className="px-3 py-2 border">Notes</th>
          <th className="px-3 py-2 border">Start Date</th>
          <th className="px-3 py-2 border">End Date</th>
        </tr>
      </thead>
      <tbody>
        {medications.map((med) => (
          <tr key={med.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border">{med.name}</td>
            <td className="px-3 py-2 border">{med.direction}</td>
            <td className="px-3 py-2 border">{med.prescribed_by}</td>
            <td className="px-3 py-2 border">{med.dosage}</td>
            <td className="px-3 py-2 border">{med.frequency}</td>
            <td className="px-3 py-2 border">{med.status}</td>
            <td className="px-3 py-2 border">{med.notes}</td>
            <td className="px-3 py-2 border">{formatDate(med.start_date)}</td>
            <td className="px-3 py-2 border">{formatDate(med.end_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}