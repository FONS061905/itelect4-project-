import React, { useEffect, useRef, useState } from "react";
import ComplaintCard from "./components/ComplaintCard";
import Usercard from "./components/Usercard";
import type { Item, User } from "./models";
import usePrevious from "./hooks/usePrevious";
import useToggle from "./hooks/useToggle";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [counts, setCounts] = useState({ totalItems: 0, openClaims: 0 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDetails, toggleDetails] = useToggle(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious<string>(searchTerm);

  useEffect(() => {
    const loadData = async () => {
      const [itemsResponse, usersResponse] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/users")
      ]);

      const nextItems = await itemsResponse.json() as Item[];
      const nextUsers = await usersResponse.json() as User[];
      setItems(nextItems);
      setUsers(nextUsers);
      setIsLoading(false);
    };

    loadData();

    const es = new EventSource("/api/counts/stream");
    es.onmessage = (event) => {
      try {
        setCounts(JSON.parse(event.data));
      } catch {
        // ignore malformed payloads
      }
    };
    return () => es.close();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      searchInputRef.current?.focus();
    }
  }, [isLoading]);

  const claim = async (itemId: number, claimantId: number) => {
    await fetch(`/api/items/${itemId}/claim`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claimantId }) });
    const updated = await fetch("/api/items").then(r => r.json());
    setItems(updated);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <div style={{ width: 360 }}>
        <h2>Lost & Found</h2>
        <div style={{ marginBottom: 8, color: "#333" }}>Live: {counts.totalItems} items • Pending claims: {counts.openClaims}</div>
        {isLoading ? (
          <p>Loading items...</p>
        ) : (
          <>
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search items"
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            {previousSearch !== undefined && previousSearch !== searchTerm && (
              <p style={{ marginTop: -4, marginBottom: 8, color: "#666" }}>Previous search: {previousSearch}</p>
            )}
            <button onClick={toggleDetails} style={{ marginBottom: 12 }}>
              {showDetails ? "Hide details" : "Show details"}
            </button>
            {showDetails && <p style={{ marginTop: -4, marginBottom: 8, color: "#555" }}>Viewing filtered items.</p>}
            <div style={{ display: "grid", gap: 12 }}>
              {filteredItems.map((item: Item) => (
                <div key={item.id}>
                  <ComplaintCard
                    item={item}
                    onSelect={(id) => {
                      const nextItem = items.find((currentItem: Item) => currentItem.id === id);
                      setSelected(nextItem || null);
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
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
                {users.map((user: User) => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}
              </select>
              <button onClick={async () => {
                const selectedUser = (document.getElementById("claimant-select") as HTMLSelectElement).value;
                if (selectedUser) {
                  await claim(selected.id, Number(selectedUser));
                  alert("Claim submitted");
                }
              }}>Claim</button>
              <button onClick={async () => {
                const response = await fetch(`/api/items/${selected.id}/suggest-description`, { method: "POST" });
                const responseJson = await response.json();
                alert(responseJson.suggestion);
              }}>Suggest description</button>
            </div>
          </div>
        ) : (
          <div>Select an item to view details</div>
        )}
      </div>
      <div style={{ width: 240 }}>
        <h4>Users</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map((user: User) => <div key={user.id}><Usercard user={user} /></div>)}
        </div>
      </div>
    </div>
  );
}
