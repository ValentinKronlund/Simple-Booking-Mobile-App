/** @format */

import { SafeAreaView, View } from 'react-native';
import Title from '../components/atoms/ui/Title';
import { useState, useCallback, useMemo } from 'react';
import type { TimeSlotRender } from '../types/types';
import DateSpanPicker from '../components/atoms/date/DateSpanPicker';
import Dropdown from '../components/molecules/ui/Dropdown';
import DateSpanContainer from '../components/molecules/date/DateSpanContainer';
import { addDays, dayKey } from '../helpers/formating/Date.formating';
import { labelToName } from '../helpers/formating/String.formating';
import StickyFooter from '../components/molecules/ui/StickyFooter';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/types';
import { useRoomsStore } from '../context/RoomsContext';
import { serializeSlot } from '../helpers/transform/TimeSlot.serialize';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const MainScreen = ({ navigation }: Props) => {
	const { rooms, loading, error, refreshRooms } = useRoomsStore();

	const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
	const [spanOffsetDays, setSpanOffsetDays] = useState(0);
	const [selectedCell, setSelectedCell] = useState<TimeSlotRender | null>(null);

	const STEP_INCREMENT = 1;

	const selectedNames = useMemo(() => selectedRooms.map(labelToName), [selectedRooms]);

	const dropdownItems = useMemo(
		() => rooms.map((r) => `${r.name} (${r.capacity} personer)`),
		[rooms],
	);

	const roomsToRender = useMemo(
		() =>
			selectedNames.length ? rooms.filter((r) => selectedNames.includes(r.name)) : rooms,
		[rooms, selectedNames],
	);

	const span = useMemo(() => {
		const yesterday = addDays(new Date(), -1);
		const start = addDays(yesterday, spanOffsetDays);
		return Array.from({ length: 3 }, (_, i) => addDays(start, i));
	}, [spanOffsetDays]);

	const timeSlotCells: TimeSlotRender[] = useMemo(() => {
		return roomsToRender.flatMap((room) =>
			(room.availability ?? []).map((timeSlot) => {
				const start = new Date(timeSlot.start as any);
				const end = new Date(timeSlot.end as any);
				return {
					id: `${room.id}-${timeSlot.start}`,
					roomId: room.id,
					name: room.name,
					capacity: room.capacity,
					start,
					end,
					state: timeSlot.state,
					dateKey: dayKey(start),
				};
			}),
		);
	}, [roomsToRender]);

	const groupedByDay = useMemo(() => {
		return span.map((d) => {
			const key = dayKey(d);
			const items = timeSlotCells
				.filter((s) => s.dateKey === key)
				.sort((a, b) => a.start.getTime() - b.start.getTime());
			return { date: d, items };
		});
	}, [span, timeSlotCells]);

	// ----- Handlers -----

	const toggleSelection = useCallback((selection: string) => {
		setSelectedRooms((prev) =>
			prev.includes(selection)
				? prev.filter((x) => x !== selection)
				: [...prev, selection],
		);
	}, []);

	const clearSelection = useCallback(() => setSelectedRooms([]), []);

	const handlePrev = useCallback(() => {
		setSpanOffsetDays((d) => d - STEP_INCREMENT);
	}, []);

	const handleNext = useCallback(() => {
		setSpanOffsetDays((d) => d + STEP_INCREMENT);
	}, []);

	const handleCell = useCallback((cell: TimeSlotRender) => {
		setSelectedCell(cell);
	}, []);

	const goNext = useCallback(() => {
		if (!selectedCell) return;
		navigation.navigate('Booking', { slot: serializeSlot(selectedCell) });
	}, [navigation, selectedCell]);

	return (
		<SafeAreaView className='flex-1 bg-white'>
			{/* Header */}
			<View className='px-4 pt-8 pb-2'>
				<View className='flex flex-wrap px-2 pt-4 pb-2 items-left'>
					<View className='w-full mb-8'>
						<Title variant='h2'>Välj en tid</Title>
					</View>

					<View className='w-[164px]'>
						<Dropdown
							items={dropdownItems}
							selectedItems={selectedRooms}
							onSelect={toggleSelection}
							onClear={clearSelection}
						/>
					</View>
				</View>
			</View>

			{/* Cell grid */}
			<View className='h-[512px] mt-4 px-4 py-4 bg-white'>
				<DateSpanPicker span={span} onPrev={handlePrev} onNext={handleNext} />
				<DateSpanContainer
					data={groupedByDay}
					onToggleCell={handleCell}
					selectedId={selectedCell?.id}
				/>
			</View>

			{/* Sticky footer */}
			<StickyFooter
				error={error}
				loading={loading}
				primaryLabel='Nästa'
				loadingLabel='Hämtar…'
				onPrimaryPress={goNext}
				className='pb-12'
				disabled={!selectedCell || loading}
			/>
		</SafeAreaView>
	);
};

export default MainScreen;
