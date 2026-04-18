const productModules = [
	{
		name: "Reservation Engine",
		detail:
			"Real-time slot checks, conflict prevention, and capacity-aware booking rules.",
	},
	{
		name: "Table Management",
		detail:
			"Create floor plans, table groups, and auto-assignment policies for every service.",
	},
	{
		name: "Guest Messaging",
		detail:
			"Automated confirmations, reminders, and rebooking nudges to reduce no-shows.",
	},
	{
		name: "Operator Dashboard",
		detail:
			"Track covers, occupancy windows, cancellations, and staff performance in one view.",
	},
	{
		name: "Multi-Tenant Controls",
		detail:
			"Isolate data by restaurant while allowing central governance for HQ teams.",
	},
	{
		name: "Integrations",
		detail:
			"Connect to POS, CRM, and analytics pipelines through event-based architecture.",
	},
];

export default function Product() {
	return (
		<main className="min-h-screen px-6 py-10 md:px-12 lg:px-20">
			<section className="mx-auto max-w-7xl rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur md:p-12">
				<div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
							Product
						</p>
						<h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
							Built to run modern restaurant operations.
						</h1>
						<p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
							ResvFlow combines guest experience and operations in a single SaaS
							suite. Replace fragmented tools with one reliable, real-time booking
							command center.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							<button className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
								Explore Demo
							</button>
							<button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
								Download Product Brief
							</button>
						</div>
					</div>

					<div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-lime-50 to-white p-6">
						<p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
							Why Operators Switch
						</p>
						<ul className="mt-4 space-y-3 text-sm text-slate-700">
							<li className="rounded-lg bg-white p-3">Unified booking + floor workflow</li>
							<li className="rounded-lg bg-white p-3">Lower cancellation and no-show rate</li>
							<li className="rounded-lg bg-white p-3">Faster host team decisions during peak</li>
							<li className="rounded-lg bg-white p-3">Scales from 1 to 100+ locations</li>
						</ul>
					</div>
				</div>

				<section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{productModules.map((module) => (
						<article
							key={module.name}
							className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
						>
							<h2 className="text-xl font-bold text-slate-900">{module.name}</h2>
							<p className="mt-2 text-sm leading-relaxed text-slate-600">
								{module.detail}
							</p>
						</article>
					))}
				</section>
			</section>
		</main>
	);
}
