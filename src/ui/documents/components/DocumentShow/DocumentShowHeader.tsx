import { useState, useRef, useEffect } from "react";
import {
  X,
  RefreshCcw,
  Share2,
  MoreHorizontal,
  PenLine,
  Printer,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { DocumentBreadcrumb } from "../DocumentBreadcrumb";

/** States where the Edit button should be visible in the header */
const EDITABLE_STATES = ["draft"];

interface DocumentShowHeaderProps {
  document: DocumentEntity;
  onClose: () => void;
}

/** Map status key to a hex color for the chip */
function getStatusColor(key: string): string {
  const map: Record<string, string> = {
    draft: "#f59e0b",
    validated: "#3b82f6",
    approved: "#6366f1",
    issued: "#22c55e",
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

export default function DocumentShowHeader({
  document,
  onClose,
}: DocumentShowHeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusKey = document.status?.key || "";
  const statusName = document.status?.name || statusKey;
  const statusColor = getStatusColor(statusKey);
  const isEditable = EDITABLE_STATES.includes(statusKey);
  const module = document.operation === "sale" ? "sales" : "purchases";
  const docTypeCode = document.document_type_code || "";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const btnClass =
    "px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer transition-colors";

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-[#e5e7eb] dark:border-gray-800 flex items-center justify-between p-2 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>
        <div className=" p-2 flex flex-col gap-1">
          <div className="">
            <h1 className="text-sm font-bold truncate max-w-[300px] text-gray-900 dark:text-gray-100 leading-tight">
              {document.document_type_name || "Documento"}:{" "}
              {document.partner_name} - {document.number_serie || "Borrador"}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className={btnClass}>
          <Printer className="w-3.5 h-3.5" />
          Imprimir
        </button>
        <button className={btnClass}>
          <Download className="w-3.5 h-3.5" />
          Descargar
        </button>
        <button className={btnClass}>
          <RefreshCcw className="w-3.5 h-3.5" />
          Convertir
        </button>
        <button className="p-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
          <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* 3-dot dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1">
              {isEditable && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/${module}/edit/${docTypeCode}/${document.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <PenLine className="w-3.5 h-3.5 text-amber-500" />
                  Editar borrador
                </button>
              )}
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Share2 className="w-3.5 h-3.5 text-gray-400" />
                Compartir
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Download className="w-3.5 h-3.5 text-gray-400" />
                Exportar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
