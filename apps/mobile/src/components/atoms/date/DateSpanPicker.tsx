/** @format */

import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Title from '../ui/Title';

type Props = {
	span: Date[]; // REQUIRED list of days to display
	onPrev: () => void;
	onNext: () => void;
};

export default function DateSpanPicker({ span, onPrev, onNext }: Props) {
	const label = `${span[0].toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
	})} - ${span[2].toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
	})}`;

	return (
		<View className='flex-row items-center justify-between'>
			<Pressable
				onPress={onPrev}
				className='w-[24px] h-[24px] rounded-full items-center justify-center bg-white border border-black'>
				<Ionicons name='arrow-back' size={14} color='#000' />
			</Pressable>

			<Title variant='h3'>{label}</Title>

			<Pressable
				onPress={onNext}
				className='w-[24px] h-[24px] rounded-full items-center justify-center bg-white border border-black'>
				<Ionicons name='arrow-forward' size={14} color='#000' />
			</Pressable>
		</View>
	);
}
