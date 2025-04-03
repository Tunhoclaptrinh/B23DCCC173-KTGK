import React from 'react';
import { Form, Input, Checkbox, Button, InputNumber } from 'antd';

interface TaskFormProps {
	initialValues: {
		Subject?: string;
		Date?: string;
		Timeline?: number;
		Grade?: string;
		Goal: string;
		Description: string;
		Status?: boolean;
		DueDate?: string;
	};
	isEdit: boolean;
	onFinish: (values: any) => void;
	onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialValues, isEdit, onFinish, onCancel }) => {
	return (
		<Form onFinish={onFinish} initialValues={initialValues}>
			<Form.Item name='Subject' label='Subject' rules={[{ required: true, message: 'Please enter a task!' }]}>
				<Input placeholder='Task description' />
			</Form.Item>
			<Form.Item name='Grade' label='Grade' rules={[{ required: true, message: 'Please enter a task!' }]}>
				<Input placeholder='Điểm cao hay thấp?' />
			</Form.Item>
			<Form.Item name='Goal' label='Goal' rules={[{ required: true, message: 'Please enter a task!' }]}>
				<Input placeholder='Mục tiêu thế nào?' />
			</Form.Item>
			<Form.Item name='Timeline' label='Timeline' rules={[{ required: true, message: 'Please enter a due date!' }]}>
				<InputNumber />
			</Form.Item>
			<Form.Item name='Date' label='Date' rules={[{ required: true, message: 'Please enter a due date!' }]}>
				<Input type='date' />
			</Form.Item>
			<Form.Item name='Taknote' label='Takenote' rules={[{ message: 'Please enter a due date!' }]}>
				<Input type='' />
			</Form.Item>
			<Form.Item name='Status' valuePropName='checked'>
				<Checkbox>Completed</Checkbox>
			</Form.Item>
			<Form.Item name='DueDate' label='DueDate' rules={[{ required: true, message: 'Please enter a due date!' }]}>
				<Input type='date' />
			</Form.Item>
			<Button htmlType='submit' type='primary'>
				{isEdit ? 'Save' : 'Add'}
			</Button>
			<Button onClick={onCancel} style={{ marginLeft: 10 }}>
				Cancel
			</Button>
		</Form>
	);
};

export default TaskForm;
