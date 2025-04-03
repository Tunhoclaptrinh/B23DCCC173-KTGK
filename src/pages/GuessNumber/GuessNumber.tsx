import { useState } from 'react';
import { Button, Input, Table, message, Card } from 'antd';

const GuessNumberGame = () => {
	// Trạng thái lưu số ngẫu nhiên cần đoán
	const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
	// Trạng thái lưu giá trị số mà người chơi nhập vào
	const [guess, setGuess] = useState('');
	// Trạng thái lưu danh sách các lần đoán
	const [attempts, setAttempts] = useState<{ key: number; number: number; result: string }[]>([]);
	// Trạng thái xác định xem trò chơi đã kết thúc chưa
	const [gameOver, setGameOver] = useState(false);
	// Trạng thái hiển thị hoặc ẩn luật chơi
	const [showRules, setShowRules] = useState(true);

	// Xử lý khi người chơi nhấn nút đoán số
	const handleGuess = () => {
		if (gameOver || attempts.length >= 10) return;

		const numGuess = parseInt(guess, 10);
		if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
			message.error('Vui lòng nhập một số từ 1 đến 100!');
			return;
		}

		let result;
		if (numGuess === targetNumber) {
			result = '🎉 Chính xác! Bạn đã thắng!';
			setGameOver(true);
		} else if (numGuess < targetNumber) {
			result = '🔼 Bạn đoán quá thấp!';
		} else {
			result = '🔽 Bạn đoán quá cao!';
		}

		const newAttempts = [...attempts, { key: attempts.length + 1, number: numGuess, result }];
		setAttempts(newAttempts);
		setGuess('');

		// Kiểm tra nếu hết lượt mà chưa đoán đúng
		if (newAttempts.length >= 10 && numGuess !== targetNumber) {
			message.error(`Bạn đã hết lượt! Số đúng là ${targetNumber}`);
			setGameOver(true);
		}
	};

	// Xử lý khi người chơi nhấn nút chơi lại
	const handleRestart = () => {
		setTargetNumber(Math.floor(Math.random() * 100) + 1);
		setGuess('');
		setAttempts([]);
		setGameOver(false);
	};

	// Cấu hình cột cho bảng lịch sử đoán số
	const columns = [
		{ title: 'Lần đoán', dataIndex: 'key', key: 'key' },
		{ title: 'Số bạn đoán', dataIndex: 'number', key: 'number' },
		{ title: 'Kết quả', dataIndex: 'result', key: 'result' },
	];

	// Dữ liệu luật chơi
	const rulesColumns = [
		{
			title:
				'Bài 1: Xây dựng một trò chơi đơn giản mà trong đó người chơi phải đoán một số ngẫu nhiên do hệ thống sinh ra. Yêu cầu :',
			dataIndex: 'rule',
			key: 'rule',
		},
	];

	const rulesData = [
		{ key: 1, rule: '- Hệ thống sẽ sinh ra một số ngẫu nhiên trong khoảng từ 1 đến 100.' },
		{
			key: 2,
			rule: '- Người chơi sẽ nhập các dự đoán của mình và hệ thống sẽ phản hồi xem dự đoán đó cao hơn, thấp hơn, hay đúng số. Cụ thể + Khi bắt đầu chơi, hệ thống sẽ tự động sinh ra một số ngẫu nhiên giữa 1 và 100.',
		},
		{
			key: 3,
			rule: '- Người chơi có 10 lượt dự đoán mỗi lượt chơi, trong từng lượt, người chơi sẽ nhập số mà họ dự đoán.',
		},
		{
			key: 4,
			rule: '- Sau mỗi lần đoán, hệ thống sẽ thông báo: “Bạn đoán quá thấp!” nếu số dự đoán nhỏ hơn số ngẫu nhiên. “Bạn đoán quá cao!” nếu số dự đoán lớn hơn số ngẫu nhiên. “Chúc mừng! Bạn đã đoán đúng!” nếu người chơi đoán đúng.',
		},
		{
			key: 5,
			rule: '- Nếu người chơi không đoán đúng trong 10 lần, hệ thống sẽ thông báo “Bạn đã hết lượt! Số đúng là [số ngẫu nhiên]',
		},
	];

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
				height: '90vh',
				padding: 20,
				backgroundColor: '#f0f2f5',
			}}
		>
			{/* Khu vực trò chơi đoán số */}
			<Card
				style={{
					flex: 1,
					margin: 10,
					textAlign: 'center',
					padding: 20,
					borderRadius: 10,
					boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
				}}
			>
				<h2>Trò chơi đoán số 🎲</h2>
				<p>Hãy đoán một số từ 1 đến 100</p>
				<Input
					type='number'
					value={guess}
					onChange={(e) => setGuess(e.target.value)}
					placeholder='Nhập số...'
					disabled={gameOver}
				/>
				<Button type='primary' onClick={handleGuess} style={{ marginTop: 10, width: '100%' }} disabled={gameOver}>
					Đoán
				</Button>
				{gameOver && (
					<Button type='default' onClick={handleRestart} style={{ marginTop: 10, width: '100%' }}>
						Chơi lại
					</Button>
				)}
				<Table columns={columns} dataSource={attempts} pagination={false} style={{ marginTop: 20 }} />
			</Card>
			{/* Khu vực luật chơi */}
			{showRules ? (
				<Card style={{ flex: 1, maxWidth: 600, padding: 20, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
					<h2>📜 Luật Chơi</h2>
					<Table columns={rulesColumns} dataSource={rulesData} pagination={false} />
					<Button type='default' onClick={() => setShowRules(false)} style={{ marginTop: 10, width: '100%' }}>
						Đã hiểu
					</Button>
				</Card>
			) : (
				<Button type='default' onClick={() => setShowRules(true)} style={{ marginTop: 10 }}>
					Xem Luật
				</Button>
			)}
		</div>
	);
};

export default GuessNumberGame;
