import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children,
  className, 
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg border border-gray-200 shadow-sm";
  const hoverStyles = hover ? "hover:shadow-md transition-shadow duration-200" : "";

  return (
    <div
      ref={ref}
      className={cn(baseStyles, hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;