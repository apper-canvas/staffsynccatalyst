import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import EmployeeForm from "@/components/organisms/EmployeeForm";
import Modal from "@/components/organisms/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";

const Employees = ({ onMenuClick }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
if (selectedEmployee) {
        const updatedEmployee = await employeeService.update(selectedEmployee.Id, employeeData);
        setEmployees(prev => prev.map(emp => 
          emp.Id === selectedEmployee.Id ? updatedEmployee : emp
        ));
      } else {
        const newEmployee = await employeeService.create(employeeData);
        setEmployees(prev => [...prev, newEmployee]);
      }
      setIsFormOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      throw new Error("Failed to save employee");
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewOpen(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        setEmployees(prev => prev.filter(emp => emp.Id !== employee.Id));
        toast.success("Employee deleted successfully");
      } catch (err) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const filteredEmployees = employees.filter(employee => {
const matchesSearch = 
      employee.first_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.job_title_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.department_c?.Name === filterDepartment;
    const matchesStatus = !filterStatus || employee.status_c === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        onMenuClick={onMenuClick}
        title="Employees"
        actions={
          <Button onClick={handleAddEmployee}>
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 max-w-md">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search employees..."
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="min-w-[140px]"
                >
                  <option value="">All Departments</option>
{departments.map(dept => (
                    <option key={dept.Id} value={dept.name_c}>{dept.name_c}</option>
                  ))}
                </Select>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="min-w-[120px]"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Select>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "table" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <ApperIcon name="List" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                  >
                    <ApperIcon name="Grid3X3" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredEmployees.length === 0 ? (
            <Empty
              title="No employees found"
              message={searchTerm || filterDepartment || filterStatus ? 
                "No employees match your current filters. Try adjusting your search criteria." :
                "Get started by adding your first employee to the system."
              }
              icon="Users"
              action={{
                label: "Add Employee",
                onClick: handleAddEmployee,
                icon: "Plus"
              }}
            />
          ) : viewMode === "table" ? (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onView={handleViewEmployee}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map(employee => (
                <div key={employee.Id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
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
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleViewEmployee(employee)} className="flex-1">
                      <ApperIcon name="Eye" className="h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)} className="flex-1">
                      <ApperIcon name="Edit" className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Employee Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? "Edit Employee" : "Add Employee"}
        size="lg"
      >
        <EmployeeForm
          employee={selectedEmployee}
          departments={departments}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedEmployee(null);
          }}
        />
      </Modal>

      {/* Employee View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedEmployee(null);
        }}
        title="Employee Details"
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
{selectedEmployee.first_name_c?.charAt(0)}{selectedEmployee.last_name_c?.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedEmployee.first_name_c} {selectedEmployee.last_name_c}
              </h2>
              <p className="text-gray-600">{selectedEmployee.job_title_c}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
<span>{selectedEmployee.email_c}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                    <span>{selectedEmployee.phone_c}</span>
                  </div>
                  {selectedEmployee.address_c && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400" />
                      <span>{selectedEmployee.address_c}</span>
                    </div>
                  )}
                </div>
              </div>
<div>
                <h3 className="font-semibold text-gray-900 mb-3">Job Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Building2" className="h-4 w-4 text-gray-400" />
                    <span>{selectedEmployee.department_c?.Name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                    <span>Started {new Date(selectedEmployee.start_date_c).toLocaleDateString()}</span>
                  </div>
                  {selectedEmployee.manager_c && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="UserCheck" className="h-4 w-4 text-gray-400" />
                      <span>Manager: {selectedEmployee.manager_c}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewOpen(false);
                handleEditEmployee(selectedEmployee);
              }}>
                <ApperIcon name="Edit" className="h-4 w-4" />
                Edit Employee
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Employees;