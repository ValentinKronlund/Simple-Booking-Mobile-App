/** @format */

import { SerializedTimeSlot } from '../../helpers/transform/TimeSlot.serialize';

export type RootStackParamList = {
	Splash: undefined;
	Main: undefined;
	Booking: { slot: SerializedTimeSlot };
};
