import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useIndexNumberSeries from '@/features/number_series/hooks/useIndexNumberSeries';
import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';

import { useState } from 'react';
import CreateNumberSeriesModal from './modals/CreateNumberSeriesModal';
import UpdateNumberSeriesModal from './modals/UpdateNumberSeriesModal';
import NumberSeriesTable from './NumberSeriesTable';

export default function NumberSeriesTabView() {
	const theme = useTheme();
	const { numberSeries, isLoading, isError } = useIndexNumberSeries();
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [selectedSeries, setSelectedSeries] = useState<NumberSeriesEntity | null>(null);

	const handleEdit = (series: NumberSeriesEntity) => {
		setSelectedSeries(series);
		setUpdateModalOpen(true);
	};

	const handleCloseUpdateModal = () => {
		setUpdateModalOpen(false);
		setSelectedSeries(null);
	};

	if (isLoading)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="text.secondary">Cargando series numéricas...</Typography>
			</Box>
		);

	if (isError)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="error">Error al cargar las series numéricas</Typography>
			</Box>
		);

	return (
		<Box className="w-full overflow-hidden">
			{/* Header Section */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				sx={{
					p: 3,
					borderBottom: `1px solid ${theme.palette.divider}`
				}}
			>
				<div />
				<Button
					className="btn-primary"
					variant="contained"
					color="primary"
					size="large"
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
					onClick={() => setCreateModalOpen(true)}
				>
					Crear serie
				</Button>
			</Stack>

			{/* Table Section */}
			{/* Table Section */}
			<NumberSeriesTable
				numberSeries={numberSeries}
				onEdit={handleEdit}
				onDelete={() => {}}
			/>

			<CreateNumberSeriesModal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
			/>

			<UpdateNumberSeriesModal
				open={updateModalOpen}
				onClose={handleCloseUpdateModal}
				numberSeries={selectedSeries}
			/>
		</Box>
	);
}
