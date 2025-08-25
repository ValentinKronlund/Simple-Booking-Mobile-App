/** @format */

import { addMinutes } from '@/helpers/formating/Time.formating';
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

const now = new Date();
now.setMinutes(0, 0, 0);

const seedAvailability: SeedTimeSlot[] = [
	{ start: now, end: addMinutes(now, 60), state: 'vacant' },
	{
		start: addMinutes(now, 60),
		end: addMinutes(now, 90),
		state: 'vacant',
		bookedBy: null,
	},
	{
		start: addMinutes(now, 1440),
		end: addMinutes(now, 1440 + 60),
		state: 'vacant',
		bookedBy: null,
	},
	{
		start: addMinutes(now, 1440 + 60),
		end: addMinutes(now, 1440 + 90),
		state: 'booked',
		bookedBy: 'You',
	},
	{
		start: addMinutes(now, 1440 + 90),
		end: addMinutes(now, 1440 + 120),
		state: 'occupied',
		bookedBy: 'The Boss',
	},
];

const rooms: SeedRoom[] = [
	{
		name: 'Margret',
		capacity: 4,
		availability: [...seedAvailability],
	},
	{
		name: 'Steve',
		capacity: 6,
		availability: [...seedAvailability],
	},
	{
		name: 'Ada',
		capacity: 10,
		availability: [...seedAvailability],
	},
	{
		name: 'Edmund',
		capacity: 10,
		availability: [...seedAvailability],
	},
	{
		name: 'Grace',
		capacity: 20,
		availability: [...seedAvailability],
	},
];

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
	});
	console.dir(sample, { depth: 3 });
}

main()
	.catch((e) => {
		console.error('Seed failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
