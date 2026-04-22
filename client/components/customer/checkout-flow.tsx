"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  checkAvailability,
  createReservation,
  createReservationHold,
} from "@/services/reservation-service";
import { getRestaurantById } from "@/services/restaurant-service";
import { initiatePayment, resolvePayment } from "@/services/payment-service";
import { sendNotification } from "@/services/notification-service";
import type { PaymentMethod, ReservationExtras, ServiceType } from "@/types/domain";

type GuestDetails = {
  fullName: string;
  email: string;
  phone: string;
};

export function CheckoutFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>(
    (params.get("service") as ServiceType) ?? "dining",
  );
  const [date, setDate] = useState(params.get("date") ?? new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState(params.get("slot") ?? "19:00-20:30");
  const [guests, setGuests] = useState(Number(params.get("guests") ?? "2"));

  const [guest, setGuest] = useState<GuestDetails>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [extras, setExtras] = useState<ReservationExtras>({
    decoration: false,
    cake: false,
    airportPickup: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [holdId, setHoldId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string>("");

  const restaurantId = params.get("restaurantId") ?? "";
  const tableId = params.get("tableId") ?? undefined;

  const [startTime, endTime] = slot.split("-");

  const restaurantQuery = useQuery({
    queryKey: ["checkout-restaurant", restaurantId],
    queryFn: () => getRestaurantById(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const availabilityQuery = useQuery({
    queryKey: ["checkout-availability", restaurantId, date, slot, guests],
    queryFn: () => checkAvailability(restaurantId, date, { startTime, endTime }, guests),
    enabled: Boolean(restaurantId && date && startTime && endTime),
  });

  const amount = useMemo(() => {
    const base = Math.max(1200, guests * 550);
    const extrasCost =
      (extras.decoration ? 350 : 0) +
      (extras.cake ? 600 : 0) +
      (extras.airportPickup ? 900 : 0);
    return base + extrasCost;
  }, [extras, guests]);

  const createHoldMutation = useMutation({
    mutationFn: async () => {
      const activeUser = auth.currentUser ?? (await signInAnonymously(auth)).user;

      return createReservationHold({
        restaurantId,
        date,
        startTime,
        endTime,
        guestCount: guests,
        userId: activeUser.uid,
      });
    },
    onSuccess: (hold) => {
      setHoldId(hold.id);
      setCheckoutError("");
      setStep(2);
    },
    onError: (error: Error) => {
      setCheckoutError(error.message);
    },
  });

  const finalizePaymentMutation = useMutation({
    mutationFn: async () => {
      const activeUser = auth.currentUser ?? (await signInAnonymously(auth)).user;
      const payment = await initiatePayment({
        userId: activeUser.uid,
        method: paymentMethod,
        amount,
      });

      setPaymentId(payment.id);
      setPaymentStatus("pending");

      const success = Math.random() > (paymentMethod === "mobile-money" ? 0.15 : 0.08);
      const resolved = await resolvePayment(payment.id, success ? "success" : "failed");

      if (!resolved || resolved.status !== "success") {
        throw new Error("Payment failed. Retry with another method.");
      }

      setPaymentStatus("success");
      return resolved;
    },
    onSuccess: () => {
      setCheckoutError("");
      setStep(5);
    },
    onError: (error: Error) => {
      setPaymentStatus("failed");
      setCheckoutError(error.message);
    },
  });

  const reserveMutation = useMutation({
    mutationFn: async () => {
      if (!holdId) {
        throw new Error("Checkout hold missing. Return to step 1.");
      }

      if (!guest.fullName || !guest.email || !guest.phone) {
        throw new Error("Please complete guest details.");
      }

      const activeUser = auth.currentUser ?? (await signInAnonymously(auth)).user;

      const reservationId = await createReservation({
        restaurantId,
        tableId,
        userId: activeUser.uid,
        guestCount: guests,
        serviceType,
        date,
        startTime,
        endTime,
        paymentId: paymentId ?? undefined,
        extras,
        timezone: "Africa/Addis_Ababa",
        holdId,
      });

      await sendNotification({
        userId: activeUser.uid,
        channel: "email",
        template: "booking-confirmed",
        metadata: {
          reservationId,
          serviceType,
          date,
          slot,
        },
      });

      await sendNotification({
        userId: activeUser.uid,
        channel: "sms",
        template: "booking-confirmed",
        metadata: {
          reservationId,
          serviceType,
        },
      });

      return reservationId;
    },
    onSuccess: (reservationId) => {
      router.push(
        `/confirmation?reservationId=${reservationId}&paymentId=${paymentId ?? ""}&service=${serviceType}`,
      );
    },
    onError: (error: Error) => {
      setCheckoutError(error.message);
    },
  });

  const onContinueFromStepOne = async () => {
    if (!restaurantId || !date || !startTime || !endTime) {
      setCheckoutError("Please complete reservation basics first.");
      return;
    }

    if (!availabilityQuery.data?.available) {
      setCheckoutError("Selected slot is unavailable. Please choose another.");
      return;
    }

    await createHoldMutation.mutateAsync();
  };

  return (
    <section className="hotel-card rounded-4xl p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">Reservation Checkout</p>
      <h1 className="display-font mt-2 text-5xl leading-none text-[#2b0d0a]">Multi-step Booking</h1>

      <div className="mt-5 grid gap-2 sm:grid-cols-5">
        {["Slot", "Guest", "Extras", "Payment", "Confirm"].map((item, index) => (
          <div
            key={item}
            className={`rounded-full px-3 py-2 text-center text-xs font-semibold ${
              step >= index + 1 ? "bg-[#a4271f] text-white" : "bg-[#ead8b9] text-[#6d3a2f]"
            }`}
          >
            {index + 1}. {item}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-[#5d3c35]">
            Service Type
            <select
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value as ServiceType)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="dining">Dining</option>
              <option value="room-service">Room Service</option>
              <option value="events">Events</option>
            </select>
          </label>

          <label className="text-sm text-[#5d3c35]">
            Guests
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <label className="text-sm text-[#5d3c35]">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <label className="text-sm text-[#5d3c35]">
            Slot
            <select
              value={slot}
              onChange={(event) => setSlot(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="09:00-10:30">09:00 - 10:30</option>
              <option value="12:00-13:30">12:00 - 13:30</option>
              <option value="19:00-20:30">19:00 - 20:30</option>
            </select>
          </label>

          <div className="rounded-xl bg-[#f2e3c7] p-3 text-sm text-[#5d3c35] md:col-span-2">
            <p>Hotel: {restaurantQuery.data?.name ?? restaurantId || "Not selected"}</p>
            <p>
              Availability: {availabilityQuery.isLoading ? "Checking" : availabilityQuery.data?.available ? "Available" : "Unavailable"}
            </p>
          </div>

          <button
            onClick={onContinueFromStepOne}
            disabled={createHoldMutation.isPending}
            className="rounded-full bg-[#a4271f] px-5 py-2 text-sm font-semibold text-white md:col-span-2"
          >
            {createHoldMutation.isPending ? "Locking Inventory..." : "Continue to Guest Details"}
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-[#5d3c35] md:col-span-2">
            Full Name
            <input
              value={guest.fullName}
              onChange={(event) => setGuest((current) => ({ ...current, fullName: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <label className="text-sm text-[#5d3c35]">
            Email
            <input
              type="email"
              value={guest.email}
              onChange={(event) => setGuest((current) => ({ ...current, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <label className="text-sm text-[#5d3c35]">
            Phone
            <input
              value={guest.phone}
              onChange={(event) => setGuest((current) => ({ ...current, phone: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            />
          </label>

          <button
            onClick={() => setStep(3)}
            className="rounded-full bg-[#a4271f] px-5 py-2 text-sm font-semibold text-white md:col-span-2"
          >
            Continue to Extras
          </button>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-6 space-y-3 text-sm text-[#5d3c35]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={extras.decoration}
              onChange={(event) =>
                setExtras((current) => ({ ...current, decoration: event.target.checked }))
              }
            />
            Decoration setup (+ETB 350)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={extras.cake}
              onChange={(event) => setExtras((current) => ({ ...current, cake: event.target.checked }))}
            />
            Celebration cake (+ETB 600)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={extras.airportPickup}
              onChange={(event) =>
                setExtras((current) => ({ ...current, airportPickup: event.target.checked }))
              }
            />
            Airport pickup (+ETB 900)
          </label>

          <button
            onClick={() => setStep(4)}
            className="rounded-full bg-[#a4271f] px-5 py-2 text-sm font-semibold text-white"
          >
            Continue to Payment
          </button>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-[#f2e3c7] p-3 text-sm text-[#5d3c35]">
            <p>Total Amount: ETB {amount.toLocaleString()}</p>
            <p>Payment Status: {paymentStatus}</p>
          </div>

          <label className="text-sm text-[#5d3c35]">
            Method
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="card">Card</option>
              <option value="mobile-money">Mobile Money</option>
            </select>
          </label>

          <button
            onClick={() => finalizePaymentMutation.mutate()}
            disabled={finalizePaymentMutation.isPending}
            className="rounded-full bg-[#a4271f] px-5 py-2 text-sm font-semibold text-white"
          >
            {finalizePaymentMutation.isPending ? "Processing Payment..." : "Pay & Continue"}
          </button>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-[#f2e3c7] p-3 text-sm text-[#5d3c35]">
            <p>Service: {serviceType}</p>
            <p>Date: {date}</p>
            <p>Slot: {slot}</p>
            <p>Guests: {guests}</p>
            <p>Payment: {paymentStatus}</p>
          </div>

          <button
            onClick={() => reserveMutation.mutate()}
            disabled={reserveMutation.isPending}
            className="rounded-full bg-[#a4271f] px-5 py-2 text-sm font-semibold text-white"
          >
            {reserveMutation.isPending ? "Finalizing Reservation..." : "Confirm Reservation"}
          </button>
        </div>
      ) : null}

      {checkoutError ? <p className="mt-4 text-sm text-rose-700">{checkoutError}</p> : null}
    </section>
  );
}
