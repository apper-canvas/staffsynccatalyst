import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ 
  children,
  required,
  className, 
  ...props 
}, ref) => {
  const baseStyles = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <label
      ref={ref}
      className={cn(baseStyles, className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;