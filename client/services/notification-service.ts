type NotificationChannel = "email" | "sms";

type NotificationPayload = {
  userId: string;
  channel: NotificationChannel;
  template: "booking-confirmed" | "booking-cancelled" | "payment-failed";
  metadata: Record<string, string>;
};

const sentLog: Array<NotificationPayload & { sentAt: string }> = [];

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  sentLog.unshift({
    ...payload,
    sentAt: new Date().toISOString(),
  });
}

export async function listNotificationLog() {
  return sentLog;
}
