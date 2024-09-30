"use client";

import { useFormState, useFormStatus } from "react-dom";
import React, { useRef, useState } from "react";
import { createBooking } from "@/app/actions";

const initialState = {
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" aria-disabled={pending} className={`inline-block max-w-full rounded border border-transparent bg-neutral-900 px-6 py-3 text-center font-medium text-neutral-50 hover:bg-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-500 sm:px-16 w-full sm:w-1/3`} onClick={(e) => pending && e.preventDefault()}>
            {pending ? (
				<div className="inline-flex items-center">
					<svg
						className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span>Processing...</span>
				</div>
			) : (
				<span>Mpesa Checkout</span>
            )}
        </button>
    );
}

type CartItem = {
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
};
type CartItems = CartItem[];

interface BookingFormProps {
    amount: number;
    checkoutId: string;
    cartItems: CartItems;
}

export function BookingForm({amount, checkoutId, cartItems }: BookingFormProps) {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [state] = useFormState(createBooking, initialState );
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [serverResponse, setServerResponse] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        try {
            const response = await createBooking(initialState, formData);
            if (response.status === "error") {
                setIsError(true);
            }
            else{
                setIsSuccess(true);
            }
            setServerResponse(response.message);
        }
        catch (error) {
            console.error("error", error);
        }
    }


    return (
        <section>
            {isSuccess ? (
			    <article className="rounded-xl border-2 border-gray-100 bg-white mt-12">
                    <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                        <a href="/" className="block shrink-0">
                                <img alt="House of Qacym" src="/icon.svg" className="size-14 rounded-lg object-cover"/>
                        </a>
                        <div>
                            <h3 className="font-medium sm:text-lg">
                                <span className="hover:underline"> Your Order Has Been Placed</span>
                            </h3>
                            <p className="line-clamp-2 text-sm text-gray-700">
                                {serverResponse}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <strong className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-green-600 px-3 py-1.5 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                            <span className="text-[10px] font-medium sm:text-xs">Payment Request!</span>
                        </strong>
                    </div>
                </article>
            ) : (
                <div>
                <form action={handleSubmit} className="mt-12" ref={formRef}>
                    <input type="hidden" name="amount" value={amount} />
                    <input type="hidden" name="cart" value={checkoutId} />
                    <input type="hidden" name="cartItems" value={JSON.stringify(cartItems)} />
                    <div className="border-b border-t border-neutral-200 lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="bg-neutral-50 px-4 py-2">
			                <h1 className="mt-4 text-2xl font-bold text-neutral-900">Mpesa Checkout</h1>
                            <ul className="">
                                <li className="flex py-4">
                                    <div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 sm:h-32 sm:w-32">
                                        <img
                                            src="/mpesa1.png"
                                            alt="Mpesa Logo"
                                            width={200}
                                            height={200}
                                            className="h-full w-full object-contain object-center"
                                        />
                                    </div>
                                    <div className="relative flex flex-1 flex-col justify-between p-4 py-2">
                                        <div className="flex justify-between justify-items-start gap-4">
                                            <div>
                                                <h2 className="font-medium text-neutral-700">Mpesa Checkout</h2>
                                            </div>
                                            <p className="text-right font-semibold text-neutral-900">
                                                KES {amount}
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="mt-1 text-sm text-neutral-500">The phone number you provide <b>Should</b> be a valid M-Pesa number. Purchases made through this platform are strictly paid for via M-Pesa.</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="px-4 py-2">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 py-4">
                                <div className="rounded-lg">
                                    <label
                                        htmlFor="first_name"
                                        className="relative block overflow-hidden rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
                                    >
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            placeholder="First Name"
                                            autoComplete="given-name"
                                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                            required
                                        />
                                        <span
                                            className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
                                        >
                                            First Name
                                        </span>
                                    </label>
                                </div>
                                <div className="rounded-lg">
                                    <label
                                        htmlFor="last_name"
                                        className="relative block overflow-hidden rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
                                    >
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            placeholder="Last Name"
                                            autoComplete="family-name"
                                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                            required
                                        />
                                        <span
                                            className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
                                        >
                                            Last Name
                                        </span>
                                    </label>
                                </div>
                                <div className="rounded-lg">
                                    <label
                                        htmlFor="email"
                                        className="relative block overflow-hidden rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
                                    >
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Email"
                                            autoComplete="email"
                                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                            required
                                        />
                                        <span
                                            className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
                                        >
                                            Email
                                        </span>
                                    </label>
                                </div>
                                <div className="rounded-lg">
                                    <label
                                        htmlFor="phone_number"
                                        className="relative block overflow-hidden rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
                                    >
                                        <input
                                            type="text"
                                            id="phone_number"
                                            name="phone_number"
                                            placeholder="Phone Number"
                                            pattern="^(07|\+2547|2547|01|\+2541|2541|7|1)\d{8}$"
                                            autoComplete="tel"
                                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                            required
                                        />
                                        <span
                                            className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
                                        >
                                            Phone Number
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <p className="mt-1 text-sm text-neutral-500">The email you provide will be used to send you a receipt of your purchase and a link to track your order.</p>
                        </div>
                    </div>
                    <div className="mt-10 text-center">
                        <SubmitButton />
                        <output aria-live="polite" className="sr-only">
                            {state?.message}
                        </output>
                    </div>   
                </form>
                <div className="mt-4 text-center">
                    {isError && (
                        <div className="text-red-600">
                            {serverResponse}
                        </div>
                    )}
                </div>
                </div>
            )}
        </section>
    );
};