import { MaterialReactTable, useMaterialReactTable, MaterialReactTableProps, MRT_Icons } from 'material-react-table';
import defaultsDeep from 'lodash/defaultsDeep';
import { useMemo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Theme } from '@mui/material/styles';
import DataTableTopToolbar from './DataTableTopToolbar';
import { useThemeMediaQuery } from '@fuse/hooks';

const tableIcons: Partial<MRT_Icons> = {
	ArrowDownwardIcon: (props) => <FuseSvgIcon {...props}>lucide:arrow-down</FuseSvgIcon>,
	ClearAllIcon: () => <FuseSvgIcon>lucide:brush-cleaning</FuseSvgIcon>,
	DensityLargeIcon: () => <FuseSvgIcon>lucide:rows-2</FuseSvgIcon>,
	DensityMediumIcon: () => <FuseSvgIcon>lucide:rows-3</FuseSvgIcon>,
	DensitySmallIcon: () => <FuseSvgIcon>lucide:rows-4</FuseSvgIcon>,
	DragHandleIcon: () => <FuseSvgIcon>lucide:grip-vertical</FuseSvgIcon>,
	FilterListIcon: (props) => <FuseSvgIcon {...props}>lucide:list-filter</FuseSvgIcon>,
	FilterListOffIcon: () => <FuseSvgIcon>lucide:funnel</FuseSvgIcon>,
	FullscreenExitIcon: () => <FuseSvgIcon>lucide:log-in</FuseSvgIcon>,
	FullscreenIcon: () => <FuseSvgIcon>lucide:log-out</FuseSvgIcon>,
	SearchIcon: (props) => <FuseSvgIcon {...props}>lucide:search</FuseSvgIcon>,
	SearchOffIcon: () => <FuseSvgIcon>lucide:search-x</FuseSvgIcon>,
	ViewColumnIcon: () => <FuseSvgIcon>lucide:columns-3-cog</FuseSvgIcon>,
	MoreVertIcon: () => <FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>,
	MoreHorizIcon: () => <FuseSvgIcon>lucide:ellipsis</FuseSvgIcon>,
	SortIcon: (props) => <FuseSvgIcon {...props}>lucide:arrow-down-up</FuseSvgIcon>,
	PushPinIcon: (props) => <FuseSvgIcon {...props}>lucide:pin</FuseSvgIcon>,
	VisibilityOffIcon: () => <FuseSvgIcon>lucide:eye-off</FuseSvgIcon>
};

function DataTable<TData>(props: MaterialReactTableProps<TData>) {
	const { columns, data, ...rest } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const defaults = useMemo(
		() =>
			defaultsDeep(rest, {
				initialState: {
					density: 'compact',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: isMobile ? [] : ['mrt-row-numbers', 'mrt-row-expand', 'mrt-row-select'],
						right: isMobile ? [] : ['mrt-row-actions']
					},
					pagination: {
						pageSize: 15
					},
					enableFullScreenToggle: false
				},
				enableRowNumbers: true,
				rowNumberDisplayMode: 'static',
				enableColumnResizing: false,
				enableFullScreenToggle: false,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: true,
				muiTableProps: {
					sx: {
						borderCollapse: 'collapse',
						border: (theme: Theme) => `1px solid ${theme.vars.palette.divider}`,
						'& .MuiTableCell-root': {
							border: (theme: Theme) => `1px solid ${theme.vars.palette.divider}`,
							padding: '6px 10px',
							fontSize: '0.8125rem',
							borderRadius: 0
						},
						'& .MuiTableHead-root .MuiTableCell-root': {
							backgroundColor: (theme: Theme) =>
								theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
							fontWeight: 700,
							color: 'text.primary'
						}
					}
				},
				muiTopToolbarProps: {
					sx: {
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
						borderBottom: (theme: Theme) => `1px solid ${theme.vars.palette.divider}`,
					}
				},
				muiBottomToolbarProps: {
					className: 'flex items-center min-h-14 h-14'
				},
				muiTablePaperProps: {
					elevation: 0,
					square: true,
					className: 'flex flex-col flex-auto h-full'
				},
				muiTableContainerProps: {
					className: 'flex-auto'
				},
				enableStickyHeader: true,
				// enableStickyFooter: true,
				paginationDisplayMode: 'pages',
				positionToolbarAlertBanner: 'top',
				muiPaginationProps: {
					color: 'secondary',
					rowsPerPageOptions: [10, 20, 30],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: false
				},
				muiSearchTextFieldProps: {
					placeholder: 'Search',
					sx: { minWidth: '300px' },
					variant: 'outlined',
					size: 'small'
				},
				muiFilterTextFieldProps: {
					variant: 'outlined',
					size: 'small',
					sx: {
						'& .MuiInputAdornment-root': {
							padding: 0,
							margin: 0
						},
						'& .MuiInputBase-root': {
							padding: 0
						},
						'& .MuiInputBase-input': {
							padding: 0
						}
					}
				},
				muiSelectAllCheckboxProps: {
					size: 'small'
				},
				muiSelectCheckboxProps: {
					size: 'small'
				},
				muiTableBodyRowProps: ({ row, table }) => {
					const { density } = table.getState();

					return {
						sx: {
							backgroundColor: row.index % 2 === 0 ? 'transparent' : 'action.hover',
							borderBottom: (theme: Theme) => `1px solid ${theme.vars.palette.divider}`,
							opacity: 1,
							boxShadow: 'none',
							height: row.getIsPinned() ? `${37}px` : undefined,
							'&:hover': {
								backgroundColor: (theme: Theme) =>
									theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
								transition: 'background-color 0.2s ease'
							}
						}
					};
				},
				muiTableHeadCellProps: ({ column }) => ({
					sx: {
						'& .Mui-TableHeadCell-Content-Labels': {
							flex: 1,
							justifyContent: 'space-between'
						},
						'& .Mui-TableHeadCell-Content-Actions': {
							'& > button': {
								marginX: '2px'
							}
						},
						'& .MuiFormHelperText-root': {
							textAlign: 'center',
							marginX: 0,
							color: (theme: Theme) => theme.vars.palette.text.disabled,
							fontSize: 11
						},
						backgroundColor: (theme) =>
							column.getIsPinned()
								? theme.vars.palette.background.paper
								: theme.palette.mode === 'dark'
									? '#242a2b'
									: '#f1f3f4',
						borderBottom: (theme: Theme) => `1px solid ${theme.vars.palette.divider}`,
						borderRight: (theme: Theme) => `1px solid ${theme.vars.palette.divider}`,
						fontWeight: 700,
						fontSize: '0.8125rem',
						padding: '6px 10px'
					}
				}),
				mrtTheme: (theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
				renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
				icons: tableIcons,
				positionActionsColumn: 'last'
			} as Partial<MaterialReactTableProps<TData>>),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[rest]
	);

	const tableOptions = useMemo(
		() => ({
			columns,
			data,
			...defaults,
			...rest
		}),
		[columns, data, defaults, rest]
	);

	const tableInstance = useMaterialReactTable<TData>(tableOptions);

	return <MaterialReactTable table={tableInstance} />;
}

export default DataTable;
