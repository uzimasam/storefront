import Image from "next/image";
import { DeleteLineButton } from "./DeleteLineButton";
import { BookingForm } from "./BookingForm";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export const metadata = {
	title: "Shopping Cart · House of Qacym",
};

export default async function Page({ params }: { params: { channel: string } }) {
	const checkoutId = Checkout.getIdFromCookies(params.channel);

	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return (
			<section className="mx-auto max-w-7xl p-8">
				<h1 className="mt-8 text-3xl font-bold text-neutral-900">Your Shopping Cart is empty</h1>
				<p className="my-12 text-sm text-neutral-500">
					Looks like you haven’t added any items to the cart yet.
				</p>
				<LinkWithChannel
					href="/products"
					className="inline-block max-w-full rounded border border-transparent bg-neutral-900 px-6 py-3 text-center font-medium text-neutral-50 hover:bg-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-500 sm:px-16"
				>
					Explore products
				</LinkWithChannel>
			</section>
		);
	}

	const cartItems = checkout.lines.map((item) => ({
		productName: item.variant?.product?.name,
		variantName: item.variant.name,
		quantity: item.quantity,
		price: item.totalPrice.gross.amount,
	}));

	return (
		<section className="mx-auto max-w-7xl p-8">
			<h1 className="mt-8 text-3xl font-bold text-neutral-900">Your Shopping Cart</h1>
			<ul
            	data-testid="CartProductList"
            	className="divide-y divide-neutral-200 border-b border-t border-neutral-200"
        	>
				{checkout.lines.map((item) => (
					<li key={item.id} className="flex py-4">
						<div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 sm:h-32 sm:w-32">
							{item.variant?.product?.thumbnail?.url && (
								<Image
									src={item.variant.product.thumbnail.url}
									alt={item.variant.product.thumbnail.alt ?? ""}
									width={200}
									height={200}
									className="h-full w-full object-contain object-center"
								/>
							)}
						</div>
						<div className="relative flex flex-1 flex-col justify-between p-4 py-2">
							<div className="flex justify-between justify-items-start gap-4">
								<div>
									<LinkWithChannel
										href={getHrefForVariant({
											productSlug: item.variant.product.slug,
											variantId: item.variant.id,
										})}
									>
										<h2 className="font-medium text-neutral-700">{item.variant?.product?.name}</h2>
									</LinkWithChannel>
									<p className="mt-1 text-sm text-neutral-500">{item.variant?.product?.category?.name}</p>
									{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
										<p className="mt-1 text-sm text-neutral-500">Variant: {item.variant.name}</p>
									)}
								</div>
								<p className="text-right font-semibold text-neutral-900">
									{formatMoney((item.totalPrice.gross.amount), "KES")}
								</p>
							</div>
							<div className="flex justify-between">
								<div className="text-sm font-bold">Qty: {item.quantity}</div>
								<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
							</div>
						</div>
					</li>
				))}
			</ul>

				
			<div className="mt-12">
				<div className="rounded border bg-neutral-50 px-4 py-4">
					<div className="flex items-center justify-between gap-2 p7-2">
						<div>
							<p className="font-semibold text-neutral-900">Your Total</p>
						</div>
						<div className="font-medium text-neutral-900">
							{formatMoney((checkout.totalPrice.gross.amount), "KES")}
							<p className="text-sm text-neutral-500">Inclusive of all taxes</p>
						</div>
					</div>
				</div>
			</div>
			<BookingForm amount={(checkout.totalPrice.gross.amount)} checkoutId={checkoutId} cartItems={cartItems} />
		</section>
	);
}
