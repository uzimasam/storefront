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
		console.error(e);
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
	// link cart items to the booking
	const checkoutId = formData.get("cart") as string;
	const cartItems = formData.getAll("cartItems") as string[];
	const cartItems2 = cartItems.map((item) => JSON.parse(item));
	const cartItems3 = cartItems2[0] as { productName: string; variantName: string; quantity: number; price: number }[];
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
		return {
			message: "Failed to create booking",
			status: "error",
		};
	}

	const booking = parse.data.booking;

	try {
		await prisma.booking.create({
			data: booking,
		});
		for (const item of cartItems3) {
			await prisma.bookedItem.create({
				data: {
					product_name: item.productName,
					product_price: item.price,
					product_variant: item.variantName,
					quantity: item.quantity,
					bookingCode: booking.code,
				},
			});
		}
		try {
			// 👉Order placed. Sending payment request
			// make api call to request payment https://api.mypayd.app/api/v2/payments using basic auth
			const url = "https://api.mypayd.app/api/v2/payments";
			const username = process.env.MYPAYD_API_USERNAME;
			const password = process.env.MYPAYD_API_PASSWORD;
			const wallet = process.env.MYPAYD_WALLET;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Basic " + btoa(username + ":" + password),
				},
				body: JSON.stringify({
					username: wallet,
					network_code: "63902",
					amount: booking.amount,
					currency: "KES",
					phone_number: booking.phone_number,
					narration: " Payment Request at House of Qacym",
					callback_url: "https://houseofqacym.vercel.app/api/booking/callback/" + booking.code,
				}),
			});
			const data = await response.json() as { data: any; message: string; success: string; };
			let message = data.message;
			let status = "error";
			if (message === "STK Push is sent to customer") {
				message = "Payment request sent has been sent to your phone. Please check your phone to complete the payment";
				status = "success";
			} else {
				message = "An error occurred while requesting for payment. Please try again";
			}
			return {
				// message from the payment gateway
				message: message,
				status: status
			};
			// clear cart and display success message
			console.log("Checkout ID: ", checkoutId);
			// 👉Order successful. Redirecting to home page
		} catch (error) {
			return {
				message: "An error occurred while requesting for payment",
				status: "error",
			};
		}
	} catch (error) {
		console.error(error);
		return {
			message: "An error occurred while creating the booking",
			status: "error",
		};
	}
}