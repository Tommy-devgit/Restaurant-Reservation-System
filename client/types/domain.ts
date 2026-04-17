export type UserRole = "admin" | "customer";

export type ReservationStatus = "confirmed" | "cancelled";

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
};

export type Reservation = {
  id: string;
  restaurantId: string;
  tableId: string;
  userId: string;
  guestCount: number;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  createdAt: string;
};

export type CreateReservationInput = {
  restaurantId: string;
  tableId?: string;
  userId: string;
  guestCount: number;
  date: string;
  startTime: string;
  endTime: string;
};
