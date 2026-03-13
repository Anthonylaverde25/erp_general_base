import * as React from "react"
import { ChevronRight } from "lucide-react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SidebarTabsHeaderProps {
    onClose?: () => void
}

export const SidebarTabsHeader = ({ onClose }: SidebarTabsHeaderProps) => {
    return (
        <div className="px-4 pb-2 border-b border-[#e5e7eb] dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2 w-full">
                <TabsList className="flex-1 grid grid-cols-3 bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                    <TabsTrigger value="messages" className="text-xs">Mensajes</TabsTrigger>
                    <TabsTrigger value="history" className="text-xs">Historial</TabsTrigger>
                </TabsList>

                {/* Collapse Button */}
                <button
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    title="Contraer sidebar"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
