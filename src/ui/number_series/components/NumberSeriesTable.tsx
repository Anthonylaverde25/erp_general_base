import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Stack, Typography, Chip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';

interface NumberSeriesTableProps {
	numberSeries: NumberSeriesEntity[] | undefined;
	onEdit: (series: NumberSeriesEntity) => void;
	onDelete: (id: number) => void;
}

export default function NumberSeriesTable(props: NumberSeriesTableProps) {
	const { numberSeries, onEdit, onDelete } = props;

	const columns = useMemo<MRT_ColumnDef<NumberSeriesEntity>[]>(
		() => [
			{
				id: 'document_type',
				header: 'Tipo de Documento',
				accessorFn: (row) => row.document_type?.name || '',
				Cell: ({ row }) => (
					<Stack spacing={0.5}>
						<Typography
							variant="subtitle2"
							sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
						>
							{row.original.document_type?.name || '-'}
						</Typography>
						<Chip
							label={row.original.document_type?.code || '-'}
							size="small"
							sx={{ width: 'fit-content', borderRadius: 0, height: 18, fontSize: '0.7rem' }}
						/>
					</Stack>
				)
			},
			{
				accessorKey: 'serie',
				header: 'Serie',
				Cell: ({ cell }) => (
					<span className="font-semibold">
						{cell.getValue<string>()}
					</span>
				)
			},
			{
				accessorKey: 'year',
				header: 'Año'
			},
			{
				accessorKey: 'current_number',
				header: 'Número Actual',
				Cell: ({ cell }) => (
					<span className="font-semibold text-primary">
						{cell.getValue<number>()}
					</span>
				)
			},
			{
				accessorKey: 'terms',
				header: 'Términos',
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			}
		],
		[]
	);

	return (
		<DataTable
			data={numberSeries || []}
			columns={columns}
			enableRowSelection={false}
			renderRowActionMenuItems={({ closeMenu, row }) => [
				<MenuItem
					key="edit"
					onClick={() => {
						onEdit(row.original);
						closeMenu();
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
					</ListItemIcon>
					Editar serie
				</MenuItem>,
				<MenuItem
					key="delete"
					onClick={() => {
						onDelete(row.original.id);
						closeMenu();
					}}
					sx={{ color: 'error.main' }}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20} className="text-red">heroicons-outline:trash</FuseSvgIcon>
					</ListItemIcon>
					Eliminar serie
				</MenuItem>
			]}
		/>
	);
}
