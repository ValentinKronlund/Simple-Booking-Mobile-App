<!-- @format -->

Simple Booking — Mobile + Web
Repo: https://github.com/ValentinKronlund/Simple-Booking-Mobile-App.git

Monorepo: Next.js API (Prisma + SQLite) + React Native app (Expo + NativeWind + Reanimated).
Mobile books/unbooks meeting-room time slots persisted by the web API.

────────────────────────────────────────

## STRUCTURE

```
apps/
web/ # Next.js (App Router) + Prisma + SQLite
prisma/
schema.prisma
seed.ts
src/app/api/
rooms/route.ts # GET rooms
slots/route.ts # PATCH slot { state, bookedBy }
mobile/ # Expo (React Native)
app.config.ts
babel.config.js
src/
config/api.ts # resolves API base URL (LAN/env/fallback)
...
```

### PREREQS

- Node 18+ (or 20+)
- npm
- Xcode (for iOS simulator)
- Expo CLI (use: npx expo)

────────────────────────────────────────

## FRESH CLONE & RUN

1. Clone & install
   git clone https://github.com/ValentinKronlund/Simple-Booking-Mobile-App.git
   cd Simple-Booking-Mobile-App
   npm install

2. Web API (DB + server)
   cd apps/web
   cp .env.example .env # DATABASE_URL="file:./dev.db"
   npm run db:migrate # prisma migrate dev
   npm run db:seed # prisma db seed
   npm run dev # serves on http://0.0.0.0:3000 (LAN)

3. Mobile (Expo)

### new terminal

cd apps/mobile
npx expo start -c # press "i" for iOS simulator

- Simulator: uses http://localhost:3000 automatically.
- Physical phone (same Wi-Fi): set API to your laptop’s LAN IP (see below).
- macOS: allow firewall for Node/Next.

────────────────────────────────────────

## MOBILE API BASE URL

### Resolution order:

1. app.config.ts → expo.extra.apiUrl
2. EXPO_PUBLIC_API_URL env
3. Fallbacks:
   - iOS simulator → http://localhost:3000
   - Android emulator → http://10.0.2.2:3000

### apps/mobile/app.config.ts

export default {
expo: {
name: 'mobile',
slug: 'mobile',
extra: {
// Set to your laptop LAN IP for real device testing:
apiUrl: 'http://<YOUR_LAN_IP_HERE>:3000',
},
plugins: ['expo-font'],
},
} as const;

### apps/mobile/src/config/api.ts

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const extraUrl = (Constants?.expoConfig?.extra as any)?.apiUrl as string | undefined;
const envUrl = process.env.EXPO_PUBLIC_API_URL;
const defaultUrl =
Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = extraUrl || envUrl || defaultUrl;

Sanity check (phone): open http://<LAN_IP>:3000/api/rooms in the browser; JSON should load.

────────────────────────────────────────

## PRISMA / DATABASE

- DB: SQLite (dev.db) — ensure dev.db is gitignored.
- Seed: 2 random slots per room per day (5 days back, today, 5 days forward).

From apps/web:
npm run db:migrate
npm run db:seed

### or full reset:

npm run db:reset # prisma migrate reset --force

────────────────────────────────────────

## PI ENDPOINTS

### GET /api/rooms

→ list rooms with availability

### PATCH /api/slots

Body (server accepts start or startUtc):
{
"roomId": "room_cuid",
"startUtc": "2025-08-26T10:00:00.000Z",
"state": "booked" | "vacant" | "occupied",
"bookedBy": "Name" // "" clears the field
}

Dev CORS is permissive (Access-Control-Allow-Origin: \*). Tighten for prod.

────────────────────────────────────────

## EXPO / NATIVEWIND / REANIMATED

### apps/mobile/babel.config.js (must be .js, reanimated plugin LAST)

module.exports = function (api) {
api.cache(true);
return {
presets: [
['babel-preset-expo', { jsxImportSource: 'nativewind' }],
'nativewind/babel',
],
plugins: ['react-native-reanimated/plugin'],
};
};

or (if above doesn't work)

module.exports = function (api) {
api.cache(true);
return {
presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
plugins: ['nativewind/babel', 'react-native-reanimated/plugin'],
};
};

### apps/mobile/App.tsx (first import)

import 'react-native-reanimated';

Restart Expo after config changes:
npx expo start -c

────────────────────────────────────────

## TROUBLESHOOTING

- Phone can’t reach API:
  • Web must run on 0.0.0.0
  • Set mobile URL to LAN IP (app.config.ts or EXPO_PUBLIC_API_URL)
  • Allow macOS firewall
  • Test http://<LAN_IP>:3000/api/rooms on phone

- CORS:
  • Ensure API routes respond to OPTIONS and include Access-Control-Allow-Origin: \*

- Android emulator:
  • Use http://10.0.2.2:3000

- Reanimated/animations not working:
  • Plugin last in Babel
  • import 'react-native-reanimated' first in App.tsx
  • Clear cache: npx expo start -c

- Stale Metro cache:
  • npx expo start -c
