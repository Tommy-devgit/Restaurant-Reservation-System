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
      <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-600">
        No restaurants found. Add entries in Firestore to get started.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((restaurant) => (
        <article
          key={restaurant.id}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">{restaurant.name}</h2>
          <p className="mt-1 text-slate-600">{restaurant.location}</p>
          <p className="mt-3 text-sm text-slate-500">
            Hours: {restaurant.workingHours.open} - {restaurant.workingHours.close}
          </p>
          <Link
            className="mt-4 inline-flex rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            href={`/restaurant/${restaurant.id}`}
          >
            Reserve a Table
          </Link>
        </article>
      ))}
    </div>
  );
}
