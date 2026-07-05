import { type ReactNode } from 'react';
import { Box, alpha, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';

type DashGridItemProps = {
	children: ReactNode;
	isEditing: boolean;
	/** If true, the card content has no padding (e.g. PendingPaymentsCard manages its own). */
	noPadding?: boolean;
	onRemove?: () => void;
};

/**
 * Lightweight wrapper for each react-grid-layout grid item.
 *
 * It renders a flex column container:
 * - When isEditing is true, a top-bar drag handle (.drag-handle) is rendered at the top,
 *   and the card border turns dashed with a subtle primary color shadow.
 * - When isEditing is false, it renders normal borders with no drag handle.
 */
function DashGridItem({ children, isEditing, noPadding = false, onRemove }: DashGridItemProps) {
	return (
		<Box
			sx={{
				height: '100%',
				width: '100%',
				bgcolor: 'background.paper',
				borderRadius: '8px',
				border: isEditing ? '1px dashed' : '1px solid',
				borderColor: isEditing ? 'primary.main' : 'divider',
				boxShadow: isEditing ? (theme) => `0 0 0 1px ${alpha(theme.palette.primary.main, 0.15)}` : 1,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				transition: 'border-color 0.2s, box-shadow 0.2s'
			}}
		>
			{/* Top-bar drag handle — only visible in edit mode */}
			{isEditing && (
				<Box
					className="drag-handle"
					sx={{
						height: '24px',
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						px: 1,
						bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
						borderBottom: '1px solid',
						borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
						color: 'primary.main',
						cursor: 'grab',
						zIndex: 10,
						flexShrink: 0,
						'&:hover': {
							bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
						},
						'&:active': {
							cursor: 'grabbing'
						}
					}}
				>
					<Box sx={{ width: 20 }} /> {/* Spacer to center the drag handle icon */}
					<DragIndicatorIcon sx={{ fontSize: 18 }} />
					{onRemove ? (
						<IconButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							sx={{ 
								p: '2px', 
								color: 'text.secondary',
								'&:hover': { color: 'error.main' }
							}}
						>
							<CloseIcon sx={{ fontSize: 14 }} />
						</IconButton>
					) : (
						<Box sx={{ width: 20 }} />
					)}
				</Box>
			)}

			{/* Card content */}
			<Box
				sx={{
					p: noPadding ? 0 : 2.5,
					flex: 1,
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

export default DashGridItem;
