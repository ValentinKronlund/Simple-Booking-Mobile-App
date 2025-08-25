/** @format */

import { View, Text } from 'react-native';
import { swedishShort } from '../../../helpers/formating/Date.formating';
import { getRowHeaderVisuals } from '../../../helpers/styling/Styles.helper';

type Props = {
	date: Date;
	isFirst?: boolean;
	isLast?: boolean;
};

export default function ColumnHeader({ date, isFirst, isLast }: Props) {
	const visuals = getRowHeaderVisuals({ isFirst, isLast });
	return (
		<View className={visuals.container}>
			<Text className={visuals.primary}>{swedishShort(date)}</Text>
		</View>
	);
}
