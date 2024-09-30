import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/app/components/email';
import prisma from '@/lib/server';

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

    // send email to the user via api route /api/client/send
    const resend = new Resend(process.env.RESEND_API_KEY);
    const email = booking.email;
    const firstName = booking.first_name;
    // create date in format 10th May 2023 from createdAt and time in format 10:00 AM
    const createdAt = new Date(booking.createdAt);
    const formattedDate = new Intl.DateTimeFormat('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    }).format(createdAt);

    const formattedTime = new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    }).format(createdAt);

    // get related cart items
    
    // fetch all the booked items for the booking code
    const bookedItems = await prisma.bookedItem.findMany({
        where: {
            bookingCode: booking.code,
        },
        select: {
            product_name: true,
            product_price: true,
            product_variant: true,
            quantity: true,
        }
    });
    const bookingDetails = {
        bookingId: booking.code,
        date: formattedDate,
        time: formattedTime,
        products: bookedItems.map((item) => ({
            name: item.product_name,
            variant: item.product_variant,
            quantity: item.quantity,
            amount: item.product_price
        })),
    };
    try {
        const { data, error } = await resend.emails.send(
            {
                from: "House of Qacym <onboarding@resend.dev>",
                to: [email],
                subject: "Booking Confirmation",
                react: EmailTemplate({
                    firstName: firstName,
                    bookingDetails,
                }),
            }
        );

        if (error) {
            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: {
                    "content-type": "application/json",
                },
            });
        }

        return new Response(JSON.stringify({ data }), {
            status: 200,
            headers: {
                "content-type": "application/json",
            },
        });
    }
    catch(error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
                "content-type": "application/json",
            },
        });
    }
    // send email to the admin via api route /api/admin/send

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