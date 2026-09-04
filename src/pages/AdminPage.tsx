import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ComplaintCard from "../components/ComplaintCard";
import type { ApiItem } from "../models";
import { ItemStatus } from "../models";
import { fetchItems, updateItemStatus } from "../api/client";

function AdminPage() {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery<ApiItem[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const markReturned = useMutation({
    mutationFn: (id: string) => updateItemStatus(id, ItemStatus.Returned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  if (isPending) {
    return <div className="animate-pulse p-6 text-gray-500">Loading items...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">{error.message}</div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Admin</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div key={item.id}>
            <ComplaintCard item={item} />
            <button
              onClick={() => markReturned.mutate(item.id)}
              disabled={markReturned.isPending}
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
