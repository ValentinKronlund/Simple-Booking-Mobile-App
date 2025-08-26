/** @format */

// components/molecules/ui/Toast.tsx
/** @format */
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

type Props = {
	visible: boolean;
	message: string;
	duration?: number; // ms
	onHide?: () => void;
};

export default function Toast({ visible, message, duration = 3000, onHide }: Props) {
	useEffect(() => {
		if (!visible) return;
		const t = setTimeout(() => onHide?.(), duration);
		return () => clearTimeout(t);
	}, [visible, duration, onHide]);

	if (!visible) return null;

	return (
		<Animated.View
			entering={FadeInUp.springify().mass(0.3)}
			exiting={FadeOutDown.duration(220)}
			pointerEvents='none'
			className='absolute left-0 right-0 items-center'
			style={{ bottom: 100 }}>
			<View className='bg-black/90 px-4 py-3 rounded-full'>
				<Text className='text-white text-sm'>{message}</Text>
			</View>
		</Animated.View>
	);
}
