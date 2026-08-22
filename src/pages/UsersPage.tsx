import { useQuery } from "@tanstack/react-query";
import Usercard from "../components/Usercard";
import type { ApiUser } from "../models";
import { fetchUsers } from "../api/client";

function UsersPage() {
  const { data, isPending, isError, error } = useQuery<ApiUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isPending) {
    return <div className="animate-pulse p-6 text-gray-500">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">{error.message}</div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Users</h2>
      <div className="flex max-w-sm flex-col gap-2">
        {data.map((user) => <Usercard key={user.id} user={user} />)}
      </div>
    </div>
  );
}

export default UsersPage;
