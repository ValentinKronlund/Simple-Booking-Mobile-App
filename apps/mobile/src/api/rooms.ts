/** @format */

// api/rooms.ts
import type { MeetingRoom } from '../types/types';
import { http } from './http';

export async function fetchRoomsApi(signal?: AbortSignal): Promise<MeetingRoom[]> {
	const data = await http.get<unknown>('/api/rooms', signal);
	return Array.isArray(data) ? (data as MeetingRoom[]) : [];
}
