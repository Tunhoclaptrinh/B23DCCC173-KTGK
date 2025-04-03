import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { ScissorOutlined, FileOutlined, BorderOutlined } from '@ant-design/icons';
import GameResultModal from '@/components/rockpaperscissors/GameResultModal';
import HistoryTable from '@/components/rockpaperscissors/HistoryTable';

const RockPaperScissors = () => {
    const { gameHistory, getGameHistory, playGame, clearHistory, choices } = useModel('rockpaperscissors');
    const [visible, setVisible] = useState<boolean>(false);
    const [gameResult, setGameResult] = useState<any>(null);

    useEffect(() => {
        getGameHistory();
    }, []);

    const handlePlayerChoice = (choice: string) => {
        const result = playGame(choice);
        setGameResult(result);
        setVisible(true);
    };

    // Map choices to their respective icons
    const choiceIcons = {
        'Rock': <BorderOutlined />,       // Using BorderOutlined for Rock
        'Paper': <FileOutlined />,        // Using FileOutlined for Paper
        'Scissors': <ScissorOutlined />   // Using ScissorOutlined for Scissors
    };

    const columns = [
        {
            title: 'Player Choice',
            dataIndex: 'playerChoice', 
            key: 'playerChoice',
            width: 150,
            render: (choice: string) => (
                <span>
                    {choiceIcons[choice as keyof typeof choiceIcons]} {choice}
                </span>
            )
        },
        {
            title: 'Computer Choice',
            dataIndex: 'computerChoice',
            key: 'computerChoice',
            width: 150,
            render: (choice: string) => (
                <span>
                    {choiceIcons[choice as keyof typeof choiceIcons]} {choice}
                </span>
            )
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            width: 100,
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
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <h1>Rock Paper Scissors Game</h1>
            <div style={{ marginBottom: 20 }}>
                {choices.map((choice) => (
                    <Button 
                        key={choice} 
                        type="primary" 
                        style={{ margin: '0 10px', height: 'auto', padding: '10px 15px' }}
                        onClick={() => handlePlayerChoice(choice)}
                        icon={choiceIcons[choice as keyof typeof choiceIcons]}
                        size="large"
                    >
                        {choice}
                    </Button>
                ))}
            </div>

            <GameResultModal 
                visible={visible} 
                setVisible={setVisible} 
                gameResult={gameResult} 
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h2>Game History</h2>
                <Popconfirm
                    title="Are you sure you want to clear all game history?"
                    onConfirm={clearHistory}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger disabled={gameHistory.length === 0}>
                        Clear History
                    </Button>
                </Popconfirm>
            </div>
            
            {/* <Table 
                style={{justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 , marginTop: 10}}
                dataSource={gameHistory} 
                columns={columns} 
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'No game history yet' }}
            /> */}
            <HistoryTable gameHistory={gameHistory} columns={columns}/> 
        </div>
    );
};

export default RockPaperScissors;