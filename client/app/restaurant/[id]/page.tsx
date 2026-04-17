"use client";

import { use } from "react";
import { AppShell } from "@/components/app-shell";
import { RestaurantBookingPanel } from "@/components/customer/restaurant-booking-panel";

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppShell>
      <RestaurantBookingPanel restaurantId={id} />
    </AppShell>
  );
}
