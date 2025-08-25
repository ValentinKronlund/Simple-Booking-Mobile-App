/** @format */

import { ReactNode } from 'react';
import { Modal, View, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Button from '../../atoms/ui/Button';

type Props = {
	visible: boolean;
	onClose?: () => void;
	blurBackground: boolean;
	fullScreen?: boolean;
	children: ReactNode;
	buttons?: { label: string; onPress: () => void; disabled?: boolean }[]; // max 2
};

export default function Popup({
	visible,
	onClose,
	blurBackground,
	fullScreen,
	children,
	buttons = [],
}: Props) {
	const shell = (
		<View
			className={[
				fullScreen ? 'w-full h-full' : 'w-[345px]',
				'bg-[#ECECEC] rounded-[8px]',
			].join(' ')}
			style={{
				paddingHorizontal: 16,
				paddingVertical: 32,
				...(fullScreen
					? {}
					: {
							borderColor: '#BDBDBD',
							borderWidth: 1,
							shadowColor: '#424242',
							shadowOpacity: 0.35,
							shadowOffset: { width: 0, height: 4 },
							shadowRadius: 16,
							elevation: Platform.OS === 'android' ? 6 : 0,
					  }),
			}}>
			{children}
			{buttons.length > 0 && (
				<View className='mt-4 flex-row gap-3'>
					{buttons.slice(0, 2).map((b, i) => (
						<Button key={i} label={b.label} onPress={b.onPress} disabled={b.disabled} />
					))}
				</View>
			)}
		</View>
	);

	return (
		<Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
			{blurBackground ? (
				<BlurView intensity={40} className='flex-1 items-center justify-center'>
					<Pressable className='absolute inset-0' onPress={onClose} />
					{shell}
				</BlurView>
			) : (
				<View className='flex-1 items-center justify-center bg-black/40'>
					<Pressable className='absolute inset-0' onPress={onClose} />
					{shell}
				</View>
			)}
		</Modal>
	);
}
