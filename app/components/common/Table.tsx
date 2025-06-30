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
};

export function Table<T extends { id: string }>({ columns, data, emptyMessage = "No data found." }: TableProps<T>) {
  if (!data || data.length === 0) {
    return (<div className="text-center py-8">
      <p className="opacity-50">{emptyMessage}</p>
    </div>)
  }


  return (
    <div className="overflow-x-auto">
      <table className={"table table-zebra"}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-hover">
              {columns.map((col, idx) => (
                <td key={idx}>{col.accessor(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
