"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { getRestaurants } from "@/services/restaurant-service";
import { getAllTables } from "@/services/table-service";
import { checkAvailability } from "@/services/reservation-service";

export default function SearchPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [guests, setGuests] = useState(2);
  const [typeFilter, setTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(20000);

  const slot = "19:00-20:30";
  const [startTime, endTime] = slot.split("-");

  const restaurantsQuery = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  const tablesQuery = useQuery({
    queryKey: ["all-tables"],
    queryFn: getAllTables,
  });

  const primaryRestaurantId = restaurantsQuery.data?.[0]?.id ?? "";

  const availabilityQuery = useQuery({
    queryKey: ["search-availability", primaryRestaurantId, date, guests],
    enabled: Boolean(primaryRestaurantId && tablesQuery.data?.length),
    queryFn: async () => {
      const rows = tablesQuery.data ?? [];

      const checks = await Promise.all(
        rows.map(async (table) => {
          const result = await checkAvailability(
            table.restaurantId,
            date,
            { startTime, endTime },
            guests,
          );

          return {
            table,
            available: result.available,
          };
        }),
      );

      return checks;
    },
  });

  const filtered = useMemo(() => {
    const rows = availabilityQuery.data ?? [];

    return rows.filter(({ table }) => {
      const matchesCapacity = table.capacity >= guests;
      const matchesType = typeFilter === "all" || (table.type ?? "table") === typeFilter;
      const price = table.price ?? table.capacity * 500;
      const matchesPrice = price <= maxPrice;

      return matchesCapacity && matchesType && matchesPrice;
    });
  }, [availabilityQuery.data, guests, maxPrice, typeFilter]);

  return (
    <AppShell>
      <section className="hotel-card rounded-4xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">Search Availability</p>
        <h1 className="display-font mt-2 text-5xl leading-none text-[#2b0d0a]">
          Find Your Perfect Slot
        </h1>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <label className="text-sm text-[#5d3c35]">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
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
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <label className="text-sm text-[#5d3c35]">
            Room/Table Type
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="all">All</option>
              <option value="table">Table</option>
              <option value="suite">Suite</option>
              <option value="hall">Event Hall</option>
            </select>
          </label>

          <label className="text-sm text-[#5d3c35]">
            Max Price (ETB)
            <input
              type="number"
              min={1000}
              step={500}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="display-font text-4xl text-[#2b0d0a]">Available Inventory</h2>

        {availabilityQuery.isLoading ? (
          <p className="text-[#6a4a43]">Checking live availability...</p>
        ) : !filtered.length ? (
          <p className="hotel-card rounded-3xl p-5 text-[#6a4a43]">
            No matching room/table currently available for your filters.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(({ table, available }) => {
              const price = table.price ?? table.capacity * 500;
              return (
                <article key={table.id} className="hotel-card rounded-3xl p-5">
                  <div className="mb-4 h-20 rounded-2xl bg-linear-to-r from-[#5f120f] to-[#d0a060]" />
                  <h3 className="display-font text-3xl text-[#2b0d0a]">
                    {table.type ?? "Table"} {table.tableNumber}
                  </h3>
                  <p className="text-sm text-[#6a4a43]">Capacity: {table.capacity} guests</p>
                  <p className="text-sm text-[#6a4a43]">Price: ETB {price.toLocaleString()}</p>
                  <p className={`mt-2 text-sm font-semibold ${available ? "text-emerald-700" : "text-rose-700"}`}>
                    {available ? "Available" : "Currently occupied"}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/rooms/${table.id}?restaurantId=${table.restaurantId}`}
                      className="rounded-full border border-[#cfb48a] px-4 py-2 text-sm font-semibold text-[#5f2b22]"
                    >
                      View Details
                    </Link>
                    {available ? (
                      <Link
                        href={`/checkout?restaurantId=${table.restaurantId}&tableId=${table.id}&date=${date}&slot=${slot}&guests=${guests}`}
                        className="rounded-full bg-[#a4271f] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Reserve Now
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
