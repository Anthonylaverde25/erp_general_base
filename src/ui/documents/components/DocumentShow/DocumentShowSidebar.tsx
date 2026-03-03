import { Clock, CheckCircle2, Plus, PenLine, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

interface DocumentShowSidebarProps {
    document: DocumentEntity;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function DocumentShowSidebar({ document }: DocumentShowSidebarProps) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <aside className="bg-white dark:bg-gray-900 border-l border-[#e5e7eb] dark:border-gray-800 flex flex-col overflow-hidden w-[440px]">
            {/* Sidebar Tabs */}
            <div className="border-b border-[#e5e7eb] dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-1 m-4 rounded-md flex">
                <button
                    className={`flex-1 text-xs py-1.5 rounded font-medium transition-all cursor-pointer ${activeTab === 0 ? 'bg-white dark:bg-gray-700 text-[#1f2937] dark:text-white shadow-sm border border-gray-200 dark:border-gray-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab(0)}
                >
                    General
                </button>
                <button
                    className={`flex-1 text-xs py-1.5 rounded font-medium transition-all cursor-pointer ${activeTab === 1 ? 'bg-white dark:bg-gray-700 text-[#1f2937] dark:text-white shadow-sm border border-gray-200 dark:border-gray-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab(1)}
                >
                    Mensajes
                </button>
                <button
                    className={`flex-1 text-xs py-1.5 rounded font-medium transition-all cursor-pointer ${activeTab === 2 ? 'bg-white dark:bg-gray-700 text-[#1f2937] dark:text-white shadow-sm border border-gray-200 dark:border-gray-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab(2)}
                >
                    Historial
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
                {/* Main Totals Section */}
                <section className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total</span>
                        <span className="text-xl font-bold text-black dark:text-white">{formatCurrency(document.total)}</span>
                    </div>
                    <div className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                            <span>Número de documento</span>
                            <span className="font-semibold text-black dark:text-white px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                {document.number_serie || 'Borrador'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Contacto</span>
                            <span className="text-blue-500 dark:text-blue-400 cursor-pointer">{document.partner_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Fecha</span>
                            <span>{document.issue_date ? format(new Date(document.issue_date), 'dd/MM/yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Vencimiento</span>
                            <span className="text-blue-500 dark:text-blue-400">{document.due_date ? format(new Date(document.due_date), 'dd/MM/yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total unidades</span>
                            <span>{document.lines.reduce((acc: number, line: any) => acc + line.quantity, 0)}</span>
                        </div>
                    </div>
                </section>

                {/* Status Pill */}
                <section className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                        <Clock className="w-3 h-3" />
                        <span className="capitalize">{document.status || 'Borrador'}</span>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-xs font-semibold cursor-pointer hover:underline">Aprobar</button>
                </section>

                {/* Pagos Section */}
                <section className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                            Pagos <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-0.5"><CheckCircle2 className="w-3 h-3" /></span>
                        </div>
                        <button className="text-blue-500 dark:text-blue-400 text-xs flex items-center gap-1 cursor-pointer hover:underline">
                            <Plus className="w-3 h-3" /> Añadir pago
                        </button>
                    </div>
                </section>

                {/* Emails Section */}
                <section className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-semibold text-black dark:text-white">Emails</div>
                        <button className="text-blue-500 dark:text-blue-400 text-xs cursor-pointer hover:underline">Enviar vía email</button>
                    </div>
                    {/* Promo Banner */}
                    <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg p-3 flex items-start gap-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        <div className="text-green-500 pt-1">
                            <PenLine className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Activa la firma digital</h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Envía tus documentos y consigue la firma de tus clientes de forma rápida y gratuita.</p>
                        </div>
                        <div className="text-gray-400 self-center">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </section>

                {/* Categorización */}
                <section className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold text-black dark:text-white">Categorización</div>
                        <button className="text-blue-500 dark:text-blue-400 text-xs cursor-pointer hover:underline">Editar</button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Cuenta contable</span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Ventas de mercaderías
                        </span>
                    </div>
                </section>

                {/* Archivos Dropzone */}
                <section className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold text-black dark:text-white">Archivos</div>
                        <button className="text-blue-500 dark:text-blue-400 text-xs cursor-pointer hover:underline">Subir archivo</button>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        Haz clic o arrastra un archivo
                    </div>
                </section>

                {/* Asiento contable */}
                <section className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-sm font-semibold mb-2 text-black dark:text-white">Asiento contable</div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                        Este documento no tiene ningún asiento relacionado
                    </div>
                </section>

                {/* Footer link */}
                <div className="pt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">
                        Enlace público
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 truncate border border-gray-200 dark:border-gray-700 rounded px-2 py-1 flex-1 transition-colors">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Copiar enlace del documento en el portal del cliente</span>
                        </div>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
