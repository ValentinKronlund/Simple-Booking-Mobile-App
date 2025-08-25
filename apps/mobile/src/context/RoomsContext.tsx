/** @format */

// context/RoomsContext.tsx
import React, {
	createContext,
	useContext,
	useCallback,
	useMemo,
	useState,
	useEffect,
} from 'react';
import type { MeetingRoom, TimeSlot } from '../types/types';
import { fetchRoomsApi } from '../api/rooms'; // from earlier extraction (Option A)
import { MOCK_ROOMS } from '../data/MockData';

type Ctx = {
	rooms: MeetingRoom[];
	loading: boolean;
	error: string | null;
	refreshRooms: () => void;
	setRooms: React.Dispatch<React.SetStateAction<MeetingRoom[]>>;
	updateSlotBookedBy: (slotId: string, bookedBy: string | undefined) => void;
	updateSlotState: (slotId: string, state: TimeSlot['state']) => void;
};

const RoomsContext = createContext<Ctx | null>(null);

export function RoomsProvider({ children }: { children: React.ReactNode }) {
	const [rooms, setRooms] = useState<MeetingRoom[]>(MOCK_ROOMS ?? []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const refreshRooms = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchRoomsApi();
			setRooms(data);
		} catch (e: any) {
			setError(e?.message ?? 'Kunde inte hämta rum.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshRooms();
	}, [refreshRooms]);

	const updateSlotBookedBy = useCallback(
		(slotId: string, bookedBy: string | undefined) => {
			setRooms((prev) =>
				prev.map((room) => ({
					...room,
					availability: (room.availability ?? []).map((ts) => {
						const id = `${room.id}-${ts.start}`;
						return id === slotId ? { ...ts, bookedBy } : ts;
					}),
				})),
			);
		},
		[],
	);

	const updateSlotState = useCallback((slotId: string, state: TimeSlot['state']) => {
		setRooms((prev) =>
			prev.map(
				(room): MeetingRoom => ({
					...room,
					availability: (room.availability ?? []).map((ts): TimeSlot => {
						const id = `${room.id}-${ts.start}`;
						return id === slotId ? { ...ts, state } : ts;
					}),
				}),
			),
		);
	}, []);

	const value = useMemo(
		() => ({
			rooms,
			loading,
			error,
			refreshRooms,
			setRooms,
			updateSlotBookedBy,
			updateSlotState,
		}),
		[rooms, loading, error, refreshRooms, updateSlotBookedBy],
	);

	return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>;
}

export function useRoomsStore() {
	const ctx = useContext(RoomsContext);
	if (!ctx) throw new Error('useRoomsStore must be used within RoomsProvider');
	return ctx;
}
