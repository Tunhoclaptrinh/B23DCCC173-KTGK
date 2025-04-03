import React from 'react';
import { Table, Button, Space, Typography, Alert, Modal, Tag } from 'antd';

const { Title } = Typography;

const TestPaperHistory = ({ testPapers, onView, onDelete }) => {
    const handleDelete = (testPaperId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this test paper?',
            onOk: () => onDelete(testPaperId),
        });
    };

    return (
        <>
            <Title level={4}>Test Paper History</Title>
            {testPapers.length === 0 ? (
                <Alert message="No test papers generated yet" type="info" />
            ) : (
                <Table
                    columns={[
                        { title: 'Course', dataIndex: 'courseName', key: 'courseName' },
                        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
                        { 
                            title: 'Questions', 
                            dataIndex: 'questions', 
                            key: 'questions', 
                            render: questions => <Tag color="blue">{questions.length} questions</Tag> 
                        },
                        {
                            title: 'Actions',
                            key: 'actions',
                            render: (_, record) => (
                                <Space>
                                    <Button onClick={() => onView(record)}>View</Button>
                                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                                </Space>
                            )
                        }
                    ]}
                    dataSource={testPapers}
                    rowKey="id"
                    pagination={testPapers.length > 10}
                />
            )}
        </>
    );
};

export default TestPaperHistory;