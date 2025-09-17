import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import Modal from "@/components/organisms/Modal";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";

const Departments = ({ onMenuClick }) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    budget: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      setDepartments(departmentsData);
      setEmployees(employeesData);
    } catch (err) {
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      manager: "",
      budget: "",
      description: "",
    });
    setErrors({});
    setSelectedDepartment(null);
  };

  const handleAddDepartment = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department) => {
setSelectedDepartment(department);
    setFormData({
      name: department.name_c || "",
      manager: department.manager_c || "",
      budget: department.budget_c || "",
      description: department.description_c || "",
    });
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = async (department) => {
const departmentEmployees = employees.filter(emp => emp.department_c?.Name === department.name_c);
    
    if (departmentEmployees.length > 0) {
      toast.error(`Cannot delete department with ${departmentEmployees.length} employees. Please reassign employees first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      try {
        await departmentService.delete(department.Id);
        setDepartments(prev => prev.filter(dept => dept.Id !== department.Id));
        toast.success("Department deleted successfully");
      } catch (err) {
        toast.error("Failed to delete department");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (formData.budget && isNaN(formData.budget)) newErrors.budget = "Budget must be a number";

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
      const departmentData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      };

      if (selectedDepartment) {
        const updatedDepartment = await departmentService.update(selectedDepartment.Id, departmentData);
        setDepartments(prev => prev.map(dept => 
          dept.Id === selectedDepartment.Id ? updatedDepartment : dept
        ));
        toast.success("Department updated successfully");
      } else {
        const newDepartment = await departmentService.create(departmentData);
        setDepartments(prev => [...prev, newDepartment]);
        toast.success("Department created successfully");
      }
      
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Failed to save department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDepartments = departments.filter(department => 
department.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.manager_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

const managerOptions = employees.map(emp => ({
    value: `${emp.first_name_c} ${emp.last_name_c}`,
    label: `${emp.first_name_c} ${emp.last_name_c} - ${emp.job_title_c}`
  }));

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        onMenuClick={onMenuClick}
        title="Departments"
        actions={
          <Button onClick={handleAddDepartment}>
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add Department
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="max-w-md">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search departments..."
              />
            </div>
          </div>

          {/* Departments Grid */}
          {filteredDepartments.length === 0 ? (
            <Empty
              title="No departments found"
              message={searchTerm ? 
                "No departments match your search. Try different keywords." :
                "Get started by creating your first department."
              }
              icon="Building2"
              action={{
                label: "Add Department",
                onClick: handleAddDepartment,
                icon: "Plus"
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map(department => (
                <DepartmentCard
                  key={department.Id}
                  department={department}
                  employees={employees}
                  onEdit={handleEditDepartment}
                  onDelete={handleDeleteDepartment}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Department Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          resetForm();
        }}
        title={selectedDepartment ? "Edit Department" : "Add Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
          />
          
          <FormField
            label="Manager"
            type="select"
            value={formData.manager}
            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            options={managerOptions}
            error={errors.manager}
          />
          
          <FormField
            label="Budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            error={errors.budget}
          />
          
          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={errors.description}
          />

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => {
              setIsFormOpen(false);
              resetForm();
            }}>
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
                  {selectedDepartment ? "Update Department" : "Create Department"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;