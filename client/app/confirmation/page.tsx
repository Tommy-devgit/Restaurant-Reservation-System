"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { cancelReservation } from "@/services/reservation-service";

export default function ConfirmationPage() {
  const params = useSearchParams();
  const reservationId = params.get("reservationId");

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!reservationId) {
        throw new Error("Missing reservation id.");
      }

      await cancelReservation(reservationId);
    },
  });

  return (
    <AppShell>
      <section className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Reservation Confirmed
        </p>
        <h2 className="mt-3 text-3xl font-bold text-emerald-900">
          Your table is booked
        </h2>
        <p className="mt-4 text-emerald-800">
          Reservation ID: <span className="font-mono">{reservationId ?? "N/A"}</span>
        </p>

        {reservationId ? (
          <button
            onClick={() => cancelMutation.mutate()}
            className="mt-4 rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            Cancel This Reservation
          </button>
        ) : null}

        {cancelMutation.isSuccess ? (
          <p className="mt-2 text-sm text-rose-700">Reservation cancelled.</p>
        ) : null}

        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
        >
          Back to Restaurants
        </Link>
      </section>
    </AppShell>
  );
}
