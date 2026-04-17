"use client";

import { AppShell } from "@/components/app-shell";
import { CreateRestaurantPanel } from "@/components/admin/create-restaurant-panel";
import { RestaurantSelector } from "@/components/admin/restaurant-selector";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { useActiveRestaurant } from "@/hooks/use-active-restaurant";

export default function SettingsPage() {
  const { selectedRestaurantId, setSelectedRestaurantId, restaurants } =
    useActiveRestaurant();

  return (
    <AppShell>
      {restaurants.length ? <div className="mb-4"><RestaurantSelector /></div> : null}
      {selectedRestaurantId ? (
        <SettingsPanel restaurantId={selectedRestaurantId} />
      ) : (
        <CreateRestaurantPanel onCreated={setSelectedRestaurantId} />
      )}
    </AppShell>
  );
}
