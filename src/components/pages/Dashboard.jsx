import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatsCard from "@/components/molecules/StatsCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";

const Dashboard = ({ onMenuClick }) => {
  const navigate = useNavigate();
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
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const activeEmployees = employees.filter(emp => emp.status === "active");
  const recentHires = employees.filter(emp => {
    const hireDate = new Date(emp.startDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return hireDate >= thirtyDaysAgo;
  });

  const departmentStats = departments.map(dept => ({
    ...dept,
    employeeCount: employees.filter(emp => emp.department === dept.name).length
  }));

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        onMenuClick={onMenuClick}
        title="Dashboard"
        actions={
          <Button onClick={() => navigate("/employees")}>
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Employees"
              value={employees.length}
              icon="Users"
              trend="up"
              change="+5%"
            />
            <StatsCard
              title="Active Employees"
              value={activeEmployees.length}
              icon="UserCheck"
              trend="up"
              change="+2%"
            />
            <StatsCard
              title="Departments"
              value={departments.length}
              icon="Building2"
            />
            <StatsCard
              title="Recent Hires"
              value={recentHires.length}
              icon="UserPlus"
              trend="up"
              change={`${recentHires.length} this month`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Hires */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Hires</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}>
                  View All
                  <ApperIcon name="ArrowRight" className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentHires.slice(0, 5).map(employee => (
                  <div key={employee.Id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{employee.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        {format(new Date(employee.startDate), "MMM dd")}
                      </p>
                      <p className="text-xs text-gray-500">{employee.department}</p>
                    </div>
                  </div>
                ))}
                {recentHires.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent hires</p>
                )}
              </div>
            </Card>

            {/* Department Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/departments")}>
                  View All
                  <ApperIcon name="ArrowRight" className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {departmentStats.slice(0, 5).map(department => (
                  <div key={department.Id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-success-500 to-success-600 p-2 rounded-lg">
                        <ApperIcon name="Building2" className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{department.name}</p>
                        <p className="text-sm text-gray-500">{department.manager}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{department.employeeCount}</p>
                      <p className="text-xs text-gray-500">employees</p>
                    </div>
                  </div>
                ))}
                {departmentStats.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No departments</p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="p-4 h-auto flex-col space-y-2"
                onClick={() => navigate("/employees")}
              >
                <ApperIcon name="UserPlus" className="h-8 w-8" />
                <span>Add New Employee</span>
              </Button>
              <Button
                variant="outline"
                className="p-4 h-auto flex-col space-y-2"
                onClick={() => navigate("/departments")}
              >
                <ApperIcon name="Building2" className="h-8 w-8" />
                <span>Manage Departments</span>
              </Button>
              <Button
                variant="outline"
                className="p-4 h-auto flex-col space-y-2"
                onClick={() => navigate("/reports")}
              >
                <ApperIcon name="FileText" className="h-8 w-8" />
                <span>View Reports</span>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;