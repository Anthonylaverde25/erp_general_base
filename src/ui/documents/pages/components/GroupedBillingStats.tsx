import { Box, Paper, Typography, alpha } from "@mui/material";
import { FileText, Users, Calculator } from "lucide-react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { SAP_THEME } from "./grouped-invoices-table/theme";

interface GroupedBillingStatsProps {
	documents: DocumentEntity[];
}

export default function GroupedBillingStats({ documents }: GroupedBillingStatsProps) {
	const totalPending = documents.reduce((acc, doc) => acc + (doc.total || 0), 0);
	const uniquePartners = new Set(documents.map((doc) => doc.partner_id)).size;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
	};

	const stats = [
		{
			label: 'TOTAL PENDIENTE',
			value: formatCurrency(totalPending),
			subtitle: 'Importe bruto a facturar',
			icon: <Calculator size={16} />,
			color: SAP_THEME.primary,
		},
		{
			label: 'DOCUMENTOS',
			value: documents.length.toString(),
			subtitle: 'Albaranes listos para procesar',
			icon: <FileText size={16} />,
			color: '#64748b', // Technical slate gray
		},
		{
			label: 'PARTNERS',
			value: uniquePartners.toString(),
			subtitle: 'Clientes con deuda pendiente',
			icon: <Users size={16} />,
			color: '#64748b', // Technical slate gray
		}
	];

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
				gap: 2,
				mb: 1
			}}
		>
			{stats.map((stat) => (
				<Paper
					key={stat.label}
					elevation={0}
					sx={{
						p: 2.5,
						border: (theme) => `1px solid ${theme.palette.divider}`,
						borderLeft: `4px solid ${stat.color}`,
						borderRadius: SAP_THEME.borderRadius,
						bgcolor: 'background.paper',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						gap: 1.5,
						transition: SAP_THEME.transition,
						'&:hover': {
							boxShadow: (theme) => theme.shadows[1],
							transform: 'translateY(-1px)'
						}
					}}
				>
					<Box className="flex items-center justify-between">
						<Box className="flex items-center gap-2">
							<Box 
								sx={{ 
									p: 0.75, 
									borderRadius: '4px', 
									bgcolor: alpha(stat.color, 0.08), 
									color: stat.color,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								{stat.icon}
							</Box>
							<Typography
								sx={{ 
									fontSize: '0.65rem', 
									fontWeight: 800, 
									color: 'text.secondary',
									letterSpacing: 1,
									textTransform: 'uppercase'
								}}
							>
								{stat.label}
							</Typography>
						</Box>
					</Box>

					<Box>
						<Typography
							sx={{
								fontSize: '1.75rem',
								fontWeight: 900,
								color: stat.color === SAP_THEME.primary ? SAP_THEME.primary : 'text.primary',
								lineHeight: 1,
								letterSpacing: -1
							}}
						>
							{stat.value}
						</Typography>
						<Typography
							variant="caption"
							sx={{ 
								color: 'text.secondary', 
								fontWeight: 500,
								mt: 0.5,
								display: 'block',
								opacity: 0.8
							}}
						>
							{stat.subtitle}
						</Typography>
					</Box>
				</Paper>
			))}
		</Box>
	);
}
