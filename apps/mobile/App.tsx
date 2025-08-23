/** @format */

import { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { API_BASE_URL } from './src/config/api';

type Room = { id: string; name: string; capacity: number };

export default function App() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [who, setWho] = useState('');

	useEffect(() => {
		fetch(`${API_BASE_URL}/api/rooms`)
			.then((rooms) => rooms.json())
			.then(setRooms)
			.catch(() => {});
	}, []);

	const createBooking = async (roomId: string) => {
		const now = new Date();
		const start = new Date(now);
		start.setMinutes(start.getMinutes() + 5);
		const end = new Date(start);
		end.setMinutes(end.getMinutes() + 30);

		const res = await fetch(`${API_BASE_URL}/api/bookings`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				roomId,
				bookedBy: who || 'Anonymous',
				startUtc: start.toISOString(),
				endUtc: end.toISOString(),
			}),
		});

		const jsonResponse = await res.json();
		if (!res.ok) Alert.alert('Fel', jsonResponse.error || 'Något gick fel');
		else Alert.alert('Klart', `Bokning skapad: ${jsonResponse.id}`);
	};

	return (
		<SafeAreaView className='bg-black flex-1'>
			<View className='p-6 gap-4'>
				<Text className='text-white text-xl font-semibold'>
					Mötesrumsbokning (Mobile)
				</Text>
				<TextInput
					placeholder='Bokas av'
					placeholderTextColor='#9ca3af'
					value={who}
					onChangeText={setWho}
					className='h-12 px-3 rounded-xl border border-white/10 text-white'
				/>

				<View className='gap-3'>
					{rooms.map((r) => (
						<Pressable
							key={r.id}
							onPress={() => createBooking(r.id)}
							className='rounded-xl bg-zinc-900 border border-white/10 p-4'>
							<Text className='text-white'>{r.name}</Text>
							<Text className='text-zinc-400 text-sm'>Kapacitet: {r.capacity}</Text>
						</Pressable>
					))}
					{rooms.length === 0 && (
						<Text className='text-zinc-400'>
							Inga rum (starta web API och kontrollera API_BASE_URL)
						</Text>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}
