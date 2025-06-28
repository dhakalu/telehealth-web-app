import React from "react";

export type RadioOption = {
    value: string;
    label: string;
};

export interface RadioGroupProps {
    label: string;
    name: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    error?: string;
    wrapperClass?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    name,
    options,
    value,
    onChange,
    required = false,
    error,
    wrapperClass = ""
}) => {
    const handleChange = (optionValue: string) => {
        if (onChange) {
            onChange(optionValue);
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
                            type="radio"
                            className="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            required={required}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
            {error && <div className="text-error text-sm mt-1">{error}</div>}
        </div>
    );
};
