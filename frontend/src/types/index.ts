export type UserRole = "student" | "security" | "admin"

export interface User {
  id: number
  name: string
  role: UserRole
  contact?: string
}

export type ItemType = "lost" | "found"

export enum ItemStatus {
  Reported = "reported",
  Claimed = "claimed",
  Verified = "verified",
  Returned = "returned",
}

export interface Item {
  id: number
  title: string
  type: ItemType
  description: string
  location: string
  reporterId: number
  status: ItemStatus
  createdAt: string
}

export enum ClaimStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface Claim {
  id: number
  itemId: number
  claimantId: number
  reason?: string
  status: ClaimStatus
  createdAt: string
}
