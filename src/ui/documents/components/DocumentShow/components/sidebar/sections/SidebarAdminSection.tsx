import * as React from "react"

export const SidebarAdminSection = () => {
    return (
        <section>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Administración
            </h3>
            <div className="space-y-1">
                <div className="flex justify-between items-center px-2 py-2 rounded text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors pointer-events-none">
                    <span className="text-gray-500 font-semibold">Cta. Contable</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">700.0 Ventas</span>
                </div>
            </div>
        </section>
    )
}
