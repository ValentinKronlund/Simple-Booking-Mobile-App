/** @format */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const rooms = [
		{ name: 'Margret', capacity: 4 },
		{ name: 'Steve', capacity: 6 },
		{ name: 'Ada', capacity: 10 },
		{ name: 'Edmund', capacity: 10 },
		{ name: 'Grace', capacity: 20 },
	];

	for (const room of rooms) {
		await prisma.room.upsert({
			where: { name: room.name },
			update: {},
			create: room,
		});
	}
}

main().finally(() => prisma.$disconnect());
