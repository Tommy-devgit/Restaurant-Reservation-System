import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RestaurantList } from "@/components/customer/restaurant-list";

export default function HomePage() {
  return (
    <AppShell>
      <section className="hotel-card reveal-up mb-8 overflow-hidden rounded-4xl">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-12">
            <p className="inline-flex rounded-full border border-[#c2ad86] px-3 py-1 text-xs font-semibold text-[#5f2b22]">
              Drizzle Hotel Hospitality Platform
            </p>
            <h2 className="display-font mt-5 text-5xl leading-[0.95] font-semibold text-[#240a08] sm:text-7xl">
              Stay, Dine,
              <br />
              Celebrate Better
            </h2>
            <p className="mt-4 max-w-2xl text-base text-[#56312a] sm:text-lg">
              One elegant experience for room stays, table appointments, and
              event reservations. Check availability in real-time and confirm in
              a guided checkout flow.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-full bg-[#a4271f] px-5 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-[#8e1f17]"
              >
                Book Now
              </Link>
              <Link
                href="/rooms"
                className="rounded-full border border-[#c8b491] bg-[#f6eddd] px-5 py-2.5 text-sm font-semibold text-[#4f2a23] hover:bg-[#efe3cc]"
              >
                View Inventory
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#efe4cf] p-6 sm:p-8">
            {["Dining", "Room Service", "Events", "Premium Stays"].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-[#cdbb9a] bg-[#f8efdd] p-4"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">
                  Signature
                </p>
                <h3 className="display-font mt-2 text-3xl text-[#2b0b09]">{item}</h3>
                <p className="mt-1 text-xs text-[#654039]">
                  Real-time booking with instant status updates.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d251d]">
          Featured Rooms & Tables
        </p>
        <h3 className="display-font mt-2 text-5xl leading-none text-[#2a0907]">
          Handpicked Inventory
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { name: "Skyline Suite", price: "ETB 9,200 / night", cap: "2 Guests" },
            { name: "Garden Table 12", price: "ETB 2,300 / slot", cap: "4 Guests" },
            { name: "Grand Event Hall", price: "ETB 15,000 / block", cap: "60 Guests" },
          ].map((item) => (
            <article key={item.name} className="hotel-card rounded-3xl p-6">
              <div className="mb-4 h-28 rounded-2xl bg-linear-to-br from-[#6a1b13] via-[#a4271f] to-[#dfb277]" />
              <h4 className="display-font text-4xl leading-none text-[#2b0b09]">{item.name}</h4>
              <p className="mt-1 text-sm text-[#593630]">{item.price}</p>
              <p className="mt-1 text-sm text-[#7f3a2f]">{item.cap}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Dining Reservations",
            text: "Book your preferred table and appointment time with live capacity checks.",
          },
          {
            title: "Room Service Slots",
            text: "Schedule in-room meals, curated breakfast experiences, and late-night orders.",
          },
          {
            title: "Events & Celebrations",
            text: "Reserve banquet spaces for birthdays, corporate dinners, and private events.",
          },
        ].map((service, index) => (
          <article
            key={service.title}
            className="hotel-card reveal-up rounded-3xl p-6"
            style={{ animationDelay: `${index * 110}ms` }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f3a2f]">
              Signature Service
            </p>
            <h3 className="display-font mt-2 text-4xl leading-tight text-[#2b0b09]">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-[#593630]">{service.text}</p>
          </article>
        ))}
      </section>

      <section className="mb-8 rounded-3xl bg-[#3f0808] px-6 py-10 text-[#f7ecd7] sm:px-10">
        <div className="reveal-up grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#81554f] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#f4d6c6]">
              Testimonials
            </p>
            <h3 className="display-font mt-4 text-5xl leading-[0.95] sm:text-6xl">
              Guests Keep
              <br />
              Coming Back
            </h3>
            <p className="mt-3 max-w-xl text-sm text-[#eecfbe] sm:text-base">
              "Best booking flow in Addis." "Fast confirmations and excellent
              service." "The event team made everything effortless."
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Occupancy grew 24% after launch.",
              "Room service pre-orders increased 31%.",
              "Peak-hour table conflicts dropped to zero.",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-[#774038] bg-[#5b1111] p-4 text-sm"
              >
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { offer: "Weekend Escape", value: "-15%", note: "Suites + breakfast" },
          { offer: "Family Dining", value: "ETB 600 Off", note: "Groups above 6" },
          { offer: "Corporate Events", value: "Bundle", note: "Hall + catering" },
        ].map((item) => (
          <article key={item.offer} className="hotel-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">Offer</p>
            <h4 className="display-font mt-2 text-4xl text-[#2b0b09]">{item.offer}</h4>
            <p className="mt-1 text-lg font-semibold text-[#a4271f]">{item.value}</p>
            <p className="mt-1 text-sm text-[#593630]">{item.note}</p>
          </article>
        ))}
      </section>

      <section id="bookings" className="reveal-up mb-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d251d]">
          Reserve Instantly
        </p>
        <h3 className="display-font text-5xl leading-none text-[#2a0907]">
          Start Your Reservation
        </h3>
        <p className="text-sm text-[#613933] sm:text-base">
          Begin from live availability, continue through checkout, complete payment,
          and get your confirmation immediately.
        </p>
      </section>

      <div className="mt-4">
        <RestaurantList />
      </div>
    </AppShell>
  );
}
