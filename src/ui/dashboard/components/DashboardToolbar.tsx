import { useState } from 'react';
import { Box, Typography, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import { Dashboard } from '../types/dashboard.types';
import CreateDashboardModal from './modals/CreateDashboardModal';

type DashboardToolbarProps = {
  isEditing: boolean;
  onToggleEdit: () => void;
  dashboards: Dashboard[];
  activeDashboardId: number | null;
  onSelectDashboard: (id: number) => void;
  onCreateDashboard: (name: string) => void;
  onDeleteDashboard: (id: number) => void;
  onUpdateDashboard: (id: number, payload: { name?: string; is_default?: boolean }) => void;
  onOpenAddWidget: () => void;
};

/**
 * Dashboard toolbar with board tabs, edit structure toggle, and reset layout button.
 */
function DashboardToolbar({
  isEditing,
  onToggleEdit,
  dashboards,
  activeDashboardId,
  onSelectDashboard,
  onCreateDashboard,
  onDeleteDashboard,
  onUpdateDashboard,
  onOpenAddWidget,
}: DashboardToolbarProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuBoard, setSelectedMenuBoard] = useState<Dashboard | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, board: Dashboard) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuBoard(board);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedMenuBoard(null);
  };

  const handleMarkDefault = () => {
    if (selectedMenuBoard) {
      onUpdateDashboard(selectedMenuBoard.id, { is_default: true });
    }
    handleCloseMenu();
  };

  const handleRename = () => {
    if (selectedMenuBoard) {
      const newName = prompt('Ingrese el nuevo nombre del tablero:', selectedMenuBoard.name);
      if (newName && newName.trim()) {
        onUpdateDashboard(selectedMenuBoard.id, { name: newName.trim() });
      }
    }
    handleCloseMenu();
  };

  const handleDelete = () => {
    if (selectedMenuBoard) {
      if (confirm(`¿Está seguro de que desea eliminar el tablero "${selectedMenuBoard.name}"?`)) {
        onDeleteDashboard(selectedMenuBoard.id);
      }
    }
    handleCloseMenu();
  };

  return (
    <>
      {/* Main toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
        
        {/* Render boards dynamically */}
        {dashboards.map((board) => {
          const isActive = board.id === activeDashboardId;
          return (
            <Box
              key={board.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: isActive ? 'text.primary' : 'background.paper',
                color: isActive ? 'background.paper' : 'text.primary',
                borderRadius: 1,
                border: isActive ? 'none' : '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                height: 32,
              }}
            >
              <Button
                size="small"
                onClick={() => onSelectDashboard(board.id)}
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontWeight: isActive ? 700 : 600,
                  px: 2,
                  minWidth: 'auto',
                  borderRadius: 0,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {board.name}
                {board.is_default && (
                  <StarIcon sx={{ fontSize: 14, color: isActive ? '#fbbf24' : 'text.secondary' }} />
                )}
              </Button>
              <Box sx={{ width: '1px', bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'divider', height: '100%' }} />
              <IconButton
                size="small"
                onClick={(e) => handleOpenMenu(e, board)}
                sx={{ color: 'inherit', borderRadius: 0, p: '4px', height: '100%' }}
              >
                <MoreVertIcon fontSize="small" sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          );
        })}

        {/* Create board button */}
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, fontSize: '0.8125rem' }}
        >
          Nuevo tablero
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* Toolbar action buttons */}
        <Button
          size="small"
          onClick={onToggleEdit}
          variant={isEditing ? 'contained' : 'outlined'}
          color={isEditing ? 'primary' : 'inherit'}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', borderRadius: '4px' }}
        >
          {isEditing ? '✓ Finalizar Edición' : '⊞ Editar Diseño'}
        </Button>

        {isEditing && activeDashboardId && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={onOpenAddWidget}
            variant="contained"
            color="secondary"
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', borderRadius: '4px' }}
          >
            Añadir Widget
          </Button>
        )}
      </Box>

      {/* Edit mode hint banner */}
      {isEditing && (
        <Box
          sx={{
            mb: 2,
            px: 2,
            py: 1,
            borderRadius: '4px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: 13,
          }}
        >
          <DragIndicatorIcon fontSize="small" />
          <Typography
            variant="caption"
            sx={{ fontWeight: 600 }}
          >
            Modo edición activo — Mueve los widgets arrastrando desde el encabezado · Cambia de tamaño desde la esquina inferior derecha
          </Typography>
        </Box>
      )}

      {/* Boards Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleMarkDefault} disabled={selectedMenuBoard?.is_default}>
          <ListItemIcon>
            <StarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Marcar como predeterminado" />
        </MenuItem>
        <MenuItem onClick={handleRename}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Renombrar tablero" />
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={dashboards.length <= 1} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" className="text-red" />
          </ListItemIcon>
          <ListItemText primary="Eliminar tablero" />
        </MenuItem>
      </Menu>

      {/* Modal for creating a board */}
      <CreateDashboardModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={onCreateDashboard}
      />
    </>
  );
}

export default DashboardToolbar;
