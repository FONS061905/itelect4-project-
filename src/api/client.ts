import type { ApiItem, ApiUser, ItemStatus, NewItem } from "../models";

export const API_URL = "http://localhost:3001";

// GET /items -> the whole list
export async function fetchItems(): Promise<ApiItem[]> {
  const res = await fetch(`${API_URL}/items`);
  if (!res.ok) {
    throw new Error("Could not load items");
  }
  return res.json();
}

// GET /items/:id -> one item
export async function fetchItemById(id: string): Promise<ApiItem> {
  const res = await fetch(`${API_URL}/items/${id}`);
  if (!res.ok) {
    throw new Error(`No item found with id "${id}".`);
  }
  return res.json();
}

// POST /items -> the row the server saved, with the id it made
export async function createItem(newItem: NewItem): Promise<ApiItem> {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });
  if (!res.ok) {
    throw new Error("Could not save the item");
  }
  return res.json();
}

// PATCH /items/:id -> used for claiming and marking an item returned
export async function updateItemStatus(id: string, status: ItemStatus): Promise<ApiItem> {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error("Could not update the item");
  }
  return res.json();
}

// GET /users
export async function fetchUsers(): Promise<ApiUser[]> {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) {
    throw new Error("Could not load users");
  }
  return res.json();
}
