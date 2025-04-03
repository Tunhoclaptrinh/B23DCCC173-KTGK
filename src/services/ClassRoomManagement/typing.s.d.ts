declare module Classroom {
	// Loại phòng (Chọn từ enum)
	export type RoomType = 'Lecture' | 'Lab' | 'Auditorium';

	export interface Record {
		id: string; // UUID primary key
		roomCode: string;
		roomName: string;
		seatingCapacity: number;
		roomType: RoomType;
		assignedStaff: string;
		description: string; // Added description field
	}
}
