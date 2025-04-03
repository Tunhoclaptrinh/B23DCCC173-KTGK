import React from 'react';
import { Modal } from 'antd';
import { ScissorOutlined, FileOutlined, BorderOutlined } from '@ant-design/icons';

interface GameResultModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    gameResult: {
        playerChoice: string;
        computerChoice: string;
        result: string;
    } | null;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ 
    visible, 
    setVisible, 
    gameResult 
}) => {
    // Map choices to their respective icons
    const choiceIcons = {
        'Rock': <BorderOutlined style={{ fontSize: '24px', marginRight: '8px' }} />,
        'Paper': <FileOutlined style={{ fontSize: '24px', marginRight: '8px' }} />,
        'Scissors': <ScissorOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
    };

    return ( 
        <Modal
            title="Game Result"
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
        >
            {gameResult && (
                <>
                    <p style={{ fontSize: '16px' }}>
                        
                        Your Choice: {gameResult.playerChoice} 
                        {choiceIcons[gameResult.playerChoice as keyof typeof choiceIcons]}
                    </p>
                    <p style={{ fontSize: '16px' }}>
                        
                        Computer Choice: {gameResult.computerChoice} 
                        {choiceIcons[gameResult.computerChoice as keyof typeof choiceIcons]}
                    </p>
                    <p style={{ 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        color: gameResult.result === 'Win' ? 'green' : 
                               gameResult.result === 'Lose' ? 'red' : 'gray' 
                    }}>
                        Result: {gameResult.result}
                    </p>
                </>
            )}
        </Modal>
    ); 
};

export default GameResultModal;