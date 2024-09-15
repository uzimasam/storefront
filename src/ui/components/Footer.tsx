export async function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-neutral-300 bg-neutral-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="text-center py-10">
					<p className="text-sm text-neutral-500">Copyright &copy; {currentYear} House of Qacym</p>
				</div>
			</div>
		</footer>
	);
}
