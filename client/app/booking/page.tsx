import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { BookingForm } from "@/components/customer/booking-form";

export default function BookingPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-slate-600">Loading booking form...</p>}>
        <BookingForm />
      </Suspense>
    </AppShell>
  );
}
