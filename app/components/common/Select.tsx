import React from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
};

export const Select: React.FC<SelectProps> = ({ label, options, error, id, className = "", ...props }) => {
  const selectId = id || props.name;
  return (
    <div className="mb-2">
      <label htmlFor={selectId} className="block mb-1 font-medium">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full border px-2 py-1 rounded ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};
