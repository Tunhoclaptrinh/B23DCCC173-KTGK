import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { DichVu } from '../types'; // Import from your types file

const { Option } = Select;

interface EmployeeBasicInfoFormProps {
  form: any;
  services: DichVu.DichVu[];
}

const EmployeeBasicInfoForm: React.FC<EmployeeBasicInfoFormProps> = ({ 
  form, 
  services 
}) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter employee name' }]}
      >
        <Input placeholder="Employee name" />
      </Form.Item>

      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: 'Please enter employee age' }]}
      >
        <InputNumber min={18} max={100} style={{ width: '100%' }} placeholder="Employee age" />
      </Form.Item>

      <Form.Item
        name="services"
        label="Services Provided"
        rules={[{ required: true, message: 'Please select at least one service' }]}
      >
        <Select mode="multiple" placeholder="Select services this employee provides" style={{ width: '100%' }}>
          {services.map((service) => (
            <Option key={service.dichvu_id} value={service.dichvu_id}>
              {service.name} - ${service.price} ({service.thoiGianThucHien || 60} mins)
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        name="sokhach" 
        label="Maximum Clients Per Day" 
        tooltip="Leave empty for unlimited clients"
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="Maximum clients per day" />
      </Form.Item>
    </Form>
  );
};

export default EmployeeBasicInfoForm;