import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Button, Table, Space, Modal, Card, Tabs, Popconfirm, message } from 'antd';
import moment from 'moment';
import EmployeeBasicInfoForm from '../../../components/Form/EmployeeBasicInfoForm';
import EmployeeScheduleForm from '../../../components/Form/EmployeeScheduleForm';
import DichVu from '@/models/ServiceManagement/DichVu'; // Import from your types file

const { TabPane } = Tabs;
const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const EmployeeManagement = () => {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    services 
  } = useModel('ServiceManagement.appointment');

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<DichVu.NhanVien | null>(null);
  const [scheduleForm] = Form.useForm();
  const [employeeStats, setEmployeeStats] = useState<any[]>([]); // To store enriched employee data

  // Reset form when modal is closed
  useEffect(() => {
    if (!isModalVisible) {
      form.resetFields();
      setEditingEmployee(null);
    }
  }, [isModalVisible, form]);

  // Set schedule form values when editing an employee
  useEffect(() => {
    if (editingEmployee && editingEmployee.lichLamViec) {
      const scheduleValues: { [key: string]: any } = {};
      weekDays.forEach((day) => {
        const schedule = editingEmployee.lichLamViec[day];
        if (schedule) {
          scheduleValues[`${day}_enabled`] = true;
          scheduleValues[`${day}_start`] = moment(schedule.start, 'HH:mm');
          scheduleValues[`${day}_end`] = moment(schedule.end, 'HH:mm');
        } else {
          scheduleValues[`${day}_enabled`] = false;
        }
      });
      scheduleForm.setFieldsValue(scheduleValues);
    } else {
      // Default schedule (Monday-Friday, 9am-5pm)
      const defaultSchedule: { [key: string]: any } = {};
      weekDays.forEach((day) => {
        const isWeekday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day);
        defaultSchedule[`${day}_enabled`] = isWeekday;
        defaultSchedule[`${day}_start`] = moment('09:00', 'HH:mm');
        defaultSchedule[`${day}_end`] = moment('17:00', 'HH:mm');
      });
      scheduleForm.setFieldsValue(defaultSchedule);
    }
  }, [editingEmployee, scheduleForm]);

  // Set form values when editing an employee
  useEffect(() => {
    if (editingEmployee) {
      form.setFieldsValue({
        name: editingEmployee.name,
        age: editingEmployee.age,
        sokhach: editingEmployee.sokhach || 10,
        services: editingEmployee.dichvu_id || [],
      });
    }
  }, [editingEmployee, form]);

  // Calculate employee stats (rating and review count) from local storage
  useEffect(() => {
    const storedReviews: DichVu.Review[] = JSON.parse(localStorage.getItem('reviews') || '[]');
    const stats = employees.map((employee) => {
      const employeeReviews = storedReviews.filter((r) => r.employee_id === employee.employee_id);
      const totalRating = employeeReviews.reduce((sum, review) => sum + review.rating, 0);
      const reviewCount = employeeReviews.length;
      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      return {
        ...employee,
        averageRating,
        reviewCount,
      };
    });
    setEmployeeStats(stats);
  }, [employees]); // Re-run when employees change

  const showAddModal = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const showEditModal = (employee: DichVu.NhanVien) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (employeeId: number) => {
    deleteEmployee(employeeId);
    message.success('Employee deleted successfully');
  };

  const onFinish = () => {
    // Get values from both forms
    const basicValues = form.getFieldsValue();
    const scheduleValues = scheduleForm.getFieldsValue();
    
    // Process schedule data
    const lichLamViec: { [key: string]: { start: string; end: string } } = {};
    weekDays.forEach((day) => {
      if (scheduleValues[`${day}_enabled`]) {
        lichLamViec[day] = {
          start: scheduleValues[`${day}_start`]?.format('HH:mm') || '09:00',
          end: scheduleValues[`${day}_end`]?.format('HH:mm') || '17:00',
        };
      }
    });

    const employeeData: DichVu.NhanVien = {
      employee_id: editingEmployee ? editingEmployee.employee_id : Date.now(),
      name: basicValues.name,
      age: basicValues.age,
      sokhach: basicValues.sokhach,
      lichLamViec,
      dichvu_id: basicValues.services || [],
    };

    if (editingEmployee) {
      updateEmployee(employeeData);
      message.success('Employee updated successfully');
    } else {
      addEmployee(employeeData);
      message.success('Employee added successfully');
    }

    setIsModalVisible(false);
  };

  // Helper function to get service names
  const getServiceNames = (serviceIds?: number[]): string => {
    if (!serviceIds || !serviceIds.length) return 'No services assigned';
    return serviceIds
      .map((id) => {
        const service = services.find((s) => s.dichvu_id === id);
        return service ? service.name : `Unknown (${id})`;
      })
      .join(', ');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Services',
      key: 'services',
      render: (_: any, record: DichVu.NhanVien) => getServiceNames(record.dichvu_id),
    },
    {
      title: 'Max Clients Per Day',
      dataIndex: 'sokhach',
      key: 'sokhach',
      render: (sokhach?: number) => sokhach || 'Unlimited',
    },
    {
      title: 'Overall Rating',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number) => (rating > 0 ? `${rating.toFixed(1)} / 5.0` : 'N/A'),
      sorter: (a: any, b: any) => a.averageRating - b.averageRating,
    },
    {
      title: 'Review Count',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      render: (count: number) => count,
      sorter: (a: any, b: any) => a.reviewCount - b.reviewCount,
    },
    {
      title: 'Work Schedule',
      key: 'schedule',
      render: (_: any, record: DichVu.NhanVien) => {
        if (!record.lichLamViec) return 'No schedule set';
        return (
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {Object.entries(record.lichLamViec).map(([day, hours]) => (
              <li key={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}: {hours.start} - {hours.end}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DichVu.NhanVien) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.employee_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Employee Management</h1>

      <Card style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showAddModal}>
          Add New Employee
        </Button>
      </Card>

      <Table
        dataSource={employeeStats}
        columns={columns}
        rowKey="employee_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              // Validate both forms
              Promise.all([
                form.validateFields(),
                scheduleForm.validateFields()
              ]).then(() => {
                onFinish();
              }).catch(error => {
                console.error('Validation failed:', error);
              });
            }}
          >
            {editingEmployee ? 'Update' : 'Add'}
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Information" key="1">
            <EmployeeBasicInfoForm 
              form={form} 
              services={services} 
            />
          </TabPane>
          <TabPane tab="Work Schedule" key="2">
            <EmployeeScheduleForm
              form={scheduleForm}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;