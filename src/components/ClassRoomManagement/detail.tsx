import { Modal, Descriptions, Badge } from 'antd';
import React from 'react';

interface ClassroomDetailProps {
	visible: boolean;
	classroom: Classroom.Record | undefined;
	onClose: () => void;
}

const ClassroomDetail: React.FC<ClassroomDetailProps> = ({ visible, classroom, onClose }) => {
	if (!classroom) return null;

	// Determine status based on seating capacity
	const getCapacityStatus = (capacity: number) => {
		if (capacity >= 100) return { status: 'success', text: 'Large' };
		if (capacity >= 30) return { status: 'processing', text: 'Medium' };
		return { status: 'warning', text: 'Small' };
	};

	const capacityStatus = getCapacityStatus(classroom.seatingCapacity);

	return (
		<Modal
			title='Classroom Details'
			visible={visible}
			onCancel={onClose}
			footer={null}
			width={800}
			bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
		>
			<Descriptions bordered column={1}>
				<Descriptions.Item label='Room Code'>{classroom.roomCode}</Descriptions.Item>
				<Descriptions.Item label='Room Name'>{classroom.roomName}</Descriptions.Item>
				<Descriptions.Item label='Seating Capacity'>
					{classroom.seatingCapacity}
					<Badge
						status={capacityStatus.status as 'success' | 'processing' | 'warning'}
						text={capacityStatus.text}
						style={{ marginLeft: 8 }}
					/>
				</Descriptions.Item>
				<Descriptions.Item label='Room Type'>{classroom.roomType}</Descriptions.Item>
				<Descriptions.Item label='Assigned Staff'>{classroom.assignedStaff}</Descriptions.Item>
				<Descriptions.Item label='Unique ID'>{classroom.id}</Descriptions.Item>
				<Descriptions.Item label='Description'>
					<div
						dangerouslySetInnerHTML={{ __html: classroom.description }}
						className='tinymce-content'
						style={{
							padding: '8px',
							border: '1px solid #f0f0f0',
							borderRadius: '4px',
							backgroundColor: '#fafafa',
							minHeight: '100px',
						}}
					/>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ClassroomDetail;
