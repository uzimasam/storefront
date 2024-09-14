"use server";

import { z } from "zod";
import { getServerAuthClient } from "@/app/config";
import prisma from "@/lib/server";

export async function logout() {
	"use server";
	getServerAuthClient().signOut();
}

export async function createBooking(
	prevState: {
		message: string;
	},
	formData: FormData
) {
	try{
		prevState.message = "";
	}
	catch(e){
		console.log(e);
	}
	const schema = z.object({
		booking: z.object({
			code: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			email: z.string(),
			phone_number: z.string(),
			amount: z.number(),
			status: z.string()
		}),
	});

	// generate a new booking code in the format XXXX-XXXX where X is a random uppercase letter or number
	const code1 = Array.from({ length: 4 }, () =>
		Math.random().toString(36)[2].toUpperCase()
	).join("");
	const code2 = Array.from({ length: 4 }, () =>
		Math.random().toString(36)[2].toUpperCase()
	).join("");
	const code = `${code1}-${code2}`;

	const parse = schema.safeParse({
		booking: {
			code: code,
			first_name: formData.get("first_name") as string,
			last_name: formData.get("last_name") as string,
			email: formData.get("email") as string,
			phone_number: formData.get("phone_number") as string,
			amount: Number(formData.get("amount")),
			status: "pending"
		},
	});


	if (!parse.success) {
		console.log("Failed to create booking", parse.error);
		return {
			message: "Failed to create booking",
		};
	}

	const booking = parse.data.booking;

	try {
		await prisma.booking.create({
			data: booking,
		});
		// make api call to request payment https://api.mypayd.app/api/v2/payments using basic auth
		const url = "https://api.mypayd.app/api/v2/payments";
		const username = process.env.MYPAYD_API_USERNAME;
		const password = process.env.MYPAYD_API_PASSWORD;
		const wallet = process.env.MYPAYD_WALLET;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${btoa(`${username}:${password}`)}`,
			},
			body: JSON.stringify({
				username: wallet,
				network_code: "63902",
				amount: booking.amount,
				currency: "KES",
				phone_number: booking.phone_number,
				narration: " Payment Request at House of Qacym",
				callback_url: "https://houseofqacym.vercel.app/api/callback/" + booking.code,
			}),
		});
		const data = await response.json() as { message: string };
		console.log(data);
		return {
			// message from the payment gateway
			message: data.message,
		};
	} catch (error) {
		return {
			message: "An error occurred while creating the booking",
		};
	}
}