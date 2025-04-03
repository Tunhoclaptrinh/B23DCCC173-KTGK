import { getInitialClassroomData, getStaffList } from '@/services/ClassRoomManagement/classroom';
import { useState } from 'react';
import { message } from 'antd';

export default () => {
  const [classrooms, setClassrooms] = useState<Classroom.Record[]>([]);
  const [staffList] = useState<string[]>(getStaffList());

  // Load classroom data from localStorage or initialize with mock data (dữ liệu giả)
  const getClassroomData = () => {
    const localData = localStorage.getItem('classrooms');
    if (localData) {
      setClassrooms(JSON.parse(localData));
    } else {
      const initialData = getInitialClassroomData();
      localStorage.setItem('classrooms', JSON.stringify(initialData));
      setClassrooms(initialData);
    }
  };

  // Add a new classroom
  const addClassroom = (newClassroom: Classroom.Record) => {
    // Check if roomCode or roomName already exists
    const isDuplicate = classrooms.some(
      room => room.roomCode === newClassroom.roomCode || room.roomName === newClassroom.roomName
    );

    if (isDuplicate) {
      message.error('Room Code or Room Name already exists!');
      return false;
    }

    const updatedClassrooms = [newClassroom, ...classrooms];
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
    setClassrooms(updatedClassrooms);
    message.success('Classroom added successfully!');
    return true;
  };

  // Update an existing classroom
  const updateClassroom = (updatedClassroom: Classroom.Record, originalRoomCode: string) => {
    // Check if roomCode or roomName already exists (excluding the current classroom)
    const isDuplicate = classrooms.some(
      room => 
        (room.roomCode === updatedClassroom.roomCode || room.roomName === updatedClassroom.roomName) && 
        room.roomCode !== originalRoomCode
    );

    if (isDuplicate) {
      message.error('Room Code or Room Name already exists!');
      return false;
    }

    const updatedClassrooms = classrooms.map(room => 
      room.roomCode === originalRoomCode ? updatedClassroom : room
    );
    
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
    setClassrooms(updatedClassrooms);
    message.success('Classroom updated successfully!');
    return true;
  };

  // Delete a classroom
  const deleteClassroom = (roomCode: string) => {
    const classroom = classrooms.find(room => room.roomCode === roomCode);
    
    if (classroom && classroom.seatingCapacity >= 30) {
      message.error('Cannot delete classrooms with 30 or more seats!');
      return false;
    }
    
    const updatedClassrooms = classrooms.filter(room => room.roomCode !== roomCode);
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
    setClassrooms(updatedClassrooms);
    message.success('Classroom deleted successfully!');
    return true;
  };

  return {
    classrooms,
    staffList,
    getClassroomData,
    addClassroom,
    updateClassroom,
    deleteClassroom
  };
};