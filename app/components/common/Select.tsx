import React from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
  reactSelect?: boolean; // Optional prop for react-select compatibility
};

// const getItemByValue = (value: string, options: SelectOption[]) => {
//   return options.find((option) => option.value === value);
// }

export const Select: React.FC<SelectProps> = ({ label, options, error, id, ...props }) => {
  const selectId = id || props.name;
  return (
    <div className="mb-2">
      <label htmlFor={selectId} className="block mb-1 font-medium">
        {label}
      </label>
      <select
        id={selectId}
        className={'select w-full'}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="text-error-content text-xs mt-1">{error}</div>}
    </div>
  );
};
