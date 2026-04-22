"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { getAllTables } from "@/services/table-service";

export default function RoomsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [minCapacity, setMinCapacity] = useState(1);
  const [featureFilter, setFeatureFilter] = useState("all");

  const roomsQuery = useQuery({
    queryKey: ["inventory-listing"],
    queryFn: getAllTables,
  });

  const rows = useMemo(() => {
    const data = roomsQuery.data ?? [];

    return data.filter((item) => {
      const capacityPass = item.capacity >= minCapacity;
      const featurePass =
        featureFilter === "all" || (item.features ?? []).includes(featureFilter as never);
      return capacityPass && featurePass;
    });
  }, [featureFilter, minCapacity, roomsQuery.data]);

  return (
    <AppShell>
      <section className="hotel-card rounded-4xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">Room/Table Listing</p>
        <h1 className="display-font mt-2 text-5xl leading-none text-[#2b0d0a]">
          Browse Inventory
        </h1>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="text-sm text-[#5d3c35]">
            Minimum Capacity
            <input
              type="number"
              min={1}
              max={30}
              value={minCapacity}
              onChange={(event) => setMinCapacity(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <label className="text-sm text-[#5d3c35]">
            Feature
            <select
              value={featureFilter}
              onChange={(event) => setFeatureFilter(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="all">All</option>
              <option value="wifi">WiFi</option>
              <option value="ac">AC</option>
              <option value="breakfast">Breakfast</option>
              <option value="city-view">City View</option>
            </select>
          </label>

          <div className="text-sm text-[#5d3c35]">
            View
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`rounded-full px-4 py-2 font-semibold ${view === "grid" ? "bg-[#a4271f] text-white" : "bg-[#f2e6cf] text-[#5f2b22]"}`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-full px-4 py-2 font-semibold ${view === "list" ? "bg-[#a4271f] text-white" : "bg-[#f2e6cf] text-[#5f2b22]"}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </section>

      {roomsQuery.isLoading ? (
        <p className="mt-4 text-[#6a4a43]">Loading inventory...</p>
      ) : !rows.length ? (
        <p className="hotel-card mt-4 rounded-3xl p-5 text-[#6a4a43]">No inventory found.</p>
      ) : (
        <section
          className={`mt-4 ${view === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}`}
        >
          {rows.map((item) => {
            const price = item.price ?? item.capacity * 500;

            return (
              <article key={item.id} className="hotel-card rounded-3xl p-5">
                <div className="mb-3 h-24 rounded-2xl bg-linear-to-r from-[#5f120f] to-[#d0a060]" />
                <h2 className="display-font text-3xl text-[#2b0d0a]">
                  {item.type ?? "Table"} {item.tableNumber}
                </h2>
                <p className="text-sm text-[#6a4a43]">Capacity: {item.capacity}</p>
                <p className="text-sm text-[#6a4a43]">ETB {price.toLocaleString()}</p>
                <p className="mt-1 text-sm text-[#6a4a43]">
                  {(item.description ?? "Premium inventory with dynamic availability and instant confirmation.").slice(0, 95)}
                </p>
                <Link
                  href={`/rooms/${item.id}?restaurantId=${item.restaurantId}`}
                  className="mt-4 inline-flex rounded-full bg-[#a4271f] px-4 py-2 text-sm font-semibold text-white"
                >
                  View Details
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </AppShell>
  );
}
