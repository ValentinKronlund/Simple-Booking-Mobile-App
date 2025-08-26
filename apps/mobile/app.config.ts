/** @format */

export default {
	expo: {
		name: 'mobile',
		slug: 'mobile',
		extra: {
			apiUrl: 'http://192.168.1.77:3000', //<--- Update this to your machines IP
		},
		plugins: ['expo-font'],
	},
} as const;
