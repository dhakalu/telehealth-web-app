import React, { useState } from "react";
import { HealthCondition } from "./types";
import axios from "axios";

export type AddHealthConditionModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd?: (hc: HealthCondition) => void;
  patientId: string;
  baseUrl: string;
};

const initialForm: Omit<HealthCondition, "id"> = {
  name: "",
  status: "",
  notes: "",
  diagnosed_on: null,
};

const AddHealthConditionModal: React.FC<AddHealthConditionModalProps> = ({ open, onClose, onAdd, patientId, baseUrl }) => {
  const [form, setForm] = useState(initialForm);
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
      const response =  await axios.post(`${baseUrl}/patient/${patientId}/health-condition`, {...form, diagnosed_on: new Date().toISOString().split('T')[0]});
      const createdHealthCondition = response.data as HealthCondition;
      if (onAdd) {
        onAdd(createdHealthCondition);
      }
      onClose();
    } catch (err) {
      setError("Failed to add health condition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Health Condition</h2>
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
};

export default AddHealthConditionModal;
