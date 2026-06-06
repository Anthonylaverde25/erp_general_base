import { type ReactNode } from 'react';
import { Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type DashGridItemProps = {
	children: ReactNode;
	isEditing: boolean;
	/** If true, the card content has no padding (e.g. PendingPaymentsCard manages its own). */
	noPadding?: boolean;
};

/**
 * Lightweight wrapper for each react-grid-layout grid item.
 *
 * IMPORTANT: This component renders a plain <div> as its root element.
 * react-grid-layout clones each direct child and injects `style`, `className`,
 * and mouse event handlers. Using a complex MUI component (Paper/Card) as the
 * root would break drag/resize because those components may intercept events
 * or fail to forward injected props to the DOM.
 *
 * The visual "card" appearance is achieved with inline styles on the root <div>.
 */
function DashGridItem({ children, isEditing, noPadding = false }: DashGridItemProps) {
	return (
		<Box
			sx={{
				height: '100%',
				width: '100%',
				bgcolor: 'background.paper',
				borderRadius: '4px',
				border: '1px solid',
				borderColor: isEditing ? 'primary.light' : 'divider',
				boxShadow: 1,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				transition: 'border-color 0.2s',
			}}
		>
			{/* Drag handle — only visible in edit mode */}
			{isEditing && (
				<Box
					className="drag-handle"
					sx={{
						position: 'absolute',
						top: 6,
						right: 6,
						zIndex: 10,
						cursor: 'grab',
						p: 0.5,
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'primary.main',
						bgcolor: 'action.hover',
						borderRadius: '4px',
						opacity: 0.8,
						'&:hover': { opacity: 1, bgcolor: 'primary.main', color: 'primary.contrastText' },
						'&:active': { cursor: 'grabbing' },
					}}
				>
					<DragIndicatorIcon fontSize="small" />
				</Box>
			)}

			{/* Card content */}
			<Box sx={{ p: noPadding ? 0 : 2.5, flex: 1, overflow: 'hidden' }}>{children}</Box>
		</Box>
	);
}

export default DashGridItem;
