import { Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

/**
 * Drag handle for react-grid-layout items.
 * Must have className="drag-handle" so the grid recognizes it via draggableHandle prop.
 * Uses touchAction: none to prevent scroll interference on touch devices.
 */
function DragHandle() {
	return (
		<Box
			className="drag-handle"
			sx={{
				cursor: 'grab',
				p: 0.5,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'primary.main',
				bgcolor: 'action.hover',
				borderRadius: '4px',
				opacity: 0.8,
				flexShrink: 0,
				'&:hover': { opacity: 1, bgcolor: 'primary.main', color: 'primary.contrastText' },
				'&:active': { cursor: 'grabbing' },
			}}
		>
			<DragIndicatorIcon fontSize="small" />
		</Box>
	);
}

export default DragHandle;
