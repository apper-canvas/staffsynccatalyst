import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  options = [], 
  error, 
  required,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      <Label required={required}>{label}</Label>
      {type === "select" ? (
        <Select error={error} {...props}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <textarea
          className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          rows={3}
          {...props}
        />
      ) : (
        <Input type={type} error={error} {...props} />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;