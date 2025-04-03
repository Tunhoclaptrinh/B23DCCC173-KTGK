// Lấy màu cho từng cấp độ khó
import React from 'react';
import { Tag } from 'antd';

export const getColorForDifficulty = (difficulty) => {
    switch(difficulty) {
        case 'Easy': return 'green';
        case 'Medium': return 'blue';
        case 'Hard': return 'orange';
        case 'Very Hard': return 'red';
        default: return 'default';
    }
};

export const questionColumns = [
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