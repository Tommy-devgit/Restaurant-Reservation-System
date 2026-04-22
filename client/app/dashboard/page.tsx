"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { RestaurantSelector } from "@/components/admin/restaurant-selector";
import { useActiveRestaurant } from "@/hooks/use-active-restaurant";

export default function DashboardPage() {
  const { selectedRestaurantId } = useActiveRestaurant();
  const date = new Date().toISOString().slice(0, 10);

  return (
    <AppShell>
      <div className="mb-4">
        <RestaurantSelector />
      </div>
      {selectedRestaurantId ? (
        <DashboardOverview restaurantId={selectedRestaurantId} date={date} />
      ) : (
        <p className="text-slate-700">Create your hotel profile first.</p>
      )}
    </AppShell>
  );
}
