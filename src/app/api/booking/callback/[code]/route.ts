import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AdminEmail, ClientEmail } from '@/app/components/email';
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    const email = booking.email;
    // get admin email from env
    const adminmail = process.env.ADMIN_EMAIL || "uzimasamuel1@gmail.com";
    const firstName = booking.first_name;
    const fullName = booking.first_name + " " + booking.last_name;
    const phoneNumber = booking.phone_number;
    const location = booking.location;
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
                react: ClientEmail({
                    firstName: firstName,
                    fullName: fullName,
                    email: email,
                    phoneNumber: phoneNumber,
                    location: location,
                    bookingDetails,
                }),
            }
        );

        if (error) {
            console.error(error);
        }
        else {
            console.log(data);
        }
    }
    catch(error) {
        console.error(error);
    }

    try {
        const { data, error } = await resend.emails.send(
            {
                from: "House of Qacym <onboarding@resend.dev>",
                to: [adminmail],
                subject: "New Booking",
                react: AdminEmail({
                    firstName: firstName,
                    fullName: fullName,
                    email: email,
                    phoneNumber: phoneNumber,
                    location: location,
                    bookingDetails,
                }),
            }
        );

        if (error) {
            console.error(error);
        }
        else {
            console.log(data);
        }
    }
    catch(error) {
        console.error(error);
    }

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