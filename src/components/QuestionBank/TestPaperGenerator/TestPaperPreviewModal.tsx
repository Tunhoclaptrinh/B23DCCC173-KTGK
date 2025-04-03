import React from 'react';
import { Modal, Button, Table, Typography, Empty, Tag, Popconfirm } from 'antd';

const { Text, Paragraph } = Typography;

const TestPaperPreviewModal = ({ visible, testPaper, onClose, onEditQuestion, onRemoveQuestion }) => {
    const getColorForDifficulty = (difficulty) => {
        switch(difficulty) {
            case 'Easy': return 'green';
            case 'Medium': return 'blue';
            case 'Hard': return 'orange';
            case 'Very Hard': return 'red';
            default: return 'default';
        }
    };

    const questionColumns = [
        { 
            title: 'Question', 
            dataIndex: 'content', 
            key: 'content',
            render: text => <div style={{ maxWidth: 500, wordWrap: 'break-word' }}>{text}</div>
        },
        { 
            title: 'Difficulty', 
            dataIndex: 'difficultyLevel', 
            key: 'difficultyLevel', 
            width: 120,
            render: difficulty => (
                <Tag color={getColorForDifficulty(difficulty)}>{difficulty}</Tag>
            )
        },
        { 
            title: 'Knowledge Area', 
            dataIndex: 'knowledgeArea', 
            key: 'knowledgeArea', 
            width: 180 
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 160,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => onEditQuestion(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={() => onRemoveQuestion(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Remove</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <Modal
            title={testPaper ? `Test Paper: ${testPaper.courseName}` : 'Test Paper Details'}
            visible={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
            destroyOnClose={true}
        >
            {testPaper && (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <Paragraph>
                            <Text strong>Course:</Text> {testPaper.courseName}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Created:</Text> {testPaper.createdAt}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Total Questions:</Text> {testPaper.questions.length}
                        </Paragraph>
                        
                        <div style={{ marginTop: 8 }}>
                            <Text strong>Question Distribution:</Text>
                            <div style={{ display: 'flex', gap: '8px', marginTop: 4, flexWrap: 'wrap' }}>
                                {['Easy', 'Medium', 'Hard', 'Very Hard'].map(difficulty => {
                                    const count = testPaper.questions.filter(q => 
                                        q.difficultyLevel === difficulty
                                    ).length;
                                    return count > 0 ? (
                                        <Tag key={difficulty} color={getColorForDifficulty(difficulty)}>
                                            {difficulty}: {count}
                                        </Tag>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {testPaper.questions && testPaper.questions.length > 0 ? (
                        <Table 
                            columns={questionColumns}
                            dataSource={testPaper.questions} 
                            rowKey="id"
                            size="small"
                            pagination={testPaper.questions.length > 10 ? 
                                { pageSize: 10, position: 'bottom' } : false}
                        />
                    ) : (
                        <Empty description="This test paper does not contain any questions." />
                    )}
                </div>
            )}
        </Modal>
    );
};

export default TestPaperPreviewModal;
