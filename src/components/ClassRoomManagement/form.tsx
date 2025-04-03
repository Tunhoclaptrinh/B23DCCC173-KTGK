import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

interface ClassroomFormProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isEdit: boolean;
  classroom?: Classroom.Record;
  classrooms: Classroom.Record[];
  staffList: string[];
  onSubmit: (values: Classroom.Record, originalRoomCode?: string) => void;
}

const ClassroomForm: React.FC<ClassroomFormProps> = ({ 
  visible, 
  setVisible, 
  isEdit, 
  classroom, 
  classrooms, 
  staffList,
  onSubmit 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && isEdit && classroom) {
      form.setFieldsValue(classroom);
    } else if (visible && !isEdit) {
      form.resetFields();
    }
  }, [visible, isEdit, classroom, form]);

  const handleSubmit = (values: Classroom.Record) => {
    onSubmit(values, isEdit ? classroom?.roomCode : undefined);
  };

  return (
    <Modal
      destroyOnClose
      footer={false}
      title={isEdit ? 'Edit Classroom' : 'Add Classroom'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Room Code"
          name="roomCode"
          rules={[
            { required: true, message: 'Please input Room Code!' },
            { max: 10, message: 'Room Code cannot exceed 10 characters!' }
          ]}
        >
          <Input disabled={isEdit} />
        </Form.Item>
        
        <Form.Item
          label="Room Name"
          name="roomName"
          rules={[
            { required: true, message: 'Please input Room Name!' },
            { max: 50, message: 'Room Name cannot exceed 50 characters!' }
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Seating Capacity"
          name="seatingCapacity"
          rules={[
            { required: true, message: 'Please input Seating Capacity!' },
            { type: 'number', min: 10, message: 'Minimum capacity is 10!' },
            { type: 'number', max: 200, message: 'Maximum capacity is 200!' }
          ]}
        >
          <InputNumber min={10} max={200} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          label="Room Type"
          name="roomType"
          rules={[{ required: true, message: 'Please select Room Type!' }]}
        >
          <Select>
            <Select.Option value="Lecture">Lecture</Select.Option>
            <Select.Option value="Lab">Lab</Select.Option>
            <Select.Option value="Auditorium">Auditorium</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Assigned Staff"
          name="assignedStaff"
          rules={[{ required: true, message: 'Please select Assigned Staff!' }]}
        >
          <Select>
            {staffList.map(staff => (
              <Select.Option key={staff} value={staff}>{staff}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ClassroomForm;