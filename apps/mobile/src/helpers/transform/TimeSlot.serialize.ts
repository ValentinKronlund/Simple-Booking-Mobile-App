/** @format */

import type { TimeSlotRender } from '../../types/types';

export type SerializedTimeSlot = Omit<TimeSlotRender, 'start' | 'end'> & {
	start: string;
	end: string;
};

export function serializeSlot(s: TimeSlotRender): SerializedTimeSlot {
	return { ...s, start: s.start.toISOString(), end: s.end.toISOString() };
}
export function deserializeSlot(s: SerializedTimeSlot): TimeSlotRender {
	return { ...s, start: new Date(s.start), end: new Date(s.end) };
}
