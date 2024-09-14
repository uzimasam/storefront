"use client";

type Props = {
	disabled?: boolean;
	className?: string;
};

export const CheckoutLink = ({ disabled, className = "" }: Props) => {
	return (
		<button
			data-testid="CheckoutLink"
			aria-disabled={disabled}
			type="submit"
			className={`inline-block max-w-full rounded border border-transparent bg-neutral-900 px-6 py-3 text-center font-medium text-neutral-50 hover:bg-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-500 sm:px-16 ${className}`}
		>
			Mpesa Checkout
		</button>
	);
};
