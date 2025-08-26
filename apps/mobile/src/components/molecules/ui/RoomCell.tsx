/** @format */

import { Pressable, View, Text } from 'react-native';
import type { TimeSlotRender } from '../../../types/types';
import { FormatTime_FourDigits } from '../../../helpers/formating/Date.formating';
import {
	combineClasses,
	getCellStateVisuals,
} from '../../../helpers/styling/Styles.helper';

type Props = {
	slot: TimeSlotRender;
	selected?: boolean;
	onPress?: (timeSlotCell: TimeSlotRender) => void;
};

export default function RoomCell({ slot, selected, onPress }: Props) {
	const { name, capacity, start, end, state } = slot;
	const visual = getCellStateVisuals(state);

	const selectedStyle = selected
		? { backgroundColor: '#acd8f5', borderColor: '#085169' }
		: undefined;
	const primaryText = selected ? 'text-[#1C1B1F]' : visual.primary;
	const secondaryText = selected ? 'text-sm text-[#1C1B1F]/60' : visual.secondary;

	return (
		<Pressable
			onPress={() => onPress?.(slot)}
			accessibilityRole='button'
			className={visual.container}
			style={selectedStyle}>
			<View className='mb-1 flex-row flex-wrap gap-x-3'>
				<Text className={primaryText}>{name}</Text>
				<Text className={secondaryText}>{`(${capacity})`}</Text>
			</View>

			<View className='flex-row items-center justify-between'>
				<Text className={primaryText}>
					{FormatTime_FourDigits(start)}–{FormatTime_FourDigits(end)}
				</Text>
			</View>
		</Pressable>
	);
}
