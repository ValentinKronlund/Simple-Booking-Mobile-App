/** @format */

import { addMinutes } from '@/helpers/formating/Date.formating';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type RoomStateLit = 'vacant' | 'occupied' | 'booked';
type SeedTimeSlot = {
	start: Date;
	end: Date;
	state: RoomStateLit;
	bookedBy?: string | null;
};
type SeedRoom = {
	name: string;
	capacity: number;
	availability: SeedTimeSlot[];
};

// -------------------- helpers --------------------

const addDays = (d: Date, n: number) => {
	const copy = new Date(d);
	copy.setDate(copy.getDate() + n);
	return copy;
};

const startOfDay = (d: Date) => {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
};

const rand = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const choice = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];

// Non-overlap check (half-open intervals [a,b))
const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
	aStart < bEnd && bStart < aEnd;

// Pick 2 non-overlapping slots within business hours, aligned to :00 or :30
function twoSlotsForDay(day: Date): SeedTimeSlot[] {
	// business hours 08:00–18:00
	const day0 = startOfDay(day);
	const earliestMin = 8 * 60; // 08:00
	const latestMin = 17 * 60 + 30; // 17:30 last possible start for a 30-min slot

	const mkSlot = (): SeedTimeSlot => {
		// random start aligned to 00 or 30
		const startMin = rand(earliestMin, latestMin);
		const alignedStartMin = startMin - (startMin % 30); // snap to :00 or :30
		const start = addMinutes(day0, alignedStartMin);

		// random duration 30 or 60 minutes
		const duration = choice([30, 60]);
		const end = addMinutes(start, duration);

		// a little variety: mostly vacant, sometimes booked/occupied
		const state: RoomStateLit = choice(
			// tweak weights by repeating
			['vacant', 'vacant', 'vacant', 'vacant', 'booked', 'occupied', 'occupied'],
		);
		const bookedBy =
			state === 'booked' || state === 'occupied'
				? choice([
						'A Cofee Addict',
						'Seed Bot',
						'The Boss',
						'Guest',
						'The Office Mascot',
						'A Really Important HR Meeting',
				  ])
				: null;

		return { start, end, state, bookedBy };
	};

	// ensure 2 slots don't overlap
	const s1 = mkSlot();
	let tries = 0;
	let s2 = mkSlot();
	while (overlaps(s1.start, s1.end, s2.start, s2.end) && tries < 20) {
		s2 = mkSlot();
		tries++;
	}
	// If still overlapping after many tries, push the 2nd by 60 minutes safely
	if (overlaps(s1.start, s1.end, s2.start, s2.end)) {
		s2.start = addMinutes(s1.end, 0);
		s2.end = addMinutes(s2.start, 30);
		s2.state = 'vacant';
		s2.bookedBy = null;
	}

	return [s1, s2];
}

// Build availability for 5 days back .. today .. 5 days forward (11 days)
function buildAvailability(): SeedTimeSlot[] {
	const today = startOfDay(new Date());
	const days: SeedTimeSlot[] = [];
	for (let offset = -5; offset <= 5; offset++) {
		const day = addDays(today, offset);
		const [a, b] = twoSlotsForDay(day);
		days.push(a, b);
	}
	// Sort by start
	days.sort((x, y) => x.start.getTime() - y.start.getTime());
	return days;
}

// -------------------- rooms --------------------

const rooms: SeedRoom[] = [
	{ name: 'Margret', capacity: 4, availability: [] },
	{ name: 'Steve', capacity: 6, availability: [] },
	{ name: 'Ada', capacity: 10, availability: [] },
	{ name: 'Edmund', capacity: 10, availability: [] },
	{ name: 'Grace', capacity: 20, availability: [] },
];

// Prepare availability for each room
for (const room of rooms) {
	room.availability = buildAvailability();
}

const toCreateData = (room: SeedRoom) => ({
	name: room.name,
	capacity: room.capacity,
	availability: {
		create: room.availability.map((s) => ({
			startUtc: s.start,
			endUtc: s.end,
			state: s.state,
			bookedBy: s.bookedBy ?? null,
		})),
	},
});

const toUpdateData = (room: SeedRoom) => ({
	capacity: room.capacity,
	availability: {
		deleteMany: {}, // idempotent reseeds
		create: room.availability.map((s) => ({
			startUtc: s.start,
			endUtc: s.end,
			state: s.state,
			bookedBy: s.bookedBy ?? null,
		})),
	},
});

// -------------------- main --------------------

async function main() {
	for (const room of rooms) {
		await prisma.room.upsert({
			where: { name: room.name },
			update: toUpdateData(room),
			create: toCreateData(room),
		});
	}

	// sanity check
	const sample = await prisma.room.findMany({
		orderBy: { name: 'asc' },
		take: 2,
		include: { availability: { orderBy: { startUtc: 'asc' }, take: 4 } },
	});
	console.dir(sample, { depth: 5 });
}

main()
	.catch((e) => {
		console.error('Seed failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
