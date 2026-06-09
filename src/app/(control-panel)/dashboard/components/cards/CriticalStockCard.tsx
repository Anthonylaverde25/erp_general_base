import useActiveCompany from '@/features/companies/useActiveCompany';
import axiosInstance from '@/lib/@axios';
import { 
  Box, 
  Typography, 
  Stack, 
  Skeleton,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';

// Skeleton minimalista (sin avatares)
const MinimalSkeleton = () => (
  <Stack spacing={0}>
    {[...Array(4)].map((_, i) => (
      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, pl: 2 }}>
        <Box sx={{ width: '60%' }}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
        <Box sx={{ width: '20%', textAlign: 'right' }}>
          <Skeleton variant="text" width="100%" height={28} />
        </Box>
      </Box>
    ))}
  </Stack>
);

function CriticalStockCard() {
  const { id: companyId } = useActiveCompany();
  const [loading, setLoading] = useState(false);
  const [stockCritical, setStockCritical] = useState([]);

  useEffect(() => {
    const getCritical = async () => {
      try {
        setLoading(true);
        const { data: { critical_stock } } = await axiosInstance.get('items/low-stock');
        setStockCritical(critical_stock);
      } catch (error) {
        console.error('Error al obtener el stock crítico:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getCritical();
  }, [companyId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}>
      
      {/* ENCABEZADO MINIMALISTA */}
      <Box sx={{ mb: 2, px: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
          Stock Crítico
        </Typography>
        {loading ? (
          <Skeleton variant="text" width="150px" height={20} />
        ) : (
          <Typography 
            variant="body2" 
            color={stockCritical.length > 0 ? 'error.main' : 'text.secondary'}
            fontWeight={stockCritical.length > 0 ? 500 : 400}
          >
            {stockCritical.length === 0 
              ? 'Todos los niveles son óptimos' 
              : `${stockCritical.length} artículos requieren reposición`}
          </Typography>
        )}
      </Box>

      {/* LISTA DE DATOS */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {loading ? (
          <MinimalSkeleton />
        ) : stockCritical.length === 0 ? (
          <Box sx={{ py: 4, px: 1 }}>
            <Typography variant="body2" color="text.secondary">
              No hay alertas de inventario en este momento.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {stockCritical.map((item, index) => {
              const isOutOfStock = item.current_stock <= 0;
              const statusColor = isOutOfStock ? 'error.main' : 'warning.main';
              
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    px: 1.5,
                    borderLeft: '3px solid',
                    borderLeftColor: statusColor,
                    borderBottom: index !== stockCritical.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  {/* Datos del artículo */}
                  <Box sx={{ flexGrow: 1, pr: 2 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mínimo requerido: {item.stock_min}
                    </Typography>
                  </Box>

                  {/* Número crítico */}
                  <Box sx={{ textAlign: 'right', minWidth: '60px' }}>
                    <Typography 
                      variant="body1" 
                      fontWeight={700} 
                      color={statusColor}
                      sx={{ lineHeight: 1 }}
                    >
                      {item.current_stock}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      disp.
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
      
      {/* ACCIÓN GLOBAL SUTIL */}
      {!loading && stockCritical.length > 0 && (
        <Box sx={{ pt: 1, px: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            variant="text" 
            size="small" 
            color="inherit" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary', bgcolor: 'transparent' }
            }}
          >
            Gestionar reposiciones &rarr;
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CriticalStockCard;