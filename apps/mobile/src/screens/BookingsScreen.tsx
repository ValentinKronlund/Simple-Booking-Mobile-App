/** @format */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TextInput, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoomsStore } from '../context/RoomsContext';
import Title from '../components/atoms/ui/Title';
import StickyFooter from '../components/molecules/ui/StickyFooter';
import { deserializeSlot } from '../helpers/transform/TimeSlot.serialize';
import { RootStackParamList } from '../navigation/types/types';
import { patchSlot } from '../api/slots';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'Booking'>['route'];
type NavProps = NativeStackScreenProps<RootStackParamList, 'Booking'>['navigation'];

export default function BookingScreen() {
	const { updateSlotBookedBy, updateSlotState } = useRoomsStore();
	const route = useRoute<RouteProps['key'] extends never ? any : RouteProps>();
	const navigation = useNavigation<NavProps>();

	const slot = useMemo(() => deserializeSlot(route.params.slot), [route.params.slot]);
	const [bookedBy, setBookedBy] = useState(slot.bookedBy ?? '');
	const [submitting, setSubmitting] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);

	const confirm = useCallback(async () => {
		const name = bookedBy.trim();
		if (!name) {
			setLocalError('Ange ditt namn för att boka.');
			return;
		}
		setLocalError(null);

		// --- optimistic update
		const prevBookedBy = slot.bookedBy;
		const prevState = slot.state ?? 'vacant';
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

			navigation.goBack();
		} catch (e: any) {
			// --- rollback on failure
			updateSlotBookedBy(slot.id, prevBookedBy ?? undefined);
			updateSlotState(slot.id, prevState);
			setLocalError(e?.message ?? 'Kunde inte spara bokningen.');
		} finally {
			setSubmitting(false);
		}
	}, [bookedBy, slot, navigation, updateSlotBookedBy, updateSlotState]);

	return (
		<SafeAreaView className='flex-1'>
			<View className='px-4 pt-8 pb-2'>
				<View className='flex flex-wrap px-2 pt-4 pb-2 items-left'>
					<View className='w-full mb-8'>
						<Title variant='h2'>Vem bokar?</Title>
					</View>
				</View>
			</View>

			<View className='px-4 pt-8 pb-2'>
				<View className='w-full mb-4'>
					<Title variant='h3'>Förnamn och efternamn</Title>
				</View>
				<View className='w-full self-center justify-center'>
					<TextInput
						className='h-12 border border-black/20 rounded-lg px-3 py-2 mb-2'
						placeholder='Skriv ditt fullständiga namn här'
						value={bookedBy}
						onChangeText={setBookedBy}
						autoCapitalize='words'
					/>
					{localError ? <Text className='text-red-500 text-sm'>{localError}</Text> : null}
				</View>
			</View>

			<StickyFooter
				error={localError}
				loading={submitting}
				primaryLabel='Bekräfta'
				loadingLabel='Sparar…'
				onPrimaryPress={confirm}
				className='pb-12'
				disabled={submitting || !bookedBy.trim()}
			/>
		</SafeAreaView>
	);
}
