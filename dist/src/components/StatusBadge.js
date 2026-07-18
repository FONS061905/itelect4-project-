import { jsx as _jsx } from "react/jsx-runtime";
export default function StatusBadge({ status }) {
    const color = status === "reported" ? "orange" : status === "claimed" ? "blue" : status === "verified" ? "green" : status === "returned" ? "gray" : "black";
    const style = { padding: "4px 8px", borderRadius: 8, background: color, color: "white", fontWeight: 600, fontSize: 12 };
    return _jsx("span", { style: style, children: status });
}
