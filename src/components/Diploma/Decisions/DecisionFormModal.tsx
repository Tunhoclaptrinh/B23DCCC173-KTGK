import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';

const { Option } = Select;

const DecisionFormModal: React.FC<{
  visible: boolean;
  form: any;
  diplomaBooks: any[];
  onSave: (values: any) => void;
  onCancel: () => void;
}> = ({ visible, form, diplomaBooks, onSave, onCancel }) => (
  <Modal
    title="Add New Graduation Decision"
    visible={visible}
    footer={null}
    onCancel={onCancel}
  >
    <Form form={form} layout="vertical" onFinish={onSave}>
      <Form.Item
        name="decisionNumber"
        label="Decision Number"
        rules={[{ required: true, message: 'Please input decision number' }]}
      >
        <Input placeholder="Enter decision number" />
      </Form.Item>

      <Form.Item
        name="issuanceDate"
        label="Issuance Date"
        rules={[{ required: true, message: 'Please select issuance date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="diplomaBookId"
        label="Diploma Book"
        rules={[{ required: true, message: 'Please select diploma book' }]}
      >
        <Select placeholder="Select Diploma Book">
          {diplomaBooks.map(book => (
            <Option key={book.id} value={book.id}>
              {book.year} Book
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="summary" label="Summary">
        <Input.TextArea rows={4} placeholder="Enter decision summary" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Graduation Decision
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default DecisionFormModal;