import { Box, Typography } from '@mui/material';
import { Business, Person, AccountBalance } from '@mui/icons-material';

/* ── Constants ───────────────────────────────────────────────────────── */

export const roleLabels: Record<string, string> = {
	client: 'Cliente',
	supplier: 'Proveedor',
	client_supplier: 'Cliente / Proveedor',
	prospect: 'Prospecto'
};

export const typeLabels: Record<string, string> = {
	company: 'Empresa',
	person: 'Persona',
	public_organism: 'Org. Público',
	prospect: 'Prospecto'
};

export const typeIcons: Record<string, React.ReactNode> = {
	company: <Business sx={{ fontSize: 28 }} />,
	person: <Person sx={{ fontSize: 28 }} />,
	public_organism: <AccountBalance sx={{ fontSize: 28 }} />,
	prospect: <Person sx={{ fontSize: 28 }} />
};

export const roleColors: Record<string, string> = {
	client: '#4caf50',
	supplier: '#2196f3',
	client_supplier: '#9c27b0',
	prospect: '#9e9e9e'
};

/* ── Shared Components ───────────────────────────────────────────────── */

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
	return (
		<Box
			className="flex items-center justify-between"
			sx={{ mb: 2 }}
		>
			<Typography
				variant="subtitle2"
				fontWeight={700}
				sx={{ fontSize: '0.85rem', letterSpacing: '0.01em' }}
			>
				{children}
			</Typography>
			{action}
		</Box>
	);
}

export function SidebarInfoRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<Box sx={{ mb: 2 }}>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 600,
					fontSize: '0.65rem',
					color: 'text.secondary',
					display: 'block',
					mb: 0.25,
					letterSpacing: '0.04em',
					textTransform: 'uppercase'
				}}
			>
				{label}
			</Typography>
			{children}
		</Box>
	);
}
