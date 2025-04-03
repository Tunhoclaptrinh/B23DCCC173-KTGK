import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import DichVu from '@/models/ServiceManagement/DichVu';

const { TextArea } = Input;

interface ServiceFormProps {
  initialValues?: DichVu.DichVu;
  onFinish: (values: any) => void;
  form: any; // Form instance passed from parent
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  initialValues,
  onFinish,
  form 
}) => {
  
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        price: initialValues.price,
        description: initialValues.description || '',
        thoiGianThucHien: initialValues.thoiGianThucHien || 60,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Service Name"
        rules={[{ required: true, message: 'Please enter service name' }]}
      >
        <Input placeholder="Service name" />
      </Form.Item>
      
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please enter service price' }]}
      >
        <InputNumber 
          min={0} 
          precision={2} 
          style={{ width: '100%' }} 
          placeholder="Service price"
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>
      
      <Form.Item
        name="thoiGianThucHien"
        label="Duration (minutes)"
        rules={[{ required: true, message: 'Please enter service duration' }]}
        initialValue={60}
      >
        <InputNumber 
          min={5} 
          step={5} 
          style={{ width: '100%' }} 
          placeholder="Service duration in minutes"
        />
      </Form.Item>
      
      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={4} placeholder="Service description" />
      </Form.Item>
    </Form>
  );
};

export default ServiceForm;