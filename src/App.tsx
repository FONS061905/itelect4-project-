import React, { useEffect, useState } from "react";
import ComplaintCard from "./components/ComplaintCard";
import Usercard from "./components/Usercard";
import type { Item, User } from "./models";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [counts, setCounts] = useState({ totalItems: 0, openClaims: 0 });

  useEffect(() => {
    fetch("/api/items").then(r => r.json()).then(setItems);
    fetch("/api/users").then(r => r.json()).then(setUsers);

    const es = new EventSource("/api/counts/stream");
    es.onmessage = (e) => {
      try { setCounts(JSON.parse(e.data)); } catch { }
    };
    return () => es.close();
  }, []);

  const claim = async (itemId: number, claimantId: number) => {
    await fetch(`/api/items/${itemId}/claim`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claimantId }) });
    const updated = await fetch("/api/items").then(r => r.json());
    setItems(updated);
  };

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <div style={{ width: 360 }}>
        <h2>Lost & Found</h2>
        <div style={{ marginBottom: 8, color: "#333" }}>Live: {counts.totalItems} items • Pending claims: {counts.openClaims}</div>
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((i: Item) => <div key={i.id}><ComplaintCard item={i} onSelect={(id)=>{ const it = items.find((x: Item) => x.id===id); setSelected(it||null); }} /></div>)}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3>Detail</h3>
        {selected ? (
          <div>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <p><strong>Location:</strong> {selected.location}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select id="claimant-select">
                <option value="">-- choose user --</option>
                {users.map((u: User) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
              <button onClick={async ()=>{ const sel = (document.getElementById("claimant-select") as HTMLSelectElement).value; if(sel){ await claim(selected.id, Number(sel)); alert("Claim submitted"); } }}>Claim</button>
              <button onClick={async ()=>{ const res = await fetch(`/api/items/${selected.id}/suggest-description`, { method: "POST" }); const js = await res.json(); alert(js.suggestion); }}>Suggest description</button>
            </div>
          </div>
        ) : (
          <div>Select an item to view details</div>
        )}
      </div>
      <div style={{ width: 240 }}>
        <h4>Users</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map((u: User) => <div key={u.id}><Usercard user={u} /></div>)}
        </div>
      </div>
    </div>
  );
}
