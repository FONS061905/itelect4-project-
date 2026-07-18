import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Usercard({ user }) {
    return (_jsxs("div", { style: { border: "1px solid #ddd", padding: 8, borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 20, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }, children: user.name.charAt(0) }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 700 }, children: user.name }), _jsx("div", { style: { fontSize: 12, color: "#555" }, children: user.role })] })] }));
}
