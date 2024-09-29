import prisma from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_: NextRequest, { params }: { params: { code: string } }) {
    const { code } = params;
    // find the booking with the code and update the status to "actioned" using prisma
    // find booking first
    const booking = await prisma.booking.findUnique({
        where: {
            code,
        },
    });
    if (!booking) {
        return new NextResponse(
            JSON.stringify({
                message: "Booking of code " + (code || "unknown") + " not found",
            }),
            {
                status: 404,
                headers: {
                    "content-type": "application/json",
                },
            }
        );
    }
    // update booking status to processing
    await prisma.booking.update({
        where: {
            code,
        },
        data: {
            status: "processing",
        },
    });

    return new NextResponse(
        JSON.stringify({
            message: "Booking of code " + (code || "unknown") + " has been actioned",
        }),
        {
            status: 200,
            headers: {
                "content-type": "application/json",
            },
        }
    );
}