import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Tooltip,
  Skeleton,
  Stack
} from '@mui/material';
import { 
  AlertTriangle, 
  CheckCircle2, 
  QrCode 
} from 'lucide-react';
import axiosInstance from '@/lib/@axios';

interface PendingItem {
  id: number;
  name: string;
  sku: string;
  store_id: number;
  store_name: string;
  physical_stock: number;
  serials_count: number;
  pending_count: number;
}

export default function PendingSerializationCard() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPendingSerialization = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/items/pending-serialization');
      setItems(data.pending_items || []);
    } catch (error) {
      console.error('Error fetching pending serialization items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSerialization();
  }, []);

  const totalPending = items.reduce((acc, item) => acc + item.pending_count, 0);
  const count = items.length;
  const hasPending = count > 0;

  const MinimalSkeleton = () => (
    <Stack spacing={0}>
      {[...Array(4)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, px: 2 }}>
          <Box sx={{ width: '60%' }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="40%" height={14} />
          </Box>
          <Box sx={{ width: '20%', textAlign: 'right' }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box 
      className="flex flex-col h-full bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-800"
      sx={{ 
        borderRadius: '4px',
        borderLeft: '4px solid',
        borderLeftColor: hasPending ? '#d97706' : '#10b981'
      }}
    >
      {/* Header */}
      <Box className="flex justify-between items-center p-3">
        <Box className="flex items-center gap-2">
          {hasPending ? (
            <AlertTriangle size={18} className="text-[#d97706]" />
          ) : (
            <CheckCircle2 size={18} className="text-[#10b981]" />
          )}
          <Box>
            <Typography variant="subtitle2" fontWeight={800} className="text-slate-800 dark:text-slate-200 leading-tight">
              Series Pendientes
            </Typography>
            <Typography variant="caption" className="text-slate-400 block">
              Stock físico sin número de serie
            </Typography>
          </Box>
        </Box>
        <Box 
          className={`px-2 py-0.5 text-xs font-black rounded-[2px] ${
            hasPending 
              ? 'bg-amber-50 text-[#d97706] dark:bg-amber-950/20 dark:text-[#d97706]' 
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
          }`}
        >
          {totalPending} {totalPending === 1 ? 'Serie' : 'Series'}
        </Box>
      </Box>

      <Divider className="border-slate-100 dark:border-slate-800" />

      {/* Content */}
      <Box className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <MinimalSkeleton />
        ) : !hasPending ? (
          <Box className="flex flex-col items-center justify-center h-full py-6 text-center">
            <CheckCircle2 size={32} className="text-[#10b981] mb-2" />
            <Typography variant="body2" fontWeight={600} className="text-slate-700 dark:text-slate-300">
              Inventario totalmente serializado
            </Typography>
            <Typography variant="caption" className="text-slate-400 px-4 mt-1">
              Todos los ítems serializables en stock tienen sus respectivos números de serie registrados.
            </Typography>
          </Box>
        ) : (
          <Box className="flex flex-col gap-1.5">
            {items.map((item) => (
              <Box 
                key={`${item.id}-${item.store_id}`}
                className="flex items-center justify-between p-2 border border-solid border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
                sx={{ borderRadius: '2px' }}
              >
                <Box className="flex items-start gap-2 flex-1 min-w-0">
                  <QrCode size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <Box className="min-w-0">
                    <Tooltip title={item.name} arrow placement="top-start">
                      <Typography 
                        variant="caption" 
                        fontWeight={700} 
                        className="text-slate-700 dark:text-slate-300 block truncate"
                      >
                        [{item.sku}] {item.name}
                      </Typography>
                    </Tooltip>
                    
                    <Box className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 px-1 py-0.25 text-slate-500 rounded-[2px]">
                        Almacén: {item.store_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Stock: {item.physical_stock} | Reg: {item.serials_count}
                      </span>
                    </Box>
                  </Box>
                </Box>

                {/* Pending Serialization Counter */}
                <Box className="text-right shrink-0 pl-2">
                  <Typography 
                    variant="body2" 
                    fontWeight={800} 
                    className="text-[#d97706]"
                  >
                    +{item.pending_count}
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 block text-[9px]">
                    sin serie
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
