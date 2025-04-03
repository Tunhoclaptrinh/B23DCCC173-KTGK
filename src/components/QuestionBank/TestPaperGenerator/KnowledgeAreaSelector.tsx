import React from 'react';
import { Form, Select, InputNumber } from 'antd';
import { Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const KnowledgeAreaSelector = ({ form, knowledgeAreaStats }) => {
    const renderKnowledgeAreaInputs = () => {
        const knowledgeAreas = form.getFieldValue('knowledgeAreas') || [];
        if (knowledgeAreas.length === 0) return null;

        return (
            <div style={{ marginBottom: 16 }}>
                <Text strong>Questions per Knowledge Area:</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 8 }}>
                    {knowledgeAreas.map(area => (
                        <Form.Item 
                            key={area} 
                            name={`${area}_count`} 
                            label={area}
                            rules={[{ type: 'number', min: 0, message: 'Must be 0 or greater' }]}
                        >
                            <InputNumber min={0} placeholder="Count" />
                        </Form.Item>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Form.Item name="knowledgeAreas" label="Knowledge Areas (Optional)">
                <Select 
                    mode="multiple" 
                    placeholder="Select knowledge areas to filter questions"
                    style={{ width: '100%' }}
                >
                    {Object.keys(knowledgeAreaStats).map(area => (
                        <Option key={area} value={area}>
                            {area} ({knowledgeAreaStats[area]} questions)
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            {renderKnowledgeAreaInputs()}
        </>
    );
};

export default KnowledgeAreaSelector;