/** @format */

import { Pressable, Text, ViewStyle } from 'react-native';

type Props = {
	label: string;
	size?: 'cover' | 'partial';
	disabled?: boolean;
	onPress?: () => void;
	style?: ViewStyle;
	maxChars?: number;
};

export const Button = ({
	label,
	size = 'cover',
	disabled = false,
	onPress,
	style,
	maxChars = 34,
}: Props) => {
	const width = size === 'cover' ? 'w-[345px] min-w-[144]' : 'w-[144px] min-w-[144px]';
	const bgColor = disabled ? 'bg-[#3c3c3c]' : 'bg-[#1d1d1d]';
	const safeSizeText =
		label.length > maxChars ? `${label.slice(0, maxChars - 1)}...` : label;

	return (
		<Pressable
			accessibilityRole='button'
			disabled={disabled}
			onPress={onPress}
			className={[
				width,
				`h-[48px] p-2 rounded-2xl border border-white/10 items-center justify-center`,
				bgColor,
			].join(' ')}
			style={style}>
			<Text
				className={`text-white text-[16px] text-center`}
				style={{
					letterSpacing: 0,
					lineHeight: 16,
				}}>
				{safeSizeText}
			</Text>
		</Pressable>
	);
};

export default Button;
