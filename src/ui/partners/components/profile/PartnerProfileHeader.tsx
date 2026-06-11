import { Box, Typography, Chip, Button, IconButton, Avatar, alpha, useTheme, Tooltip } from '@mui/material';
import { ContentCopy, MoreVert, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import PageHeader from '@/components/PageHeader';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { roleLabels, typeLabels, typeIcons, roleColors } from './PartnerProfileShared';
import PartnerCreateActionMenu from './PartnerCreateActionMenu';

interface PartnerProfileHeaderProps {
	partner: PartnerEntity;
	tabValue: number;
	onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function PartnerProfileHeader({ partner, tabValue, onTabChange }: PartnerProfileHeaderProps) {
	const navigate = useNavigate();
	const theme = useTheme();

	const name = partner.name || 'Sin nombre';
	const accentColor = roleColors[partner.role] || theme.palette.primary.main;
	const defaultContact = partner.contact?.find((c) => c.default) || (partner.contact?.[0] ?? null);

	const titleNode = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
			<Avatar
				sx={{
					width: 32,
					height: 32,
					bgcolor: alpha(accentColor, 0.15),
					color: accentColor,
					fontSize: 16,
					fontWeight: 700
				}}
			>
				{typeIcons[partner.type] || typeIcons['company']}
			</Avatar>
			<Typography
				variant="h5"
				sx={{ fontWeight: 900, color: 'text.primary' }}
			>
				{name}
			</Typography>
			<Chip
				label={roleLabels[partner.role] || partner.role}
				size="small"
				sx={{
					bgcolor: alpha(accentColor, 0.12),
					color: accentColor,
					fontWeight: 600,
					height: 20,
					fontSize: '0.7rem'
				}}
			/>
			<Chip
				label={typeLabels[partner.type] || partner.type}
				size="small"
				variant="outlined"
				sx={{ height: 20, fontSize: '0.7rem' }}
			/>
		</Box>
	);

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
			<PageHeader
				title={titleNode}
				subtitle={`CIF: ${partner.cif || 'N/A'} · Contacto: ${defaultContact?.email || 'N/A'}`}
				onBack={() => navigate('/partners')}
				actions={
					<>
						<PartnerCreateActionMenu />
						<Button
							variant="outlined"
							color="inherit"
							size="small"
							disableElevation
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								fontSize: '0.75rem',
								color: 'text.secondary',
								py: 0.5,
								px: 1.5,
								borderRadius: '4px',
								borderColor: 'divider',
								bgcolor: 'transparent',
								gap: 1,
								'&:hover': {
									bgcolor: 'action.hover',
									color: 'text.primary',
									borderColor: 'divider'
								}
							}}
						>
							<Refresh sx={{ fontSize: 18 }} />
							Actualizar
						</Button>
						<Tooltip title="Copiar ID">
							<IconButton size="small">
								<ContentCopy fontSize="small" />
							</IconButton>
						</Tooltip>
						<IconButton size="small">
							<MoreVert fontSize="small" />
						</IconButton>
					</>
				}
			/>

			<Box className="flex flex-wrap items-center gap-2 px-8 pb-4">
				{['Resumen', 'Impuestos', 'Archivos'].map((label, index) => {
					const isActive = tabValue === index;
					return (
						<Button
							key={label}
							onClick={(e) => onTabChange(e, index)}
							size="small"
							disableElevation
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								fontSize: '0.75rem',
								color: isActive ? '#ffffff' : 'text.secondary',
								py: 0.5,
								px: 1.5,
								borderRadius: '4px',
								border: '1px solid',
								borderColor: isActive ? '#005483' : 'divider',
								bgcolor: isActive ? '#005483' : 'transparent',
								'&:hover': {
									bgcolor: isActive ? '#004369' : 'action.hover',
									color: isActive ? '#ffffff' : 'text.primary',
									borderColor: isActive ? '#005483' : 'divider'
								}
							}}
						>
							{label}
						</Button>
					);
				})}
			</Box>
		</Box>
	);
}
