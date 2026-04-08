import { Info, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { cn } from "@/lib/utils";

interface DocumentSuccessorAlertProps {
    document: DocumentEntity;
    className?: string;
}

/**
 * Componente que muestra una alerta informativa si el documento actual tiene "sucesores"
 * (ej. un albarán que ya ha sido facturado o una oferta aceptada).
 */
export default function DocumentSuccessorAlert({ document, className }: DocumentSuccessorAlertProps) {
    console.log("document", document);
    const successors = document.successors || [];

    if (successors.length === 0) {
        return null;
    }

    // Usualmente nos interesa el sucesor "más importante" o el último
    const mainSuccessor = successors[successors.length - 1];

    // Generamos el enlace al documento sucesor usando el método estático de la entidad
    const successorLink = DocumentEntity.getDocumentLink(mainSuccessor.id, document.operation);

    return (
        <div
            className={cn(
                "w-full max-w-[21cm] flex items-start gap-4 p-4",
                "bg-blue-50/50 dark:bg-blue-900/10",
                "border-l-4 border-[#005483] dark:border-blue-500",
                "shadow-sm print:hidden", // No mostrar al imprimir
                className
            )}
        >
            <div className="flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-[#005483] dark:text-blue-400" />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-bold text-[#005483] dark:text-blue-400 uppercase tracking-wider">
                        Documento Vinculado
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        Este {document.document_type_name} ha sido procesado.
                        Documento final: <span className="font-semibold">{mainSuccessor.number_serie}</span> ({mainSuccessor.document_type_name}).
                    </p>
                </div>

                <Link
                    to={successorLink}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-tight",
                        "bg-[#005483] text-white hover:bg-[#004369] transition-colors rounded-[4px]",
                        "shadow-md active:shadow-sm"
                    )}
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver Documento
                </Link>
            </div>
        </div>
    );
}
