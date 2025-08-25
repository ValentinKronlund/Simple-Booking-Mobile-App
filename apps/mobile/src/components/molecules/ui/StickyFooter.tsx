/** @format */

import React from 'react';
import { View, Text, ActivityIndicator, ViewProps } from 'react-native';
import Button from '../../atoms/ui/Button';
import { getFooterVisuals } from '../../../helpers/styling/Styles.helper';

type Props = {
	loading?: boolean;
	error?: string | null;
	primaryLabel: string;
	loadingLabel?: string;
	onPrimaryPress: () => void;
	disabled?: boolean;
} & ViewProps;

export default function StickyFooter({
	loading = false,
	error,
	primaryLabel,
	loadingLabel = 'Hämtar…',
	onPrimaryPress,
	disabled,
	className,
	style,
	...rest
}: Props) {
	const computedDisabled = disabled ?? loading;
	const visuals = getFooterVisuals(className);

	return (
		<View className={visuals.container} style={style} {...rest}>
			{error ? <Text className={visuals.error}>{error}</Text> : null}

			{loading ? (
				<View className={visuals.loading}>
					<ActivityIndicator />
				</View>
			) : null}

			<Button
				label={loading ? loadingLabel : primaryLabel}
				onPress={onPrimaryPress}
				disabled={computedDisabled}
			/>
		</View>
	);
}
