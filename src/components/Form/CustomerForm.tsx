import React from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import DichVu from '@/models/ServiceManagement/DichVu';

const { Option } = Select;

interface CustomerFormProps {
  initialValues?: DichVu.User;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  initialValues, 
  onFinish, 
  onCancel 
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        age: initialValues.age,
        gender: initialValues.gender || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item 
        name="name" 
        label="Tên" 
        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
      > 
        <Input />
      </Form.Item>
      <Form.Item 
        name="age" 
        label="Tuổi" 
        rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
      > 
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item 
        name="gender" 
        label="Giới tính" 
        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
      > 
        <Select>
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          {initialValues ? 'Cập nhật' : 'Thêm'}
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>
            Hủy
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default CustomerForm;