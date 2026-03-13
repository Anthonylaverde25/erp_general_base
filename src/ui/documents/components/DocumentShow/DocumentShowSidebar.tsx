import * as React from "react"
import { Tabs } from "@/components/ui/tabs"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { useIndexPayments } from "@/features/payments/hooks/useIndexPayments"

// Specialized Components
import { SidebarTabsHeader } from "./components/sidebar/SidebarTabsHeader"
import { SidebarGeneralTab } from "./components/sidebar/SidebarGeneralTab"
import { SidebarMessagesTab } from "./components/sidebar/SidebarMessagesTab"
import { SidebarHistoryTab } from "./components/sidebar/SidebarHistoryTab"

interface DocumentShowSidebarProps {
    document: DocumentEntity
    onClose: () => void
}

const DocumentShowSidebar = ({ document, onClose }: DocumentShowSidebarProps) => {
    // Hooks
    const { payments = [], isLoading: isLoadingPayments } = useIndexPayments({
        documentId: document.id
    })

    return (
        <aside className="w-[380px] h-full bg-white dark:bg-gray-900 border-l border-[#e5e7eb] dark:border-gray-800 flex flex-col shadow-2xl z-40 transition-all duration-300">
            <Tabs defaultValue="general" className="w-full h-full flex flex-col">
                <div className="pt-4 flex-none">
                    <SidebarTabsHeader onClose={onClose} />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* General Tab Content */}
                    <SidebarGeneralTab document={document} />

                    {/* Messages Tab Content */}
                    <SidebarMessagesTab />

                    {/* History & Trayectory Tab Content */}
                    <SidebarHistoryTab 
                        document={document} 
                        payments={payments} 
                        isLoadingPayments={isLoadingPayments} 
                    />
                </div>
            </Tabs>
        </aside>
    )
}

export default DocumentShowSidebar
