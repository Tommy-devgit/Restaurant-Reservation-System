export type UserRole = "guest" | "customer" | "admin" | "staff";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type ServiceType = "dining" | "room-service" | "events";

export type PaymentMethod = "card" | "mobile-money";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type InventoryFeature = "wifi" | "ac" | "breakfast" | "city-view";

export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export type WorkingHours = {
  open: string;
  close: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  restaurantId: string | null;
};

export type Restaurant = {
  id: string;
  name: string;
  location: string;
  ownerId: string;
  workingHours: WorkingHours;
};

export type RestaurantTable = {
  id: string;
  restaurantId: string;
  tableNumber: string;
  capacity: number;
  price?: number;
  type?: string;
  imageUrl?: string;
  features?: InventoryFeature[];
  description?: string;
};

export type ReservationExtras = {
  decoration: boolean;
  cake: boolean;
  airportPickup: boolean;
};

export type Reservation = {
  id: string;
  restaurantId: string;
  tableId: string;
  userId: string;
  guestCount: number;
  serviceType?: ServiceType;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  paymentId?: string | null;
  extras?: ReservationExtras;
  timezone?: string;
  createdAt: string;
};

export type PaymentRecord = {
  id: string;
  reservationId: string;
  userId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
};

export type AvailabilitySlot = {
  id: string;
  restaurantId: string;
  tableId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

export type Promotion = {
  id: string;
  title: string;
  code: string;
  percentageOff: number;
  active: boolean;
};

export type CreateReservationInput = {
  restaurantId: string;
  tableId?: string;
  userId: string;
  guestCount: number;
  serviceType?: ServiceType;
  date: string;
  startTime: string;
  endTime: string;
  paymentId?: string;
  extras?: ReservationExtras;
  timezone?: string;
};
