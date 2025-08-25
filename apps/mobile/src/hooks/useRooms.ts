/** @format */

import { useEffect, useState, useCallback } from 'react';
import type { MeetingRoom } from '../types/types';
import { fetchRoomsApi } from '../api/rooms';

// NOTE: This file is currently redundant, as it was only used for testing in early development.
// Choosing to leave file structure to demonstrate use-case for hooks.

export function useRooms(initial?: MeetingRoom[]) {
	const [rooms, setRooms] = useState<MeetingRoom[]>(initial ?? []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const refresh = useCallback(async (signal?: AbortSignal) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchRoomsApi(signal);
			setRooms(data);
		} catch (e: any) {
			if (e?.name !== 'AbortError') setError(e?.message ?? 'Fel vid hämtning.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const c = new AbortController();
		refresh(c.signal);
		return () => c.abort();
	}, [refresh]);

	return { rooms, loading, error, refreshRooms: refresh, setRooms };
}
