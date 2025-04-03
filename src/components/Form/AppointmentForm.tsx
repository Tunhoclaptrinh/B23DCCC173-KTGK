import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;

// Status options and colors
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Approval', color: 'orange' },
  { value: 'confirmed', label: 'Confirmed', color: 'green' },
  { value: 'completed', label: 'Completed', color: 'blue' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

const AppointmentForm = ({
  form,
  onFinish,
  editingAppointment,
  isStatusUpdateMode,
  isNewCustomerMode,
  setIsNewCustomerMode,
  services,
  users,
  availableEmployees,
  selectedService,
  selectedDate,
  handleServiceChange,
  handleDateChange,
  isEmployeeAvailable,
  formatEmployeeOption
}) => {
  // Toggle new customer form
  const toggleNewCustomerMode = () => {
    setIsNewCustomerMode(!isNewCustomerMode);
    if (!isNewCustomerMode) {
      form.setFieldsValue({ user_id: undefined });
    } else {
      form.setFieldsValue({ 
        new_customer_name: undefined,
        new_customer_age: undefined,
        new_customer_gender: undefined
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {!isStatusUpdateMode && (
        <>
          {!isNewCustomerMode ? (
            <>
              <Form.Item
                name="user_id"
                label="Client"
                rules={[{ required: !isNewCustomerMode, message: 'Please select a client' }]}
              >
                <Select 
                  placeholder="Select client"
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px', borderTop: '1px solid #e8e8e8' }}>
                        <Button type="link" onClick={toggleNewCustomerMode}>
                          + Add New Customer
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {users.map(user => (
                    <Option key={user.user_id} value={user.user_id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <Button type="link" onClick={toggleNewCustomerMode}>
                  &lt; Back to Customer Selection
                </Button>
              </div>
              <Form.Item
                name="new_customer_name"
                label="Customer Name"
                rules={[{ required: isNewCustomerMode, message: 'Please enter customer name' }]}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>
              <Form.Item
                name="new_customer_age"
                label="Customer Age"
              >
                <Input type="number" placeholder="Enter age" />
              </Form.Item>
              <Form.Item
                name="new_customer_gender"
                label="Customer Gender"
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </>
          )}
          
          <Form.Item
            name="dichvu_id"
            label="Service"
            rules={[{ required: true, message: 'Please select a service' }]}
          >
            <Select 
              placeholder="Select service"
              onChange={handleServiceChange}
            >
              {services.map(service => (
                <Option key={service.dichvu_id} value={service.dichvu_id}>
                  {service.name} - ${service.price} ({service.thoiGianThucHien || 60} mins)
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              disabledDate={current => current && current < moment().startOf('day')}
              onChange={handleDateChange}
            />
          </Form.Item>
          
          <Form.Item
            name="employee_id"
            label="Employee"
            rules={[{ required: true, message: 'Please select an employee' }]}
          >
            <Select 
              placeholder="Select employee"
              disabled={!selectedService}
            >
              {availableEmployees.map(employee => (
                <Option 
                  key={employee.employee_id} 
                  value={employee.employee_id}
                  disabled={!isEmployeeAvailable(employee.employee_id)}
                >
                  {formatEmployeeOption(employee)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: 'Please select a time' }]}
          >
            <TimePicker 
              format="HH:mm" 
              style={{ width: '100%' }} 
              minuteStep={15}
            />
          </Form.Item>
        </>
      )}
      
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Select placeholder="Select status">
          {STATUS_OPTIONS.map(status => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default AppointmentForm;