import { useEffect, useState } from "react";
import Usercard from "../components/Usercard";
import type { User } from "../models";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="animate-pulse p-6 text-gray-500">Loading users...</div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
      <div className="flex max-w-sm flex-col gap-2">
        {users.map((user) => <Usercard key={user.id} user={user} />)}
      </div>
    </div>
  );
}

export default UsersPage;
