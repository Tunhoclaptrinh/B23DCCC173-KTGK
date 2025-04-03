import { useState } from 'react';

export default () => {
    const [gameHistory, setGameHistory] = useState<any[]>([]);

    const choices = ['Rock', 'Paper', 'Scissors'];

    // Kiểm tra ai thắng ai thua
    const determineWinner = (player: string, computer: string): string => {
        if (player === computer) {
            return 'Draw';
        } else {
            if (player === 'Rock' && computer === 'Scissors') {
                return 'Win';
            } else if (player === 'Paper' && computer === 'Rock') {
                return 'Win';
            } else if (player === 'Scissors' && computer === 'Paper') {
                return 'Win';
            } else {
                return 'Lose';
            }
        }
    };

    // Lấy lịch sử game
    const getGameHistory = () => {
        let historyFromStorage = localStorage.getItem('gameHistory');
        if (historyFromStorage !== null) {
            let parsedHistory = JSON.parse(historyFromStorage);
            setGameHistory(parsedHistory);
            return parsedHistory;
        } else {
            return [];
        }
    };

    // Chơi một ván
    const playGame = (playerChoice: string) => {
        let randomIndex = Math.floor(Math.random() * choices.length);
        let computerChoice = choices[randomIndex];

        let result = determineWinner(playerChoice, computerChoice);

        let newGame = {
            playerChoice: playerChoice,
            computerChoice: computerChoice,
            result: result,
            timestamp: new Date().toLocaleString()
        };

        let newHistory = [newGame, ...gameHistory];

        if (newHistory.length > 10) {
            newHistory = newHistory.slice(0, 10);
        }

        localStorage.setItem('gameHistory', JSON.stringify(newHistory));
        setGameHistory(newHistory);

        return newGame;
    };

    // Xóa hết lịch sử
    const clearHistory = () => {
        localStorage.removeItem('gameHistory');
        setGameHistory([]);
    };

    return {
        gameHistory: gameHistory,
        getGameHistory: getGameHistory,
        playGame: playGame,
        clearHistory: clearHistory,
        choices: choices
    };
};
