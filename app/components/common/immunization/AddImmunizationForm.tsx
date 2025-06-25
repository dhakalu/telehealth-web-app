import axios from "axios";
import React, { useState } from "react";
import { Input } from "~/components/common/Input";
import Button from "../Button";
import { Immunization } from "./types";

export type AddImmunizationModalProps = {
  onClose: () => void;
  onAdd?: (im: Immunization) => void;
  patientId: string;
  baseUrl: string;
};

const initialForm: Omit<Immunization, "id" | "created_at" | "deleted_at"> = {
  vaccine: "",
  date_administered: "",
  notes: "",
};

const AddImmunizationModal: React.FC<AddImmunizationModalProps> = ({ onClose, onAdd, patientId, baseUrl }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(`${baseUrl}/patient/${patientId}/immunization`, form);
      const createdImmunization = response.data as Immunization;
      if (onAdd) {
        onAdd(createdImmunization);
      }
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to add immunization.");
      } else {
        setError("Unknown issue");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Vaccine"
        id="vaccine"
        name="vaccine"
        placeholder="Vaccine"
        value={form.vaccine}
        onChange={handleChange}
        required
      />
      <Input
        label="Date Administered"
        id="date_administered"
        name="date_administered"
        type="date"
        value={form.date_administered || ""}
        onChange={handleChange}
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
          type="button"
          buttonType="parimaryReversed"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
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

export default AddImmunizationModal;
