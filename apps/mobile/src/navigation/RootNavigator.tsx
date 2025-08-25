/** @format */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import MainScreen from '../screens/MainScreen';
import { RootStackParamList } from './types/types';
import BookingScreen from '../screens/BookingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
				<Stack.Screen name='Splash' component={SplashScreen} />
				<Stack.Screen name='Main' component={MainScreen} />
				<Stack.Screen name='Booking' component={BookingScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
