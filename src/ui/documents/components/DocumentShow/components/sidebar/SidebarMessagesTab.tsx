import * as React from "react"
import { HelpCircle } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"

export const SidebarMessagesTab = () => {
    return (
        <TabsContent value="messages" className="m-0 p-4 focus-visible:ring-0">
            <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center">
                <HelpCircle className="w-8 h-8 mb-4 opacity-20" />
                <p className="text-sm font-medium">No hay mensajes disponibles</p>
            </div>
        </TabsContent>
    )
}
