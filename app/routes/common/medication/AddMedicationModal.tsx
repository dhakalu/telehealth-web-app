import { useState } from "react";
import { Medication } from "./types";
import axios from "axios";

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
    } catch (err) {
      setError("Failed to add medication.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Medication</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="direction" className="block mb-1 font-medium">Direction</label>
            <input
              id="direction"
              name="direction"
              placeholder="Direction"
              value={form.direction}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="dosage" className="block mb-1 font-medium">Dosage</label>
            <input
              id="dosage"
              name="dosage"
              placeholder="Dosage"
              value={form.dosage}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="frequency" className="block mb-1 font-medium">Frequency</label>
            <input
              id="frequency"
              name="frequency"
              placeholder="Frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="status" className="block mb-1 font-medium">Status</label>
            <input
              id="status"
              name="status"
              placeholder="Status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block mb-1 font-medium">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="start_date" className="block mb-1 font-medium">Start Date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={form.start_date || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block mb-1 font-medium">End Date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={form.end_date || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
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
