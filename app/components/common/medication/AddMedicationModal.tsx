import axios from "axios";
import { useState } from "react";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { Medication } from "./types";

type AddMedicationModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd?: (medication: Medication) => void;
  baseUrl: string;
  patientId: string;
};

export default function AddMedicationModal({ baseUrl, open, onClose, onAdd, patientId }: AddMedicationModalProps) {
  const [form, setForm] = useState<Omit<Medication, "id">>({
    name: "",
    direction: "",
    prescribed_by: "",
    dosage: "",
    frequency: "",
    status: "",
    notes: "",
    // start_date: null,
    // end_date: null
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${baseUrl}/patient/${patientId}/medication`, form);
      const createdMedication = response.data as Medication;
      if (onAdd) {
        onAdd({ ...form, id: createdMedication.id || Math.random().toString() });
      }
      onClose();
    } catch {
      setError("Failed to add medication.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className=" rounded shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Medication</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Name"
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full"
            required
          />
          <Input
            label="Direction"
            id="direction"
            name="direction"
            placeholder="Direction"
            value={form.direction}
            onChange={handleChange}
            className="w-full"
            required
          />
          <Input
            label="Dosage"
            id="dosage"
            name="dosage"
            placeholder="Dosage"
            value={form.dosage}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="Frequency"
            id="frequency"
            name="frequency"
            placeholder="Frequency"
            value={form.frequency}
            onChange={handleChange}
            className="w-full"
          />
          <Select
            label="Status"
            id="status"
            name="status"
            value={form.status}
            onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
            className="w-full"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            required
          />
          <Input
            label="Notes"
            id="notes"
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full"
            textarea
          />
          <Input
            label="Start Date"
            id="start_date"
            name="start_date"
            type="date"
            value={form.start_date || ""}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="End Date"
            id="end_date"
            name="end_date"
            type="date"
            value={form.end_date || ""}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
