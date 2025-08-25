/** @format */

import { TimeSlot, MeetingRoom } from '../types/types';

export const MOCK_SLOTS: TimeSlot[] = [
	{
		start: new Date(),
		end: new Date(Date.now() + 30 * 60000),
		state: 'vacant',
		bookedBy: undefined,
	},
	{
		start: new Date(),
		end: new Date(Date.now() + 60 * 60000),
		state: 'vacant',
		bookedBy: undefined,
	},
	{
		start: new Date(),
		end: new Date(Date.now() + 90 * 60000),
		state: 'vacant',
		bookedBy: undefined,
	},
	{
		start: new Date(),
		end: new Date(Date.now() + 120 * 60000),
		state: 'vacant',
		bookedBy: undefined,
	},
];

export const MOCK_ROOMS: MeetingRoom[] = [
	{ id: '1', name: 'Tollaren', capacity: 4, availability: [MOCK_SLOTS[0]] },
	{ id: '2', name: 'Ugglan', capacity: 4, availability: [MOCK_SLOTS[1]] },
	{ id: '3', name: 'Mysaren', capacity: 4, availability: [MOCK_SLOTS[2]] },
	{ id: '4', name: 'Skeppet', capacity: 4, availability: [MOCK_SLOTS[3]] },
];
