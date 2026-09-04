import { Link } from "react-router";

function DashboardPage() {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/items"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Browse Items
        </Link>
        <Link
          to="/users"
          className="rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
        >
          View Users
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
