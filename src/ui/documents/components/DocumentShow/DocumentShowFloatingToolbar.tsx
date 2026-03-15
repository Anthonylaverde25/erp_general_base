import { Printer, Download, Share2, MoreHorizontal, PenLine, Send, Copy, CreditCard, FileText, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"

interface DocumentShowFloatingToolbarProps {
    className?: string
    document?: DocumentEntity
    onMoreClick?: () => void
    onPaymentClick?: () => void
    onDetailsClick?: () => void
    onDuplicateClick?: () => void
}

export function DocumentShowFloatingToolbar({ 
    className, 
    document,
    onMoreClick, 
    onPaymentClick, 
    onDetailsClick,
    onDuplicateClick,
}: DocumentShowFloatingToolbarProps) {
    const isQuote = document?.document_type_code === 'QUO';

    return (
        <div className={cn(
            "fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center p-1",
            "bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-md",
            className
        )}>
            {/* Primary Actions */}
            <ToolbarButton icon={FileText} label="Detalles de documento" onClick={onDetailsClick} />
            <ToolbarButton icon={Printer} label="Imprimir" />
            <ToolbarButton icon={Download} label="Descargar PDF" />
            <ToolbarButton icon={Send} label="Enviar" primary />

            <Divider />

            {/* Secondary Actions */}
            <ToolbarButton icon={Copy} label="Duplicar" onClick={onDuplicateClick} />
            <ToolbarButton icon={PenLine} label="Editar" />

            <Divider />

            {/* Share & More */}
            <ToolbarButton icon={Share2} label="Compartir" />

            <ToolbarButton icon={CreditCard} label="Consignar pago" onClick={onPaymentClick} />
            <ToolbarButton icon={MoreHorizontal} label="Más" onClick={onMoreClick} />
        </div>
    )
}

function Divider() {
    // Línea separadora sólida y fina, ocupando casi todo el ancho disponible
    return <div className="w-[80%] h-[1px] bg-gray-200 dark:bg-gray-800 my-1" />
}

function ToolbarButton({
    icon: Icon,
    label,
    primary,
    danger,
    onClick
}: {
    icon: any,
    label: string,
    primary?: boolean,
    danger?: boolean,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={cn(
                "group relative flex items-center justify-center p-2 rounded transition-colors duration-150",
                // Colores sólidos y limpios para los estados hover. Sin animaciones de escala (active:scale).
                primary
                    ? "text-blue-700 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    : danger
                        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
        >
            {/* Iconos ligeramente más pequeños (w-4 h-4) para aumentar la percepción de densidad y profesionalismo */}
            <Icon className="w-4 h-4 stroke-[1.5px]" />

            {/* Tooltip estilo empresarial: cuadrado, sin animaciones de movimiento, aparición rápida */}
            <span className={cn(
                "absolute right-full mr-3 px-2 py-1 rounded whitespace-nowrap pointer-events-none",
                "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-xs",
                "opacity-0 transition-opacity duration-150 ease-in",
                "group-hover:opacity-100"
            )}>
                {label}
            </span>
        </button>
    )
}