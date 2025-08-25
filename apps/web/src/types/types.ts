/** @format */

export type RoomState = 'vacant' | 'occupied' | 'booked';

export type TimeSlot = {
	start: Date;
	end: Date;
	state: RoomState;
	bookedBy?: string;
};

export type MeetingRoom = {
	id?: string;
	name: string;
	capacity: number;
	availability: TimeSlot[];
	createdAt?: Date;
	updatedAt?: Date;
};

export type Booking = {
	id: string;
	roomId: string;
	title: string;
	bookedBy: string;
	startUtc: string;
	endUtc: string;
};
