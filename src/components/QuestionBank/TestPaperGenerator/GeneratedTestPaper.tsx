import React from 'react';
import { Table, Divider, Typography, Empty, Tag } from 'antd';

const { Title } = Typography;

const GeneratedTestPaper = ({ testPaper }) => {
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
        }
    ];

    return (
        <div style={{ marginTop: 24 }}>
            <Divider />
            <Title level={4}>Generated Test Paper</Title>
            <div style={{ marginBottom: 16 }}>
                <p><strong>Course:</strong> {testPaper.courseName}</p>
                <p><strong>Created At:</strong> {testPaper.createdAt}</p>
                <p><strong>Total Questions:</strong> {testPaper.questions.length}</p>
            </div>
            
            {testPaper.questions.length > 0 ? (
                <Table 
                    columns={questionColumns} 
                    dataSource={testPaper.questions} 
                    rowKey="id"
                    pagination={testPaper.questions.length > 10}
                />
            ) : (
                <Empty description="No questions were generated based on your criteria." />
            )}
        </div>
    );
};

export default GeneratedTestPaper;