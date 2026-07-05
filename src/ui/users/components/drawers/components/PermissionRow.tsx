// import React from 'react';
// import { Box, Stack, Typography, Chip, ToggleButtonGroup, ToggleButton, alpha, useTheme } from '@mui/material';

// interface PermissionRowProps {
//   permission: any;
//   isGrantedByRole: boolean;
//   localState: boolean | null;
//   onExceptionChange: (permissionId: number, value: string | null) => void;
// }

// export default function PermissionRow({ 
//   permission, 
//   isGrantedByRole, 
//   localState, 
//   onExceptionChange 
// }: PermissionRowProps) {
//   const theme = useTheme();

//   // Determinar el valor de ToggleButton
//   const toggleValue = localState === true 
//     ? 'allow' 
//     : localState === false 
//       ? 'deny' 
//       : 'inherit';

//   // Determinar si el permiso está finalmente habilitado para el usuario
//   const isCurrentlyAllowed = localState !== null ? localState : isGrantedByRole;

//   return (
//     <Box
//       className=''
//       sx={{
//         border: '1px solid',
//         borderColor: '#e2e8f0',
//         bgcolor: '#ffffff',
//         transition: 'all 0.15s',
//         display: 'flex',
//         flexDirection: 'column', // Cambiado a layout de columna
//         '&:hover': {
//           borderColor: 'primary.light',
//           bgcolor: alpha(theme.palette.primary.main, 0.01)
//         }
//       }}
//     >
//       {/* Contenido Principal */}
//       <Box sx={{ py: 1, px: 1.5, flexGrow: 1 }}>
//         <Stack direction="column" spacing={0.5}>
//           <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.5}>
//             <Typography 
//               variant="body2" 
//               fontWeight={650}
//               color="text.primary"
//               sx={{ fontSize: '0.8rem' }}
//             >
//               {permission.name}
//             </Typography>
            
//             {/* Chip Indicador de Estado Final */}
//             <Chip
//               label={isCurrentlyAllowed ? 'Con acceso' : 'Sin acceso'}
//               size="small"
//               color={isCurrentlyAllowed ? 'success' : 'default'}
//               variant="outlined"
//               sx={{ 
//                 height: 16, 
//                 fontSize: '9px', 
//                 fontWeight: 700, 
//                 px: 0.5,
//                 borderColor: isCurrentlyAllowed ? 'success.light' : 'divider',
//                 color: isCurrentlyAllowed ? 'success.main' : 'text.secondary'
//               }}
//             />
//           </Stack>
          
//           <Typography 
//             variant="caption" 
//             color="text.secondary"
//             sx={{ fontSize: '0.7rem', display: 'block' }}
//           >
//             {permission.description}
//           </Typography>
          
//           {/* Estado Rol Base */}
//           <Typography 
//             variant="caption" 
//             sx={{ 
//               fontSize: '9px', 
//               fontWeight: 500,
//               color: isGrantedByRole ? 'success.main' : 'text.disabled',
//               display: 'block'
//             }}
//           >
//             {isGrantedByRole ? '✓ Concedido nativamente por el Rol' : '✗ No concedido por el Rol'}
//           </Typography>
//         </Stack>
//       </Box>

//       {/* Footer de Acciones */}
//       <Box 
//         sx={{ 
//           mt: 'auto',
//           borderTop: '1px solid', 
//           borderColor: '#e2e8f0',
//           bgcolor: alpha(theme.palette.action.hover, 0.02) // Fondo sutil para destacar que es el footer
//         }}
//       >
//         <ToggleButtonGroup
//           value={toggleValue}
//           exclusive
//           size="small"
//           fullWidth // Hace que los botones se expandan uniformemente
//           onChange={(_, val) => {
//             if (val !== null) {
//               onExceptionChange(permission.id, val);
//             }
//           }}
//           sx={{
//             height: '32px', // Ligeramente más alto para mejor área de toque en el footer
//             borderRadius: 0,
//             '& .MuiToggleButton-root': {
//               border: 'none', // Quitamos bordes individuales para que se funda con el footer
//               borderRight: '1px solid #e2e8f0',
//               px: 1,
//               fontSize: '10px', // Un poco más legible
//               textTransform: 'none',
//               fontWeight: 600,
//               borderRadius: 0,
//               color: 'text.secondary',
//               '&:last-of-type': {
//                 borderRight: 'none'
//               },
//               '&.Mui-selected': {
//                 color: '#ffffff',
//                 fontWeight: 700,
//                 '&:hover': {
//                   opacity: 0.95
//                 }
//               }
//             },
//             '& .MuiToggleButton-root.allow-btn.Mui-selected': {
//               bgcolor: theme.palette.success.main,
//             },
//             '& .MuiToggleButton-root.deny-btn.Mui-selected': {
//               bgcolor: theme.palette.error.main,
//             },
//             '& .MuiToggleButton-root.inherit-btn.Mui-selected': {
//               bgcolor: theme.palette.primary.main,
//             }
//           }}
//         >
//           <ToggleButton value="inherit" className="inherit-btn">
//             Heredar
//           </ToggleButton>
//           <ToggleButton value="allow" className="allow-btn">
//             Habilitar
//           </ToggleButton>
//           <ToggleButton value="deny" className="deny-btn">
//             Denegar
//           </ToggleButton>
//         </ToggleButtonGroup>
//       </Box>
//     </Box>
//   );
// }

