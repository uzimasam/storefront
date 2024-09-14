"use client";

import { createBooking } from "@/app/actions";
import { useFormState, useFormStatus } from "react-dom";

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

export function BookingForm({ amount }: { amount: number }) {
    const [state, formAction] = useFormState(createBooking, initialState);

    return (
        <form action={formAction} className="mt-12">
            <input type="hidden" name="amount" value={amount} />
            <div className="rounded border bg-neutral-50 px-4 py-2 mt-12">
                <div className="bg-neutral-50 px-4 py-2">
                    <p className="mt-1 text-sm text-neutral-500">Fill in your details below accurately to proceed to checkout.</p>
                    <p className="mt-1 text-sm text-neutral-500">The email you provide will be used to send you a receipt of your purchase and a link to track your order.</p>
                    <p className="mt-1 text-sm text-neutral-500">The phone number you provide <b>Should</b> be a valid M-Pesa number. Purchases made through this platform are strictly paid for via M-Pesa.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 py-4">
                    <div className="rounded-lg">
                        <label
                            htmlFor="first_name"
                            className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black"
                        >
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="First Name"
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
                            className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black"
                        >
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Last Name"
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
                            className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black"
                        >
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Email"
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
                            className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black"
                        >
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Phone Number"
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
            </div>
            <div className="mt-10 text-center">
                <SubmitButton />
                <output aria-live="polite" className="sr-only">
                    {state?.message}
                </output>
            </div>   
    </form>
  );
};