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

            <div className="space-y-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                    <div className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Total Logístico (Entrega)
                    </div>
                    <div className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                        {formatCurrency(document.total)}
                    </div>
                </div>

                {['DLV', 'PDLV'].includes(document.document_type_code || '') && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div>
                            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Facturado</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(document.invoiced_amount)}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Pendiente</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(document.pending_invoicing_amount)}</div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Balance Pendiente</div>
                        <div className={`text-lg font-bold ${document.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {formatCurrency(document.balance)}
                        </div>
                    </div>
                    {document.total_paid > 0 && (
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pagos Totales</div>
                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatCurrency(document.total_paid)}</div>
                        </div>
                    )}
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
