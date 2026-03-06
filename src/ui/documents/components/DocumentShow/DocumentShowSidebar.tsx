"use client"

import * as React from "react"
import { Clock, CheckCircle2, Plus, PenLine, ChevronRight, Copy, ExternalLink, Link, FileText, Send, HelpCircle } from "lucide-react"
import { format } from "date-fns"
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from '@mui/material'

interface DocumentShowSidebarProps {
    document: DocumentEntity
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount)
}

export default function DocumentShowSidebar({ document }: DocumentShowSidebarProps) {
    return (
        <aside className="w-[418px] flex-shrink-0 bg-white dark:bg-gray-900 border-l border-[#e5e7eb] dark:border-gray-800 flex flex-col h-full overflow-hidden">
            <Tabs defaultValue="general" className="w-full h-full flex flex-col pt-2">
                <div className="px-4 pb-2 border-b border-[#e5e7eb] dark:border-gray-800 shrink-0">
                    <TabsList className="w-full grid grid-cols-3 bg-gray-100 dark:bg-gray-800">
                        <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                        <TabsTrigger value="messages" className="text-xs">Mensajes</TabsTrigger>
                        <TabsTrigger value="history" className="text-xs">Historial</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <TabsContent value="general" className="m-0 focus-visible:ring-0">
                        <div className="flex flex-col p-4 pb-8 space-y-6">

                            {/* Main Totals Section */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                                    Detalles del Documento
                                </h3>
                                <div className="space-y-4 px-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total</span>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(document.total)}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 text-xs">
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 mb-1">Número</div>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded inline-block">
                                                {document.number_serie || "Borrador"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 mb-1">Contacto</div>
                                            <div className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">{document.partner_name}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 mb-1">Fecha</div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{document.issue_date ? format(new Date(document.issue_date), "dd/MM/yyyy") : "N/A"}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 mb-1">Vencimiento</div>
                                            <div className="font-medium text-blue-600 dark:text-blue-400">{document.due_date ? format(new Date(document.due_date), "dd/MM/yyyy") : "N/A"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        Status: <span className="capitalize text-gray-900 dark:text-gray-100">{document.status?.name || "Borrador"}</span>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-200 dark:border-gray-800 mx-2" />

                            {/* Pagos Section */}
                            <section>
                                <div className="flex items-center justify-between mt-2 mb-3">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        Pagos <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-0.5"><CheckCircle2 className="w-3 h-3" /></span>
                                    </h3>
                                </div>
                                <ul className="space-y-1">
                                    <li>
                                        <button className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                            <Plus className="w-4 h-4" />
                                            <span>Añadir pago</span>
                                        </button>
                                    </li>
                                </ul>
                            </section>

                            <hr className="border-gray-200 dark:border-gray-800 mx-2" />

                            {/* Emails Section */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Emails</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <button className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <Send className="w-4 h-4" />
                                            <span>Enviar vía email</span>
                                        </button>
                                    </li>
                                </ul>

                                {/* Promo Banner */}
                                <div className="mt-4 mx-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-3 cursor-pointer hover:bg-green-500/15 transition-colors">
                                    <div className="text-green-600 dark:text-green-500 pt-1">
                                        <PenLine className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Activa la firma digital</h4>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Envía tus documentos y consigue la firma de forma rápida.</p>
                                    </div>
                                    <div className="text-gray-400 self-center">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-200 dark:border-gray-800 mx-2" />

                            {/* Archivos & Categorización */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Documento Relacionado</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <button className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <Link className="w-4 h-4" />
                                            <span>Vincular documento</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <span className="flex items-center gap-2">
                                                <HelpCircle className="w-4 h-4" />
                                                Cuenta contable
                                            </span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Ventas</span>
                                        </button>
                                    </li>
                                </ul>
                            </section>

                            <hr className="border-gray-200 dark:border-gray-800 mx-2" />

                            {/* Archivos Dropzone */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Archivos adjuntos</h3>
                                <div className="mx-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 cursor-pointer transition-colors">
                                    <FileText className="w-6 h-6 mb-2 opacity-50" />
                                    <span className="text-xs text-center font-medium">Arrastra archivos aquí</span>
                                    <span className="text-[10px] mt-1 opacity-70">o haz clic para explorar</span>
                                </div>
                            </section>

                            <hr className="border-gray-200 dark:border-gray-800 mx-2" />

                            {/* Footer link */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Herramientas Compartir</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <button className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <Copy className="w-4 h-4" />
                                            <span>Copiar enlace público</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                            <span>Ver portal de cliente</span>
                                        </button>
                                    </li>
                                </ul>
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
        </aside>
    )
}
