import axios from "axios";
import React, { useState } from "react";
import { Procedure } from "./types";

export type AddProcedureModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd?: (proc: Procedure) => void;
  patientId: string;
  baseUrl: string;
};

const initialForm: Omit<Procedure, "id" | "created_at" | "deleted_at"> = {
  name: "",
  performed_on: "",
  performed_by: "",
  location: "",
  outcome: "",
  notes: "",
  source_id: "",
};

const AddProcedureModal: React.FC<AddProcedureModalProps> = ({ open, onClose, onAdd, patientId, baseUrl }) => {
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
      const response = await axios.post(`${baseUrl}/patient/${patientId}/procedure`, form);
      const createdProcedure = response.data as Procedure;
      if (onAdd) {
        onAdd(createdProcedure);
      }
      onClose();
    } catch (err) {

      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add procedure.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className=" rounded shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Procedure</h2>
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
            <label htmlFor="performed_on" className="block mb-1 font-medium">Performed On</label>
            <input
              id="performed_on"
              name="performed_on"
              type="date"
              value={form.performed_on || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="performed_by" className="block mb-1 font-medium">Performed By</label>
            <input
              id="performed_by"
              name="performed_by"
              placeholder="Performed By"
              value={form.performed_by}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">Location</label>
            <input
              id="location"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label htmlFor="outcome" className="block mb-1 font-medium">Outcome</label>
            <input
              id="outcome"
              name="outcome"
              placeholder="Outcome"
              value={form.outcome}
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
            <label htmlFor="source_id" className="block mb-1 font-medium">Source ID</label>
            <input
              id="source_id"
              name="source_id"
              placeholder="Source ID"
              value={form.source_id}
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

export default AddProcedureModal;
