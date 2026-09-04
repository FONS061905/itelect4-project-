import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import type { ApiItem } from "../models";
import { ItemStatus } from "../models";
import { fetchItemById, updateItemStatus } from "../api/client";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // The id from the URL goes INTO the key, so each item gets its own
  // cache entry instead of every item sharing one.
  const { data, isPending, isError, error } = useQuery<ApiItem>({
    queryKey: ["items", id],
    queryFn: () => fetchItemById(id!),
    enabled: id !== undefined,
  });

  const claim = useMutation({
    mutationFn: (itemId: string) => updateItemStatus(itemId, ItemStatus.Claimed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", id] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  if (isPending) {
    return <div className="animate-pulse p-6 text-gray-500">Loading item...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">{error.message}</div>
    );
  }

  return (
    <div className="max-w-sm">
      <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{data.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{data.description}</p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        <strong>Location:</strong> {data.location}
      </p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        <strong>Status:</strong> {data.status}
      </p>

      <button
        onClick={() => claim.mutate(data.id)}
        disabled={data.status !== ItemStatus.Reported || claim.isPending}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        {claim.isPending ? "Claiming..." : "Claim This Item"}
      </button>

      <button
        onClick={() => navigate("/items")}
        className="mt-4 ml-2 rounded bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
      >
        Back to Items
      </button>
    </div>
  );
}

export default ItemDetailPage;
