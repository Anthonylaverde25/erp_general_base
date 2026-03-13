import * as React from "react"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"

interface SidebarTrayectorySectionProps {
    document: DocumentEntity
}

export const SidebarTrayectorySection = ({ document }: SidebarTrayectorySectionProps) => {
    const hasTrajectory = (document.predecessors && document.predecessors.length > 0) || 
                          (document.successors && document.successors.length > 0);

    if (!hasTrajectory) return null;

    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                Trayectoria Documental
            </h4>
            <div className="space-y-2">
                {document.predecessors && document.predecessors.map((parent) => (
                    <div key={parent.id} className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{parent.document_type_name}</p>
                            <p className="text-xs font-black text-gray-900 dark:text-gray-100 truncate">{parent.number_serie}</p>
                        </div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Origen</div>
                    </div>
                ))}

                <div className="flex items-center gap-3 p-2 rounded-lg border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">{document.document_type_name}</p>
                        <p className="text-xs font-black text-blue-900 dark:text-blue-100 truncate">{document.number_serie || '(Borrador)'}</p>
                    </div>
                    <div className="text-[9px] font-black text-blue-600 dark:text-blue-400">ACTUAL</div>
                </div>

                {document.successors && document.successors.map((child) => (
                    <div key={child.id} className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{child.document_type_name}</p>
                            <p className="text-xs font-black text-gray-900 dark:text-gray-100 truncate">{child.number_serie}</p>
                        </div>
                        <div className="text-[9px] font-bold text-green-600 dark:text-green-500 uppercase">Destino</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
