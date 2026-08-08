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
  const [isError, setIsError] = useState<boolean>(false);
  const [showDetails, toggleDetails] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
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

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 rounded-lg bg-red-50 p-4 text-red-700">
        Could not load items. Please try again.
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lost & Found</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Live: {counts.totalItems} items • Pending claims: {counts.openClaims}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => setIsError(true)}
              className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
            >
              Simulate Error
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search items"
              className="mb-3 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {previousSearch !== undefined && previousSearch !== searchTerm && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Previous search: {previousSearch}</p>
            )}
            <button
              onClick={toggleDetails}
              className="mb-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>
            {showDetails && <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Viewing filtered items.</p>}
            <div className="grid gap-3">
              {filteredItems.map((item: Item) => (
                <ComplaintCard
                  key={item.id}
                  item={item}
                  variant={showDetails ? "default" : "compact"}
                  onSelect={(id) => {
                    const nextItem = items.find((currentItem: Item) => currentItem.id === id);
                    setSelected(nextItem || null);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Detail</h3>
            {selected ? (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{selected.title}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{selected.description}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Location:</strong> {selected.location}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    id="claimant-select"
                    className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">-- choose user --</option>
                    {users.map((user: User) => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}
                  </select>
                  <button
                    onClick={async () => {
                      const selectedUser = (document.getElementById("claimant-select") as HTMLSelectElement).value;
                      if (selectedUser) {
                        await claim(selected.id, Number(selectedUser));
                        alert("Claim submitted");
                      }
                    }}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Claim
                  </button>
                  <button
                    onClick={async () => {
                      const response = await fetch(`/api/items/${selected.id}/suggest-description`, { method: "POST" });
                      const responseJson = await response.json();
                      alert(responseJson.suggestion);
                    }}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
                  >
                    Suggest description
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">Select an item to view details</div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Users</h4>
            <div className="flex flex-col gap-2">
              {users.map((user: User) => <Usercard key={user.id} user={user} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
