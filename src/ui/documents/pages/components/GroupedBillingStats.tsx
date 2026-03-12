import { Box, Paper, Typography, Avatar } from "@mui/material";
import { FileText, Users, Calculator } from "lucide-react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";

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
			label: 'Total Pendiente',
			value: formatCurrency(totalPending),
			subtitle: 'Importe bruto a facturar',
			icon: <Calculator size={18} />
		},
		{
			label: 'Documentos',
			value: documents.length.toString(),
			subtitle: 'Albaranes listos para procesar',
			icon: <FileText size={18} />
		},
		{
			label: 'Partners',
			value: uniquePartners.toString(),
			subtitle: 'Clientes con deuda pendiente',
			icon: <Users size={18} />
		}
	];

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
				gap: 2
			}}
		>
			{stats.map((stat) => (
				<Paper
					key={stat.label}
					variant="outlined"
					sx={{
						p: 3,
						borderColor: 'divider',
						bgcolor: 'background.paper',
						display: 'flex',
						flexDirection: 'column',
						gap: 2
					}}
				>
					<Box className="flex items-center gap-3">
						<Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected', color: 'text.primary' }}>{stat.icon}</Avatar>
						<Box>
							<Typography
								variant="body2"
								fontWeight={600}
								sx={{ fontSize: '0.85rem' }}
							>
								{stat.label}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{stat.subtitle}
							</Typography>
						</Box>
					</Box>

					<Typography
						sx={{
							fontSize: '1.5rem',
							fontWeight: 800,
							color: 'text.primary'
						}}
					>
						{stat.value}
					</Typography>
				</Paper>
			))}
		</Box>
	);
}
