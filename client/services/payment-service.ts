import type {
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
} from "@/types/domain";

type CreatePaymentInput = {
  reservationId?: string;
  userId: string;
  method: PaymentMethod;
  amount: number;
  currency?: string;
};

const STORAGE_KEY = "hotel-payment-records";

let memoryPayments: PaymentRecord[] = [];

function readPayments(): PaymentRecord[] {
  if (typeof window === "undefined") {
    return memoryPayments;
  }

  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (!serialized) {
    return [];
  }

  try {
    return JSON.parse(serialized) as PaymentRecord[];
  } catch {
    return [];
  }
}

function writePayments(rows: PaymentRecord[]) {
  memoryPayments = rows;

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function createPaymentId() {
  return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function initiatePayment(
  input: CreatePaymentInput,
): Promise<PaymentRecord> {
  const existing = readPayments();

  const payment: PaymentRecord = {
    id: createPaymentId(),
    reservationId: input.reservationId ?? "pending",
    userId: input.userId,
    method: input.method,
    amount: input.amount,
    currency: input.currency ?? "ETB",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  writePayments([payment, ...existing]);

  return payment;
}

export async function resolvePayment(
  paymentId: string,
  status: Exclude<PaymentStatus, "pending">,
): Promise<PaymentRecord | null> {
  const rows = readPayments();
  const index = rows.findIndex((item) => item.id === paymentId);

  if (index < 0) {
    return null;
  }

  const updated: PaymentRecord = {
    ...rows[index],
    status,
  };

  rows[index] = updated;
  writePayments(rows);

  return updated;
}

export async function listPayments(): Promise<PaymentRecord[]> {
  return readPayments();
}

export async function getPaymentsByUser(userId: string): Promise<PaymentRecord[]> {
  return readPayments().filter((item) => item.userId === userId);
}

export async function getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
  return readPayments().find((item) => item.id === paymentId) ?? null;
}

export function verifyWebhookSignature(
  signature: string | null,
  sharedSecret: string | undefined,
): boolean {
  if (!signature || !sharedSecret) {
    return false;
  }

  return signature === sharedSecret;
}
