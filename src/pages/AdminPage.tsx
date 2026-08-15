import { useEffect, useState } from "react";
import ComplaintCard from "../components/ComplaintCard";
import type { Item } from "../models";
import useAuthStore from "../store/authStore";

function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const user = useAuthStore((state) => state.user);

  const loadItems = (): void => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data: Item[]) => setItems(data));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const markReturned = async (itemId: number): Promise<void> => {
    if (user === null) return;
    await fetch(`/api/items/${itemId}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user.id }),
    });
    loadItems();
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Admin</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id}>
            <ComplaintCard item={item} />
            <button
              onClick={() => markReturned(item.id)}
              className="mt-2 w-full rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900"
            >
              Mark Returned
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
