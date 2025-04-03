import React from 'react';
import { Modal, Form, DatePicker, Button } from 'antd';

const DiplomaFormModal = ({ 
  isModalVisible, 
  editingBook, 
  form, 
  handleSaveBook, 
  setIsModalVisible, 
  setEditingBook 
}) => (
  <Modal
    title={editingBook ? "Edit Diploma Book" : "Add New Diploma Book"}
    visible={isModalVisible}
    footer={null}
    onCancel={() => {
      setIsModalVisible(false);
      setEditingBook(null);
    }}
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSaveBook}
    >
      <Form.Item
        name="year"
        label="Year"
        rules={[{ required: true, message: 'Please select the year' }]}
      >
        <DatePicker 
          picker="year" 
          style={{ width: '100%' }} 
          placeholder="Select Year"
        />
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: 'Please select start date' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          placeholder="Select Start Date"
        />
      </Form.Item>

      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: 'Please select end date' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          placeholder="Select End Date"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editingBook ? 'Update' : 'Add'} Diploma Book
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default DiplomaFormModal;