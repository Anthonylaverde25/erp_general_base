"use client"

import * as React from "react"
import { Clock, CheckCircle2, Plus, PenLine, ChevronRight, Copy, ExternalLink, Link, FileText, Send, HelpCircle } from "lucide-react"
import { format } from "date-fns"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { DocumentBreadcrumb } from "../DocumentBreadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link as RouterLink } from "react-router"

interface DocumentShowSidebarProps {
    document: DocumentEntity
    onClose?: () => void
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount)
}

export default function DocumentShowSidebar({ document, onClose }: DocumentShowSidebarProps) {

    return (
        <aside className="w-[418px] flex-shrink-0 bg-white dark:bg-gray-900 border-l border-[#e5e7eb] dark:border-gray-800 flex flex-col h-full overflow-hidden">
            <Tabs defaultValue="general" className="w-full h-full flex flex-col pt-2">
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

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <TabsContent value="general" className="m-0 focus-visible:ring-0">
                        <div className="flex flex-col p-5 pb-10 space-y-6">

                            {/* Miga de pan de documentos relacionados */}
                            <DocumentBreadcrumb document={document} />

                            {/* Main Totals Section */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                                        Información General
                                    </h3>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                        <Clock className="w-3 h-3" />
                                        {document.status?.name || "Borrador"}
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Documento</div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(document.total)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-y-4">
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Número de serie</span>
                                        <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 italic">
                                            {document.number_serie || "(Borrador)"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Partner / Contacto</span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer max-w-[200px] truncate">
                                            {document.partner_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Fecha de Factura</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {document.issue_date ? format(new Date(document.issue_date), "dd MMM yyyy") : "---"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Vencimiento</span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {document.due_date ? format(new Date(document.due_date), "dd MMM yyyy") : "---"}
                                        </span>
                                    </div>
                                </div>
                            </section>


                            {/* Pagos Section */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        Estatus Pago
                                    </h3>
                                    <span className="text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <button className="w-full h-9 flex items-center justify-center gap-2 px-4 text-[13px] font-bold text-blue-600 dark:text-blue-400 rounded-md border border-blue-600/20 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Registrar transacción</span>
                                    </button>
                                </div>
                            </section>


                            {/* Acciones Rápidas */}
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                                    Herramientas
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full h-9 flex items-center justify-center gap-2 px-4 text-[13px] font-semibold text-gray-700 dark:text-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Enviar Documento</span>
                                    </button>

                                    {/* Promo Banner */}
                                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 flex items-start gap-3 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                                        <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                                            <PenLine className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Complemento Firma Digital</h4>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Valida tus documentos legalmente vía email.</p>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform self-center" />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-200 dark:border-gray-800 mx-2" />

                            {/* Contabilidad */}
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                                    Administración
                                </h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center px-2 py-2 rounded text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors pointer-events-none">
                                        <span className="text-gray-500 font-semibold">Cta. Contable</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">700.0 Ventas</span>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* Archivos Dropzone */}
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                                    Anexos
                                </h3>
                                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-400 transition-all cursor-pointer">
                                    <FileText className="w-5 h-5 mb-2 opacity-50" />
                                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase italic">Arrastrar Archivos</span>
                                </div>
                            </section>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* Footer link */}
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                                    Opciones adicionales
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="flex items-center justify-center gap-2 p-2.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <Copy className="w-3 h-3" />
                                        <span>Copiar Enlace</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-2.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <ExternalLink className="w-3 h-3" />
                                        <span>Portal Externo</span>
                                    </button>
                                </div>
                            </section>

                        </div>
                    </TabsContent>

                    <TabsContent value="messages" className="m-0 p-4 focus-visible:ring-0">
                        <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center">
                            <HelpCircle className="w-8 h-8 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No hay mensajes disponibles</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="m-0 p-4 focus-visible:ring-0">
                        <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center">
                            <Clock className="w-8 h-8 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No hay historial disponible</p>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </aside >
    )
}
