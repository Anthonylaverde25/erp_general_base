import { ReactNode } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	IconButton,
	Divider,
	DialogProps,
	SxProps,
	Theme
} from '@mui/material';
import { X } from 'lucide-react';

interface AppFormModalProps extends Omit<DialogProps, 'open' | 'onClose' | 'title'> {
	isOpen: boolean;
	onClose: () => void;
	title: ReactNode;
	subtitle?: ReactNode;
	children: ReactNode;
	actions?: ReactNode; // Allow fully custom actions
	// Or use predefined action buttons
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
	isConfirmDisabled?: boolean;
	confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
	hideCancel?: boolean;
	actionsSx?: SxProps<Theme>;
}

export function AppFormModal({
	isOpen,
	onClose,
	title,
	subtitle,
	children,
	actions,
	onConfirm,
	confirmText = 'Aceptar',
	cancelText = 'Cancelar',
	isConfirmDisabled = false,
	confirmColor = 'secondary',
	hideCancel = false,
	maxWidth = 'sm',
	fullWidth = true,
	actionsSx,
	...dialogProps
}: AppFormModalProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth={maxWidth}
			fullWidth={fullWidth}
			PaperProps={{
				sx: { borderRadius: 3, overflow: 'hidden', ...dialogProps.PaperProps?.sx }
			}}
			{...dialogProps}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					pb: subtitle ? 1 : 2
				}}
			>
				<div>
					<Typography
						variant="h6"
						fontWeight={700}
					>
						{title}
					</Typography>
					{subtitle && (
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{subtitle}
						</Typography>
					)}
				</div>
				<IconButton
					onClick={onClose}
					size="small"
					tabIndex={-1}
				>
					<X size={18} />
				</IconButton>
			</DialogTitle>

			<Divider />

			<DialogContent sx={{ p: 0 }}>{children}</DialogContent>

			<Divider />

			{(actions || onConfirm || !hideCancel) && (
				<DialogActions sx={{ px: 3, py: 2, ...actionsSx }}>
					{actions ? (
						actions
					) : (
						<>
							{!hideCancel && (
								<Button
									variant="outlined"
									color="inherit"
									onClick={onClose}
								>
									{cancelText}
								</Button>
							)}
							{onConfirm && (
								<Button
									variant="contained"
									color={confirmColor}
									onClick={onConfirm}
									disabled={isConfirmDisabled}
								>
									{confirmText}
								</Button>
							)}
						</>
					)}
				</DialogActions>
			)}
		</Dialog>
	);
}
