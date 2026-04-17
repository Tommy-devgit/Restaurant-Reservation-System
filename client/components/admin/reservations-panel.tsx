"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cancelReservation } from "@/services/reservation-service";
import { useRealtimeReservations } from "@/hooks/use-realtime-reservations";

export function ReservationsPanel({ restaurantId }: { restaurantId: string }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"all" | "confirmed" | "cancelled">("all");

  const { data, loading } = useRealtimeReservations(restaurantId, date);

  const cancelMutation = useMutation({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
  });

  const filtered = useMemo(() => {
    if (status === "all") {
      return data;
    }
    return data.filter((item) => item.status === status);
  }, [data, status]);

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Status</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | "confirmed" | "cancelled")
            }
            className="rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading reservations...</p>
      ) : !filtered.length ? (
        <p className="text-slate-600">No reservations for this filter.</p>
      ) : (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Calendar View
            </h3>
            <div className="mt-2 space-y-2">
              {filtered.map((item) => (
                <article
                  key={`${item.id}-calendar`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">
                      {item.startTime} - {item.endTime}
                    </p>
                    <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">
                      Table {item.tableId}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.guestCount} guests • {item.userId}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              List View
            </h3>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Time</th>
                  <th className="py-2">Guests</th>
                  <th className="py-2">Table</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2">{item.startTime} - {item.endTime}</td>
                    <td className="py-2">{item.guestCount}</td>
                    <td className="py-2">{item.tableId}</td>
                    <td className="py-2">{item.userId}</td>
                    <td className="py-2">{item.status}</td>
                    <td className="py-2">
                      {item.status === "confirmed" ? (
                        <button
                          onClick={() => cancelMutation.mutate(item.id)}
                          className="rounded-full border border-rose-300 px-3 py-1 text-rose-700 hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
