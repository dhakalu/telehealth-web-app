import axios from "axios";
import React, { useState } from "react";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import Button from "../Button";
import { Allergy } from "./types";

export type AddAllergyFormProps = {
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

const AddAllergyForm: React.FC<AddAllergyFormProps> = ({ onClose, onAdd, patientId, baseUrl }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


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
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          buttonType="warning"
          soft
          type="button"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          buttonType="primary"
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default AddAllergyForm;
