import React from "react";
import { Procedure } from "./types";
import { Table, Column } from "~/components/common/Table";
import { formatDate } from "~/utils/dateUtils";

const columns: Column<Procedure>[] = [
  { header: "Name", accessor: (p) => p.name },
  { header: "Performed On", accessor: (p) => formatDate(p.performed_on) },
  { header: "Location", accessor: (p) => p.location },
  { header: "Outcome", accessor: (p) => p.outcome },
  { header: "Notes", accessor: (p) => p.notes },
  { header: "Source ID", accessor: (p) => p.source_id },
];

export function ProcedureTable({ procedures }: { procedures: Procedure[] }) {
  return <Table columns={columns} data={procedures} emptyMessage="No procedures found." />;
}
