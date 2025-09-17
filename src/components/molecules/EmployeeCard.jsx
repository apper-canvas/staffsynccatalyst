import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const EmployeeCard = ({ employee, onEdit, onView }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "danger";
      case "pending": return "warning";
      default: return "default";
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
<div className="bg-gradient-to-r from-primary-500 to-primary-600 h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {employee.first_name_c?.charAt(0)}{employee.last_name_c?.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {employee.first_name_c} {employee.last_name_c}
            </h3>
            <p className="text-sm text-gray-500">{employee.job_title_c}</p>
            <p className="text-xs text-gray-400">{employee.department_c?.Name}</p>
          </div>
        </div>
<Badge variant={getStatusVariant(employee.status_c)}>
          {employee.status_c}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
<ApperIcon name="Mail" className="h-4 w-4 mr-2" />
          {employee.email_c}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
          {employee.phone_c}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          Started {format(new Date(employee.start_date_c), "MMM dd, yyyy")}
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="secondary" size="sm" onClick={() => onView(employee)} className="flex-1">
          <ApperIcon name="Eye" className="h-4 w-4" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(employee)} className="flex-1">
          <ApperIcon name="Edit" className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default EmployeeCard;