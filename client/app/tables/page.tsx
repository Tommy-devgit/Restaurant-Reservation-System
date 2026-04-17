"use client";

import { AppShell } from "@/components/app-shell";
import { RestaurantSelector } from "@/components/admin/restaurant-selector";
import { TablesPanel } from "@/components/admin/tables-panel";
import { useActiveRestaurant } from "@/hooks/use-active-restaurant";

export default function TablesPage() {
  const { selectedRestaurantId } = useActiveRestaurant();

  return (
    <AppShell>
      <div className="mb-4">
        <RestaurantSelector />
      </div>
      {selectedRestaurantId ? (
        <TablesPanel restaurantId={selectedRestaurantId} />
      ) : (
        <p className="text-slate-600">Select a restaurant.</p>
      )}
    </AppShell>
  );
}
