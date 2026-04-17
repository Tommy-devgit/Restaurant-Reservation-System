"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkAvailability } from "@/services/reservation-service";
import { getRestaurantById } from "@/services/restaurant-service";
import { generateTimeSlots } from "@/lib/time";

export function RestaurantBookingPanel({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [guestCount, setGuestCount] = useState(2);
  const [slot, setSlot] = useState("");

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantById(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const slots = useMemo(() => {
    if (!restaurant) {
      return [];
    }

    return generateTimeSlots(restaurant.workingHours, 90).map((item) => ({
      value: `${item.startTime}-${item.endTime}`,
      label: `${item.startTime} - ${item.endTime}`,
    }));
  }, [restaurant]);

  const availabilityQuery = useQuery({
    queryKey: ["availability", restaurantId, date, slot, guestCount],
    queryFn: async () => {
      const [startTime, endTime] = slot.split("-");
      return checkAvailability(restaurantId, date, { startTime, endTime }, guestCount);
    },
    enabled: Boolean(slot && restaurantId),
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading restaurant...</p>;
  }

  if (!restaurant) {
    return <p className="text-red-600">Restaurant not found.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-900">{restaurant.name}</h2>
        <p className="text-slate-600">{restaurant.location}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Guests</span>
            <input
              type="number"
              min={1}
              max={20}
              value={guestCount}
              onChange={(event) => setGuestCount(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Time Slot</span>
            <select
              value={slot}
              onChange={(event) => setSlot(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              <option value="">Select a slot</option>
              {slots.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-lg font-semibold text-slate-900">Availability</h3>

        {!slot ? (
          <p className="mt-4 text-slate-600">Choose a slot to check live availability.</p>
        ) : availabilityQuery.isLoading ? (
          <p className="mt-4 text-slate-600">Checking...</p>
        ) : availabilityQuery.data?.available ? (
          <div className="mt-4 space-y-3">
            <p className="text-emerald-700">Table available.</p>
            <Link
              href={`/booking?restaurantId=${restaurant.id}&date=${date}&slot=${slot}&guests=${guestCount}`}
              className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Continue Booking
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-red-600">No suitable table for this slot.</p>
        )}
      </aside>
    </div>
  );
}
