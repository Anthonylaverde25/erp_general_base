import React from 'react';
import { Box, Typography, Stack, Button, CircularProgress } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface DrawerFooterProps {
	activeExceptionsCount: number;
	isSaving: boolean;
	isLoading: boolean;
	onClose: () => void;
	onSave: () => void;
}

export default function DrawerFooter({ 
	activeExceptionsCount, 
	isSaving, 
	isLoading, 
	onClose, 
	onSave 
}: DrawerFooterProps) {
	return (
		<Box
			sx={{
				p: 2,
				bgcolor: '#f1f5f9',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderTop: '1px solid',
				borderColor: 'divider'
			}}
		>
			<Typography variant="caption" color="text.secondary" fontWeight={600}>
				{activeExceptionsCount} excepciones configuradas
			</Typography>
			
			<Stack direction="row" spacing={1.5}>
				<Button
					variant="outlined"
					size="small"
					onClick={onClose}
					disabled={isSaving}
					sx={{
						borderRadius: 0,
						textTransform: 'none',
						fontWeight: 650,
						fontSize: '0.78rem',
						bgcolor: '#ffffff',
						color: '#374151',
						borderColor: '#d1d5db',
						border: '1px solid',
						'&:hover': {
							bgcolor: '#f9fafb',
							borderColor: '#c5c9d1'
						}
					}}
				>
					Cancelar
				</Button>
				<Button
					variant="contained"
					size="small"
					color="primary"
					disabled={isLoading || isSaving}
					startIcon={isSaving ? <CircularProgress size={12} color="inherit" /> : <FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
					onClick={onSave}
					sx={{
						borderRadius: 0,
						textTransform: 'none',
						fontWeight: 650,
						fontSize: '0.78rem',
						px: 2.5
					}}
				>
					{isSaving ? 'Guardando...' : 'Guardar Cambios'}
				</Button>
			</Stack>
		</Box>
	);
}
