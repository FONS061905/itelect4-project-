import { apiFetch } from "./client";
import type { ApiItem, ItemStatus, NewItem } from "../models";

// GET /items -> the logged-in user's items, newest first
export async function fetchItems(): Promise<ApiItem[]> {
  return apiFetch<ApiItem[]>("/api/items");
}

// GET /items/:id -> one item (404 if it isn't yours)
export async function fetchItemById(id: string): Promise<ApiItem> {
  return apiFetch<ApiItem>(`/api/items/${id}`);
}

// POST /items -> the saved item; the server sets reporterId from the token
export async function createItem(newItem: NewItem): Promise<ApiItem> {
  return apiFetch<ApiItem>("/api/items", {
    method: "POST",
    body: JSON.stringify(newItem),
  });
}

// PATCH /items/:id -> used for claiming and marking an item returned
export async function updateItemStatus(id: string, status: ItemStatus): Promise<ApiItem> {
  return apiFetch<ApiItem>(`/api/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
