export type Allergy = {
  id: string;
  substance: string;
  reaction: string;
  status: "active" | "resolved",
  severity: "mild" | "moderate" | "severe",
  notes: string;
  created_at: string | null;
  deleted_at: string | null;
};
