import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Item, User } from "../models";
import useAuthStore from "../store/authStore";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [item, setItem] = useState<Item | null | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [claimantId, setClaimantId] = useState<string>("");

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Item | null) => setItem(data));
    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, [id]);

  const claim = async (): Promise<void> => {
    if (claimantId === "" || item === null || item === undefined) return;
    await fetch(`/api/items/${item.id}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimantId: Number(claimantId) }),
    });
    alert("Claim submitted");
    navigate("/items");
  };

  const suggestDescription = async (): Promise<void> => {
    if (item === null || item === undefined) return;
    const response = await fetch(`/api/items/${item.id}/suggest-description`, { method: "POST" });
    const data = await response.json();
    alert(data.suggestion);
  };

  if (item === undefined) {
    return <div className="animate-pulse p-6 text-gray-500">Loading item...</div>;
  }

  if (item === null) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        No item found with id "{id}".
      </div>
    );
  }

  return (
    <div className="max-w-sm">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        <strong>Location:</strong> {item.location}
      </p>

      {user === null ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Log in to claim this item.</p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={claimantId}
            onChange={(e) => setClaimantId(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- choose claimant --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
          <button
            onClick={claim}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Claim
          </button>
        </div>
      )}

      <button
        onClick={suggestDescription}
        className="mt-2 rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
      >
        Suggest description
      </button>

      <button
        onClick={() => navigate("/items")}
        className="mt-4 block rounded bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
      >
        Back to Items
      </button>
    </div>
  );
}

export default ItemDetailPage;
