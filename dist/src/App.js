import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ComplaintCard from "./components/ComplaintCard";
import Usercard from "./components/Usercard";
export default function App() {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [counts, setCounts] = useState({ totalItems: 0, openClaims: 0 });
    useEffect(() => {
        fetch("/api/items").then(r => r.json()).then(setItems);
        fetch("/api/users").then(r => r.json()).then(setUsers);
        const es = new EventSource("/api/counts/stream");
        es.onmessage = (e) => {
            try {
                setCounts(JSON.parse(e.data));
            }
            catch { }
        };
        return () => es.close();
    }, []);
    const claim = async (itemId, claimantId) => {
        await fetch(`/api/items/${itemId}/claim`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claimantId }) });
        const updated = await fetch("/api/items").then(r => r.json());
        setItems(updated);
    };
    return (_jsxs("div", { style: { display: "flex", gap: 24, padding: 24 }, children: [_jsxs("div", { style: { width: 360 }, children: [_jsx("h2", { children: "Lost & Found" }), _jsxs("div", { style: { marginBottom: 8, color: "#333" }, children: ["Live: ", counts.totalItems, " items \u2022 Pending claims: ", counts.openClaims] }), _jsx("div", { style: { display: "grid", gap: 12 }, children: items.map((i) => _jsx("div", { children: _jsx(ComplaintCard, { item: i, onSelect: (id) => { const it = items.find((x) => x.id === id); setSelected(it || null); } }) }, i.id)) })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { children: "Detail" }), selected ? (_jsxs("div", { children: [_jsx("h2", { children: selected.title }), _jsx("p", { children: selected.description }), _jsxs("p", { children: [_jsx("strong", { children: "Location:" }), " ", selected.location] }), _jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [_jsxs("select", { id: "claimant-select", children: [_jsx("option", { value: "", children: "-- choose user --" }), users.map((u) => _jsxs("option", { value: u.id, children: [u.name, " (", u.role, ")"] }, u.id))] }), _jsx("button", { onClick: async () => { const sel = document.getElementById("claimant-select").value; if (sel) {
                                            await claim(selected.id, Number(sel));
                                            alert("Claim submitted");
                                        } }, children: "Claim" }), _jsx("button", { onClick: async () => { const res = await fetch(`/api/items/${selected.id}/suggest-description`, { method: "POST" }); const js = await res.json(); alert(js.suggestion); }, children: "Suggest description" })] })] })) : (_jsx("div", { children: "Select an item to view details" }))] }), _jsxs("div", { style: { width: 240 }, children: [_jsx("h4", { children: "Users" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: users.map((u) => _jsx("div", { children: _jsx(Usercard, { user: u }) }, u.id)) })] })] }));
}
