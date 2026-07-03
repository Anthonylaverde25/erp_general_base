import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  AlertTriangle, 
  Check, 
  X, 
  Boxes, 
  Edit2, 
  CheckCircle2 
} from 'lucide-react';
import axiosInstance from '@/lib/@axios';

interface Batch {
  id: number;
  internal_batch_number: string;
  supplier_batch_number: string | null;
  manufactured_date?: string;
  expiry_date?: string;
  item?: {
    id: number;
    name: string;
    sku: string;
  } | null;
  partner?: {
    id: number;
    name: string;
  } | null;
}

export default function IncompleteBatchesCard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchIncompleteBatches = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/dashboard/incomplete-batches');
      setBatches(data.batches || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching incomplete batches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncompleteBatches();
  }, []);

  const handleStartEdit = (batch: Batch) => {
    setEditingId(batch.id);
    setEditValue(batch.supplier_batch_number || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSaveEdit = async (id: number) => {
    if (!editValue.trim()) return;

    try {
      setSavingId(id);
      await axiosInstance.put(`/batches/${id}`, {
        supplier_batch_number: editValue.trim()
      });
      
      // Update local state by filtering out the saved batch and decrementing count
      setBatches((prev) => prev.filter((b) => b.id !== id));
      setCount((prev) => Math.max(0, prev - 1));
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Error saving supplier batch number:', error);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress size={24} sx={{ color: '#005483' }} />
      </Box>
    );
  }

  const hasIncomplete = count > 0;

  return (
    <Box 
      className="flex flex-col h-full bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-800"
      sx={{ 
        borderRadius: '4px',
        borderLeft: '4px solid',
        borderLeftColor: hasIncomplete ? '#ed6c02' : '#10b981'
      }}
    >
      {/* Header */}
      <Box className="flex justify-between items-center p-3">
        <Box className="flex items-center gap-2">
          {hasIncomplete ? (
            <AlertTriangle size={18} className="text-[#ed6c02]" />
          ) : (
            <CheckCircle2 size={18} className="text-[#10b981]" />
          )}
          <Box>
            <Typography variant="subtitle2" fontWeight={800} className="text-slate-800 dark:text-slate-200 leading-tight">
              Lotes por Definir
            </Typography>
            <Typography variant="caption" className="text-slate-400 block">
              Control de trazabilidad de proveedores
            </Typography>
          </Box>
        </Box>
        <Box 
          className={`px-2 py-0.5 text-xs font-black rounded-[2px] ${
            hasIncomplete 
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' 
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
          }`}
        >
          {count} {count === 1 ? 'Pendiente' : 'Pendientes'}
        </Box>
      </Box>

      <Divider className="border-slate-100 dark:border-slate-800" />

      {/* Content */}
      <Box className="flex-1 overflow-y-auto p-2">
        {!hasIncomplete ? (
          <Box className="flex flex-col items-center justify-center h-full py-6 text-center">
            <CheckCircle2 size={32} className="text-[#10b981] mb-2" />
            <Typography variant="body2" fontWeight={600} className="text-slate-700 dark:text-slate-300">
              Todos los lotes están completos
            </Typography>
            <Typography variant="caption" className="text-slate-400 px-4 mt-1">
              Todos los lotes activos tienen definido su número de lote de proveedor correspondientemente.
            </Typography>
          </Box>
        ) : (
          <Box className="flex flex-col gap-1.5">
            {batches.map((batch) => {
              const isEditing = editingId === batch.id;
              const isSaving = savingId === batch.id;

              return (
                <Box 
                  key={batch.id} 
                  className={`flex flex-col p-2 border border-solid border-slate-100 dark:border-slate-800/60 transition-colors ${
                    isEditing 
                      ? 'bg-slate-50 dark:bg-slate-800/40' 
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/20'
                  }`}
                  sx={{ borderRadius: '2px' }}
                >
                  <Box className="flex items-start justify-between gap-2">
                    <Box className="flex items-start gap-2 flex-1 min-w-0">
                      <Boxes size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <Box className="min-w-0">
                        <Tooltip title={batch.item?.name || ''} arrow placement="top-start">
                          <Typography 
                            variant="caption" 
                            fontWeight={700} 
                            className="text-slate-700 dark:text-slate-300 block truncate"
                          >
                            {batch.item ? `[${batch.item.sku}] ${batch.item.name}` : 'Artículo no definido'}
                          </Typography>
                        </Tooltip>
                        
                        <Box className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.25 text-slate-500 rounded-[2px]">
                            Lote Int: {batch.internal_batch_number}
                          </span>
                          {batch.partner && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              Prov: {batch.partner.name}
                            </span>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Actions column */}
                    {!isEditing && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleStartEdit(batch)}
                        className="text-slate-400 hover:text-[#005483] dark:hover:text-blue-400"
                        sx={{ p: 0.5 }}
                      >
                        <Edit2 size={12} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Inline edit form */}
                  {isEditing && (
                    <Box className="flex items-center gap-1.5 mt-2 w-full">
                      <TextField
                        size="small"
                        placeholder="Lote Proveedor"
                        variant="filled"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        disabled={isSaving}
                        autoFocus
                        fullWidth
                        hiddenLabel
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            height: '28px',
                            fontSize: '11px',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            borderRadius: '2px',
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(0, 0, 0, 0.06)',
                            },
                            px: 1,
                            py: 0
                          }
                        }}
                      />
                      
                      <Box className="flex gap-0.5 shrink-0">
                        <IconButton
                          size="small"
                          onClick={() => handleSaveEdit(batch.id)}
                          disabled={isSaving || !editValue.trim()}
                          sx={{ 
                            p: 0.5, 
                            color: '#10b981',
                            '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.08)' } 
                          }}
                        >
                          {isSaving ? (
                            <CircularProgress size={12} color="inherit" />
                          ) : (
                            <Check size={14} />
                          )}
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          sx={{ 
                            p: 0.5, 
                            color: '#ef4444',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } 
                          }}
                        >
                          <X size={14} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
