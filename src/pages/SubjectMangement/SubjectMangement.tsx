import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal, Table, Checkbox, Card, Switch } from 'antd';
import TaskForm from '../../components/Form/form4subjectmanagement';
import { ColumnType } from 'antd/lib/table';

const Subjectmanagement = () => {
	const [tasks, setTasks] = useState<any[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [currentTask, setCurrentTask] = useState<any | null>(null);
	const [detailVisible, setDetailVisible] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [viewMode, setViewMode] = useState('table');

	useEffect(() => {
		const storedTasks = localStorage.getItem('tasks');
		if (storedTasks) setTasks(JSON.parse(storedTasks));
	}, []);

	useEffect(() => {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}, [tasks]);

	const handleAdd = useCallback(() => {
		setVisible(true);
		setIsEdit(false);
		setCurrentTask(null);
	}, []);

	const handleEdit = useCallback((task) => {
		setCurrentTask(task);
		setIsEdit(true);
		setVisible(true);
	}, []);

	const handleDelete = useCallback((taskToDelete) => {
		Modal.confirm({
			title: 'Are you sure?',
			content: `Delete "${taskToDelete.Subject}"?`,
			onOk: () => {
				setTasks((prevTasks) => prevTasks.filter((task) => task.Subject !== taskToDelete.Subject));
			},
		});
	}, []);

	const handleFinish = useCallback(
		(values) => {
			const newTask = { ...values };
			setTasks((prevTasks) => {
				if (isEdit && currentTask) {
					return prevTasks.map((task) => (task.Subject === currentTask.Subject ? newTask : task));
				}
				return [...prevTasks, newTask];
			});
			setCurrentTask(null);
			setVisible(false);
		},
		[isEdit, currentTask],
	);

	const handleViewDetails = useCallback((task) => {
		setCurrentTask(task);
		setDetailVisible(true);
	}, []);

	const toggleComplete = useCallback((taskToToggle) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) => (task.Subject === taskToToggle.Subject ? { ...task, Status: !task.Status } : task)),
		);
	}, []);

	const columns: ColumnType<any>[] = [
		{ title: 'Subject', dataIndex: 'Subject', key: 'Subject' },
		{
			title: 'Actions',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<>
					<Button onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
					<Button onClick={() => handleEdit(record)} style={{ marginLeft: 10 }}>
						Edit
					</Button>
					<Button onClick={() => handleDelete(record)} danger style={{ marginLeft: 10 }}>
						Delete
					</Button>
				</>
			),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button type='primary' onClick={handleAdd}>
					Add Task
				</Button>
				<Switch
					checkedChildren='Card View'
					unCheckedChildren='Table View'
					checked={viewMode === 'card'}
					onChange={() => setViewMode((prev) => (prev === 'table' ? 'card' : 'table'))}
				/>
			</div>
			{viewMode === 'table' ? (
				<Table
					dataSource={tasks}
					columns={columns}
					rowKey='Subject'
					pagination={{ current: page, pageSize, onChange: setPage }}
				/>
			) : (
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
					{tasks.map((task) => (
						<Card
							key={task.Subject}
							title={<span style={{ fontWeight: 'bold' }}>{task.Subject}</span>}
							style={{ width: 300, border: '1px solid #ddd', padding: '10px' }}
							actions={[
								<Button onClick={() => handleViewDetails(task)}>Xem chi tiết</Button>,
								<Button onClick={() => handleEdit(task)}>Edit</Button>,
								<Button onClick={() => handleDelete(task)} danger>
									Delete
								</Button>,
							]}
						/>
					))}
				</div>
			)}
			<Modal title='Task Details' visible={detailVisible} onCancel={() => setDetailVisible(false)} footer={null}>
				{currentTask && (
					<div>
						<p>
							<strong>Subject:</strong> {currentTask.Subject}
						</p>
						<p>
							<strong>Grade:</strong> {currentTask.Grade}
						</p>
						<p>
							<strong>Goal:</strong> {currentTask.Goal}
						</p>
						<p>
							<strong>Description:</strong> {currentTask.Description}
						</p>
						<p>
							<strong>Timeline:</strong> {currentTask.Timeline} days
						</p>
						<p>
							<strong>Start Date:</strong> {currentTask.Date}
						</p>
						<p>
							<strong>Due Date:</strong> {currentTask.DueDate}
						</p>
						<p>
							<strong>Notes:</strong> {currentTask.Taknote || 'N/A'}
						</p>
						<Checkbox checked={currentTask.Status} onChange={() => toggleComplete(currentTask)}>
							{currentTask.Status ? 'Completed' : 'Pending'}
						</Checkbox>
					</div>
				)}
			</Modal>
			<Modal
				title={isEdit ? 'Edit Task' : 'Add Task'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<TaskForm initialValues={currentTask} onFinish={handleFinish} />
			</Modal>
		</div>
	);
};

export default Subjectmanagement;
