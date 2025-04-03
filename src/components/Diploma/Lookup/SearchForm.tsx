import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';

const SearchForm: React.FC<{
  form: any;
  onSearch: () => void;
}> = ({ form, onSearch }) => (
  <Form form={form} layout="vertical">
    <Form.Item name="diplomaSerialNumber" label="Diploma Serial Number">
      <Input placeholder="Enter diploma serial number" />
    </Form.Item>
    
    <Form.Item name="bookEntryNumber" label="Book Entry Number">
      <Input type="number" placeholder="Enter book entry number" />
    </Form.Item>
    
    <Form.Item name="studentId" label="Student ID">
      <Input placeholder="Enter student ID" />
    </Form.Item>
    
    <Form.Item name="fullName" label="Full Name">
      <Input placeholder="Enter full name" />
    </Form.Item>
    
    <Form.Item name="dateOfBirth" label="Date of Birth">
      <DatePicker style={{ width: '100%' }} />
    </Form.Item>
    
    <Button type="primary" onClick={onSearch}>
      Search Diplomas
    </Button>
  </Form>
);

export default SearchForm;