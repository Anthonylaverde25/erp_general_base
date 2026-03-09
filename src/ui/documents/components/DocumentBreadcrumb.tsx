import * as React from "react"
import { FileText, ChevronRight } from "lucide-react"
import { Link as RouterLink } from "react-router"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { cn } from "@/lib/utils"

interface DocumentBreadcrumbProps {
    document: DocumentEntity
    className?: string
}

export function DocumentBreadcrumb({ document, className }: DocumentBreadcrumbProps) {
    // Si no hay padre, puedes decidir si quieres retornar null o mostrar solo el actual. 
    // Mantuve tu lógica de retornar null.
    if (!document.parent_document) {
        return null
    }

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                {/* Documento Padre (Enlace) */}
                <li className="flex items-center">
                    <RouterLink
                        to={`/documents/view/${document.parent_document.id}`}
                        className={cn(
                            "group flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-all",
                            "hover:bg-gray-100 hover:text-gray-900",
                            "dark:hover:bg-gray-800 dark:hover:text-gray-50",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                        )}
                    >
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
                        <span className="font-medium truncate max-w-[200px] sm:max-w-none">
                            {document.parent_document.document_type_name} #{document.parent_document.number_serie}
                        </span>
                    </RouterLink>
                </li>

                {/* Separador */}
                <li className="flex items-center" aria-hidden="true">
                    <ChevronRight className="w-4 h-4 text-gray-400/70" />
                </li>

                {/* Documento Actual (Texto estático) */}
                <li className="flex items-center">
                    <div className="flex items-center gap-1.5 px-1.5 py-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">
                            {document.document_type_name} {document.number_serie ? `#${document.number_serie}` : ''}
                        </span>
                    </div>
                </li>
            </ol>
        </nav>
    )
}