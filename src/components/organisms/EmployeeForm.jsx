import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const EmployeeForm = ({ employee, onSave, onCancel, departments = [] }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    manager: "",
    startDate: "",
    salary: "",
    status: "active",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
if (employee) {
      setFormData({
        firstName: employee.first_name_c || "",
        lastName: employee.last_name_c || "",
        email: employee.email_c || "",
        phone: employee.phone_c || "",
        jobTitle: employee.job_title_c || "",
        department: employee.department_c?.Name || "",
        manager: employee.manager_c || "",
        startDate: employee.start_date_c ? employee.start_date_c.split("T")[0] : "",
        salary: employee.salary_c || "",
        status: employee.status_c || "active",
        address: employee.address_c || "",
        emergencyContactName: employee.emergency_contact_name_c || "",
        emergencyContactPhone: employee.emergency_contact_phone_c || "",
      });
    }
  }, [employee]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (formData.salary && isNaN(formData.salary)) newErrors.salary = "Salary must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const employeeData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
        },
      };

      await onSave(employeeData);
      toast.success(employee ? "Employee updated successfully" : "Employee created successfully");
    } catch (error) {
      toast.error("Failed to save employee");
    } finally {
      setIsSubmitting(false);
    }
  };

const departmentOptions = departments.map(dept => ({
    value: dept.name_c,
    label: dept.name_c
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
            required
          />
          <FormField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
            required
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            required
          />
          <FormField
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="Address"
              type="textarea"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
            />
          </div>
        </div>
      </div>

      {/* Job Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Job Title"
            value={formData.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            error={errors.jobTitle}
            required
          />
          <FormField
            label="Department"
            type="select"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            options={departmentOptions}
            error={errors.department}
            required
          />
          <FormField
            label="Manager"
            value={formData.manager}
            onChange={(e) => handleChange("manager", e.target.value)}
            error={errors.manager}
          />
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={statusOptions}
            error={errors.status}
            required
          />
          <FormField
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            error={errors.startDate}
            required
          />
          <FormField
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            error={errors.salary}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contact Name"
            value={formData.emergencyContactName}
            onChange={(e) => handleChange("emergencyContactName", e.target.value)}
            error={errors.emergencyContactName}
          />
          <FormField
            label="Contact Phone"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
            error={errors.emergencyContactPhone}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="h-4 w-4" />
              {employee ? "Update Employee" : "Create Employee"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;