import type { User } from "../models";

export default function Usercard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        {user.name.charAt(0)}
      </div>
      <div>
        <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
      </div>
    </div>
  );
}
