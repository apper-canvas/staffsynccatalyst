import { toast } from 'react-toastify';

export const employeeService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "department_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };

      const response = await apperClient.fetchRecords('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error?.response?.data?.message || error);
      toast.error("Failed to fetch employees");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "department_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };

      const response = await apperClient.getRecordById('employee_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.error("Employee not found");
        toast.error("Employee not found");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch employee");
      return null;
    }
  },

  async create(employeeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone || "",
          job_title_c: employeeData.jobTitle,
          manager_c: employeeData.manager || "",
          start_date_c: employeeData.startDate,
          salary_c: employeeData.salary ? parseFloat(employeeData.salary) : null,
          status_c: employeeData.status || "active",
          address_c: employeeData.address || "",
          emergency_contact_name_c: employeeData.emergencyContact?.name || "",
          emergency_contact_phone_c: employeeData.emergencyContact?.phone || "",
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString(),
          department_c: employeeData.departmentId || null
        }]
      };

      const response = await apperClient.createRecord('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} employees:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Employee created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating employee:", error?.response?.data?.message || error);
      toast.error("Failed to create employee");
      return null;
    }
  },

  async update(id, employeeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone || "",
          job_title_c: employeeData.jobTitle,
          manager_c: employeeData.manager || "",
          start_date_c: employeeData.startDate,
          salary_c: employeeData.salary ? parseFloat(employeeData.salary) : null,
          status_c: employeeData.status || "active",
          address_c: employeeData.address || "",
          emergency_contact_name_c: employeeData.emergencyContact?.name || "",
          emergency_contact_phone_c: employeeData.emergencyContact?.phone || "",
          updated_at_c: new Date().toISOString(),
          department_c: employeeData.departmentId || null
        }]
      };

      const response = await apperClient.updateRecord('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} employees:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Employee updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating employee:", error?.response?.data?.message || error);
      toast.error("Failed to update employee");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} employees:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Employee deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting employee:", error?.response?.data?.message || error);
      toast.error("Failed to delete employee");
      return false;
    }
  }
};