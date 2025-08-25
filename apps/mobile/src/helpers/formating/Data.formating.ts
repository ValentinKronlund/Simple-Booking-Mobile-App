/** @format */

import type { MeetingRoom, TimeSlotRender } from '../../types/types';
import { toDateSafe, dayKey } from './Date.formating';

export function roomsToSlots(rooms: MeetingRoom[]): TimeSlotRender[] {
	return rooms.flatMap((room) =>
		(room.availability ?? []).map((ts) => {
			const start = toDateSafe(ts.start);
			const end = toDateSafe(ts.end);
			return {
				id: `${room.id}-${ts.start}`,
				name: room.name,
				capacity: room.capacity,
				state: ts.state,
				start: start ?? new Date(NaN), // still typed as Date
				end: end ?? new Date(NaN),
				dateKey: dayKey(start),
			};
		}),
	);
}
