import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Add, Description, RequestQuote, NoteAdd, PointOfSale, ShoppingCart } from '@mui/icons-material';

export default function PartnerCreateActionMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Tooltip title="Crear nuevo documento">
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 1, border: '1px solid', borderColor: 'divider' }}
					aria-controls={open ? 'create-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<Add fontSize="small" />
				</IconButton>
			</Tooltip>
			<Menu
				id="create-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1
							}
						}
					}
				}}
			>
				{[
					{ icon: <Description fontSize="small" />, label: 'Factura' },
					{ icon: <RequestQuote fontSize="small" />, label: 'Presupuesto' },
					{ icon: <NoteAdd fontSize="small" />, label: 'Nota' },
					{ icon: <PointOfSale fontSize="small" />, label: 'Venta' },
					{ icon: <ShoppingCart fontSize="small" />, label: 'Compra' }
				].map((item) => (
					<MenuItem
						key={item.label}
						onClick={handleClose}
					>
						<ListItemIcon>{item.icon}</ListItemIcon>
						<ListItemText primary={item.label} />
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
