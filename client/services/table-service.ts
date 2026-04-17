import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RestaurantTable } from "@/types/domain";

const tablesCol = collection(db, "tables");

export async function getTables(restaurantId: string): Promise<RestaurantTable[]> {
  const tablesQuery = query(
    tablesCol,
    where("restaurantId", "==", restaurantId),
    orderBy("capacity", "asc"),
  );

  const snapshot = await getDocs(tablesQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<RestaurantTable, "id">),
  }));
}

export async function createTable(
  payload: Omit<RestaurantTable, "id">,
): Promise<string> {
  const created = await addDoc(tablesCol, payload);
  return created.id;
}

export async function updateTable(
  tableId: string,
  payload: Partial<Omit<RestaurantTable, "id" | "restaurantId">>,
): Promise<void> {
  const tableRef = doc(db, "tables", tableId);
  await updateDoc(tableRef, payload);
}

export async function deleteTable(tableId: string): Promise<void> {
  const tableRef = doc(db, "tables", tableId);
  await deleteDoc(tableRef);
}
