export default function Home() {
    return (
        <main className="min-h-screen px-6 py-10 md:px-12 lg:px-20">
            <section className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-cyan-100 bg-white/80 p-8 shadow-xl backdrop-blur md:grid-cols-[1.15fr_0.85fr] md:p-12">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                        Restaurant Reservation SaaS
                    </p>
                    <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                        Turn every table into predictable revenue.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                        One platform for discovery, instant bookings, waitlist recovery, and
                        live floor visibility. Built for teams that care about guest experience
                        and operational speed.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700">
                            Start Free Trial
                        </button>
                        <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
                            Book a Demo
                        </button>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        {[
                            { label: "Restaurants", value: "1,200+" },
                            { label: "Bookings / Month", value: "2.4M" },
                            { label: "No-show Reduction", value: "37%" },
                        ].map((item) => (
                            <article
                                key={item.label}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                                <p className="text-sm text-slate-600">{item.label}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-cyan-50 to-white p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Live Snapshot
                    </p>
                    <div className="mt-6 space-y-4">
                        <article className="rounded-xl border border-emerald-200 bg-white p-4">
                            <p className="text-sm text-slate-500">Tonight Occupancy</p>
                            <p className="mt-1 text-3xl font-black text-slate-900">84%</p>
                        </article>
                        <article className="rounded-xl border border-cyan-200 bg-white p-4">
                            <p className="text-sm text-slate-500">Average Booking Lead</p>
                            <p className="mt-1 text-3xl font-black text-slate-900">3.1 days</p>
                        </article>
                        <article className="rounded-xl border border-sky-200 bg-white p-4">
                            <p className="text-sm text-slate-500">Waitlist Conversions</p>
                            <p className="mt-1 text-3xl font-black text-slate-900">62%</p>
                        </article>
                    </div>
                </aside>
            </section>

            <section className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
                {[
                    {
                        title: "Dynamic Floor Control",
                        text: "Automate table assignments using capacity rules, turn-time assumptions, and live reservation conflicts.",
                    },
                    {
                        title: "Guest Experience Layer",
                        text: "Offer branded booking journeys, confirmations, reminders, and cancellation recovery flows.",
                    },
                    {
                        title: "Multi-Location Ready",
                        text: "Operate single venues or chains with tenant-level segmentation and centralized analytics.",
                    },
                ].map((feature) => (
                    <article
                        key={feature.title}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-xl font-bold text-slate-900">{feature.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.text}</p>
                    </article>
                ))}
            </section>
        </main>
    );
}