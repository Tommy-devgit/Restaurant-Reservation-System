"use client";

import { useMemo } from "react";
import { useRealtimeReservations } from "@/hooks/use-realtime-reservations";

export function DashboardOverview({
  restaurantId,
  date,
}: {
  restaurantId: string;
  date: string;
}) {
  const { data, loading } = useRealtimeReservations(restaurantId, date);

  const metrics = useMemo(() => {
    const confirmed = data.filter((item) => item.status === "confirmed");
    const cancelled = data.filter((item) => item.status === "cancelled");
    const guests = confirmed.reduce((sum, item) => sum + item.guestCount, 0);

    return {
      total: data.length,
      confirmed: confirmed.length,
      cancelled: cancelled.length,
      guests,
    };
  }, [data]);

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Total Reservations</p>
        <p className="text-3xl font-bold text-slate-900">{metrics.total}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Confirmed</p>
        <p className="text-3xl font-bold text-emerald-700">{metrics.confirmed}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Cancelled</p>
        <p className="text-3xl font-bold text-rose-700">{metrics.cancelled}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Guests Served</p>
        <p className="text-3xl font-bold text-cyan-700">{metrics.guests}</p>
      </div>
    </section>
  );
}
