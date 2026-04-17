"use client";

import { useEffect } from "react";
import { useRestaurants } from "@/hooks/use-restaurants";
import { useAppStore } from "@/stores/app-store";

export function useActiveRestaurant() {
  const { data } = useRestaurants();
  const selectedRestaurantId = useAppStore((state) => state.selectedRestaurantId);
  const setSelectedRestaurantId = useAppStore(
    (state) => state.setSelectedRestaurantId,
  );

  useEffect(() => {
    if (!selectedRestaurantId && data?.length) {
      setSelectedRestaurantId(data[0].id);
    }
  }, [data, selectedRestaurantId, setSelectedRestaurantId]);

  return {
    restaurants: data ?? [],
    selectedRestaurantId,
    setSelectedRestaurantId,
  };
}
