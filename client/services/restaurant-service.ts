import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Restaurant } from "@/types/domain";

const restaurantsCol = collection(db, "restaurants");

export async function getRestaurants(): Promise<Restaurant[]> {
  const snapshot = await getDocs(restaurantsCol);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Restaurant, "id">),
  }));
}

export async function getRestaurantById(
  restaurantId: string,
): Promise<Restaurant | null> {
  const restaurantRef = doc(db, "restaurants", restaurantId);
  const snapshot = await getDoc(restaurantRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Restaurant, "id">),
  };
}

export async function getRestaurantsByOwner(ownerId: string): Promise<Restaurant[]> {
  const ownerQuery = query(restaurantsCol, where("ownerId", "==", ownerId));
  const snapshot = await getDocs(ownerQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Restaurant, "id">),
  }));
}

export async function createRestaurant(
  payload: Omit<Restaurant, "id">,
): Promise<string> {
  const created = await addDoc(restaurantsCol, payload);
  return created.id;
}

export async function updateRestaurant(
  restaurantId: string,
  payload: Partial<Omit<Restaurant, "id" | "ownerId">>,
): Promise<void> {
  const restaurantRef = doc(db, "restaurants", restaurantId);
  await updateDoc(restaurantRef, payload);
}
