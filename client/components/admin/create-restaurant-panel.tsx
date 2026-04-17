"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createRestaurant } from "@/services/restaurant-service";

const createRestaurantSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  ownerId: z.string().min(2),
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
});

type CreateRestaurantForm = z.infer<typeof createRestaurantSchema>;

export function CreateRestaurantPanel({
  onCreated,
}: {
  onCreated: (restaurantId: string) => void;
}) {
  const form = useForm<CreateRestaurantForm>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: "",
      location: "",
      ownerId: "",
      open: "09:00",
      close: "22:00",
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateRestaurantForm) =>
      createRestaurant({
        name: values.name,
        location: values.location,
        ownerId: values.ownerId,
        workingHours: {
          open: values.open,
          close: values.close,
        },
      }),
    onSuccess: (restaurantId) => {
      onCreated(restaurantId);
    },
  });

  const onSubmit = form.handleSubmit((values) => createMutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Create Restaurant Profile</h2>

      <input
        {...form.register("name")}
        placeholder="Restaurant name"
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
      />
      <input
        {...form.register("location")}
        placeholder="Location"
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
      />
      <input
        {...form.register("ownerId")}
        placeholder="Owner UID"
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

      {createMutation.error ? (
        <p className="text-sm text-red-600">{createMutation.error.message}</p>
      ) : null}

      <button
        type="submit"
        className="rounded-full bg-cyan-600 px-5 py-2 font-semibold text-white hover:bg-cyan-700"
      >
        Create Restaurant
      </button>
    </form>
  );
}
