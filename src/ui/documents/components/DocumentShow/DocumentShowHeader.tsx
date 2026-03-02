import { X, RefreshCcw, Share2, MoreHorizontal, Send } from "lucide-react";

interface DocumentShowHeaderProps {
  partnerName: string;
  numberSerie: string | null;
  onClose: () => void;
}

export default function DocumentShowHeader({
  partnerName,
  numberSerie,
  onClose,
}: DocumentShowHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-[#e5e7eb] dark:border-gray-800 flex items-center justify-between  pb-4 shrink-0 p-2">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold truncate max-w-[300px] text-[#1f2937] dark:text-gray-100">
          {partnerName} - {numberSerie || "Draft"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer">
          <RefreshCcw className="w-3.5 h-3.5" />
          Convertir
        </button>
        <button className="p-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
          <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        <button className="p-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
          <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        <button className="bg-[#2463eb] text-white px-4 py-1.5 text-xs font-medium rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer transition-colors">
          <Send className="w-3.5 h-3.5" />
          Enviar
        </button>
      </div>
    </header>
  );
}
