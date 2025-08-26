/** @format */

import { SerializedTimeSlot } from '../../helpers/transform/TimeSlot.serialize';

export type RootStackParamList = {
	Splash: undefined;
	Main:
		| {
				roomConfirmation?: {
					kind: 'booked' | 'unbooked';
					room: string;
					start: Date;
					end: Date;
				};
		  }
		| undefined;
	Booking: { slot: SerializedTimeSlot };
};
