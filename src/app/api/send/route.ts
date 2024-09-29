import { EmailTemplate } from '@/app/components/email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    try {
        const { data, error } = await resend.emails.send(
            {
                from: "House of Qacym <onboarding@resend.dev>",
                to: ["uzimasamuel1@gmail.com"],
                subject: "Booking Confirmation",
                react: EmailTemplate({
                    firstName: "Samuel",
                    bookingDetails: {
                        bookingId: "123456",
                        date: "2021-10-10",
                        time: "10:00 AM",
                        products: [
                            {
                                name: "Shoe",
                                quantity: 1,
                                amount: 1000,
                            },
                            {
                                name: "Samsung Galaxy",
                                quantity: 2,
                                amount: 2000,
                            },
                        ],
                    },
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
    catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
                "content-type": "application/json",
            },
        });
    }
}