"use client";

import { useEffect, useState } from "react";
import type { Reservation } from "@/types/domain";
import { subscribeReservationsByDate } from "@/services/reservation-service";

export function useRealtimeReservations(restaurantId: string, date: string) {
  const [cache, setCache] = useState<Record<string, Reservation[]>>({});
  const subscriptionKey = `${restaurantId}:${date}`;
  const enabled = Boolean(restaurantId && date);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubscribe = subscribeReservationsByDate(restaurantId, date, (rows) => {
      setCache((current) => ({
        ...current,
        [subscriptionKey]: rows,
      }));
    });

    return unsubscribe;
  }, [enabled, restaurantId, date, subscriptionKey]);

  if (!enabled) {
    return { data: [], loading: false };
  }

  const data = cache[subscriptionKey] ?? [];
  const loading = !(subscriptionKey in cache);

  return { data, loading };
}
