import React from "react";
import type { ItemStatus } from "../models";

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const color =
    status === "reported" ? "orange" : status === "claimed" ? "blue" : status === "verified" ? "green" : status === "returned" ? "gray" : "black";
  const style: React.CSSProperties = { padding: "4px 8px", borderRadius: 8, background: color, color: "white", fontWeight: 600, fontSize: 12 };
  return <span style={style}>{status}</span>;
}
