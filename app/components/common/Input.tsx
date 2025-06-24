import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  textarea?: boolean;
};

export const Input: React.FC<InputProps> = ({ label, error, textarea, id, className = "", ...props }) => {
  const inputId = id || props.name;
  return (
    <div className="mb-2">
      <label htmlFor={inputId} className="block mb-1 font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={inputId}
          className={`w-full border px-2 py-1 rounded ${error ? "border-red-500" : ""} ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={`w-full border px-2 py-1 rounded ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
      )}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};
