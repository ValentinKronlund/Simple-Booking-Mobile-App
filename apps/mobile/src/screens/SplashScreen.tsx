/** @format */

import { SafeAreaView, View } from 'react-native';
import Button from '../components/atoms/ui/Button';
import Title from '../components/atoms/ui/Title';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen = ({ navigation }: Props) => {
	return (
		<SafeAreaView className='flex-1'>
			<View className='flex-1 px-6 pt-10 pb-6 justify-between'>
				<View className='flex-1'>
					<Title variant='h1'>Boka ett rum</Title>
				</View>
				<View className='gap-3'>
					<Button label='Boka' onPress={() => navigation.replace('Main')} />
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SplashScreen;
