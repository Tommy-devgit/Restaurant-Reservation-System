"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  getRestaurantById,
  updateRestaurant,
} from "@/services/restaurant-service";

const settingsSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export function SettingsPanel({ restaurantId }: { restaurantId: string }) {
  const { data } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantById(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      location: "",
      open: "09:00",
      close: "22:00",
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    form.reset({
      name: data.name,
      location: data.location,
      open: data.workingHours.open,
      close: data.workingHours.close,
    });
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: (values: SettingsForm) =>
      updateRestaurant(restaurantId, {
        name: values.name,
        location: values.location,
        workingHours: {
          open: values.open,
          close: values.close,
        },
      }),
  });

  const onSubmit = form.handleSubmit((values) => updateMutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Hotel Settings</h2>

      <input
        {...form.register("name")}
        placeholder="Hotel name"
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
      />
      <input
        {...form.register("location")}
        placeholder="Address"
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          {...form.register("open")}
          type="time"
          className="rounded-xl border border-slate-300 px-3 py-2"
        />
        <input
          {...form.register("close")}
          type="time"
          className="rounded-xl border border-slate-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700"
      >
        Save Settings
      </button>
    </form>
  );
}
