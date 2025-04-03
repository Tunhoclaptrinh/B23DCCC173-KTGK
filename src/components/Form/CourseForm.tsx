import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';

interface CourseFormProps {
    onSubmit: (values: any) => void;
    initialValues?: any;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    // Set form values when initialValues changes
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item 
                name="name" 
                label="Course Name" 
                rules={[{ required: true, message: 'Please input course name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item 
                name="credits" 
                label="Credits" 
                rules={[{ required: true, message: 'Please input credits' }]}
            >
                <Input type="number" />
            </Form.Item>

            <Form.Item 
                name="knowledgeAreas" 
                label="Knowledge Areas (comma-separated)" 
                rules={[{ required: true, message: 'Please input knowledge areas' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {initialValues ? 'Update Course' : 'Add Course'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CourseForm;