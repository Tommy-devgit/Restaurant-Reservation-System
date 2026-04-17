"use client";

import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/services/restaurant-service";

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
}
