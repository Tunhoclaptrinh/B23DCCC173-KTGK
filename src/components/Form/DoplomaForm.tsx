import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Modal, Select, InputNumber } from 'antd';
import { DiplomaInfo, DiplomaField } from './diploma-model';

interface DiplomaFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (diplomaInfo: DiplomaInfo) => void;
  initialData?: DiplomaInfo;
  additionalFields: DiplomaField[];
}

const DiplomaForm: React.FC<DiplomaFormProps> = ({
  visible, 
  onCancel, 
  onSubmit, 
  initialData,
  additionalFields
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        date_of_birth: initialData.date_of_birth ? new Date(initialData.date_of_birth) : undefined
      });
    } else {
      form.resetFields();
    }
  }, [initialData, visible]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const diplomaInfo: DiplomaInfo = {
        ...values,
        graduation_decision_id: values.graduation_decision_id,
        diploma_book_id: initialData?.diploma_book_id || 0, // Will be set by model
        entry_number: initialData?.entry_number || 0, // Will be auto-incremented
        additional_fields: additionalFields.map(field => ({
          field_name: field.field_name,
          data_type: field.data_type,
          value_string: values[`field_${field.field_name}_string`],
          value_number: values[`field_${field.field_name}_number`],
          value_date: values[`field_${field.field_name}_date`]
        }))
      };

      onSubmit(diplomaInfo);
      onCancel();
    });
  };

  const renderAdditionalField = (field: DiplomaField) => {
    const fieldKey = `field_${field.field_name}`;
    
    switch(field.data_type) {
      case 'String':
        return (
          <Form.Item 
            key={fieldKey} 
            name={`${fieldKey}_string`} 
            label={field.field_name}
          >
            <Input />
          </Form.Item>
        );
      case 'Number':
        return (
          <Form.Item 
            key={fieldKey} 
            name={`${fieldKey}_number`} 
            label={field.field_name}
          >
            <InputNumber />
          </Form.Item>
        );
      case 'Date':
        return (
          <Form.Item 
            key={fieldKey} 
            name={`${fieldKey}_date`} 
            label={field.field_name}
          >
            <DatePicker />
          </Form.Item>
        );
    }
  };

  return (
    <Modal
      title={initialData ? 'Edit Diploma Information' : 'Add Diploma Information'}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="student_id" 
          label="Student ID" 
          rules={[{ required: true, message: 'Please input student ID' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="full_name" 
          label="Full Name" 
          rules={[{ required: true, message: 'Please input full name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="date_of_birth" 
          label="Date of Birth" 
          rules={[{ required: true, message: 'Please select date of birth' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item 
          name="diploma_serial" 
          label="Diploma Serial Number" 
          rules={[{ required: true, message: 'Please input diploma serial number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="graduation_decision_id" 
          label="Graduation Decision" 
          rules={[{ required: true, message: 'Please select graduation decision' }]}
        >
          <Select placeholder="Select Graduation Decision">
            {/* Populate with actual graduation decisions */}
          </Select>
        </Form.Item>

        {additionalFields.map(renderAdditionalField)}
      </Form>
    </Modal>
  );
};

export default DiplomaForm;