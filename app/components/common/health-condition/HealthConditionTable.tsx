import { HealthCondition } from "./types";
import { Table, Column } from "~/components/common/Table";
import { formatDate } from "~/utils/dateUtils";

const columns: Column<HealthCondition>[] = [
  { header: "Name", accessor: (hc) => hc.name },
  { header: "Status", accessor: (hc) => hc.status },
  { header: "Notes", accessor: (hc) => hc.notes },
  { header: "Diagnosed On", accessor: (hc) => formatDate(hc.diagnosed_on) },
];

export function HealthConditionTable({ healthConditions }: { healthConditions: HealthCondition[] }) {
  return <Table columns={columns} data={healthConditions} emptyMessage="No health conditions found." />;
}
