import departmentsData from "@/services/mockData/departments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let departments = [...departmentsData];

export const departmentService = {
  async getAll() {
    await delay(300);
    return [...departments];
  },

  async getById(id) {
    await delay(200);
    const department = departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay(400);
    const newId = Math.max(...departments.map(dept => dept.Id)) + 1;
    const newDepartment = {
      Id: newId,
      ...departmentData,
      employeeCount: 0,
      createdAt: new Date().toISOString(),
    };
    departments.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay(350);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    const updatedDepartment = {
      ...departments[index],
      ...departmentData,
      Id: parseInt(id),
    };
    departments[index] = updatedDepartment;
    return { ...updatedDepartment };
  },

  async delete(id) {
    await delay(250);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departments.splice(index, 1);
    return true;
  },
};