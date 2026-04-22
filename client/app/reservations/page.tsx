"use client";

import { AppShell } from "@/components/app-shell";
import { ReservationsPanel } from "@/components/admin/reservations-panel";
import { RestaurantSelector } from "@/components/admin/restaurant-selector";
import { useActiveRestaurant } from "@/hooks/use-active-restaurant";

export default function ReservationsPage() {
  const { selectedRestaurantId } = useActiveRestaurant();

  return (
    <AppShell>
      <div className="mb-4">
        <RestaurantSelector />
      </div>
      {selectedRestaurantId ? (
        <ReservationsPanel restaurantId={selectedRestaurantId} />
      ) : (
        <p className="text-slate-700">Select a hotel profile.</p>
      )}
    </AppShell>
  );
}
