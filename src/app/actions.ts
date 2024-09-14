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
		return {
			message: "Booking created successfully",
		};
	} catch (error) {
		return {
			message: "An error occurred while creating the booking",
		};
	}
}