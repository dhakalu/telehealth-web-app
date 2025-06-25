import axios from "axios";
import React, { useState } from "react";
import Button from "../Button";
import { Procedure } from "./types";

export type AddProcedureFormProps = {
  onAdd?: (proc: Procedure) => void;
  onClose?: () => void;
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

const AddProcedureForm: React.FC<AddProcedureFormProps> = ({ onClose, onAdd, patientId, baseUrl }) => {
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
      const response = await axios.post(`${baseUrl}/patient/${patientId}/procedure`, form);
      const createdProcedure = response.data as Procedure;
      if (onAdd) {
        onAdd(createdProcedure);
      }
      onClose?.();
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
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          buttonType={"parimaryReversed"}
          type="button"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          buttonType="primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default AddProcedureForm;
