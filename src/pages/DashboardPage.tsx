import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Counts {
  totalItems: number;
  openClaims: number;
}

function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ totalItems: 0, openClaims: 0 });

  useEffect(() => {
    const es = new EventSource("/api/counts/stream");
    es.onmessage = (event) => {
      try {
        setCounts(JSON.parse(event.data));
      } catch {
        // ignore malformed payloads
      }
    };
    return () => es.close();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Live: {counts.totalItems} items reported &bull; {counts.openClaims} pending claims
      </div>
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
