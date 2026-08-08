import { ItemStatus } from "../models";

const statusStyles: Record<ItemStatus, string> = {
  [ItemStatus.Reported]: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  [ItemStatus.Claimed]: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  [ItemStatus.Verified]: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  [ItemStatus.Returned]: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
