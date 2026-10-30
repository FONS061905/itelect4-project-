import { apiFetch } from "./client";
import type { Location } from "../models";

export async function fetchLocations(): Promise<Location[]> {
  return apiFetch<Location[]>("/api/locations");
}

export async function fetchLocationByCode(code: string): Promise<Location> {
  return apiFetch<Location>(`/api/locations/${code}`);
}
