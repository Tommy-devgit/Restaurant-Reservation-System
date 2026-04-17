"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signInAnonymously } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { auth } from "@/lib/firebase";
import { createReservation } from "@/services/reservation-service";

const bookingSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  guests: z.coerce.number().int().min(1).max(20),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();

  const defaults = useMemo(
    () => ({
      restaurantId: params.get("restaurantId") ?? "",
      date: params.get("date") ?? "",
      slot: params.get("slot") ?? "",
      guests: Number(params.get("guests") ?? "2"),
    }),
    [params],
  );

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      guests: defaults.guests,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: BookingFormData) => {
      const [startTime, endTime] = defaults.slot.split("-");

      if (!defaults.restaurantId || !defaults.date || !startTime || !endTime) {
        throw new Error("Missing booking parameters.");
      }

      const authUser =
        auth.currentUser ?? (await signInAnonymously(auth)).user;

      const id = await createReservation({
        restaurantId: defaults.restaurantId,
        userId: authUser.uid,
        guestCount: values.guests,
        date: defaults.date,
        startTime,
        endTime,
      });

      return id;
    },
    onSuccess: (reservationId) => {
      router.push(`/confirmation?reservationId=${reservationId}`);
    },
  });

  const onSubmit = form.handleSubmit((values) => createMutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-slate-900">Complete Reservation</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Full Name</span>
          <input
            {...form.register("customerName")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Email</span>
          <input
            type="email"
            {...form.register("customerEmail")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Guests</span>
          <input
            type="number"
            min={1}
            max={20}
            {...form.register("guests")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p>Restaurant ID: {defaults.restaurantId || "-"}</p>
        <p>Date: {defaults.date || "-"}</p>
        <p>Slot: {defaults.slot || "-"}</p>
      </div>

      {createMutation.error ? (
        <p className="text-sm text-red-600">{createMutation.error.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="rounded-full bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-70"
      >
        {createMutation.isPending ? "Booking..." : "Confirm Reservation"}
      </button>
    </form>
  );
}
