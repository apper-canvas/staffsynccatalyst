import employeesData from "@/services/mockData/employees.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let employees = [...employeesData];

export const employeeService = {
  async getAll() {
    await delay(300);
    return [...employees];
  },

  async getById(id) {
    await delay(200);
    const employee = employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  },

  async create(employeeData) {
    await delay(400);
    const newId = Math.max(...employees.map(emp => emp.Id)) + 1;
    const newEmployee = {
      Id: newId,
      ...employeeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    employees.push(newEmployee);
    return { ...newEmployee };
  },

  async update(id, employeeData) {
    await delay(350);
    const index = employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    const updatedEmployee = {
      ...employees[index],
      ...employeeData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    employees[index] = updatedEmployee;
    return { ...updatedEmployee };
  },

  async delete(id) {
    await delay(250);
    const index = employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    employees.splice(index, 1);
    return true;
  },
};