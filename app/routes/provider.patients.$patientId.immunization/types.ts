export type Immunization = {
  id: string;
  vaccine: string;
  date_administered: string | null;
  notes: string;
  created_at: string | null;
  deleted_at: string | null;
};
