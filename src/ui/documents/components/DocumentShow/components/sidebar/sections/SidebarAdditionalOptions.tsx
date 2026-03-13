import * as React from "react"
import { Copy, ExternalLink } from "lucide-react"

export const SidebarAdditionalOptions = () => {
    return (
        <section className="pt-2">
            <div className="flex flex-col gap-3">
                <button className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider group">
                    <div className="p-1 rounded bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                        <Copy className="w-3.5 h-3.5" />
                    </div>
                    <span>Copiar enlace de acceso</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors uppercase tracking-wider group">
                    <div className="p-1 rounded bg-gray-100 dark:bg-gray-800 group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                        <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                    <span>Ver en portal externo</span>
                </button>
            </div>
        </section>
    )
}
