import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DepartmentCard = ({ department, employees = [], onEdit, onDelete }) => {
  const departmentEmployees = employees.filter(emp => emp.department_c?.Name === department.name_c);
  const managerEmployee = employees.find(emp => emp.first_name_c + " " + emp.last_name_c === department.manager_c);
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
<h3 className="text-lg font-semibold text-gray-900 mb-2">{department.name_c}</h3>
          <p className="text-sm text-gray-600 mb-3">{department.description_c}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(department)}>
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(department)}>
            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Users" className="h-4 w-4" />
            <span>{departmentEmployees.length} employees</span>
          </div>
{department.budget_c && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="DollarSign" className="h-4 w-4" />
              <span>${department.budget_c?.toLocaleString()}</span>
            </div>
          )}
        </div>

{managerEmployee && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="UserCheck" className="h-4 w-4" />
            <span>Manager: {department.manager_c}</span>
          </div>
        )}

        {departmentEmployees.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members:</h4>
            <div className="flex flex-wrap gap-2">
              {departmentEmployees.slice(0, 5).map((employee) => (
                <div
                  key={employee.Id}
                  className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1 text-xs"
                >
<div className="bg-gradient-to-r from-primary-500 to-primary-600 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {employee.first_name_c?.charAt(0)}
                  </div>
                  <span className="text-gray-700">{employee.first_name_c} {employee.last_name_c}</span>
                </div>
              ))}
              {departmentEmployees.length > 5 && (
                <div className="bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-600">
                  +{departmentEmployees.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DepartmentCard;