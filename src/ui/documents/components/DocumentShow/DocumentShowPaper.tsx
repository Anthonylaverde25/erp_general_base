import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    type ColDef,
    themeAlpine,
    ModuleRegistry,
} from 'ag-grid-community';
import { DocumentEntity, DocumentLine } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { Box, Typography, useTheme } from '@mui/material';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface DocumentShowPaperProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function DocumentShowPaper({ document, activeCompany }: DocumentShowPaperProps) {
    const muiTheme = useTheme();
    const isDark = muiTheme.palette.mode === 'dark';

    const alpineTheme = useMemo(() => {
        return themeAlpine.withParams({
            accentColor: '#0f172a',
            headerBackgroundColor: isDark ? '#1e293b' : '#f8fafc',
            headerTextColor: isDark ? '#f8fafc' : '#0f172a',
            headerFontWeight: '800',
            rowHoverColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.02)',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            textColor: isDark ? '#f1f5f9' : '#1e293b',
            oddRowBackgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#fbfcfd',
        });
    }, [isDark]);

    const columnDefs = useMemo<ColDef<DocumentLine>[]>(() => [
        {
            headerName: 'Descripción',
            field: 'name',
            flex: 4,
            cellRenderer: (params: any) => (
                <Box className="flex flex-col py-1.5">
                    <Typography style={{ fontSize: '13px', fontWeight: 600 }}>{params.value}</Typography>
                    {params.data.description && (
                        <Typography variant="caption" color="text.secondary" className="leading-tight italic">
                            {params.data.description}
                        </Typography>
                    )}
                </Box>
            ),
            autoHeight: true,
        },
        {
            headerName: 'Cant.',
            field: 'quantity',
            flex: 1,
            type: 'numericColumn',
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        },
        {
            headerName: 'Precio',
            field: 'unit_price',
            flex: 1.5,
            valueFormatter: (p) => formatCurrency(p.value),
            type: 'numericColumn',
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
        },
        {
            headerName: 'Imp.',
            valueGetter: (p) => `${p.data.taxes?.[0]?.percentage || 0}%`,
            flex: 1,
            type: 'numericColumn',
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
        },
        {
            headerName: 'Total',
            field: 'line_total',
            flex: 1.5,
            valueFormatter: (p) => formatCurrency(p.value),
            cellStyle: (params) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontWeight: 700,
                color: isDark ? '#60a5fa' : '#0f172a'
            }),
            type: 'numericColumn',
        },
    ], [isDark]);

    return (
        <section
            className="bg-white dark:bg-[#0f172a] w-full max-w-[21cm] shadow-2xl border border-gray-200 dark:border-gray-800 min-h-[29.7cm] relative flex flex-col text-[#1e293b] dark:text-gray-100 overflow-hidden"
            id="invoice-sheet"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Top Bar Accent */}
            <div className="h-1 w-full bg-[#0f172a] dark:bg-blue-500" />

            <div className="p-[1.5cm] flex flex-col gap-10">
                {/* Professional Header */}
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-10">
                    <div className="flex flex-col gap-4">
                        {activeCompany?.logo_url ? (
                            <img src={activeCompany.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
                        ) : (
                            <Typography variant="h5" className="font-black text-[#0f172a] dark:text-white tracking-tighter uppercase">{activeCompany?.name}</Typography>
                        )}
                        <div className="text-[10px] text-slate-500 leading-relaxed max-w-[250px]">
                            <p className="font-bold text-slate-700 dark:text-slate-300">{activeCompany?.name}</p>
                            <p>CIF: {activeCompany?.cif || ''}</p>
                            <p>{activeCompany?.address}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <Typography className="text-[#0f172a] dark:text-blue-400 font-black text-3xl mb-4 tracking-widest uppercase">Factura</Typography>
                        <div className="flex gap-10 justify-end">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nº Factura</span>
                                <span className="text-[12px] font-black text-[#0f172a] dark:text-white">#{document.number_serie || '(Borrador)'}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha</span>
                                <span className="text-[12px] font-bold text-[#0f172a] dark:text-white">{document.issue_date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-16">
                    <div>
                        <p className="font-bold text-slate-400 dark:text-slate-400 uppercase text-[9px] mb-4 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Facturar a</p>
                        <p className="font-black text-[15px] text-slate-900 dark:text-white mb-2">{document.partner_name}</p>
                        <div className="text-[12px] text-slate-500 space-y-1">
                            <p>{document.partner_address}</p>
                            <p>{document.partner_email}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-slate-400 dark:text-slate-400 uppercase text-[9px] mb-4 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Detalles</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-400">Estado</span>
                                <span className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[9px] bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                                    {document.status || 'Borrador'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-400">Vencimiento</span>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{document.due_date || document.issue_date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex-1 mt-4">
                    <Box sx={{ height: 'auto', width: '100%', minHeight: 300 }}>
                        <AgGridReact
                            theme={alpineTheme}
                            rowData={document.lines}
                            columnDefs={columnDefs}
                            domLayout="autoHeight"
                            headerHeight={32}
                            rowHeight={48}
                        />
                    </Box>
                </div>

                {/* Summary Section */}
                <div className="flex justify-end mt-8">
                    <div className="w-64 space-y-1">
                        <div className="flex justify-between text-[11px] px-2 py-1">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium">{formatCurrency(document.subtotal)}</span>
                        </div>
                        {document.tax_summaries?.map((tax, i) => (
                            <div key={i} className="flex justify-between text-[11px] px-2 py-1">
                                <span className="text-slate-400">IVA ({tax.rate}%)</span>
                                <span className="text-slate-900 dark:text-slate-200 font-medium">{formatCurrency(tax.tax_amount)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center p-3 mt-4 border-t-2 border-[#0f172a] dark:border-blue-500">
                            <span className="font-bold uppercase text-[10px] tracking-widest text-[#0f172a] dark:text-white">Total</span>
                            <span className="text-2xl font-black text-[#0f172a] dark:text-white">{formatCurrency(document.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-20 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
                    <p className="text-[9px] text-slate-400 italic">Generado por {activeCompany?.name}. Documento generado electrónicamente.</p>
                </div>
            </div>
        </section>
    );
}
