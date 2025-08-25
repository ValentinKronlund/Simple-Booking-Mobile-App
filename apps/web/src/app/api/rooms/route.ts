/** @format */

// app/api/rooms/route.ts
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
	const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } });
	const times = await prisma.timeSlot.findMany({
		where: { roomId: { in: rooms.map((r) => r.id) } },
		orderBy: { startUtc: 'asc' },
	});
	const byRoom = times.reduce(
		(m, t) => ((m[t.roomId] ||= []).push(t), m),
		{} as Record<string, typeof times>,
	);
	const payload = rooms.map((r) => ({
		id: r.id,
		name: r.name,
		capacity: r.capacity,
		availability: (byRoom[r.id] ?? []).map((s) => ({
			start: s.startUtc,
			end: s.endUtc,
			state: s.state,
			...(s.bookedBy ? { bookedBy: s.bookedBy } : {}),
		})),
	}));
	return NextResponse.json(payload);
}
