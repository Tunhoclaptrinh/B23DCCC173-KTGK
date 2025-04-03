import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Table, Input, Space, Row, Col } from 'antd';
import { useModel } from 'umi';

const QuestionSearch: React.FC = () => {
    const { courses, questions } = useModel('questionbank'); 
    const [form] = Form.useForm();
    const [filteredQuestions, setFilteredQuestions] = useState(questions);

    useEffect(() => {
        setFilteredQuestions(questions);
    }, [questions]);

    const handleSearch = (values: any) => {
        const { courseId, difficultyLevel, knowledgeArea, searchContent } = values;

        const results = questions.filter(question => 
            (!courseId || question.courseId === courseId) &&
            (!difficultyLevel || question.difficultyLevel === difficultyLevel) &&
            (!knowledgeArea?.length || knowledgeArea.includes(question.knowledgeArea)) &&
            (!searchContent || question.content.toLowerCase().includes(searchContent.toLowerCase()))
        );

        setFilteredQuestions(results);
    };

    const handleReset = () => {
        form.resetFields(); 
        setFilteredQuestions(questions); 
    };

    const columns = [
        {
            title: 'Course',
            dataIndex: 'courseId',
            key: 'courseId',
            render: (courseId: string) => 
                courses.find(c => c.id === courseId)?.name || courseId
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficultyLevel',
            key: 'difficultyLevel',
        },
        {
            title: 'Knowledge Area',
            dataIndex: 'knowledgeArea',
            key: 'knowledgeArea',
        }
    ];

    return (
        <div>
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSearch}
                onValuesChange={() => handleSearch(form.getFieldsValue())} 
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="searchContent" label="Search by Content">
                            <Input placeholder="Enter keyword..." allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="courseId" label="Course">
                            <Select placeholder="Select a course" allowClear>
                                {courses.map(course => (
                                    <Select.Option key={course.id} value={course.id}>
                                        {course.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="difficultyLevel" label="Difficulty Level">
                            <Select placeholder="Select difficulty level" allowClear>
                                <Select.Option value="Easy">Easy</Select.Option>
                                <Select.Option value="Medium">Medium</Select.Option>
                                <Select.Option value="Hard">Hard</Select.Option>
                                <Select.Option value="Very Hard">Very Hard</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="knowledgeArea" label="Knowledge Area">
                            <Select 
                                placeholder="Select knowledge area" 
                                allowClear
                                mode="multiple"
                            >
                                {Array.from(new Set(questions.map(q => q.knowledgeArea))).map(area => (
                                    <Select.Option key={area} value={area}>
                                        {area}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                            <Button onClick={handleReset}>
                                Reset
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>

            <Table 
                columns={columns} 
                dataSource={filteredQuestions} 
                rowKey="id"
                locale={{ emptyText: 'No questions found' }}
            />
        </div>
    );
};

export default QuestionSearch;
