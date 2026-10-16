export type UserRole = "student" | "security" | "admin";

export interface User {
  id: number;
  name: string;
  role: UserRole;
  contact?: string;
}

export type ItemType = "lost" | "found";

export enum ItemStatus {
  Reported = "reported",
  Claimed = "claimed",
  Verified = "verified",
  Returned = "returned",
}

export interface Item {
  id: number;
  title: string;
  type: ItemType;
  description: string;
  location: string;
  reporterId: number;
  status: ItemStatus;
  createdAt: string;
}

export enum ClaimStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface Claim {
  id: number;
  itemId: number;
  claimantId: number;
  reason?: string;
  status: ClaimStatus;
  createdAt: string;
}

// MongoDB makes its own ids and sends them as strings. Both types below
// are DERIVED from User/Item, so those stay the single source of truth.
export type ApiUser = Omit<User, "id"> & { id: string; email: string };

export type ApiItem = Omit<Item, "id" | "reporterId"> & {
  id: string;
  reporterId: string;
};

// What we SEND when creating one -- no id, reporterId or createdAt;
// the server sets those (the reporter comes from the token).
export type NewItem = Omit<ApiItem, "id" | "reporterId" | "createdAt">;

// POST /api/auth/login replies with this.
export interface AuthResponse {
  user: ApiUser;
  token: string;
}

// A campus location from GET /api/locations. The code is its identity.
export interface Location {
  code: string;
  name: string;
  building: string;
  floor: number;
}
