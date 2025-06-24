export type Procedure = {
  id: string;
  name: string;
  performed_on: string | null;
  performed_by: string;
  location: string;
  outcome: string;
  notes: string;
  source_id: string;
  created_at: string | null;
  deleted_at: string | null;
};
