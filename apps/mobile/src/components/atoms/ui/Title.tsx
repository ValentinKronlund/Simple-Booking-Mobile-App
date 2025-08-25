/** @format */

import { Text, TextProps } from 'react-native';

type Variant = 'h1' | 'h2' | 'h3';
type Props = TextProps & {
	variant?: Variant;
	children: string;
	maxChars?: number;
};

const variantSpec = {
	h1: { size: 80, color: '#000', spacingPct: -0.03 },
	h2: { size: 40, color: '#000', spacingPct: -0.03 },
	h3: { size: 20, color: '#212121', spacingPct: -0.01 },
} as const;

export const Title = ({ variant = 'h2', children, maxChars = 34, ...rest }: Props) => {
	const spec = variantSpec[variant];
	const safeSizeText =
		children.length > maxChars ? `${children.slice(0, maxChars - 1)}...` : children;
	const letterSpacing = spec.size * spec.spacingPct;

	return (
		<Text
			{...rest}
			style={{
				fontSize: spec.size,
				color: spec.color,
				letterSpacing,
			}}>
			{safeSizeText}
		</Text>
	);
};

export default Title;
