import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  textarea?: boolean;
  wrapperClass?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, textarea, id, className = "", wrapperClass, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={`mb-2 text-base-content ${wrapperClass || ""}`}>
        <label htmlFor={inputId} className="block mb-1 font-medium">
          {label} {props.required && <span className="text-error">*</span>}
        </label>
        {textarea ? (
          <textarea
            id={inputId}
            className={`input validator w-full border px-4 py-2 rounded ${error ? "border-red-500" : ""} ${className}`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            className={`input validator w-full border px-4 py-2 rounded ${error ? "border-red-500" : ""} ${className}`}
            {...props}
          />
        )}
        {error && <div className="text-error">{error}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
