import React from "react";
import { HealthCondition } from "./types";

export type HealthConditionTableProps = {
  healthConditions: HealthCondition[];
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}

export function HealthConditionTable({ healthConditions }: HealthConditionTableProps) {
  if (!healthConditions || healthConditions.length === 0) {
    return <div>No health conditions found.</div>;
  }

  return (
    <table className="min-w-full border border-gray-200 mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-3 py-2 border">Name</th>
          <th className="px-3 py-2 border">Status</th>
          <th className="px-3 py-2 border">Notes</th>
          <th className="px-3 py-2 border">Start Date</th>
          <th className="px-3 py-2 border">End Date</th>
        </tr>
      </thead>
      <tbody>
        {healthConditions.map((hc) => (
          <tr key={hc.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border">{hc.name}</td>
            <td className="px-3 py-2 border">{hc.status}</td>
            <td className="px-3 py-2 border">{hc.notes}</td>
            <td className="px-3 py-2 border">{formatDate(hc.start_date)}</td>
            <td className="px-3 py-2 border">{formatDate(hc.end_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
