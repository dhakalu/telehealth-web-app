import React, { useState } from "react";
import { Procedure } from "./types";
import axios from "axios";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";

export type AddProcedureModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd?: (proc: Procedure) => void;
  patientId: string;
  baseUrl: string;
  practitionerId: string;
};

const initialForm: Omit<Procedure, "id" | "created_at" | "deleted_at"> = {
  name: "",
  performed_on: "",
  location: "",
  outcome: "",
  notes: "",
  source_id: "",
};

const AddProcedureModal: React.FC<AddProcedureModalProps> = ({ open, onClose, onAdd, patientId, baseUrl, practitionerId }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(`${baseUrl}/patient/${patientId}/procedure`, {...form, source_id: practitionerId});
      const createdProcedure = response.data as Procedure;
      if (onAdd) {
        onAdd(createdProcedure);
      }
      onClose();
    } catch (err) {
      setError("Failed to add procedure.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Procedure</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Name"
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Performed On"
            id="performed_on"
            name="performed_on"
            type="date"
            value={form.performed_on || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Location"
            id="location"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <Select
            label="Outcome"
            id="outcome"
            name="outcome"
            value={form.outcome}
            onChange={handleChange}
            options={[
              { value: "success", label: "Success" },
              { value: "failure", label: "Failure" },
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
            textarea
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
};

export default AddProcedureModal;
