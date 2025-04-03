import axios from 'axios';

// This function would normally fetch data from an API
// But for this assignment, we'll just provide initial mock data (dữ liệu giả)
export const getInitialClassroomData = (): Classroom.Record[] => {
  return [
    {
      roomCode: 'A101',
      roomName: 'Main Lecture Hall',
      seatingCapacity: 150,
      roomType: 'Lecture',
      assignedStaff: 'Prof. Johnson'
    },
    {
      roomCode: 'B203',
      roomName: 'Computer Lab',
      seatingCapacity: 25,
      roomType: 'Lab',
      assignedStaff: 'Dr. Smith'
    },
    {
      roomCode: 'C305',
      roomName: 'Science Auditorium',
      seatingCapacity: 200,
      roomType: 'Auditorium',
      assignedStaff: 'Prof. Garcia'
    },
    {
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