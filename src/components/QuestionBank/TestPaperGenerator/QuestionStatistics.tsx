import React from 'react';
import { Typography, Tag, Divider } from 'antd';

const { Text } = Typography;

const QuestionStatistics = ({ availableQuestions, difficultyStats, knowledgeAreaStats }) => {
    const getColorForDifficulty = (difficulty) => {
        switch(difficulty) {
            case 'Easy': return 'green';
            case 'Medium': return 'blue';
            case 'Hard': return 'orange';
            case 'Very Hard': return 'red';
            default: return 'default';
        }
    };

    return (
        <div style={{ marginBottom: 16, border: '1px solid #f0f0f0', padding: 16, borderRadius: 4 }}>
            <Text strong>Available Questions:</Text> {availableQuestions.length}
            <div style={{ display: 'flex', gap: '16px', marginTop: 8, flexWrap: 'wrap' }}>
                {Object.entries(difficultyStats).map(([difficulty, count]) => (
                    count > 0 && (
                        <div key={difficulty}>
                            <Tag color={getColorForDifficulty(difficulty)}>{difficulty}: {count}</Tag>
                        </div>
                    )
                ))}
            </div>
            
            <Divider style={{ margin: '12px 0' }}/>
            
            <Text strong>Knowledge Areas:</Text>
            <div style={{ display: 'flex', gap: '16px', marginTop: 8, flexWrap: 'wrap' }}>
                {Object.entries(knowledgeAreaStats).map(([area, count]) => (
                    <div key={area}>
                        <Tag>{area}: {count}</Tag>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionStatistics;