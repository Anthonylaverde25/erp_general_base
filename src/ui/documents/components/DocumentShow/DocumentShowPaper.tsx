import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';

interface DocumentShowPaperProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function DocumentShowPaper({ document, activeCompany }: DocumentShowPaperProps) {
    return (
        <section className="bg-white dark:bg-gray-800 w-full max-w-4xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[1100px] p-16 flex flex-col gap-12 text-[#1f2937] dark:text-gray-200" id="invoice-sheet">
            {/* Header Info */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        {activeCompany?.logo_url && (
                            <img src={activeCompany.logo_url} alt="Logo" className="h-12 w-auto object-contain dark:brightness-90" />
                        )}
                        <h2 className="text-4xl font-bold text-black dark:text-white tracking-tight">Factura</h2>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm">
                        <span className="font-bold text-black dark:text-gray-100">Número #</span>
                        <span>{document.number_serie || '(Borrador)'}</span>
                        <span className="font-bold text-black dark:text-gray-100">Fecha</span>
                        <span>{document.issue_date}</span>
                    </div>
                </div>
            </div>

            {/* Addresses */}
            <div className="flex justify-between text-sm leading-relaxed">
                <div>
                    <p className="font-bold text-black dark:text-white">{activeCompany?.name || 'Mi Empresa'}</p>
                    <p>{activeCompany?.address || 'España'}</p>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 italic">{activeCompany?.contacts?.[0]?.email || ''}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-black dark:text-white">Cliente</p>
                    <p>{document.partner_name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{document.partner_email}</p>
                </div>
            </div>

            {/* Table */}
            <div className="mt-8 border-t border-gray-100 dark:border-gray-700">
                <table className="w-full text-left text-xs uppercase tracking-wider">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                            <th className="py-4 font-normal text-gray-400 dark:text-gray-500">Concepto</th>
                            <th className="py-4 font-normal text-gray-400 dark:text-gray-500 text-right">Precio</th>
                            <th className="py-4 font-normal text-gray-400 dark:text-gray-500 text-right">Unidades</th>
                            <th className="py-4 font-normal text-gray-400 dark:text-gray-500 text-right">Subtotal</th>
                            <th className="py-4 font-normal text-gray-400 dark:text-gray-500 text-right" style={{ width: '80px' }}>IVA</th>
                            <th className="py-4 font-normal text-gray-400 dark:text-gray-500 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm normal-case text-black dark:text-gray-200">
                        {document.lines.map((line: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                                <td className="py-4 text-left">
                                    <div className="font-bold dark:text-white">{line.name || 'Item'}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{line.description}</div>
                                </td>
                                <td className="py-4 text-right">{formatCurrency(line.unit_price)}</td>
                                <td className="py-4 text-right">{line.quantity}</td>
                                <td className="py-4 text-right">{formatCurrency(line.line_subtotal)}</td>
                                <td className="py-4 text-right">{line.taxes?.[0]?.percentage || 21}%</td>
                                <td className="py-4 text-right font-bold dark:text-white">{formatCurrency(line.line_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="ml-auto w-64 mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-t border-black dark:border-white pt-2">
                    <span className="font-bold uppercase text-xs dark:text-gray-100">Base Imponible</span>
                    <span className="font-bold dark:text-white">{formatCurrency(document.subtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-bold uppercase text-xs dark:text-gray-100">IVA {document.tax_summaries?.[0]?.rate || 21}%</span>
                    <span className="font-bold dark:text-white">{formatCurrency(document.tax_total)}</span>
                </div>
                <div className="flex justify-between border-b border-black dark:border-white pb-2">
                    <span className="font-bold uppercase text-xs dark:text-gray-100">Total</span>
                    <span className="font-bold dark:text-white">{formatCurrency(document.total)}</span>
                </div>
            </div>
        </section>
    );
}
