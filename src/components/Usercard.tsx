import React from "react";
import type { User } from "../models";

export default function Usercard({ user }: { user: User }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>{user.name.charAt(0)}</div>
      <div>
        <div style={{ fontWeight: 700 }}>{user.name}</div>
        <div style={{ fontSize: 12, color: "#555" }}>{user.role}</div>
      </div>
    </div>
  );
}
