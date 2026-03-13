import * as React from "react"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"

interface SidebarOriginSectionProps {
    document: DocumentEntity
}

export const SidebarOriginSection = ({ document }: SidebarOriginSectionProps) => {
    if (!document.predecessors || document.predecessors.length === 0) return null;

    return (
        <div className="space-y-3 mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                Proviene de Albaranes
            </h4>
            <div className="flex flex-wrap gap-1.5">
                {document.predecessors.map((p) => (
                    <span 
                        key={p.id} 
                        className="inline-flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800"
                    >
                        #{p.number_serie}
                    </span>
                ))}
            </div>
        </div>
    );
};
