/** @format */

import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../atoms/ui/Button';

type Props = {
	items: string[];
	selectedItems?: string[] | null;
	onSelect: (value: string) => void;
	onClear: () => void;
	width?: number;
};

export default function Dropdown({
	items,
	selectedItems,
	onSelect,
	onClear,
	width = 164,
}: Props) {
	const [open, setOpen] = useState(false);
	const [mySelectedItems, setMySelectedItems] = useState<Props['items']>([]);

	return (
		<>
			<Pressable
				accessibilityRole='menubar'
				accessibilityLabel='Filter'
				onPress={() => setOpen(true)}
				className='h-[45px] rounded-[8px] border flex-row items-center justify-between'
				style={{ borderColor: '#BDBDBD', paddingHorizontal: 16, width }}>
				<Text className='text-[18px]' style={{ color: '#212121' }}>
					{selectedItems && selectedItems.length
						? `${selectedItems?.length} valda rum`
						: `Mötesrum`}
				</Text>
				<Ionicons name='chevron-down' size={24} color='#212121' />
			</Pressable>

			<Modal
				visible={open}
				transparent
				animationType='fade'
				onRequestClose={() => setOpen(false)}>
				<Pressable className='flex-1 pt-[152px]' onPress={() => setOpen(false)}>
					<View
						className='mx-6 mt-24 rounded-[8px] bg-white p-3 shadow items-center'
						style={{ borderColor: '#BDBDBD', borderWidth: 1 }}>
						<FlatList
							className='w-[315px] mt-[4px] mb-[32px]'
							data={items}
							keyExtractor={(s) => s}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => {
										onSelect(item);
									}}
									className='flex-row my-[8px] mx-[8px] items-center justify-between'>
									<Text
										className='text-[18px]'
										numberOfLines={1}
										ellipsizeMode='tail'
										style={{
											color: '#212121',
											letterSpacing: -0.16, // -1%
											lineHeight: 16 * 1.2,
										}}>
										{item}
									</Text>
									<View className='w-[22px] h-[22px] border border-[#757575] rounded-sm items-center justify-center'>
										{selectedItems?.includes(item) ? (
											<Ionicons name='checkmark-outline' size={20} color={'#004D40'} />
										) : (
											<></>
										)}
									</View>
								</Pressable>
							)}
						/>
						<View className='flex-row w-[305px] item-center justify-between'>
							<Button label={'Välj'} size='partial' onPress={() => setOpen(false)} />
							<Button
								label={'Avmarkera'}
								size='partial'
								disabled={!selectedItems?.length}
								onPress={() => onClear()}
							/>
						</View>
					</View>
				</Pressable>
			</Modal>
		</>
	);
}
