import axios from 'axios';

// Helper function to generate UUID
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// This function would normally fetch data from an API
// But for this assignment, we'll just provide initial mock data (dữ liệu giả)
export const getInitialClassroomData = (): Classroom.Record[] => {
    return [
        {
        id: generateUUID(),
        roomCode: 'A101',
        roomName: 'Main Lecture Hall',
        seatingCapacity: 150,
        roomType: 'Lecture',
        assignedStaff: 'Prof. Johnson'
        },
        {
        id: generateUUID(),
        roomCode: 'B203',
        roomName: 'Computer Lab',
        seatingCapacity: 25,
        roomType: 'Lab',
        assignedStaff: 'Dr. Smith'
        },
        {
        id: generateUUID(),
        roomCode: 'C305',
        roomName: 'Science Auditorium',
        seatingCapacity: 200,
        roomType: 'Auditorium',
        assignedStaff: 'Prof. Garcia'
        },
        {
        id: generateUUID(),
        roomCode: 'D408',
        roomName: 'Small Group Room',
        seatingCapacity: 20,
        roomType: 'Lecture',
        assignedStaff: 'Dr. Chen'
        }
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
    'Dr. Davis'
];
};

export { generateUUID };