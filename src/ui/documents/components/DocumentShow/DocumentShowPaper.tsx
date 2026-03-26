import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AgGridReact } from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    type ColDef,
    themeAlpine,
    ModuleRegistry,
} from 'ag-grid-community';
import { DocumentEntity, DocumentLine } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { Box, Typography, useTheme, LinearProgress, Tooltip } from '@mui/material';
import { formatDate } from './components/pdf/PDFUtils';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface DocumentShowPaperProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Chunk array helper
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
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

    const columnDefs = useMemo<ColDef<any>[]>(() => {
        const hasPredecessors = document.predecessors && document.predecessors.length > 0;
        const hasDiscounts = document.lines.some(line => line.discount_percent > 0);
        
        const defs: ColDef<any>[] = [];
        
        // 1. Column: Source (Origin)
        if (hasPredecessors) {
            defs.push({
                headerName: 'Origen',
                field: 'source_document_number',
                flex: 1.2,
                cellRenderer: (params: any) => {
                    const rowIndex = params.node.rowIndex;
                    const rowData = params.data;
                    const prevRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1)?.data;
                    const isFirstOfGroup = !prevRowData || prevRowData.source_document_number !== rowData.source_document_number;
                    if (!isFirstOfGroup) return null;
                    return (
                        <Box className="flex items-center h-full">
                            <Typography className="text-blue-600 dark:text-blue-400 font-black italic tracking-tight" style={{ fontSize: '10px' }}>
                                #{rowData.source_document_number || 'S/N'}
                            </Typography>
                        </Box>
                    );
                },
                cellStyle: { borderRight: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9' },
            });
        }

        // 2. Column: Description
        defs.push({
            headerName: 'Descripción',
            field: 'name',
            flex: 2.2,
            cellRenderer: (params: any) => (
                <Box className="flex flex-col py-1.5">
                    <Typography style={{ fontSize: '13px', fontWeight: 600 }}>
                        {params.data.item_code ? `[${params.data.item_code}] ` : ''}{params.value}
                    </Typography>
                    {params.data.description && (
                        <Typography variant="caption" color="text.secondary" className="leading-tight italic">
                            {params.data.description}
                        </Typography>
                    )}
                </Box>
            ),
            autoHeight: true,
        });

        // 3. Column: Quantity
        defs.push({
            headerName: 'Cant.',
            field: 'quantity',
            flex: 1,
            type: 'numericColumn',
            cellRenderer: (params: any) => {
                const line = params.data as DocumentLine;
                const isProcessable = ['QUO', 'PQUO', 'ORD', 'PORD', 'DLV', 'PDLV'].includes(document.document_type_code || '');
                if (!isProcessable) return (
                    <Typography style={{ fontSize: '13px', fontWeight: 700 }}>
                        {line.quantity}
                    </Typography>
                );
                const progress = (line.processed_quantity / line.quantity) * 100;
                const isDone = progress >= 99.9;
                return (
                    <Tooltip title={`Procesado: ${line.processed_quantity} de ${line.quantity}`}>
                        <Box className="flex flex-col w-full px-2 py-1">
                            <Box className="flex justify-between items-baseline mb-0.5">
                                <Typography style={{ fontSize: '12px', fontWeight: 700 }}>
                                    {line.quantity}
                                </Typography>
                                {line.processed_quantity > 0 && (
                                    <Typography variant="caption" sx={{ color: isDone ? 'success.main' : 'warning.main', fontWeight: 800, fontSize: '9px' }}>
                                        {line.processed_quantity} OK
                                    </Typography>
                                )}
                            </Box>
                            {line.processed_quantity > 0 && (
                                <LinearProgress 
                                    variant="determinate" 
                                    value={progress} 
                                    sx={{ 
                                        height: 3, 
                                        borderRadius: 1,
                                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                        '& .MuiLinearProgress-bar': { bgcolor: isDone ? '#22c55e' : '#f59e0b' }
                                    }} 
                                />
                            )}
                        </Box>
                    </Tooltip>
                );
            },
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        });

        // 4. Column: Unit (New!)
        defs.push({
            headerName: 'Ud.',
            field: 'unit_short_name',
            flex: 0.7,
            cellRenderer: (params: any) => (
                <Typography style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }} className="uppercase tracking-tighter">
                    {params.value || '-'}
                </Typography>
            ),
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        });

        // 5. Column: Price
        defs.push({
            headerName: 'Precio',
            field: 'unit_price',
            flex: 1.4,
            valueFormatter: (p) => formatCurrency(p.value),
            type: 'numericColumn',
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
        });

        // 6. Column: Discount % (Conditional)
        if (hasDiscounts) {
            defs.push({
                headerName: 'Dto.%',
                field: 'discount_percent',
                flex: 1,
                valueFormatter: (p) => p.value > 0 ? `${p.value}%` : '-',
                type: 'numericColumn',
                cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#f59e0b', fontWeight: 600 },
            });
        }

        // 7. Column: Taxes
        defs.push({
            headerName: 'Imp.',
            field: 'tax_labels',
            flex: 1.5,
            cellRenderer: (params: any) => (
                <Typography style={{ fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {params.value || '-'}
                </Typography>
            ),
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
        });

        // 8. Column: Line Total
        defs.push({
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
        });

        return defs;
    }, [isDark, document.predecessors, document.lines, document.document_type_code]);

    const LINES_PER_PAGE = 25;
    const pages = useMemo(() => {
        if (!document.lines || document.lines.length === 0) return [[]];
        const sortedLines = [...document.lines].sort((a, b) => {
            const indexA = document.predecessors?.findIndex(p => p.id === a.source_document_id) ?? -1;
            const indexB = document.predecessors?.findIndex(p => p.id === b.source_document_id) ?? -1;
            return indexA - indexB;
        });
        return chunkArray(sortedLines, LINES_PER_PAGE);
    }, [document.lines, document.predecessors]);

    const totalPages = pages.length;
    const validationUrl = `https://erp.tuempresa.com/verify/${document.id || document.number_serie}`;

    return (
        <div className="flex flex-col gap-6 items-center w-full">
            {pages.map((pageLines, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === totalPages - 1;

                return (
                    <section
                        key={`page-${pageIndex}`}
                        className="bg-white dark:bg-[#0f172a] w-full max-w-[21cm] shadow-2xl border border-gray-200 dark:border-gray-800 min-h-[29.7cm] relative flex flex-col text-[#1e293b] dark:text-gray-100 overflow-hidden"
                        id={`invoice-sheet-page-${pageIndex + 1}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        <div className="h-1 w-full bg-[#0f172a] dark:bg-blue-500" />

                        {isFirstPage && (document.document_type_code === 'QUO' || document.document_type_code === 'PQUO') &&
                            (document.status?.key === 'approved' || document.status?.key === 'rejected') && (
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-[0.12] dark:opacity-[0.22] rotate-[-35deg] border-[12px] rounded-2xl px-12 py-6 flex flex-col items-center select-none
                                ${document.status?.key === 'approved' ? 'border-emerald-600' : 'border-red-600'}`}>
                                    <h1 className={`text-9xl font-black tracking-tighter uppercase mb-2 ${document.status?.key === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {document.status?.key === 'approved' ? 'Aprobado' : 'Rechazado'}
                                    </h1>
                                    <div className={`text-2xl font-bold uppercase tracking-[0.5em] ${document.status?.key === 'approved' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {activeCompany?.name}
                                    </div>
                                </div>
                            )}

                        <div className="p-[1.5cm] flex flex-col flex-1">
                            {isFirstPage ? (
                                <>
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
                                            <Typography className="text-[#0f172a] dark:text-blue-400 font-black text-3xl mb-4 tracking-widest uppercase">
                                                {document.document_type_name || 'Documento'}
                                            </Typography>
                                            <div className="flex gap-10 justify-end">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nº Documento</span>
                                                    <span className="text-[12px] font-black text-[#0f172a] dark:text-white">#{document.number_serie || '(Borrador)'}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha</span>
                                                    <span className="text-[12px] font-bold text-[#0f172a] dark:text-white">{formatDate(document.issue_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-16 mt-10">
                                        <div>
                                            <p className="font-bold text-slate-400 dark:text-slate-400 uppercase text-[9px] mb-4 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Destinatario / Titular</p>
                                            <p className="font-black text-[15px] text-slate-900 dark:text-white mb-2">{document.partner_name}</p>
                                            <div className="text-[12px] text-slate-500 space-y-1">
                                                <p>{document.partner_address}</p>
                                                <p>{document.partner_email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-400 dark:text-slate-400 uppercase text-[9px] mb-4 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Detalles del Documento</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-[12px]">
                                                    <span className="text-slate-400">Estado</span>
                                                    <span className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[9px] bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                        {document.status?.name || 'Borrador'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-[12px]">
                                                    <span className="text-slate-400">Vencimiento</span>
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">{formatDate(document.due_date || document.issue_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-4">
                                        {activeCompany?.logo_url ? (
                                            <img src={activeCompany.logo_url} alt="Logo" className="h-6 w-auto object-contain opacity-50 grayscale" />
                                        ) : (
                                            <Typography variant="caption" className="font-bold text-slate-400 uppercase tracking-widest">{activeCompany?.name}</Typography>
                                        )}
                                    </div>
                                    <div className="text-right flex gap-4 text-[10px] text-slate-500">
                                        <span>Nº {document.number_serie || '(Borrador)'}</span>
                                        <span>•</span>
                                        <span>{formatDate(document.issue_date)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 mt-6">
                                <Box sx={{ height: 'auto', width: '100%', minHeight: 150 }}>
                                    <AgGridReact
                                        theme={alpineTheme}
                                        rowData={pageLines}
                                        columnDefs={columnDefs}
                                        domLayout="autoHeight"
                                        headerHeight={32}
                                        rowHeight={54}
                                        suppressScrollOnNewData={true}
                                        suppressHorizontalScroll={true}
                                    />
                                </Box>
                            </div>

                            {isLastPage && (
                                <div className="flex justify-between items-end mt-8">
                                    <div className="w-32 h-32 flex flex-col items-center justify-center p-2 border border-slate-200 dark:border-slate-800 rounded bg-white">
                                        <QRCodeSVG value={validationUrl} size={100} level="M" />
                                        <span className="text-[7px] text-slate-400 mt-2 uppercase tracking-widest">Verificación QR</span>
                                    </div>

                                    <div className="w-72 space-y-1">
                                        <div className="flex justify-between text-[11px] px-2 py-1">
                                            <span className="text-slate-400 uppercase tracking-wider text-[9px]">Suma Bases</span>
                                            <span className="text-slate-900 dark:text-slate-200 font-medium">{formatCurrency(document.subtotal)}</span>
                                        </div>
                                        {document.discount_total > 0 && (
                                            <div className="flex justify-between text-[11px] px-2 py-1 text-orange-600 dark:text-orange-400">
                                                <span className="uppercase tracking-wider text-[9px]">Total Descuento</span>
                                                <span className="font-bold">-{formatCurrency(document.discount_total)}</span>
                                            </div>
                                        )}
                                        {document.tax_summaries?.map((tax) => (
                                            <div key={`${tax.name}-${tax.rate}`} className="flex justify-between text-[11px] px-2 py-1">
                                                <span className="text-slate-400 uppercase tracking-wider text-[9px]">{tax.name} ({tax.rate}%)</span>
                                                <span className="text-slate-900 dark:text-slate-200 font-medium">{formatCurrency(tax.tax_amount)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center p-3 mt-4 border-t-2 border-[#0f172a] dark:border-blue-500 bg-slate-50 dark:bg-slate-900/50 rounded-b">
                                            <span className="font-black uppercase text-[11px] tracking-[0.2em] text-[#0f172a] dark:text-white">Total Neto</span>
                                            <span className="text-2xl font-black text-[#0f172a] dark:text-white">{formatCurrency(document.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400">
                                <p className="italic">Generado por {activeCompany?.name}. Documento generado electrónicamente.</p>
                                <p className="font-bold tracking-widest uppercase">Página {pageIndex + 1} de {totalPages}</p>
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
