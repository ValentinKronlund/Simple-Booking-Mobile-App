/** @format */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient, RoomState } from '@prisma/client';

const prisma = new PrismaClient();

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'OPTIONS, PATCH',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function OPTIONS() {
	return new NextResponse(null, { headers: corsHeaders });
}

const Body = z.object({
	roomId: z.string().min(1),
	startUtc: z.union([z.string(), z.number(), z.date()]).transform((v) => new Date(v)),
	state: z.nativeEnum(RoomState).optional(),
	bookedBy: z.string().optional(),
});

export async function PATCH(req: Request) {
	try {
		const json = await req.json();
		const { roomId, startUtc, state, bookedBy } = Body.parse(json);

		const updated = await prisma.timeSlot.update({
			where: { roomId_startUtc: { roomId, startUtc } },
			data: {
				...(state !== undefined ? { state } : {}),
				...(json.hasOwnProperty('bookedBy') ? { bookedBy: bookedBy || undefined } : {}),
			},
		});

		return NextResponse.json(updated, { headers: corsHeaders });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		const msg = err?.message ?? 'Bad Request';
		const code = msg.includes('Record to update not found') ? 404 : 400;
		return new NextResponse(JSON.stringify({ error: msg }), {
			status: code,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}
