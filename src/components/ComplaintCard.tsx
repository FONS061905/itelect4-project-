import StatusBadge from "./StatusBadge";
import type { Item } from "../models";

interface ComplaintCardProps {
  item: Item;
  onSelect?: (id: number) => void;
  variant?: "default" | "compact";
}

export default function ComplaintCard({ item, onSelect, variant = "default" }: ComplaintCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      onClick={() => onSelect && onSelect(item.id)}
      className={`cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
        isCompact ? "p-2" : "p-3"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className={`font-bold text-gray-900 dark:text-white ${isCompact ? "text-sm" : "text-base"}`}>
          {item.title}
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{item.location}</div>
      {!isCompact && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {item.description?.slice(0, 120)}
        </div>
      )}
    </div>
  );
}
