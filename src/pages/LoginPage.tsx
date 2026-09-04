import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { ApiUser } from "../models";
import { fetchUsers } from "../api/client";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const { data: users } = useQuery<ApiUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const [selectedId, setSelectedId] = useState<string>("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (): void => {
    const user = (users ?? []).find((u) => u.id === selectedId);
    if (!user) return;
    login(user); // 1. put the token + user in the store
    navigate("/admin"); // 2. then send them where they were going
  };

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Login</h2>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="">-- choose account --</option>
        {(users ?? []).map((u) => (
          <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
        ))}
      </select>
      <button
        onClick={handleLogin}
        disabled={selectedId === ""}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        Log In
      </button>
    </div>
  );
}

export default LoginPage;
