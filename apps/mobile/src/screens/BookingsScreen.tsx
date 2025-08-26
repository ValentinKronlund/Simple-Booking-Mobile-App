/** @format */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TextInput, SafeAreaView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoomsStore } from '../context/RoomsContext';
import Title from '../components/atoms/ui/Title';
import StickyFooter from '../components/molecules/ui/StickyFooter';
import { deserializeSlot } from '../helpers/transform/TimeSlot.serialize';
import { RootStackParamList } from '../navigation/types/types';
import { patchSlot } from '../api/slots';
import { Ionicons } from '@expo/vector-icons';
import { RoomState } from '../types/types';
import { FormatTime_FourDigits } from '../helpers/formating/Date.formating';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

export default function BookingScreen({ navigation, route }: Props) {
	const { rooms, updateSlotBookedBy, updateSlotState } = useRoomsStore();

	// ------------------
	// Memoized Variables ⬇️
	// ------------------
	const slot = useMemo(() => deserializeSlot(route.params.slot), [route.params.slot]);
	const storeView = useMemo(() => {
		for (const room of rooms) {
			for (const timeslot of room.availability ?? []) {
				const id = `${room.id}-${timeslot.start}`;
				if (id === slot.id) {
					return {
						state: timeslot.state ?? ('vacant' as RoomState),
						bookedBy: timeslot.bookedBy as string | undefined,
					};
				}
			}
		}
		return {
			state: slot.state ?? 'vacant',
			bookedBy: slot.bookedBy as string | undefined,
		};
	}, [rooms, slot.id, slot.start, slot.bookedBy]);

	// ------------------
	// State Variables ⬇️
	// ------------------
	const [bookedBy, setBookedBy] = useState(slot.bookedBy ?? '');
	const [submitting, setSubmitting] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);

	// ------------------
	// Hard Variables ⬇️
	// ------------------
	const isVacant = (storeView.state ?? 'vacant') === 'vacant';

	// ------------------
	// Handlers ⬇️
	// ------------------
	const goBackAndDeselect = useCallback(() => {
		navigation.navigate('Main');
	}, []);

	const doBook = useCallback(async () => {
		const name = bookedBy.trim();
		if (!name) {
			setLocalError('Ange ditt namn för att boka.');
			return;
		}

		setLocalError(null);

		const prevBookedBy = storeView.bookedBy;
		const prevState = storeView.state;
		updateSlotBookedBy(slot.id, name);
		updateSlotState(slot.id, 'booked');

		setSubmitting(true);
		try {
			await patchSlot({
				roomId: slot.roomId,
				startUtc: slot.start,
				state: 'booked',
				bookedBy: name,
			});
		} catch (e: any) {
			updateSlotBookedBy(slot.id, prevBookedBy);
			updateSlotState(slot.id, prevState);
			setLocalError(e?.message ?? 'Kunde inte spara bokningen.');
		} finally {
			navigation.navigate('Main', {
				roomConfirmation: {
					kind: 'booked',
					room: slot.name,
					start: slot.start,
					end: slot.end,
				},
			});
			setSubmitting(false);
		}
	}, [
		bookedBy,
		slot.roomId,
		slot.start,
		slot.id,
		storeView.bookedBy,
		storeView.state,
		updateSlotBookedBy,
		updateSlotState,
		navigation,
	]);

	const doUnbook = useCallback(async () => {
		const prevBookedBy = storeView.bookedBy;
		const prevState = storeView.state;

		updateSlotBookedBy(slot.id, undefined);
		updateSlotState(slot.id, 'vacant');

		setSubmitting(true);

		try {
			await patchSlot({
				roomId: slot.roomId,
				startUtc: slot.start,
				state: 'vacant',
				bookedBy: '',
			});
		} catch (e: any) {
			updateSlotBookedBy(slot.id, prevBookedBy);
			updateSlotState(slot.id, prevState);
			setLocalError(e?.message ?? 'Kunde inte avboka tiden.');
		} finally {
			navigation.navigate('Main', {
				roomConfirmation: {
					kind: 'unbooked',
					room: slot.name,
					start: slot.start,
					end: slot.end,
				},
			});
			setSubmitting(false);
		}
	}, [
		slot.id,
		slot.roomId,
		slot.start,
		storeView.bookedBy,
		storeView.state,
		updateSlotBookedBy,
		updateSlotState,
		navigation,
	]);

	const confirm = useCallback(async () => {
		if (isVacant) {
			doBook();
			return;
		}
		Alert.alert(
			`${slot.name} [${FormatTime_FourDigits(slot.start)} - ${FormatTime_FourDigits(slot.end)}]`,
			'Är du säker på att du vill avboka denna tid?',
			[
				{ text: 'Avbryt', style: 'cancel' },
				{ text: 'Avboka', style: 'destructive', onPress: () => doUnbook() },
			],
			{ cancelable: true },
		);
	}, [isVacant, doBook, doUnbook]);

	// ------------------
	// Render ⬇️
	// ------------------
	return (
		<SafeAreaView className='flex-1'>
			<View className='px-4 pt-12 pb-4'>
				<View className='flex-row'>
					<View className='flex-grow'>
						<Title variant='h2'>{isVacant ? 'Vem bokar?' : 'Tiden är upptagen'}</Title>
					</View>
					<Pressable
						className='p-2'
						onPress={goBackAndDeselect}
						accessibilityRole='button'>
						<Ionicons name='close' size={32} color='#212121' />
					</Pressable>
				</View>
			</View>

			<View className='px-4 pt-8 pb-2'>
				<View className='w-full mb-4'>
					<Title variant='h3'>
						{isVacant ? 'Förnamn och efternamn' : 'Denna lokal är för bokad av:'}
					</Title>
				</View>
				{isVacant ? (
					<View className='w-full self-center justify-center'>
						<TextInput
							className='h-12 border border-black/20 rounded-lg px-3 py-2 mb-2'
							placeholder='Skriv ditt fullständiga namn här'
							value={bookedBy}
							onChangeText={setBookedBy}
							autoCapitalize='words'
							editable={!submitting}
						/>
						{localError ? (
							<Text className='text-red-500 text-sm'>{localError}</Text>
						) : null}
					</View>
				) : (
					<View className='w-full self-center justify-center'>
						<Text className='mb-4 text-2xl text-black/50'>{`${storeView.bookedBy}`}</Text>
						<Text className='text-lg text-black/50'>
							{'Du kan avboka för att återställa tiden till ledig.'}
						</Text>
						{localError ? (
							<Text className='text-red-500 text-sm mt-2'>{localError}</Text>
						) : null}
					</View>
				)}
			</View>

			<StickyFooter
				error={null}
				loading={submitting}
				primaryLabel={isVacant ? 'Bekräfta' : 'Avboka'}
				loadingLabel={isVacant ? 'Sparar…' : 'Avbokar…'}
				onPrimaryPress={confirm}
				className='pb-12'
				disabled={submitting || (isVacant && !bookedBy.trim())}
			/>
		</SafeAreaView>
	);
}
