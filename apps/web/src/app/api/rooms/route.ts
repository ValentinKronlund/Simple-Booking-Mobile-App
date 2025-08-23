/** @format */

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
	const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } });
	return NextResponse.json(rooms);
}

export async function POST(req: Request) {
	const { name, capacity } = await req.json();
	if (!name || typeof capacity !== 'number') {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
	}

	const room = await prisma.room.create({ data: { name, capacity } });
	return NextResponse.json(room, { status: 201 });
}
