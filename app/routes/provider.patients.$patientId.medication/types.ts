export type Medication = {
  id: string;
  name: string;
  direction: string;
  prescribed_by: string;
  dosage: string;
  frequency: string;
  status: string;
  notes: string;
  start_date: string | null;
  end_date: string | null;
};