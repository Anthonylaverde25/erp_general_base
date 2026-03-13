import * as React from "react"
import { CheckCircle2, Plus } from "lucide-react"

export const SidebarPaymentStatusSection = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Estatus Pago
                </h3>
                <span className="text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                </span>
            </div>
            <div className="space-y-2">
                <button className="w-full h-9 flex items-center justify-center gap-2 px-4 text-[13px] font-bold text-blue-600 dark:text-blue-400 rounded-md border border-blue-600/20 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Registrar transacción</span>
                </button>
            </div>
        </section>
    )
}
