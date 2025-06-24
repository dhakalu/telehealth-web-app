import axios from "axios";
import React, { useState } from "react";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { Allergy } from "./types";

export type AddAllergyModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd?: (a: Allergy) => void;
  patientId: string;
  baseUrl: string;
};

const initialForm: Omit<Allergy, "id" | "created_at" | "deleted_at"> = {
  substance: "",
  reaction: "",
  status: "active",
  severity: "mild",
  notes: "",
};

const AddAllergyModal: React.FC<AddAllergyModalProps> = ({ open, onClose, onAdd, patientId, baseUrl }) => {
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
      const response = await axios.post(`${baseUrl}/patient/${patientId}/allergy`, form);
      const createdAllergy = response.data as Allergy;
      if (onAdd) {
        onAdd(createdAllergy);
      }
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("Cannot add allergy.");
      } else {
        setError("Unknown error.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Allergy</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Substance"
            id="substance"
            name="substance"
            placeholder="Substance"
            value={form.substance}
            onChange={handleChange}
            required
          />
          <Input
            label="Reaction"
            id="reaction"
            name="reaction"
            placeholder="Reaction"
            value={form.reaction}
            onChange={handleChange}
            required
          />
          <Select
            label="Status"
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { value: "active", label: "Active" },
              { value: "resolved", label: "Resolved" },
            ]}
            required
          />
          <Select
            label="Severity"
            id="severity"
            name="severity"
            value={form.severity}
            onChange={handleChange}
            options={[
              { value: "mild", label: "Mild" },
              { value: "moderate", label: "Moderate" },
              { value: "severe", label: "Severe" },
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

export default AddAllergyModal;
