import * as React from "react"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { formatCurrency, formatEuropeanDate } from "../SidebarUtils"

interface SidebarPaymentHistorySectionProps {
    payments: any[] // Should ideally be PaymentEntity[]
}

export const SidebarPaymentHistorySection = ({ payments }: SidebarPaymentHistorySectionProps) => {
    return (
        <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                Historial de Pagos
            </h4>
            {payments.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-[11px] font-medium italic">No hay pagos registrados aún</p>
                </div>
            ) : (
                payments.map((payment) => (
                    <div key={payment.id} className="relative pl-6 pb-4 border-l border-gray-200 dark:border-gray-800 last:border-0 last:pb-0">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"></div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3 border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
                                    {payment.payment_method_name || 'Abono general'}
                                </span>
                                <span className="text-[10px] whitespace-nowrap text-gray-500 dark:text-gray-400 font-semibold bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                                    {formatEuropeanDate(payment.payment_date)}
                                </span>
                            </div>
                            <div className="text-lg font-black text-green-600 dark:text-green-500 mt-1 mb-1">
                                {formatCurrency(payment.amount)}
                            </div>
                            {(payment.reference || payment.notes) && (
                                <div className="text-[10px] text-gray-500 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 flex flex-col gap-0.5">
                                    {payment.reference && <span><strong className="text-gray-700 dark:text-gray-300">Ref:</strong> {payment.reference}</span>}
                                    {payment.notes && <span className="italic">"{payment.notes}"</span>}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
