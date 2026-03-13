import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { SidebarTrayectorySection } from "./sections/SidebarTrayectorySection"
import { SidebarPaymentHistorySection } from "./sections/SidebarPaymentHistorySection"
import { SidebarOriginSection } from "./sections/SidebarOriginSection"

interface SidebarHistoryTabProps {
    document: DocumentEntity
    payments: any[]
    isLoadingPayments: boolean
}

export const SidebarHistoryTab = ({ document, payments, isLoadingPayments }: SidebarHistoryTabProps) => {
    return (
        <TabsContent value="history" className="m-0 p-4 focus-visible:ring-0">
            {isLoadingPayments ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center">
                    <span className="text-sm font-medium animate-pulse">Cargando pagos...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    <SidebarOriginSection document={document} />
                    <SidebarTrayectorySection document={document} />
                    <SidebarPaymentHistorySection payments={payments} />
                </div>
            )}
        </TabsContent>
    )
}
