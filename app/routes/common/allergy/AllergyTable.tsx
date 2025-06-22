import React from "react";
import { Allergy } from "./types";
import { Table, Column } from "~/components/common/Table";

const columns: Column<Allergy>[] = [
  { header: "Substance", accessor: (a) => a.substance },
  { header: "Reaction", accessor: (a) => a.reaction },
  { header: "Status", accessor: (a) => a.status },
  { header: "Severity", accessor: (a) => a.severity },
  { header: "Notes", accessor: (a) => a.notes },
];

export function AllergyTable({ allergies }: { allergies: Allergy[] }) {
  return <Table columns={columns} data={allergies} emptyMessage="No allergies found." />;
}
