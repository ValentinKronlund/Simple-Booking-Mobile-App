/** @format */

export type RoomState = 'vacant' | 'occupied' | 'booked';

export type TimeSlot = {
	start: Date;
	end: Date;
	state: RoomState;
	bookedBy?: string;
};

export type TimeSlotRender = {
	id: string;
	roomId: string;
	dateKey: string;

	name: MeetingRoom['name'];
	capacity: MeetingRoom['capacity'];

	start: TimeSlot['start'];
	end: TimeSlot['end'];
	state: TimeSlot['state'];
	bookedBy?: TimeSlot['bookedBy'];
};

export type MeetingRoom = {
	id: string;
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
