import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const CourseSelector = ({ courses, onChange }) => {
    return (
        <Form.Item 
            name="courseId" 
            label="Course" 
            rules={[{ required: true, message: 'Please select a course' }]}
        > 
            <Select 
                placeholder="Select a course"
                onChange={onChange}
            >
                {courses.map(course => (
                    <Option key={course.id} value={course.id}>{course.name}</Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default CourseSelector;