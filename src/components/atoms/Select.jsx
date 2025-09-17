import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200";
  const errorStyles = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

  return (
    <select
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;