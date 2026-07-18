import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StatusBadge from "./StatusBadge";
export default function ComplaintCard({ item, onSelect }) {
    return (_jsxs("div", { onClick: () => onSelect && onSelect(item.id), style: { border: "1px solid #e6e6e6", padding: 12, borderRadius: 8, cursor: "pointer" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("div", { style: { fontWeight: 700 }, children: item.title }), _jsx(StatusBadge, { status: item.status })] }), _jsx("div", { style: { fontSize: 13, color: "#444", marginTop: 8 }, children: item.location }), _jsx("div", { style: { marginTop: 8, fontSize: 13, color: "#666" }, children: item.description?.slice(0, 120) })] }));
}
