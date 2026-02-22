import { useNavigate } from 'react-router';
import {
	Drawer,
	Box,
	Typography,
	Avatar,
	Chip,
	Divider,
	IconButton,
	Tooltip,
	Stack,
	Button,
	Table,
	TableBody,
	TableRow,
	TableCell
} from '@mui/material';
import {
	Close,
	OpenInNew,
	Phone,
	LocationOn,
	WhatsApp,
	Mail,
	ContentCopy,
	Business,
	Badge,
	Storefront,
	LocalShipping,
	Description,
	RequestQuote,
	NoteAdd,
	ShoppingCart,
	PointOfSale
} from '@mui/icons-material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';

import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';
import { useState, useEffect } from 'react';

interface PartnerDetailDrawerProps {
	open: boolean;
	onClose: () => void;
	partner: PartnerEntity | null;
}

const DRAWER_WIDTH = 480;

const roleLabels: Record<string, string> = {
	client: 'Cliente',
	supplier: 'Proveedor',
	client_supplier: 'Cliente / Proveedor',
	prospect: 'Prospecto'
};

const typeLabels: Record<string, string> = {
	company: 'Empresa',
	person: 'Persona',
	public_organism: 'Organismo Público',
	prospect: 'Prospecto'
};

const roleIcons: Record<string, React.ReactNode> = {
	client: <Storefront fontSize="small" />,
	supplier: <LocalShipping fontSize="small" />,
	client_supplier: <Business fontSize="small" />,
	prospect: <Badge fontSize="small" />
};

function stringToColor(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	return `hsl(${hue}, 35%, 45%)`;
}

function getInitials(fullName: string) {
	const parts = fullName.trim().split(' ');

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
	}

	return fullName.substring(0, 2).toUpperCase();
}

/* ── Reusable sub-components ─────────────────────────────────────────── */

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
	return (
		<Box
			className="flex items-center justify-between"
			sx={{ px: 3, pt: 2, pb: 0.5 }}
		>
			<Typography
				variant="overline"
				color="text.secondary"
				fontWeight={700}
				sx={{ letterSpacing: '0.08em', fontSize: '0.65rem' }}
			>
				{title}
			</Typography>
			{action}
		</Box>
	);
}

interface InfoRowProps {
	label: string;
	value?: string | React.ReactNode;
	mono?: boolean;
	copyable?: boolean;
}

