import { Button, Input, Select, Table, Space, Modal, message, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ClassroomForm from '@/components/ClassRoomManagement/form';
import ClassroomDetail from '@/components/ClassRoomManagement/detail';
import type { ColumnsType, TableProps } from 'antd/es/table';

const { Option } = Select;
const { confirm } = Modal;

const ClassroomManagement: React.FC = () => {
	const { classrooms, staffList, getClassroomData, addClassroom, updateClassroom, deleteClassroom } =
		useModel('classroom');

	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [currentClassroom, setCurrentClassroom] = useState<Classroom.Record | undefined>();

	// Detail view state
	const [detailVisible, setDetailVisible] = useState<boolean>(false);
	const [detailClassroom, setDetailClassroom] = useState<Classroom.Record | undefined>();

	// Search and filter states
	const [searchText, setSearchText] = useState<string>('');
	const [filterRoomType, setFilterRoomType] = useState<string | undefined>();
	const [filterStaff, setFilterStaff] = useState<string | undefined>();

	// Load data on component mount
	useEffect(() => {
		getClassroomData();
	}, []);

	// Handle form submission (for both add and edit)
	const handleFormSubmit = (values: Classroom.Record, originalRoomCode?: string) => {
		if (isEdit && originalRoomCode) {
			const success = updateClassroom(values, originalRoomCode);
			if (success) {
				setVisible(false);
			}
		} else {
			const success = addClassroom(values);
			if (success) {
				setVisible(false);
			}
		}
	};

	// Handle opening detail view
	const handleViewDetails = (record: Classroom.Record) => {
		setDetailClassroom(record);
		setDetailVisible(true);
	};

	// Handle delete with confirmation
	const handleDelete = (record: Classroom.Record) => {
		if (record.seatingCapacity >= 30) {
			message.error('Cannot delete classrooms with 30 or more seats!');
			return;
		}

		confirm({
			title: 'Are you sure you want to delete this classroom?',
			content: `${record.roomCode} - ${record.roomName}`,
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteClassroom(record.roomCode);
			},
		});
	};

	// Helper function to strip HTML tags for text search
	const stripHtml = (html: string) => {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};

	// Filter the data based on search and filters
	const filteredData = classrooms.filter((room) => {
		const matchesSearch = searchText
			? room.roomCode.toLowerCase().includes(searchText.toLowerCase()) ||
			  room.roomName.toLowerCase().includes(searchText.toLowerCase()) ||
			  stripHtml(room.description).toLowerCase().includes(searchText.toLowerCase())
			: true;

		const matchesRoomType = filterRoomType ? room.roomType === filterRoomType : true;
		const matchesStaff = filterStaff ? room.assignedStaff === filterStaff : true;

		return matchesSearch && matchesRoomType && matchesStaff;
	});

	// Table columns definition
	const columns: ColumnsType<Classroom.Record> = [
		{
			title: 'Room Code',
			dataIndex: 'roomCode',
			key: 'roomCode',
			sorter: (a, b) => a.roomCode.localeCompare(b.roomCode),
		},
		{
			title: 'Room Name',
			dataIndex: 'roomName',
			key: 'roomName',
			sorter: (a, b) => a.roomName.localeCompare(b.roomName),
		},
		{
			title: 'Seating Capacity',
			dataIndex: 'seatingCapacity',
			key: 'seatingCapacity',
			sorter: (a, b) => a.seatingCapacity - b.seatingCapacity,
		},
		{
			title: 'Room Type',
			dataIndex: 'roomType',
			key: 'roomType',
			sorter: (a, b) => a.roomType.localeCompare(b.roomType),
		},
		{
			title: 'Assigned Staff',
			dataIndex: 'assignedStaff',
			key: 'assignedStaff',
			sorter: (a, b) => a.assignedStaff.localeCompare(b.assignedStaff),
		},
		// {
		// 	title: 'Description',
		// 	dataIndex: 'description',
		// 	key: 'description',
		// 	render: (text) => (
		// 		<Tooltip
		// 			title={<div dangerouslySetInnerHTML={{ __html: text }} />}
		// 			placement='topLeft'
		// 			overlayStyle={{ maxWidth: '400px' }}
		// 		>
		// 			<div
		// 				style={{
		// 					maxWidth: '150px',
		// 					overflow: 'hidden',
		// 					textOverflow: 'ellipsis',
		// 					whiteSpace: 'nowrap',
		// 				}}
		// 			>
		// 				{stripHtml(text).substring(0, 50)}...
		// 			</div>
		// 		</Tooltip>
		// 	),
		// },
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
						View
					</Button>
					<Button
						onClick={() => {
							setCurrentClassroom(record);
							setIsEdit(true);
							setVisible(true);
						}}
					>
						Edit
					</Button>
					<Button danger disabled={record.seatingCapacity >= 30} onClick={() => handleDelete(record)}>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<h1>Classroom Management</h1>

			{/* Search and filters */}
			<div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
				<Input
					placeholder='Search by Room Code, Name, or Description'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					prefix={<SearchOutlined />}
					style={{ width: 300 }}
				/>

				<Select
					placeholder='Filter by Room Type'
					style={{ width: 200 }}
					allowClear
					value={filterRoomType}
					onChange={(value) => setFilterRoomType(value)}
				>
					<Option value='Lecture'>Lecture</Option>
					<Option value='Lab'>Lab</Option>
					<Option value='Auditorium'>Auditorium</Option>
				</Select>

				<Select
					placeholder='Filter by Staff'
					style={{ width: 200 }}
					allowClear
					value={filterStaff}
					onChange={(value) => setFilterStaff(value)}
				>
					{staffList.map((staff) => (
						<Option key={staff} value={staff}>
							{staff}
						</Option>
					))}
				</Select>

				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setIsEdit(false);
						setCurrentClassroom(undefined);
						setVisible(true);
					}}
				>
					Add Classroom
				</Button>
			</div>

			{/* Classroom Table */}
			<Table columns={columns} dataSource={filteredData} rowKey='id' pagination={{ pageSize: 10 }} />

			{/* Classroom Form Modal */}
			<ClassroomForm
				visible={visible}
				setVisible={setVisible}
				isEdit={isEdit}
				classroom={currentClassroom}
				classrooms={classrooms}
				staffList={staffList}
				onSubmit={handleFormSubmit}
			/>

			{/* Classroom Detail Modal */}
			<ClassroomDetail visible={detailVisible} classroom={detailClassroom} onClose={() => setDetailVisible(false)} />
		</div>
	);
};

export default ClassroomManagement;
