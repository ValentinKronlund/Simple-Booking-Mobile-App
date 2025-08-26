/** @format */

import { Pressable, ScrollView, View, Text } from 'react-native';
import { TimeSlotRender } from '../../../types/types';
import RoomCell from '../ui/RoomCell';
import ColumnHeader from '../ui/RowHeader';
import { dayKey, FormatTime_FourDigits } from '../../../helpers/formating/Date.formating';
import { getTableBodyVisuals } from '../../../helpers/styling/Styles.helper';

type Props = {
	data: Array<{
		date: Date;
		items: TimeSlotRender[];
	}>;
	onToggleCell: (cell: TimeSlotRender) => void;
	minHeight?: number;
	selectedId?: string;
};

export default function DateSpanContainer({
	data,
	onToggleCell,
	minHeight = 448,
	selectedId,
}: Props) {
	return (
		<View
			className='flex-1 mt-3 border border-[#E0E0E0] rounded-xl'
			style={{ minHeight }}>
			<View className='flex-row flex-1'>
				{data.map(({ date, items }, i) => {
					const isFirst = i === 0;
					const isLast = i === data.length - 1;
					const containerVisuals = getTableBodyVisuals({ isFirst, isLast });

					return (
						<View key={`${i}_${dayKey(date)}`} className='flex-1'>
							{/* Column header */}
							<ColumnHeader date={date} isFirst={isFirst} isLast={isLast} />

							{/* Column body with independent scroll */}
							<View className={containerVisuals}>
								<ScrollView
									contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
									showsVerticalScrollIndicator={false}>
									{items.length === 0 ? (
										<Text className='text-[#9E9E9E] text-center py-6'>
											— Inget tillgängligt —
										</Text>
									) : (
										items.map((slot, idx) => (
											<RoomCell
												key={`${idx}_${slot.id}`}
												slot={slot}
												selected={slot.id === selectedId}
												onPress={(s) => onToggleCell(s)}
											/>
										))
									)}
								</ScrollView>
							</View>
						</View>
					);
				})}
			</View>
		</View>
	);
}
