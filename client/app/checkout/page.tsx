import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { CheckoutFlow } from "@/components/customer/checkout-flow";

export default function CheckoutPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-[#6a4a43]">Loading checkout flow...</p>}>
        <CheckoutFlow />
      </Suspense>
    </AppShell>
  );
}
