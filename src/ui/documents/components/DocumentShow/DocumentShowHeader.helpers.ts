/** States where the Edit button should be visible in the header */
export const EDITABLE_STATES = ["draft"];

/** Map status key to a hex color for the chip */
export function getStatusColor(key: string): string {
  const map: Record<string, string> = {
    draft: "#f59e0b",
    validated: "#3b82f6",
    approved: "#6366f1",
    issued: "#22c55e",
    converted: "#94a3b8",
    delivered: "#10b981",
    cancelled: "#ef4444",
    rejected: "#ef4444",
    collected: "#8b5cf6",
    paid: "#8b5cf6",
    invoiced: "#6366f1",
    partially_collected: "#a78bfa",
    partially_paid: "#a78bfa",
  };
  return map[key] || "#64748b";
}

export const HEADER_BTN_CLASS =
  "px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer transition-colors";
