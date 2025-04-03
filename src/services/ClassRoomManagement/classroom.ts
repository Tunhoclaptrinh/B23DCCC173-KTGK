import axios from 'axios';

// Helper function to generate UUID
const generateUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

// This function would normally fetch data from an API
// But for this assignment, we'll just provide initial mock data (dữ liệu giả)
export const getInitialClassroomData = (): Classroom.Record[] => {
	return [
		{
			id: generateUUID(),
			roomCode: 'A101',
			roomName: 'Main Lecture Hall',
			seatingCapacity: 150,
			roomType: 'Lecture',
			assignedStaff: 'Prof. Johnson',
			description:
				'<p>A spacious lecture hall equipped with modern audiovisual systems, suitable for large classes and special events. Features include a projector, sound system, and comfortable seating.</p>',
		},
		{
			id: generateUUID(),
			roomCode: 'B203',
			roomName: 'Computer Lab',
			seatingCapacity: 25,
			roomType: 'Lab',
			assignedStaff: 'Dr. Smith',
			description:
				'<p>A specialized lab with 25 workstations, each equipped with the latest software for programming and design courses. Includes high-speed internet and specialized equipment.</p>',
		},
		{
			id: generateUUID(),
			roomCode: 'C305',
			roomName: 'Science Auditorium',
			seatingCapacity: 200,
			roomType: 'Auditorium',
			assignedStaff: 'Prof. Garcia',
			description:
				'<p>Our largest venue, perfect for guest lectures, presentations, and ceremonial events. Features include stadium seating, advanced audio systems, and multiple projection screens.</p>',
		},
		{
			id: generateUUID(),
			roomCode: 'D408',
			roomName: 'Small Group Room',
			seatingCapacity: 20,
			roomType: 'Lecture',
			assignedStaff: 'Dr. Chen',
			description:
				'<p>An intimate classroom designed for small group discussions and seminars. Equipped with a smart board and modular furniture that can be rearranged for different teaching formats.</p>',
		},
	];
};

// List of staff members for the dropdown
export const getStaffList = (): string[] => {
	return [
		'Prof. Johnson',
		'Dr. Smith',
		'Prof. Garcia',
		'Dr. Chen',
		'Prof. Williams',
		'Dr. Brown',
		'Prof. Miller',
		'Dr. Davis',
	];
};

export { generateUUID };
