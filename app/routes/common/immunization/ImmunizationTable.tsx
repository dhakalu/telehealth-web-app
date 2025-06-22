import React from "react";
import { Immunization } from "./types";
import { Table, Column } from "~/components/common/Table";
import { formatDate } from "~/utils/dateUtils";

const columns: Column<Immunization>[] = [
  { header: "Vaccine", accessor: (im) => im.vaccine },
  { header: "Date Administered", accessor: (im) => formatDate(im.date_administered) },
  { header: "Notes", accessor: (im) => im.notes },
];

export function ImmunizationTable({ immunizations }: { immunizations: Immunization[] }) {
  return <Table columns={columns} data={immunizations} emptyMessage="No immunizations found." />;
}
