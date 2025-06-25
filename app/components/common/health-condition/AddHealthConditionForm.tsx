import axios from "axios";
import React, { useState } from "react";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { HealthCondition } from "./types";

export type AddHealthConditionModalProps = {
  onAdd?: (hc: HealthCondition) => void;
  patientId: string;
  baseUrl: string;
  practionerId: string;
};

const initialForm: Omit<HealthCondition, "id"> = {
  name: "",
  status: "",
  notes: "",
  diagnosed_on: null,
};

const AddHealthConditionForm: React.FC<AddHealthConditionModalProps> = ({ onAdd, patientId, baseUrl, practionerId }) => {
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
      // Replace with your actual API endpoint
      const response = await axios.post(`${baseUrl}/patient/${patientId}/health-condition`, { ...form, diagnosed_on: new Date().toISOString().split('T')[0], source_id: practionerId });
      const createdHealthCondition = response.data as HealthCondition;
      if (onAdd) {
        onAdd(createdHealthCondition);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("Failed to add health condition.");
      } else {
        setError("Unknown error.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
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
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="flex justify-end gap-2 mt-4">
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
  );
};

export default AddHealthConditionForm;
