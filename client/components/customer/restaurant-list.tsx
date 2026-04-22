"use client";

import Link from "next/link";
import { useRestaurants } from "@/hooks/use-restaurants";

export function RestaurantList() {
  const { data, isLoading, error } = useRestaurants();

  if (isLoading) {
    return <p className="text-slate-600">Loading restaurants...</p>;
  }

  if (error) {
    return <p className="text-red-600">Failed to load restaurants.</p>;
  }

  if (!data?.length) {
    return (
      <div className="hotel-card rounded-3xl border-dashed p-6 text-[#593630]">
        <p className="display-font text-3xl text-[#2b0d0a]">No hotel profile yet.</p>
        <p className="mt-2 text-sm">
          Create your hotel in the admin area, then guests can start booking
          dining and appointment slots instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((restaurant) => (
        <article
          key={restaurant.id}
          className="hotel-card rounded-3xl p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f3a2f]">
            Hotel Branch
          </p>
          <h2 className="display-font text-4xl leading-tight text-[#2b0d0a]">
            {restaurant.name}
          </h2>
          <p className="mt-1 text-[#5d3c35]">{restaurant.location}</p>
          <p className="mt-3 text-sm text-[#7a5750]">
            Hours: {restaurant.workingHours.open} - {restaurant.workingHours.close}
          </p>
          <Link
            className="mt-4 inline-flex rounded-full bg-[#a4271f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8e1f17]"
            href={`/restaurant/${restaurant.id}`}
          >
            Book Appointment
          </Link>
        </article>
      ))}
    </div>
  );
}
