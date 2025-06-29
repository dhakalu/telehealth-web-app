import axios from "axios";
import { useState } from "react";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { useToast } from "~/hooks/useToast";
import Button from "../Button";
import { Medication } from "./types";

type AddMedicationFormProps = {
  onAdd?: (medication: Medication) => void;
  baseUrl: string;
  patientId: string;
};

const instialForm = {
  name: "",
  direction: "",
  prescribed_by: "",
  dosage: "",
  frequency: "",
  status: "",
  notes: "",
  // start_date: null,
  // end_date: null
};
export default function AddMedicationForm({ baseUrl, onAdd, patientId }: AddMedicationFormProps) {
  const [form, setForm] = useState<Omit<Medication, "id">>(instialForm);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();


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

      toast.success(`Medication "${form.name}" added successfully!`);

      setForm(instialForm);
    } catch (err) {
      console.error('Error adding medication:', err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add medication. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          buttonType="primary"
          type="submit"
          isLoading={submitting}
        >
          {submitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
}
