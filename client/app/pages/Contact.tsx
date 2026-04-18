export default function Contact() {
	return (
		<main className="min-h-screen px-6 py-10 md:px-12 lg:px-20">
			<section className="mx-auto max-w-7xl rounded-[2rem] border border-sky-100 bg-white/85 p-8 shadow-xl backdrop-blur md:p-12">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
					Contact Team
				</p>
				<h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
					Talk to sales, support, or onboarding.
				</h1>
				<p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
					Whether you are launching your first venue or migrating multiple
					locations, our team helps you set up, integrate, and scale your
					reservation operation.
				</p>

				<div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
					<aside className="space-y-4">
						{[
							{
								title: "Sales",
								value: "sales@resvflow.io",
								note: "For pricing, plans, and enterprise demos.",
							},
							{
								title: "Customer Support",
								value: "support@resvflow.io",
								note: "Mon-Sun, response under 15 minutes for urgent issues.",
							},
							{
								title: "Partnerships",
								value: "partners@resvflow.io",
								note: "POS, hospitality, and technology collaborations.",
							},
						].map((channel) => (
							<article
								key={channel.title}
								className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
							>
								<p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
									{channel.title}
								</p>
								<p className="mt-2 text-lg font-bold text-slate-900">{channel.value}</p>
								<p className="mt-2 text-sm text-slate-600">{channel.note}</p>
							</article>
						))}
					</aside>

					<div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6">
						<h2 className="text-2xl font-bold text-slate-900">Send a message</h2>
						<p className="mt-2 text-sm text-slate-600">
							Share your use case and we will route your request to the right
							specialist.
						</p>

						<form className="mt-6 grid gap-4 sm:grid-cols-2">
							<label className="text-sm font-medium text-slate-700">
								Name
								<input
									type="text"
									className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-200 transition focus:ring"
									placeholder="Your full name"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Work Email
								<input
									type="email"
									className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-200 transition focus:ring"
									placeholder="you@restaurant.com"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700 sm:col-span-2">
								Company
								<input
									type="text"
									className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-200 transition focus:ring"
									placeholder="Restaurant or group name"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700 sm:col-span-2">
								Message
								<textarea
									rows={5}
									className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-cyan-200 transition focus:ring"
									placeholder="Tell us what you need help with"
								/>
							</label>

							<button
								type="button"
								className="sm:col-span-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
							>
								Send Request
							</button>
						</form>
					</div>
				</div>
			</section>
		</main>
	);
}
