"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { getTableById } from "@/services/table-service";
import { getRestaurantById } from "@/services/restaurant-service";
import { checkAvailability } from "@/services/reservation-service";

export default function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const query = useSearchParams();
  const restaurantIdFromQuery = query.get("restaurantId") ?? "";

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [guests, setGuests] = useState(2);
  const [slot, setSlot] = useState("19:00-20:30");

  const [startTime, endTime] = slot.split("-");

  const tableQuery = useQuery({
    queryKey: ["room-detail", id],
    queryFn: () => getTableById(id),
    enabled: Boolean(id),
  });

  const restaurantId = tableQuery.data?.restaurantId ?? restaurantIdFromQuery;

  const restaurantQuery = useQuery({
    queryKey: ["room-detail-restaurant", restaurantId],
    queryFn: () => getRestaurantById(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const availabilityQuery = useQuery({
    queryKey: ["room-detail-availability", restaurantId, date, guests, slot],
    enabled: Boolean(restaurantId && startTime && endTime),
    queryFn: () =>
      checkAvailability(restaurantId, date, { startTime, endTime }, guests),
  });

  const pricing = useMemo(() => {
    const base = tableQuery.data?.price ?? Math.max(1200, guests * 550);
    const taxes = Math.round(base * 0.15);
    const service = Math.round(base * 0.1);
    return {
      base,
      taxes,
      service,
      total: base + taxes + service,
    };
  }, [guests, tableQuery.data?.price]);

  if (tableQuery.isLoading) {
    return (
      <AppShell>
        <p className="text-[#6a4a43]">Loading room/table details...</p>
      </AppShell>
    );
  }

  if (!tableQuery.data) {
    return (
      <AppShell>
        <p className="text-rose-700">Inventory item not found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="hotel-card rounded-4xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">Room/Table Details</p>
        <h1 className="display-font mt-2 text-5xl leading-none text-[#2b0d0a]">
          {tableQuery.data.type ?? "Table"} {tableQuery.data.tableNumber}
        </h1>
        <p className="mt-2 text-[#6a4a43]">
          {restaurantQuery.data?.name ?? "Hotel Branch"} • Capacity {tableQuery.data.capacity}
        </p>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-2xl bg-linear-to-br from-[#5f120f] via-[#a4271f] to-[#e6bf84]"
                />
              ))}
            </div>

            <article className="rounded-2xl border border-[#d5c3a6] bg-[#fff7e8] p-4">
              <h2 className="display-font text-3xl text-[#2b0d0a]">Amenities</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#5d3c35]">
                {(tableQuery.data.features ?? ["wifi", "ac", "city-view"]).map((feature) => (
                  <span key={feature} className="rounded-full bg-[#f3e4ca] px-3 py-1">
                    {feature}
                  </span>
                ))}
              </div>
            </article>
          </div>

          <aside className="rounded-2xl border border-[#d5c3a6] bg-[#fff7e8] p-4">
            <h2 className="display-font text-3xl text-[#2b0d0a]">Availability & Pricing</h2>

            <div className="mt-3 grid gap-3">
              <label className="text-sm text-[#5d3c35]">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-white px-3 py-2"
                />
              </label>

              <label className="text-sm text-[#5d3c35]">
                Guests
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-white px-3 py-2"
                />
              </label>

              <label className="text-sm text-[#5d3c35]">
                Slot
                <select
                  value={slot}
                  onChange={(event) => setSlot(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-white px-3 py-2"
                >
                  <option value="09:00-10:30">09:00 - 10:30</option>
                  <option value="12:00-13:30">12:00 - 13:30</option>
                  <option value="19:00-20:30">19:00 - 20:30</option>
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-xl bg-[#f2e3c7] p-3 text-sm text-[#5d3c35]">
              <p>Base: ETB {pricing.base.toLocaleString()}</p>
              <p>Taxes (15%): ETB {pricing.taxes.toLocaleString()}</p>
              <p>Service (10%): ETB {pricing.service.toLocaleString()}</p>
              <p className="mt-1 font-semibold text-[#7b2018]">Total: ETB {pricing.total.toLocaleString()}</p>
            </div>

            <p className={`mt-3 text-sm font-semibold ${availabilityQuery.data?.available ? "text-emerald-700" : "text-rose-700"}`}>
              {availabilityQuery.data?.available ? "Available for booking" : "Not available for selected slot"}
            </p>

            <Link
              href={`/checkout?restaurantId=${restaurantId}&tableId=${tableQuery.data.id}&date=${date}&slot=${slot}&guests=${guests}`}
              className="mt-4 inline-flex rounded-full bg-[#a4271f] px-4 py-2 text-sm font-semibold text-white"
            >
              Reserve Now
            </Link>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
