"use client";

import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  autocomplete?: string;
  error?: FieldError;
  rows?: number;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, name, type = "text", placeholder, autocomplete, error, rows = 4, ...rest }, ref) => {
    const id = `field-${name}`;
    const errorId = `${id}-error`;
    const isTextarea = type === "textarea";

    const baseClasses =
      "w-full bg-white border border-[#DCEFD8] rounded-[10px] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/35 transition-all duration-200 focus:outline-none focus:border-[#A8E4A0] focus:ring-[3px] focus:ring-[#A8E4A0]/15";

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-xs uppercase tracking-[0.2em] text-foreground/60 font-heading"
        >
          {label}
        </label>

        {isTextarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            name={name}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={`${baseClasses} resize-y min-h-[110px]`}
            {...rest}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autocomplete}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={baseClasses}
            {...rest}
          />
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-rose-500/90 mt-1 pl-0.5"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
