/** @format */

import { TextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & { maxChars?: number };

export const Input = ({ maxChars = 64, ...props }: Props) => {
	const [height, padding, radius, fontSize] = [40, 12, 8, 18];
	const [borderColor, color, placeHolderTextColor] = ['#8D8D8D', '#212121', '#868686'];

	return (
		<TextInput
			{...props}
			className={`h-[${height}px] px-[${padding}px] rounded-[${radius}px] border`}
			style={{
				borderColor,
				color,
				fontSize,
			}}
			placeholderTextColor={placeHolderTextColor}
			maxLength={maxChars}
		/>
	);
};

export default Input;
