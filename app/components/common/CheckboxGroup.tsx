import React from "react";

export type CheckboxOption = {
    value: string;
    label: string;
};

export interface CheckboxGroupProps {
    label: string;
    name: string;
    options: CheckboxOption[];
    value?: string[];
    onChange?: (value: string[]) => void;
    required?: boolean;
    error?: string;
    wrapperClass?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    label,
    name,
    options,
    value = [],
    onChange,
    required = false,
    error,
    wrapperClass = ""
}) => {
    const handleChange = (optionValue: string, checked: boolean) => {
        if (onChange) {
            if (checked) {
                onChange([...value, optionValue]);
            } else {
                onChange(value.filter(v => v !== optionValue));
            }
        }
    };

    return (
        <div className={`space-y-2 ${wrapperClass}`}>
            <label className="block mb-1 font-medium">
                {label} {required && <span className="text-error">*</span>}
            </label>
            <div className="flex flex-wrap gap-4">
                {options.map((option, index) => (
                    <label key={index} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="checkbox"
                            name={name}
                            value={option.value}
                            checked={value.includes(option.value)}
                            onChange={(e) => handleChange(option.value, e.target.checked)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
};