function InfoRow({ label, value, mono, copyable }: InfoRowProps) {
	const isEmpty = !value || value === '';
	const displayValue = isEmpty ? '—' : value;

	const handleCopy = () => {
		if (!isEmpty && typeof value === 'string') {
			navigator.clipboard.writeText(value);
		}
	};

	return (
		<TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
			<TableCell
				sx={{
					py: 0.75,
					px: 3,
					width: '38%',
					borderBottom: '1px solid',
					borderColor: 'divider',
					verticalAlign: 'top'
				}}
			>
				<Typography
					variant="caption"
					color="text.secondary"
					fontWeight={500}
				>
					{label}
				</Typography>
			</TableCell>
			<TableCell
				sx={{
					py: 0.75,
					px: 1.5,
					borderBottom: '1px solid',
					borderColor: 'divider',
					verticalAlign: 'top'
				}}
			>
				<Box className="flex items-center gap-1">
					<Typography
						variant="body2"
						color={isEmpty ? 'text.disabled' : 'text.primary'}
						sx={mono ? { fontFamily: 'monospace', fontSize: '0.8rem' } : undefined}
					>
						{displayValue}
					</Typography>
					{copyable && !isEmpty && typeof value === 'string' && (
						<Tooltip title="Copiar">
							<IconButton
								size="small"
								onClick={handleCopy}
								sx={{ opacity: 0.3, '&:hover': { opacity: 1 } }}
							>
								<ContentCopy sx={{ fontSize: 14 }} />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</TableCell>
		</TableRow>
	);
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function PartnerDetailDrawer({ open, onClose, partner }: PartnerDetailDrawerProps) {
	const navigate = useNavigate();

	const { paymentMethods } = useIndexPaymentMethods();

	const [showAllContacts, setShowAllContacts] = useState(false);
	const [showAllAddresses, setShowAllAddresses] = useState(false);

	useEffect(() => {
		if (open) {
			setShowAllContacts(false);
			setShowAllAddresses(false);
		}
	}, [open, partner?.id]);

	if (!partner) return null;

	const name = partner.name || 'Sin nombre';
	const defaultAddress =
		partner.address?.find((a) => a.default) ||
		(partner.address && partner.address.length > 0 ? partner.address[0] : null);
	const defaultContact =
		partner.contact?.find((c) => c.default) ||
		(partner.contact && partner.contact.length > 0 ? partner.contact[0] : null);

	// Removed unused defaultBank variable

	const addressCount = partner.address?.length || 0;
	const contactCount = partner.contact?.length || 0;

	const handleGoToProfile = () => {
		navigate(`/partners/${partner.id}`);
		onClose();
	};

	const paymentMethodName = paymentMethods?.find((pm) => pm.id === partner.payment_method_id)?.name;

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
		>
			<Box
				sx={{
					width: DRAWER_WIDTH,
					maxWidth: '100vw',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					bgcolor: 'background.default'
				}}
				role="presentation"
			>
				{/* ── Header ────────────────────────────────────────────── */}
				<Box
					sx={{
						p: 2.5,
						pb: 2,
						borderBottom: '1px solid',
						borderColor: 'divider',
						bgcolor: 'background.paper'
					}}
				>
					{/* Toolbar */}
					<Box
						className="flex items-center justify-between"
						sx={{ mb: 2 }}
					>
						<Tooltip title="Ver Perfil Completo">
							<IconButton
								onClick={handleGoToProfile}
								size="small"
							>
								<OpenInNew fontSize="small" />
							</IconButton>
						</Tooltip>
						<IconButton
							onClick={onClose}
							size="small"
						>
							<Close fontSize="small" />
						</IconButton>
					</Box>

					{/* Partner identity */}
					<Box className="flex items-center gap-3">
						<Avatar
							sx={{
								width: 44,
								height: 44,
								bgcolor: stringToColor(name),
								fontSize: '0.95rem',
								fontWeight: 700
							}}
						>
							{getInitials(name)}
						</Avatar>
						<Box className="min-w-0 flex-1">
							<Typography
								variant="subtitle1"
								fontWeight={700}
								className="truncate"
								lineHeight={1.3}
							>
								{name}
							</Typography>
							{partner.comercial_name && (
								<Typography
									variant="body2"
									color="text.secondary"
									className="truncate"
									lineHeight={1.3}
									sx={{ fontSize: '0.8rem' }}
								>
									{partner.comercial_name}
								</Typography>
							)}
						</Box>
					</Box>

					{/* Chips */}
					<Stack
						direction="row"
						gap={1}
						sx={{ mt: 1.5 }}
						flexWrap="wrap"
					>
						<Chip
							icon={(roleIcons[partner.role] as React.ReactElement) || undefined}
							label={roleLabels[partner.role] || partner.role}
							size="small"
							variant="outlined"
							sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, borderRadius: 0.5 }}
						/>
						<Chip
							label={typeLabels[partner.type] || partner.type}
							size="small"
							variant="outlined"
							sx={{ fontSize: '0.7rem', height: 24, borderRadius: 0.5 }}
						/>
					</Stack>

					{/* Quick Contact Actions */}
					<Stack
						direction="row"
						gap={0.75}
						sx={{ mt: 2 }}
					>
						<Button
							variant="outlined"
							size="small"
							disabled={!defaultContact?.phone}
							onClick={() =>
								defaultContact?.phone &&
								window.open(`https://wa.me/${defaultContact.phone.replace(/\D/g, '')}`, '_blank')
							}
							startIcon={<WhatsApp sx={{ fontSize: 15 }} />}
							sx={{
								textTransform: 'none',
								borderColor: 'divider',
								color: 'text.primary',
								fontSize: '0.7rem',
								py: 0.4,
								px: 1.25,
								minWidth: 0,
								borderRadius: 0.5
							}}
						>
							WhatsApp
						</Button>
						<Button
							variant="outlined"
							size="small"
							disabled={!defaultContact?.email}
							onClick={() =>
								defaultContact?.email && (window.location.href = `mailto:${defaultContact.email}`)
							}
							startIcon={<Mail sx={{ fontSize: 15 }} />}
							sx={{
								textTransform: 'none',
								borderColor: 'divider',
								color: 'text.primary',
								fontSize: '0.7rem',
								py: 0.4,
								px: 1.25,
								minWidth: 0,
								borderRadius: 0.5
							}}
						>
							Email
						</Button>
						<Button
							variant="outlined"
							size="small"
							disabled={!defaultContact?.phone}
							onClick={() =>
								defaultContact?.phone && (window.location.href = `tel:${defaultContact.phone}`)
							}
							startIcon={<Phone sx={{ fontSize: 15 }} />}
							sx={{
								textTransform: 'none',
								borderColor: 'divider',
								color: 'text.primary',
								fontSize: '0.7rem',
								py: 0.4,
								px: 1.25,
								minWidth: 0,
								borderRadius: 0.5
							}}
						>
							Llamar
						</Button>
						<Button
							variant="outlined"
							size="small"
							disabled={!defaultAddress}
							onClick={() => {
								if (defaultAddress) {
									const q = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.country}`;
									window.open(
										`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
										'_blank'
									);
								}
							}}
							startIcon={<LocationOn sx={{ fontSize: 15 }} />}
							sx={{
								textTransform: 'none',
								borderColor: 'divider',
								color: 'text.primary',
								fontSize: '0.7rem',
								py: 0.4,
								px: 1.25,
								minWidth: 0,
								borderRadius: 0.5
							}}
						>
							Mapa
						</Button>
					</Stack>
				</Box>

				{/* ── Body – scrollable ─────────────────────────────────── */}
				<Box className="flex-1 overflow-y-auto">
					{/* ── 1. Datos Fiscales ──────────────────────────────── */}
					<SectionHeader title="Datos Fiscales" />
					<Table size="small">
						<TableBody>
							<InfoRow
								label="CIF"
								value={partner.cif}
								mono
								copyable
							/>
							<InfoRow
								label="NIF / VAT"
								value={partner.vat_number}
								mono
								copyable
							/>
							<InfoRow
								label="Método de Pago"
								value={
									paymentMethodName ||
									(partner.payment_method_id ? `#${partner.payment_method_id}` : undefined)
								}
							/>
							<InfoRow
								label="Crédito"
								value={partner.credit_available ? 'Sí' : 'No'}
							/>
							<InfoRow
								label="Fact. Agrupada"
								value={partner.grouped_billing ? 'Sí' : 'No'}
							/>
						</TableBody>
					</Table>

					<Divider />

					{/* ── 2. Crear Nuevo ─────────────────────────────────── */}
					<SectionHeader title="Crear Nuevo" />
					<Stack
						direction="row"
						gap={0.5}
						sx={{ px: 3, pb: 1.5, pt: 0.5 }}
						flexWrap="wrap"
					>
						{[
							{ icon: <Description sx={{ fontSize: 14 }} />, label: 'Factura' },
							{ icon: <RequestQuote sx={{ fontSize: 14 }} />, label: 'Presupuesto' },
							{ icon: <NoteAdd sx={{ fontSize: 14 }} />, label: 'Nota' },
							{ icon: <PointOfSale sx={{ fontSize: 14 }} />, label: 'Venta' },
							{ icon: <ShoppingCart sx={{ fontSize: 14 }} />, label: 'Compra' }
						].map((item, idx) => (
							<Button
								key={idx}
								size="small"
								startIcon={item.icon}
								sx={{
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '0.7rem',
									color: 'text.secondary',
									py: 0.5,
									px: 1.25,
									minWidth: 0,
									borderRadius: 0.5,
									border: '1px solid',
									borderColor: 'divider',
									'&:hover': { bgcolor: 'action.hover', color: 'text.primary' }
								}}
							>
								{item.label}
							</Button>
						))}
					</Stack>

					<Divider />

					{/* ── 3. Contactos ───────────────────────────────────── */}
					<SectionHeader title={`Contactos${contactCount > 1 ? ` (${contactCount})` : ''}`} />
					{partner.contact && partner.contact.length > 0 ? (
						<>
							{(showAllContacts
								? partner.contact
								: [partner.contact.find((c) => c.default) || partner.contact[0]]
							).map((contact, index) => (
								<Box
									key={index}
									sx={{ mb: 2, px: 0 }}
								>
									<Table size="small">
										<TableBody>
											<InfoRow
												label="Email"
												value={contact.email}
												copyable
											/>
											<InfoRow
												label="Teléfono"
												value={contact.phone}
												copyable
											/>
										</TableBody>
									</Table>
									{contact.default && partner.contact.length > 1 && (
										<Typography
											variant="caption"
											color="primary"
											sx={{ px: 3, display: 'block', mt: 0.5 }}
										>
											(Principal)
										</Typography>
									)}
								</Box>
							))}
							{contactCount > 1 && (
								<Button
									size="small"
									onClick={() => setShowAllContacts(!showAllContacts)}
									sx={{ mx: 3, mb: 2, textTransform: 'none', fontSize: '0.75rem' }}
								>
									{showAllContacts ? 'Ver menos' : `Ver todos (${contactCount})`}
								</Button>
							)}
						</>
					) : (
						<Typography
							variant="body2"
							color="text.disabled"
							sx={{ px: 3, mb: 2, fontSize: '0.8rem' }}
						>
							Sin contactos registrados
						</Typography>
					)}

					<Divider />

					{/* ── 4. Direcciones ─────────────────────────────────── */}
					<SectionHeader title={`Direcciones${addressCount > 1 ? ` (${addressCount})` : ''}`} />
					{partner.address && partner.address.length > 0 ? (
						<>
							{(showAllAddresses
								? partner.address
								: [partner.address.find((a) => a.default) || partner.address[0]]
							).map((address, index) => (
								<Box
									key={index}
									sx={{ mb: 2, px: 0 }}
								>
									<Table size="small">
										<TableBody>
											<InfoRow
												label="Calle"
												value={address.street}
											/>
											<InfoRow
												label="Ciudad"
												value={address.city}
											/>
											<InfoRow
												label="Provincia"
												value={address.state}
											/>
											<InfoRow
												label="C.P."
												value={address.postal_code}
												mono
											/>
											<InfoRow
												label="País"
												value={address.country}
											/>
										</TableBody>
									</Table>
									{address.default && partner.address.length > 1 && (
										<Typography
											variant="caption"
											color="primary"
											sx={{ px: 3, display: 'block', mt: 0.5 }}
										>
											(Principal)
										</Typography>
									)}
								</Box>
							))}
							{addressCount > 1 && (
								<Button
									size="small"
									onClick={() => setShowAllAddresses(!showAllAddresses)}
									sx={{ mx: 3, mb: 2, textTransform: 'none', fontSize: '0.75rem' }}
								>
									{showAllAddresses ? 'Ver menos' : `Ver todas (${addressCount})`}
								</Button>
							)}
						</>
					) : (
						<Typography
							variant="body2"
							color="text.disabled"
							sx={{ px: 3, mb: 2, fontSize: '0.8rem' }}
						>
							Sin dirección registrada
						</Typography>
					)}

					<Divider />

					{/* ── 5. Ventas y Compras Statistics ─────────────────── */}
					<SectionHeader title="Ventas y Compras" />
					<Table size="small">
						<TableBody>
							<TableRow>
								<TableCell sx={{ py: 0.6, px: 3, borderColor: 'divider' }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={500}
									>
										Total Ventas
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderColor: 'divider' }}>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										0,00€
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderColor: 'divider' }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={500}
									>
										Total Compras
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderColor: 'divider' }}>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										0,00€
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ py: 0.6, px: 3, borderColor: 'divider' }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={500}
									>
										Promedio Ventas
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderColor: 'divider' }}>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										0,00€
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderColor: 'divider' }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={500}
									>
										Promedio Compras
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderColor: 'divider' }}>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										0,00€
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ py: 0.6, px: 3, borderBottom: 0 }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={500}
									>
										Pendiente Cobro
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderBottom: 0 }}>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										0,00€
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderBottom: 0 }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={500}
									>
										Pendiente Pago
									</Typography>
								</TableCell>
								<TableCell sx={{ py: 0.6, px: 1.5, borderBottom: 0 }}>
									<Typography
										variant="body2"
										fontWeight={600}
									>
										0,00€
									</Typography>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					{/* Summary counters */}
					<Divider />
					<Box sx={{ px: 3, py: 1.5 }}>
						<Typography
							variant="caption"
							color="text.disabled"
							sx={{ fontSize: '0.65rem' }}
						>
							{addressCount} dirección{addressCount !== 1 ? 'es' : ''} · {contactCount} contacto
							{contactCount !== 1 ? 's' : ''}
						</Typography>
					</Box>
				</Box>
			</Box>
		</Drawer>
	);
}
