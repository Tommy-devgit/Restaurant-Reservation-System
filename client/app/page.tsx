import { AppShell } from "@/components/app-shell";
import { RestaurantList } from "@/components/customer/restaurant-list";

export default function HomePage() {
  return (
    <AppShell>
      <section className="mb-6 rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">
          Real-Time Booking Platform
        </p>
        <h2 className="mt-2 text-3xl font-bold">
          Book a table in less than 3 steps
        </h2>
        <p className="mt-2 max-w-2xl text-cyan-50">
          Find your restaurant, pick a slot, and confirm instantly. Availability is
          checked live to prevent double booking.
        </p>
      </section>

      <RestaurantList />
    </AppShell>
  );
}
