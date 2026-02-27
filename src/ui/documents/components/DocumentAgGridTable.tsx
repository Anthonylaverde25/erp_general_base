import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    type ColDef,
    themeBalham,
    ModuleRegistry,
    type ICellRendererParams,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    RowSelectionModule,
    ValidationModule,
    ColumnAutoSizeModule
} from 'ag-grid-community';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import {
    Box,
    Chip,
    Typography,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    TextField,
    InputAdornment
} from '@mui/material';
import { format } from 'date-fns';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    RowSelectionModule,
    ValidationModule,
    ColumnAutoSizeModule
]);

interface DocumentAgGridTableProps {
    documents: DocumentEntity[] | undefined;
    isLoading?: boolean;
}

export default function DocumentAgGridTable({ documents, isLoading }: DocumentAgGridTableProps) {
    const navigate = useNavigate();
    const muiTheme = useTheme();
    const isDark = muiTheme.palette.mode === 'dark';
    const [quickFilterText, setQuickFilterText] = useState('');
    const [showFilters, setShowFilters] = useState(true);

    // Modern Balham customization based on current theme mode
    const modernTheme = useMemo(() => {
        return themeBalham.withParams({
            spacing: 8, // Compact spacing for Balham
            accentColor: muiTheme.palette.primary.main,
            headerBackgroundColor: isDark ? '#2d3436' : '#f8f9fa',
            headerTextColor: isDark ? 'rgb(203, 213, 225)' : 'rgb(71, 85, 105)',
            headerFontWeight: '700',
            rowHoverColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            selectedRowBackgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 118, 210, 0.08)',
            backgroundColor: isDark ? '#1e2125' : '#ffffff',
            textColor: isDark ? 'rgb(241, 245, 249)' : 'rgb(15, 23, 42)',
            fontFamily: muiTheme.typography.fontFamily,
        });
    }, [isDark, muiTheme]);

    const columnDefs = useMemo<ColDef<DocumentEntity>[]>(() => [
        {
            field: 'number_serie',
            headerName: 'Documento',
            minWidth: 200,
            flex: 1,
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'clear'],
                debounceMs: 500,
                placeholder: 'Filtrar por número...'
            },
            cellRenderer: (params: ICellRendererParams<DocumentEntity>) => {
                const doc = params.data;
                if (!doc) return null;
                return (
                    <Box className="flex flex-col justify-center h-full py-2">
                        <Typography
                            variant="body2"
                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                            onClick={() => navigate(`/sales/${doc.id}`)}
                        >
                            {doc.number_serie || '(Borrador)'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                            {doc.document_type_name.toUpperCase()}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'partner_name',
            headerName: 'Cliente / Contacto',
            minWidth: 250,
            flex: 1.5,
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'clear'],
                debounceMs: 500,
                placeholder: 'Filtrar por nombre...'
            },
            cellRenderer: (params: ICellRendererParams<DocumentEntity>) => {
                const doc = params.data;
                if (!doc) return null;
                return (
                    <Box className="flex items-center gap-3 h-full py-1">
                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                                bgcolor: '#1976d2',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            {(doc.partner_name || 'N/A').substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box className="flex flex-col overflow-hidden">
                            <Typography variant="body2" className="font-semibold truncate">
                                {doc.partner_name || 'N/A'}
                            </Typography>
                            <Typography variant="caption" className="truncate opacity-60" sx={{ fontSize: '0.7rem' }}>
                                {doc.partner_email || 'Sin correo asociado'}
                            </Typography>
                        </Box>
                    </Box>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Estado',
            width: 120,
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['apply', 'clear'],
                debounceMs: 500,
                placeholder: 'Filtrar estado...'
            },
            cellRenderer: (params: ICellRendererParams<DocumentEntity>) => {
                const status = params.value;
                if (!status) return null;
                const config: Record<string, { color: string, label: string }> = {
                    issued: { color: '#22c55e', label: 'Emitido' },
                    draft: { color: '#f59e0b', label: 'Borrador' },
                    cancelled: { color: '#ef4444', label: 'Anulado' }
                };
                const { color, label } = config[status] || { color: '#64748b', label: status };

                return (
                    <Box className="flex items-center h-full">
                        <Chip
                            label={label}
                            size="small"
                            sx={{
                                bgcolor: `${color}15`,
                                color: color,
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                height: 20,
                                border: `1px solid ${color}30`,
                                textTransform: 'uppercase'
                            }}
                        />
                    </Box>
                );
            }
        },
        {
            field: 'issue_date',
            headerName: 'Emitido el',
            width: 130,
            filter: 'agDateColumnFilter',
            filterParams: {
                buttons: ['apply', 'clear'],
                debounceMs: 500
            },
            valueFormatter: (params) => params.value ? format(new Date(params.value), 'dd MMM, yyyy') : '',
            cellStyle: { color: 'rgb(100, 116, 139)', fontSize: '0.85rem' }
        },
        {
            field: 'total',
            headerName: 'Importe Total',
            width: 140,
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['apply', 'clear'],
                debounceMs: 500
            },
            cellClass: `text-right font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0
                }).format(params.value);
            }
        },
        {
            headerName: '',
            width: 80,
            pinned: 'right',
            sortable: false,
            filter: false,
            cellRenderer: () => (
                <Box className="flex items-center justify-center h-full">
                    <Tooltip title="Acciones">
                        <IconButton size="small">
                            <FuseSvgIcon size={18} color={isDark ? 'disabled' : 'action'}>heroicons-outline:ellipsis-horizontal</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ], [navigate, isDark]);

    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
        floatingFilter: showFilters,
        resizable: true,
    }), [showFilters]);

    return (
        <Box className="flex flex-col h-full w-full">
            <Box className="flex items-center px-4 py-2 bg-background-paper border-b gap-4">
                <TextField
                    placeholder="Búsqueda global..."
                    size="small"
                    variant="outlined"
                    value={quickFilterText}
                    onChange={(e) => setQuickFilterText(e.target.value)}
                    sx={{
                        width: 320,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FuseSvgIcon size={20} color="disabled">heroicons-outline:magnifying-glass</FuseSvgIcon>
                            </InputAdornment>
                        ),
                    }}
                />

                <Tooltip title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}>
                    <IconButton
                        onClick={() => setShowFilters(!showFilters)}
                        color={showFilters ? "primary" : "default"}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: showFilters ? 'primary.main' : 'transparent',
                            color: showFilters ? 'primary.contrastText' : 'inherit',
                            '&:hover': {
                                bgcolor: showFilters ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                            }
                        }}
                    >
                        <FuseSvgIcon size={20}>heroicons-outline:funnel</FuseSvgIcon>
                    </IconButton>
                </Tooltip>

                <Box sx={{ flex: 1 }} />
                <Typography variant="caption" color="text.secondary" className="font-semibold">
                    {documents?.length || 0} DOCUMENTOS ENCONTRADOS
                </Typography>
            </Box>

            <Box
                className="w-full h-full flex-auto p-4 pt-2"
                sx={{
                    height: showFilters ? 700 : 650, // Adjust height based on filter visibility
                    transition: 'height 0.2s ease-in-out',
                    '& .ag-root-wrapper': {
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: isDark
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)'
                            : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        backgroundColor: 'background.paper'
                    },
                    '& .ag-header': {
                        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgb(241 245 249)'
                    },
                    '& .ag-row': {
                        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgb(241 245 249)'
                    }
                }}
            >
                <AgGridReact
                    rowData={documents || []}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    theme={modernTheme}
                    loading={isLoading}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={15}
                    paginationPageSizeSelector={[15, 30, 50]}
                    rowHeight={45}
                    headerHeight={40}
                    floatingFiltersHeight={35}
                    quickFilterText={quickFilterText}
                />
            </Box>
        </Box>
    );
}
