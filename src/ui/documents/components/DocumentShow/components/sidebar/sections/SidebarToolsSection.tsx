import * as React from "react"
import { Send, PenLine, ChevronRight } from "lucide-react"

export const SidebarToolsSection = () => {
    return (
        <section>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Herramientas
            </h3>
            <div className="space-y-3">
                <button className="w-full h-9 flex items-center justify-center gap-2 px-4 text-[13px] font-semibold text-gray-700 dark:text-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Documento</span>
                </button>

                {/* Promo Banner */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 flex items-start gap-3 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                    <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                        <PenLine className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Complemento Firma Digital</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Valida tus documentos legalmente vía email.</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform self-center" />
                </div>
            </div>
        </section>
    )
}
