import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { SidebarInfoSection } from "./sections/SidebarInfoSection"
import { SidebarPaymentStatusSection } from "./sections/SidebarPaymentStatusSection"
import { SidebarToolsSection } from "./sections/SidebarToolsSection"
import { SidebarAdminSection } from "./sections/SidebarAdminSection"
import { SidebarAttachmentsSection } from "./sections/SidebarAttachmentsSection"
import { SidebarAdditionalOptions } from "./sections/SidebarAdditionalOptions"

interface SidebarGeneralTabProps {
    document: DocumentEntity
}

export const SidebarGeneralTab = ({ document }: SidebarGeneralTabProps) => {
    return (
        <TabsContent value="general" className="m-0 focus-visible:ring-0">
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <SidebarInfoSection document={document} />
                <SidebarPaymentStatusSection />
                <SidebarToolsSection />
                <SidebarAdminSection />
                <SidebarAttachmentsSection />
                <SidebarAdditionalOptions />
            </div>
        </TabsContent>
    )
}
