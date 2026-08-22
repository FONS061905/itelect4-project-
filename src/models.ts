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

// json-server generates its own ids and stores everything as JSON, so
// ids come back as strings instead of numbers. Both types below are
// DERIVED from User/Item, so those stay the single source of truth.
export type ApiUser = Omit<User, "id"> & { id: string };

export type ApiItem = Omit<Item, "id" | "reporterId"> & {
  id: string;
  reporterId: string;
};

// What we SEND when creating one -- no id yet, the server makes it.
export type NewItem = Omit<ApiItem, "id">;
