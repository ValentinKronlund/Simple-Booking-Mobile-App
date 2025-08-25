/** @format */

import FontProvider from './src/providers/FontProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { RoomsProvider } from './src/context/RoomsContext';
import './global.css';

export default function App() {
	return (
		<FontProvider>
			<RoomsProvider>
				<RootNavigator />
			</RoomsProvider>
		</FontProvider>
	);
}
