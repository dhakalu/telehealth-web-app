import React from "react";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  textarea?: boolean;
  wrapperClass?: string;
};


export const TextArea: React.FC<TextAreaProps> = ({ label, error, id, wrapperClass, ...props }) => {
  const inputId = id || props.name;
  return (
    <div className={`mb-2 text-base-content ${wrapperClass || ""}`}>
      <label htmlFor={inputId} className="block mb-1 font-medium">
        {label} {props.required && <span className="text-error">*</span>}
      </label>
      <textarea
        id={inputId}
        className={`textarea validator w-full`}
        {...props}
      />

      {error && <div className="text-error">{error}</div>}
    </div>
  );
};
