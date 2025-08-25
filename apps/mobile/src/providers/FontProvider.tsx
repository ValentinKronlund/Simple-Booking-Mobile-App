/** @format */

import { ReactNode, useEffect } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';

export default function FontProvider({ children }: { children: ReactNode }) {
	const [loaded] = useFonts({ Roboto: Roboto_400Regular });

	useEffect(() => {
		if (!loaded) return;

		const apply = (Comp: any) => {
			Comp.defaultProps ??= {};
			const prev = Comp.defaultProps.style;
			Comp.defaultProps.style = [prev, { fontFamily: 'Roboto' }].filter(Boolean);
			Comp.defaultProps.allowFontScaling = false;
		};

		apply(Text);
		apply(TextInput);
	}, [loaded]);

	if (!loaded) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'black',
				}}>
				<ActivityIndicator />
				<Text style={{ color: 'white', marginTop: 12 }}>Loading…</Text>
			</View>
		);
	}

	return <>{children}</>;
}
