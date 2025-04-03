import React from 'react';
import { Table } from 'antd';
import { ScissorOutlined, FileOutlined, BorderOutlined } from '@ant-design/icons';

// Icon Mapping
const choiceIcons: Record<string, JSX.Element> = {
    Rock: <BorderOutlined />,
    Paper: <FileOutlined />,
    Scissors: <ScissorOutlined />
};

// Columns Configuration
const columns = [
    {
        title: 'Player Choice',
        dataIndex: 'playerChoice',
        key: 'playerChoice',
        width: 150,
        align: 'center',
        render: (choice: string) => (
            <span>
                {choiceIcons[choice] || null} {choice}
            </span>
        )
    },
    {
        title: 'Computer Choice',
        dataIndex: 'computerChoice',
        key: 'computerChoice',
        width: 150,
        align: 'center',
        render: (choice: string) => (
            <span>
                {choiceIcons[choice] || null} {choice}
            </span>
        )
    },
    {
        title: 'Result',
        dataIndex: 'result',
        key: 'result',
        width: 100,
        align: 'center',
        render: (result: string) => (
            <span style={{ 
                color: result === 'Win' ? 'green' : 
                       result === 'Lose' ? 'red' : 'gray' 
            }}>
                {result}
            </span>
        )
    },
    {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: 200,
        align: 'center'
    } 
];

interface GameTableProps {
    gameHistory: Array<{ playerChoice: string; computerChoice: string; result: string; timestamp: string }>;
}

const GameTable: React.FC<GameTableProps> = ({ gameHistory }) => {
    return (
        <Table 
            style={{
                marginBottom: 10,
                marginTop: 10
            }}
            dataSource={gameHistory}
            columns={columns}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No game history yet' }}
            rowKey="timestamp" // Định danh duy nhất cho mỗi dòng
        />
    );
};

export default GameTable;
