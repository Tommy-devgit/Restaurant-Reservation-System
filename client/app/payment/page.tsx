"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import type { PaymentMethod } from "@/types/domain";

export default function PaymentPage() {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

  return (
    <AppShell>
      <section className="hotel-card mx-auto max-w-2xl rounded-4xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[#7f3a2f]">Payment Page</p>
        <h1 className="display-font mt-2 text-5xl leading-none text-[#2b0d0a]">Complete Payment</h1>

        <div className="mt-5 space-y-3">
          <label className="text-sm text-[#5d3c35]">
            Payment Method
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value as PaymentMethod)}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="card">Card</option>
              <option value="mobile-money">Mobile Money</option>
            </select>
          </label>

          <label className="text-sm text-[#5d3c35]">
            Payment Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "pending" | "success" | "failed")}
              className="mt-1 w-full rounded-xl border border-[#d1c0a4] bg-[#fffaf0] px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </label>
        </div>

        <article className="mt-4 rounded-2xl bg-[#f2e3c7] p-4 text-sm text-[#5d3c35]">
          <p>Method: {method}</p>
          <p>Status: {status}</p>
          <p>Mobile money is supported for Ethiopia-first checkout.</p>
        </article>
      </section>
    </AppShell>
  );
}
