import React from "react";

export type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  tableClassName?: string;
};

export function Table<T extends { id: string }>({ columns, data, emptyMessage = "No data found.", tableClassName = "min-w-full border border-gray-200 mt-4" }: TableProps<T>) {
  if (!data || data.length === 0) {
    return <div>{emptyMessage}</div>;
  }
  return (
    <table className={tableClassName}>
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col, idx) => (
            <th key={idx} className={col.className ? col.className + " border" : "px-3 py-2 border"}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {columns.map((col, idx) => (
              <td key={idx} className={col.className ? col.className + " border" : "px-3 py-2 border"}>{col.accessor(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
