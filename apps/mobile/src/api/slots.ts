/** @format */

import { API_BASE_URL } from '../config/api';

type PatchSlotInput = {
	roomId: string;
	startUtc: Date | string | number;
	state?: 'vacant' | 'booked' | 'occupied';
	bookedBy?: string;
};

export async function patchSlot(input: PatchSlotInput) {
	const payload = {
		roomId: input.roomId,
		startUtc:
			input.startUtc instanceof Date ? input.startUtc.toISOString() : input.startUtc,
		...(input.state !== undefined ? { state: input.state } : {}),
		...(Object.prototype.hasOwnProperty.call(input, 'bookedBy')
			? { bookedBy: input.bookedBy }
			: {}),
	};

	const res = await fetch(`${API_BASE_URL}/api/slots`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`PATCH /api/slots failed (${res.status}): ${text}`);
	}

	return res.json();
}
