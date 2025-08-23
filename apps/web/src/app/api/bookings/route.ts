/** @format */

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
	const now = new Date();
	const bookings = await prisma.booking.findMany({
		where: { endUtc: { gt: now } },
		orderBy: { startUtc: 'asc' },
		include: { room: true },
		take: 20,
	});

	return NextResponse.json(bookings);
}

export async function POST(req: Request) {
	const { roomId, bookedBy, startUtc, endUtc } = await req.json();
	if (!roomId || !bookedBy || !startUtc || !endUtc) {
		return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
	}

	const start = new Date(startUtc);
	const end = new Date(endUtc);

	if (!(start < end)) {
		return NextResponse.json({ error: 'Invalid time range' }, { status: 400 });
	}

	const overlapping = await prisma.booking.findFirst({
		where: { roomId, AND: [{ startUtc: { lt: end } }, { endUtc: { gt: start } }] },
		select: { id: true },
	});
	if (overlapping) {
		return NextResponse.json(
			{ error: 'Time slot overlaps an existing booking' },
			{ status: 409 },
		);
	}

	const booking = await prisma.booking.create({
		data: { roomId, bookedBy, startUtc: start, endUtc: end },
	});

	return NextResponse.json(booking, { status: 201 });
}
