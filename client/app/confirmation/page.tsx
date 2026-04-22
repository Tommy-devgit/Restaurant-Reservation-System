"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { cancelReservation } from "@/services/reservation-service";

export default function ConfirmationPage() {
  const params = useSearchParams();
  const reservationId = params.get("reservationId");
  const service = params.get("service") ?? "dining";
  const paymentId = params.get("paymentId") ?? "pending";

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
          Your appointment is booked
        </h2>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Service: {service.replace("-", " ")}
        </p>
        <p className="mt-4 text-emerald-800">
          Reservation ID: <span className="font-mono">{reservationId ?? "N/A"}</span>
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          Payment ID: <span className="font-mono">{paymentId}</span>
        </p>

        <div className="mx-auto mt-4 grid w-40 grid-cols-6 gap-1 rounded-xl border border-emerald-300 bg-white p-2">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-sm ${index % 2 === 0 || index % 5 === 0 ? "bg-emerald-800" : "bg-emerald-200"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-emerald-700">QR check-in preview</p>

        <article className="mt-4 rounded-xl border 