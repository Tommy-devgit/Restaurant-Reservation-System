"use client";

import { useActiveRestaurant } from "@/hooks/use-active-restaurant";

export function RestaurantSelector() {
  const { restaurants, selectedRestaurantId, setSelectedRestaurantId } =
    useActiveRestaurant();

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm">
      <span className="font-semibold text-slate-700">Restaurant</span>
      <select
        value={selectedRestaurantId}
        onChange={(event) => setSelectedRestaurantId(event.target.value)}
        className="bg-transparent text-slate-700 outline-none"
      >
        {restaurants.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
