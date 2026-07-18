import React from "react";
import StatusBadge from "./StatusBadge";
import type { Item } from "../models";

export default function ComplaintCard({ item, onSelect }: { item: Item; onSelect?: (id: number) => void }) {
  return (
    <div onClick={() => onSelect && onSelect(item.id)} style={{ border: "1px solid #e6e6e6", padding: 12, borderRadius: 8, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>{item.title}</div>
        <StatusBadge status={item.status} />
      </div>
      <div style={{ fontSize: 13, color: "#444", marginTop: 8 }}>{item.location}</div>
      <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>{item.description?.slice(0, 120)}</div>
    </div>
  );
}
