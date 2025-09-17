import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  action,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-50 rounded-full p-3 mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary">
          <ApperIcon name={action.icon || "Plus"} className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default Empty;