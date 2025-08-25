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

	return (
		<Pressable
			onPress={() => onPress?.(slot)}
			accessibilityRole='button'
			className={combineClasses(
				visual.container,
				selected ? 'border-[#085169] bg-[#acd8f5]' : '',
			)}>
			<View className='mb-1 flex-row flex-wrap gap-x-3'>
				<Text className={visual.primary}>{name}</Text>
				<Text className={visual.secondary}>{`(${capacity})`}</Text>
			</View>

			<View className='flex-row items-center justify-between'>
				<Text className={visual.primary}>
					{FormatTime_FourDigits(start)}–{FormatTime_FourDigits(end)}
				</Text>
			</View>
		</Pressable>
	);
}
