import Link from "next/link";
import Image from "next/image";

export async function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-neutral-300 bg-neutral-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">

				<div className="flex flex-col justify-between py-10 sm:flex-row">
					<p className="text-sm text-neutral-500">Copyright &copy; {currentYear} House of Qacym</p>
					<p className="flex gap-1 text-sm text-neutral-500">
						Created by{" "}
						<Link target={"_blank"} href={"https://github.com/uzimasam"}>
							Uzimasam
						</Link>{" "}
						<Link href={"https://github.com/uzimasam"} target={"_blank"} className={"opacity-30"}>
							<Image alt="Saleor github repository" height={20} width={20} src={"/github-mark.svg"} />
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
