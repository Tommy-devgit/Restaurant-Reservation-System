import {
  type QueryConstraint,
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { hasTimeConflict } from "@/lib/time";
import type {
  CreateReservationInput,
  Reservation,
  ReservationStatus,
  RestaurantTable,
  TimeSlot,
} from "@/types/domain";

const reservationsCol = collection(db, "reservations");
const tablesCol = collection(db, "tables");

type RawReservation = Omit<Reservation, "id" | "createdAt"> & {
  createdAt: Timestamp | null;
};

function normalizeReservation(docId: string, data: RawReservation): Reservation {
  return {
    id: docId,
    restaurantId: data.restaurantId,
    tableId: data.tableId,
    userId: data.userId,
    guestCount: data.guestCount,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    status: data.status,
    createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

function findAssignableTable(
  tables: RestaurantTable[],
  reservations: Reservation[],
  slot: TimeSlot,
  guestCount: number,
): RestaurantTable | null {
  const candidates = tables
    .filter((table) => table.capacity >= guestCount)
    .sort((a, b) => a.capacity - b.capacity);

  for (const table of candidates) {
    const tableReservations = reservations.filter(
      (reservation) =>
        reservation.tableId === table.id && reservation.status === "confirmed",
    );

    const conflictFound = tableReservations.some((reservation) =>
      hasTimeConflict(
        slot.startTime,
        slot.endTime,
        reservation.startTime,
        reservation.endTime,
      ),
    );

    if (!conflictFound) {
      return table;
    }
  }

  return null;
}

export async function getReservationsByDate(
  restaurantId: string,
  date: string,
  status?: ReservationStatus,
): Promise<Reservation[]> {
  const constraints: QueryConstraint[] = [
    where("restaurantId", "==", restaurantId),
    where("date", "==", date),
    orderBy("startTime", "asc"),
  ];

  if (status) {
    constraints.unshift(where("status", "==", status));
  }

  const reservationsQuery = query(reservationsCol, ...constraints);
  const snapshot = await getDocs(reservationsQuery);

  return snapshot.docs.map((item) =>
    normalizeReservation(item.id, item.data() as RawReservation),
  );
}

export async function checkAvailability(
  restaurantId: string,
  date: string,
  timeSlot: TimeSlot,
  guestCount: number,
): Promise<{
  available: boolean;
  tableId: string | null;
}> {
  const tablesQuery = query(
    tablesCol,
    where("restaurantId", "==", restaurantId),
    where("capacity", ">=", guestCount),
    orderBy("capacity", "asc"),
  );

  const reservations = await getReservationsByDate(restaurantId, date, "confirmed");
  const tablesSnapshot = await getDocs(tablesQuery);

  const tables = tablesSnapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<RestaurantTable, "id">),
  }));

  const table = findAssignableTable(tables, reservations, timeSlot, guestCount);

  return {
    available: Boolean(table),
    tableId: table?.id ?? null,
  };
}

export async function createReservation(
  payload: CreateReservationInput,
): Promise<string> {
  const tableChoice = payload.tableId
    ? { available: true, tableId: payload.tableId }
    : await checkAvailability(
        payload.restaurantId,
        payload.date,
        {
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
        payload.guestCount,
      );

  if (!tableChoice.available || !tableChoice.tableId) {
    throw new Error("No available table for this slot.");
  }

  const reservationId = await runTransaction(db, async (transaction) => {
    const lockedReservationsQuery = query(
      reservationsCol,
      where("restaurantId", "==", payload.restaurantId),
      where("tableId", "==", tableChoice.tableId),
      where("date", "==", payload.date),
      where("status", "==", "confirmed"),
    );

    const lockedSnapshot = await transaction.get(lockedReservationsQuery);

    const conflict = lockedSnapshot.docs.some((item) => {
      const reservation = item.data() as Omit<Reservation, "id" | "createdAt">;
      return hasTimeConflict(
        payload.startTime,
        payload.endTime,
        reservation.startTime,
        reservation.endTime,
      );
    });

    if (conflict) {
      throw new Error("Table already booked for this timeslot.");
    }

    const newDocRef = doc(reservationsCol);

    transaction.set(newDocRef, {
      restaurantId: payload.restaurantId,
      tableId: tableChoice.tableId,
      userId: payload.userId,
      guestCount: payload.guestCount,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: "confirmed",
      createdAt: serverTimestamp(),
    });

    return newDocRef.id;
  });

  return reservationId;
}

export async function cancelReservation(reservationId: string): Promise<void> {
  const reservationRef = doc(db, "reservations", reservationId);
  await updateDoc(reservationRef, {
    status: "cancelled",
  });
}

export function subscribeReservationsByDate(
  restaurantId: string,
  date: string,
  onData: (reservations: Reservation[]) => void,
): () => void {
  const reservationsQuery = query(
    reservationsCol,
    where("restaurantId", "==", restaurantId),
    where("date", "==", date),
    orderBy("startTime", "asc"),
  );

  return onSnapshot(reservationsQuery, (snapshot) => {
    onData(
      snapshot.docs.map((item) =>
        normalizeReservation(item.id, item.data() as RawReservation),
      ),
    );
  });
}
