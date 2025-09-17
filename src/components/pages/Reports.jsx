import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";

const Reports = ({ onMenuClick }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const csvContent = data.map(row => Object.values(row).join(",")).join("\n");
    const header = Object.keys(data[0]).join(",");
    const csv = header + "\n" + csvContent;
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`${filename} exported successfully`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate statistics
const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status_c === "active").length;
  const inactiveEmployees = employees.filter(emp => emp.status_c === "inactive").length;
  const pendingEmployees = employees.filter(emp => emp.status_c === "pending").length;

const departmentStats = departments.map(dept => ({
    department: dept.name_c,
    employees: employees.filter(emp => emp.department_c?.Name === dept.name_c).length,
    activeEmployees: employees.filter(emp => emp.department_c?.Name === dept.name_c && emp.status_c === "active").length,
    manager: dept.manager_c || "N/A",
    budget: dept.budget_c ? `$${dept.budget_c.toLocaleString()}` : "N/A"
  }));

  const statusReport = [
    { status: "Active", count: activeEmployees, percentage: ((activeEmployees / totalEmployees) * 100).toFixed(1) },
    { status: "Inactive", count: inactiveEmployees, percentage: ((inactiveEmployees / totalEmployees) * 100).toFixed(1) },
    { status: "Pending", count: pendingEmployees, percentage: ((pendingEmployees / totalEmployees) * 100).toFixed(1) },
  ];

const recentHires = employees
    .filter(emp => {
      const hireDate = new Date(emp.start_date_c);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate >= thirtyDaysAgo;
    })
    .map(emp => ({
      name: `${emp.first_name_c} ${emp.last_name_c}`,
      department: emp.department_c?.Name,
      jobTitle: emp.job_title_c,
      startDate: new Date(emp.start_date_c).toLocaleDateString(),
      status: emp.status_c
    }));

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        onMenuClick={onMenuClick}
        title="Reports"
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => exportToCSV(employees, "employees-report.csv")}
            >
              <ApperIcon name="Download" className="h-4 w-4" />
              Export Employees
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportToCSV(departmentStats, "departments-report.csv")}
            >
              <ApperIcon name="Download" className="h-4 w-4" />
              Export Departments
            </Button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                </div>
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-lg">
                  <ApperIcon name="Users" className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Employees</p>
                  <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                  <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Departments</p>
                  <p className="text-3xl font-bold text-blue-600">{departments.length}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                  <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Recent Hires</p>
                  <p className="text-3xl font-bold text-purple-600">{recentHires.length}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                  <ApperIcon name="UserPlus" className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Status Report */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Employee Status</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => exportToCSV(statusReport, "employee-status-report.csv")}
                >
                  <ApperIcon name="Download" className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {statusReport.map((item) => (
                  <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === "Active" ? "bg-green-500" :
                        item.status === "Inactive" ? "bg-red-500" : "bg-yellow-500"
                      }`}></div>
                      <span className="font-medium text-gray-900">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.count}</p>
                      <p className="text-sm text-gray-500">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Department Statistics */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => exportToCSV(departmentStats, "department-stats-report.csv")}
                >
                  <ApperIcon name="Download" className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{dept.department}</p>
                      <p className="text-sm text-gray-500">{dept.manager}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{dept.employees} employees</p>
                      <p className="text-sm text-green-600">{dept.activeEmployees} active</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Hires Report */}
          {recentHires.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Hires (Last 30 Days)</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => exportToCSV(recentHires, "recent-hires-report.csv")}
                >
                  <ApperIcon name="Download" className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentHires.map((hire, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {hire.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hire.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hire.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hire.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            hire.status === "active" ? "bg-green-100 text-green-800" :
                            hire.status === "inactive" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {hire.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;