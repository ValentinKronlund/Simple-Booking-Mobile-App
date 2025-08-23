/** @format */

import { Platform } from 'react-native';

const envUrl = process.env.EXPO_PUBLIC_API_URL;

const defaultUrl =
	Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = envUrl || defaultUrl;
