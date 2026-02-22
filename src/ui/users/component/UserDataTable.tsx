import { MaterialReactTable, useMaterialReactTable, MaterialReactTableProps } from 'material-react-table';
import { useMemo } from 'react';
import type { Theme } from '@mui/material/styles';
import DataTableTopToolbar from '@/components/data-table/DataTableTopToolbar';
import { UserTableIcons } from './utils/UserTableIcons';

import { IUser } from '@/types/user.types';

export default function UserDataTable(props: MaterialReactTableProps<IUser>) {
	const { columns, data, ...rest } = props;

	if (!data || (Array.isArray(data) && data.length === 0)) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-lg text-gray-500">No hay datos disponibles</p>
			</div>
		);
	}

	const defaults = useMemo<Partial<MaterialReactTableProps<IUser>>>(
		() => ({
			initialState: {
				density: 'compact',
				showColumnFilters: false,
				showGlobalFilter: true,
				columnPinning: {
					left: ['mrt-row-expand', 'mrt-row-select'],
					right: ['mrt-row-actions']
				},
				pagination: { pageIndex: 0, pageSize: 25 }
			},
			enableFullScreenToggle: true,
			enableDensityToggle: true,
			enableColumnFilterModes: true,
			enableColumnOrdering: true,
			enableGrouping: true,
			enableColumnPinning: true,
			enableColumnResizing: false,
			enableFacetedValues: true,
			enableRowActions: true,
			enableRowSelection: true,
			enableStickyHeader: true,
			enableStickyFooter: true,
			enableSorting: false,
			enableMultiSort: false,
			paginationDisplayMode: 'pages',
			positionToolbarAlertBanner: 'bottom',

			// Enhanced table styling
			muiTableProps: {
				sx: {
					'& .MuiTableCell-root': {
						borderRight: '1px solid',
						borderRightColor: (theme: Theme) => theme.palette.divider,
						'&:last-child': {
							borderRight: 'none'
						}
					},
					'& .MuiTableHead-root .MuiTableCell-root': {
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
						fontWeight: 600,
						fontSize: '0.8125rem',
						textTransform: 'uppercase',
						letterSpacing: '0.3px',
						borderBottom: '1px solid',
						borderBottomColor: (theme: Theme) => theme.palette.divider
					},
					'& .MuiTableBody-root .MuiTableRow-root': {
						'&:hover': {
							backgroundColor: (theme: Theme) =>
								theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
							transition: 'background-color 0.2s ease'
						},
						'&:nth-of-type(even)': {
							backgroundColor: (theme: Theme) =>
								theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'
						}
					}
				}
			},

			// Enhanced toolbar styling
			muiTopToolbarProps: {
				sx: {
					backgroundColor: (theme: Theme) => theme.palette.background.paper,
					'& .MuiBox-root': {
						gap: 2
					}
				}
			},

			muiBottomToolbarProps: {
				className: 'flex items-center min-h-12 h-12 border-t',
				sx: {
					borderTopColor: (theme: Theme) => theme.palette.divider,
					backgroundColor: (theme: Theme) => theme.palette.background.paper
				}
			},

			muiTablePaperProps: {
				elevation: 1,
				sx: {
					borderRadius: 1,
					border: '1px solid',
					borderColor: (theme: Theme) => theme.palette.divider,
					overflow: 'hidden'
				}
			},

			muiTableContainerProps: {
				sx: {
					maxHeight: 'calc(100vh - 300px)',
					// Scrollbar only visible when scrolling
					overflowX: 'auto',
					overflowY: 'auto',
					'&::-webkit-scrollbar': {
						width: '8px',
						height: '8px'
					},
					'&::-webkit-scrollbar-track': {
						backgroundColor: 'transparent'
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'transparent',
						borderRadius: '4px',
						transition: 'background-color 0.3s ease'
					},
					'&:hover::-webkit-scrollbar-thumb': {
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
					},
					'&::-webkit-scrollbar-thumb:hover': {
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
					},
					// Firefox scrollbar styling
					scrollbarWidth: 'thin',
					scrollbarColor: (theme: Theme) =>
						theme.palette.mode === 'dark'
							? 'rgba(255, 255, 255, 0.3) transparent'
							: 'rgba(0, 0, 0, 0.3) transparent'
				}
			},

			muiPaginationProps: {
				color: 'primary',
				rowsPerPageOptions: [10, 25, 50, 100],
				shape: 'rounded',
				variant: 'outlined',
				showRowsPerPage: true,
				showFirstButton: true,
				showLastButton: true,
				sx: {
					'& .MuiTablePagination-select': {
						fontWeight: 600
					}
				}
			},

			muiSearchTextFieldProps: {
				placeholder: 'Buscar usuarios...',
				variant: 'outlined',
				size: 'small',
				sx: {
					minWidth: '300px',
					'& .MuiOutlinedInput-root': {
						borderRadius: 1,
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
					}
				}
			},

			muiFilterTextFieldProps: {
				variant: 'outlined',
				size: 'small',
				sx: {
					'& .MuiInputBase-root': {
						borderRadius: 1,
						fontSize: '0.8125rem'
					}
				}
			},

			muiTableHeadCellProps: ({ column }) => ({
				sx: {
					'& .Mui-TableHeadCell-Content': {
						justifyContent: 'space-between',
						gap: 1
					},
					'& .Mui-TableHeadCell-Content-Wrapper': {
						fontWeight: 600
					},
					backgroundColor: (theme: Theme) => (column.getIsPinned() ? theme.palette.action.hover : 'inherit')
				}
			}),

			muiTableBodyCellProps: {
				sx: {
					fontSize: '0.8125rem',
					py: 1
				}
			},

			muiSelectCheckboxProps: {
				color: 'primary',
				sx: {
					'& .MuiSvgIcon-root': {
						fontSize: '1.1rem'
					}
				}
			},

			muiSelectAllCheckboxProps: {
				color: 'primary',
				sx: {
					'& .MuiSvgIcon-root': {
						fontSize: '1.1rem'
					}
				}
			},

			muiColumnActionsButtonProps: {
				sx: {
					'& .MuiSvgIcon-root': {
						fontSize: '1.1rem'
					}
				}
			},

			displayColumnDefOptions: {
				'mrt-row-select': {
					size: 60,
					enableResizing: false,
					enableColumnActions: false,
					enableColumnOrdering: false,
					enableSorting: false
				},
				'mrt-row-actions': {
					header: 'Acciones', // Custom header
					size: 48,
					enableResizing: false,
					enableColumnActions: false,
					enableColumnOrdering: false,
					enableSorting: false
				}
			},

			mrtTheme: (theme) => ({
				baseBackgroundColor: theme.palette.background.paper,
				menuBackgroundColor: theme.palette.background.paper,
				pinnedRowBackgroundColor: theme.palette.action.hover,
				pinnedColumnBackgroundColor: theme.palette.action.hover,
				selectedRowBackgroundColor: theme.palette.action.selected
			}),

			renderTopToolbar: (props) => <DataTableTopToolbar {...props} />,
			icons: UserTableIcons
		}),
		[]
	);

	const tableOptions = useMemo(
		() => ({
			...defaults,
			...rest,
			columns,
			data,
			initialState: {
				...defaults.initialState,
				...rest.initialState
			}
		}),
		[columns, data, defaults, rest]
	);

	const tableInstance = useMaterialReactTable(tableOptions);

	return <MaterialReactTable table={tableInstance} />;
}
