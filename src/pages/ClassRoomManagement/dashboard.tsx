import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { useModel } from 'umi';
import { DashboardOutlined, PieChartOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import LineChart from '../../components/Chart/LineChart';
import ColumnChart from '../../components/Chart/ColumnChart';
import DonutChart from '../../components/Chart/DonutChart';
import { tienVietNam } from '@/utils/utils';
import { Link } from 'umi';

const ClassroomDashboard: React.FC = () => {
	const { classrooms, getClassroomData } = useModel('classroom');
	const [roomTypesData, setRoomTypesData] = useState<{ labels: string[]; values: number[] }>({
		labels: [],
		values: [],
	});
	const [capacityData, setCapacityData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
	const [staffDistribution, setStaffDistribution] = useState<{ labels: string[]; values: number[] }>({
		labels: [],
		values: [],
	});

	useEffect(() => {
		// Load classroom data if not already loaded
		if (classrooms.length === 0) {
			getClassroomData();
		} else {
			processData();
		}
	}, [classrooms]);

	const processData = () => {
		// Process room types data for donut chart
		const roomTypes = Array.from(new Set(classrooms.map((room) => room.roomType)));
		const roomTypeCounts = roomTypes.map((type) => {
			return classrooms.filter((room) => room.roomType === type).length;
		});
		setRoomTypesData({
			labels: roomTypes,
			values: roomTypeCounts,
		});

		// Process capacity data for column chart
		const capacityRanges = ['1-10', '11-20', '21-30', '31+'];
		const capacityCounts = [
			classrooms.filter((room) => room.seatingCapacity <= 10).length,
			classrooms.filter((room) => room.seatingCapacity > 10 && room.seatingCapacity <= 20).length,
			classrooms.filter((room) => room.seatingCapacity > 20 && room.seatingCapacity <= 30).length,
			classrooms.filter((room) => room.seatingCapacity > 30).length,
		];
		setCapacityData({
			labels: capacityRanges,
			values: capacityCounts,
		});

		// Process staff assignment data
		const staffMembers = Array.from(new Set(classrooms.map((room) => room.assignedStaff)));
		const staffCounts = staffMembers.map((staff) => {
			return classrooms.filter((room) => room.assignedStaff === staff).length;
		});
		setStaffDistribution({
			labels: staffMembers,
			values: staffCounts,
		});
	};

	// Calculate total stats
	const totalClassrooms = classrooms.length;
	const totalSeats = classrooms.reduce((total, room) => total + room.seatingCapacity, 0);
	const largeClassrooms = classrooms.filter((room) => room.seatingCapacity >= 30).length;
	const smallClassrooms = classrooms.filter((room) => room.seatingCapacity < 10).length;

	// Custom formatter for charts
	const formatNumber = (val: number) => {
		return val.toString();
	};

	return (
		<div style={{ padding: '24px' }}>
			<Row gutter={[16, 16]} align='middle' style={{ marginBottom: 24 }}>
				<Col>
					<h1 style={{ margin: 0 }}>
						<DashboardOutlined /> Classroom Dashboard
					</h1>
				</Col>
				<Col flex='auto'></Col>
				<Col>
					<Link to='/classroom-management/classroom'>
						<Button type='primary'>Go to Classroom Management</Button>
					</Link>
				</Col>
			</Row>

			{/* Summary Statistics */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Total Classrooms' value={totalClassrooms} prefix={<HomeOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Total Seating Capacity' value={totalSeats} prefix={<TeamOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Large Classrooms (30+ seats)' value={largeClassrooms} prefix={<PieChartOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Small Classrooms (<10 seats)' value={smallClassrooms} prefix={<PieChartOutlined />} />
					</Card>
				</Col>
			</Row>

			{/* Charts Row */}
			<Row gutter={[16, 16]}>
				<Col xs={24} md={12}>
					<Card title='Classroom Types Distribution'>
						<DonutChart
							xAxis={roomTypesData.labels}
							yAxis={[roomTypesData.values]}
							yLabel={['Room Types']}
							formatY={formatNumber}
							showTotal={true}
							height={300}
							colors={['#1890ff', '#52c41a', '#fa8c16', '#f5222d']}
						/>
					</Card>
				</Col>
				<Col xs={24} md={12}>
					<Card title='Seating Capacity Distribution'>
						<ColumnChart
							xAxis={capacityData.labels}
							yAxis={[capacityData.values]}
							yLabel={['Number of Classrooms']}
							formatY={formatNumber}
							height={300}
							colors={['#2f54eb']}
						/>
					</Card>
				</Col>
				<Col xs={24}>
					<Card title='Staff Assignment Distribution'>
						<LineChart
							xAxis={staffDistribution.labels}
							yAxis={[staffDistribution.values]}
							yLabel={['Classrooms Assigned']}
							formatY={formatNumber}
							height={300}
							colors={['#13c2c2']}
							otherOptions={{
								markers: {
									size: 6,
								},
							}}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ClassroomDashboard;
