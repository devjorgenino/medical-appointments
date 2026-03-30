import type React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onBlur?: () => void;
  required?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  disabled = false,
  onChange,
  onBlur,
  required = false,
  options,
  className = "",
  placeholder = "",
  error = "",
}) => {
  const hasError = Boolean(error);
  const borderColorClass = hasError
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400";

  const baseInputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${borderColorClass} ${className}`;

  let inputElement: React.ReactNode;

  if (type === "select") {
    inputElement = (
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={baseInputClasses}
      >
        <option value="" disabled>
          Seleccione una opcion...
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (type === "radio") {
    inputElement = (
      <div className="flex items-center mb-5 text-center">
        {options?.map((option) => (
          <label key={option.value} className="mr-4 text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              id={`${id}-${option.value}`}
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              onBlur={onBlur}
              required={required}
              disabled={disabled}
              className={`w-auto mr-3 px-3 py-2 border rounded-md shadow-sm focus:outline-none accent-blue-500 ${borderColorClass} ${className}`}
            />
            {option.label}
          </label>
        ))}
      </div>
    );
  } else {
    inputElement = (
      <input
        type={type}
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        className={baseInputClasses}
        autoComplete={type === "password" ? "current-password" : "on"}
      />
    );
  }

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block mb-1 text-sm font-medium ${
          hasError ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {inputElement}
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;
