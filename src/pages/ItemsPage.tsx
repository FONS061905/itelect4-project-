import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import ComplaintCard from "../components/ComplaintCard";
import type { Item } from "../models";
import usePrevious from "../hooks/usePrevious";

function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious<string>(searchTerm);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data: Item[]) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      searchInputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="animate-pulse p-6 text-gray-500">Loading items...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load items. Please try again.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Items</h2>
      <input
        ref={searchInputRef}
        value={searchTerm}
        onChange={handleSearchChange}
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
