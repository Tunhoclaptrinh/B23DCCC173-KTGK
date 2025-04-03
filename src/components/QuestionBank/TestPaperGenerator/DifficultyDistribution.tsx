import React from 'react';
import { Form, InputNumber } from 'antd';

const DifficultyDistribution = ({ form }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
            <Form.Item label="Easy Questions" name="easyQuestions">
                <InputNumber placeholder="Count" min={0} />
            </Form.Item>
            <Form.Item label="Medium Questions" name="mediumQuestions">
                <InputNumber placeholder="Count" min={0} />
            </Form.Item>
            <Form.Item label="Hard Questions" name="hardQuestions">
                <InputNumber placeholder="Count" min={0} />
            </Form.Item>
            <Form.Item label="Very Hard Questions" name="veryHardQuestions">
                <InputNumber placeholder="Count" min={0} />
            </Form.Item>
        </div>
    );
};

export default DifficultyDistribution;