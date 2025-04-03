import React from 'react';
import { Form, Input, Checkbox, Button } from 'antd';

interface TaskFormProps {
    initialValues: {
        TaskName?: string;
        DueDate?: string;
        Status?: boolean;
    };
    isEdit: boolean;
    onFinish: (values: any) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialValues, isEdit, onFinish, onCancel }) => {
    return (
        <Form onFinish={onFinish} initialValues={initialValues}>
            <Form.Item
                name="TaskName"
                label="Task Name"
                rules={[{ required: true, message: 'Please enter a task!' }]}
            >
                <Input placeholder="Task description" />
            </Form.Item>
            <Form.Item
                name="DueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please enter a due date!' }]}
            >
                <Input type="date" />
            </Form.Item>
            <Form.Item
                name="Status"
                valuePropName="checked"
            >
                <Checkbox>Completed</Checkbox>
            </Form.Item>
            <Button htmlType="submit" type="primary">
                {isEdit ? 'Save' : 'Add'}
            </Button>
            <Button onClick={onCancel} style={{ marginLeft: 10 }}>
                Cancel
            </Button>
        </Form>
    );
};

export default TaskForm;
