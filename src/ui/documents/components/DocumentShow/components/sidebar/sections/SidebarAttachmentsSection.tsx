import * as React from "react"
import { FileText } from "lucide-react"

export const SidebarAttachmentsSection = () => {
    return (
        <section>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Anexos
            </h3>
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-400 transition-all cursor-pointer">
                <FileText className="w-5 h-5 mb-2 opacity-50" />
                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase italic">Arrastrar Archivos</span>
            </div>
        </section>
    )
}
