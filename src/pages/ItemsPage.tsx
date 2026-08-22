import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import ComplaintCard from "../components/ComplaintCard";
import type { ApiItem, ApiUser, NewItem } from "../models";
import { ItemStatus } from "../models";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchItems, fetchUsers, createItem } from "../api/client";

function ItemsPage() {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery<ApiItem[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const { data: users } = useQuery<ApiUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Moved to the store -- both the nav bar's theme and this search box
  // are settings ABOUT the app, not state owned by one component.
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<"lost" | "found">("lost");
  const [location, setLocation] = useState<string>("");
  const [reporterId, setReporterId] = useState<string>("");

  const addItem = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setTitle("");
      setLocation("");
      setReporterId("");
    },
  });

  const handleAdd = (): void => {
    const newItem: NewItem = {
      title,
      type,
      description: "",
      location,
      reporterId,
      status: ItemStatus.Reported,
      createdAt: new Date().toISOString(),
    };
    addItem.mutate(newItem);
  };

  if (isPending) {
    return <div className="animate-pulse p-6 text-gray-500">Loading items...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  const filteredItems = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Items</h2>

      <div className="mb-6 flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item title"
          className="rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value === "found" ? "found" : "lost")}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={reporterId}
          onChange={(e) => setReporterId(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">-- reporter --</option>
          {(users ?? []).map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={title === "" || location === "" || reporterId === "" || addItem.isPending}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addItem.isPending ? "Saving..." : "Report Item"}
        </button>
      </div>
      {addItem.isError && (
        <p className="mb-4 text-sm text-red-700">{addItem.error.message}</p>
      )}

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items"
        className="mb-3 w-full max-w-sm rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Previous search: {previousSearch}</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/items/${item.id}`}>
            <ComplaintCard item={item} variant="compact" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
