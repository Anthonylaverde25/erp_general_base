import * as React from "react"
import { Clock } from "lucide-react"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { formatCurrency, formatEuropeanDate } from "../SidebarUtils"

interface SidebarInfoSectionProps {
    document: DocumentEntity
}

export const SidebarInfoSection = ({ document }: SidebarInfoSectionProps) => {
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                    Información General
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    <Clock className="w-3 h-3" />
                    {document.status?.name || "Borrador"}
                </div>
            </div>

            <div className="space-y-1 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Documento</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(document.total)}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-4">
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Número de serie</span>
                    <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 italic">
                        {document.number_serie || "(Borrador)"}
                    </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Partner / Contacto</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer max-w-[200px] truncate">
                        {document.partner_name}
                    </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Fecha de Factura</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatEuropeanDate(document.issue_date)}
                    </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Vencimiento</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatEuropeanDate(document.due_date)}
                    </span>
                </div>
            </div>
        </section>
    )
}