import React from 'react';
import { Box, Stack, Typography, Chip, ToggleButtonGroup, ToggleButton, alpha, useTheme } from '@mui/material';

interface PermissionRowProps {
  permission: any;
  isGrantedByRole: boolean;
  localState: boolean | null;
  onExceptionChange: (permissionId: number, value: string | null) => void;
}

export default function PermissionRow({ 
  permission, 
  isGrantedByRole, 
  localState, 
  onExceptionChange 
}: PermissionRowProps) {
  const theme = useTheme();

  // Determinar el valor de ToggleButton
  const toggleValue = localState === true 
    ? 'allow' 
    : localState === false 
      ? 'deny' 
      : 'inherit';

  // Determinar si el permiso está finalmente habilitado para el usuario
  const isCurrentlyAllowed = localState !== null ? localState : isGrantedByRole;

  return (
    <Box
      className=''
      sx={{
        border: '1px solid',
        borderColor: '#e2e8f0',
        bgcolor: '#ffffff',
        // Transición más suave
        transition: 'all 0.3s ease', 
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          // Borde con opacidad reducida para que no sea tan invasivo
          borderColor: alpha(theme.palette.primary.main, 0.3), 
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          // Sombra muy sutil opcional para acompañar el hover suave
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.05)}` 
        }
      }}
    >
      {/* Contenido Principal */}
      <Box sx={{ py: 1, px: 1.5, flexGrow: 1 }}>
        <Stack direction="column" spacing={0.5}>
          <Stack className='flex items-center justify-between' direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.5}>
            <Typography 
              variant="body2" 
              fontWeight={650}
              color="text.primary"
              sx={{ fontSize: '0.8rem' }}
            >
              {permission.name}
            </Typography>
            
            {/* Chip Indicador de Estado Final */}
            <Chip
              label={isCurrentlyAllowed ? 'Con acceso' : 'Sin acceso'}
              size="small"
              color={isCurrentlyAllowed ? 'success' : 'default'}
              variant="outlined"
              sx={{ 
                height: 16, 
                fontSize: '9px', 
                fontWeight: 700, 
                px: 0.5,
                borderColor: isCurrentlyAllowed ? 'success.light' : 'divider',
                color: isCurrentlyAllowed ? 'success.main' : 'text.secondary'
              }}
            />
          </Stack>
          
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.7rem', display: 'block' }}
          >
            {permission.description}
          </Typography>
          
          {/* Estado Rol Base */}
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '9px', 
              fontWeight: 500,
              color: isGrantedByRole ? 'success.main' : 'text.disabled',
              display: 'block'
            }}
          >
            {isGrantedByRole ? '✓ Concedido nativamente por el Rol' : '✗ No concedido por el Rol'}
          </Typography>
        </Stack>
      </Box>

      {/* Footer de Acciones */}
      <Box 
        sx={{ 
          mt: 'auto',
          borderTop: '1px solid', 
          borderColor: '#e2e8f0',
          bgcolor: alpha(theme.palette.action.hover, 0.02)
        }}
      >
        <ToggleButtonGroup
          value={toggleValue}
          exclusive
          size="small"
          fullWidth
          onChange={(_, val) => {
            if (val !== null) {
              onExceptionChange(permission.id, val);
            }
          }}
          sx={{
            height: '32px',
            borderRadius: 0,
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRight: '1px solid #e2e8f0',
              px: 1,
              fontSize: '10px',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 0,
              color: 'text.secondary',
              // Transición suave también en los botones
              transition: 'background-color 0.2s ease, color 0.2s ease',
              '&:last-of-type': {
                borderRight: 'none'
              },
              '&.Mui-selected': {
                color: '#ffffff',
                fontWeight: 700,
                '&:hover': {
                  opacity: 0.95
                }
              }
            },
            '& .MuiToggleButton-root.allow-btn.Mui-selected': {
              bgcolor: theme.palette.success.main,
            },
            '& .MuiToggleButton-root.deny-btn.Mui-selected': {
              bgcolor: theme.palette.error.main,
            },
            '& .MuiToggleButton-root.inherit-btn.Mui-selected': {
              bgcolor: theme.palette.primary.main,
            }
          }}
        >
          <ToggleButton value="inherit" className="inherit-btn">
            Heredar
          </ToggleButton>
          <ToggleButton value="allow" className="allow-btn">
            Habilitar
          </ToggleButton>
          <ToggleButton value="deny" className="deny-btn">
            Denegar
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}