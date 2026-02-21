import { useState } from "react";
import { useParams } from "react-router";
import FuseLoading from "@fuse/core/FuseLoading";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Box, Typography } from "@mui/material";
import { useShowItem } from "@/features/items/hooks/useShowItem";
import ItemProfileHeader from "../components/profile/ItemProfileHeader";
import ItemProfileSidebar from "../components/profile/ItemProfileSidebar";
import ItemProfileOverview from "../components/profile/ItemProfileOverview";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { item, isLoading, isError } = useShowItem(Number(id));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) return <FuseLoading />;

  if (isError || !item) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Typography variant="h6" color="text.secondary">
          No se encontró el artículo solicitado.
        </Typography>
      </Box>
    );
  }

  return (
    <FusePageSimple
      header={
        <ItemProfileHeader
          item={item}
          tabValue={tabValue}
          onTabChange={handleTabChange}
        />
      }
      content={
        <Box sx={{ width: "100%", height: "100%", bgcolor: "background.paper" }}>
          {tabValue === 0 && (
            <Box
              className="flex flex-col md:flex-row"
              sx={{ height: { xs: "auto", md: "100%" }, borderColor: "#E6EAF0" }}
            >
              <ItemProfileSidebar item={item} />
              <ItemProfileOverview item={item} />
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Inventario por almacén
              </Typography>
              {item.inventory.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {item.inventory.map((inv) => (
                    <Box
                      key={inv.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.default',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {inv.store_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Último conteo: {inv.last_count_at ? new Date(inv.last_count_at).toLocaleDateString('es-ES') : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            En stock
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {inv.quantity_on_hand}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Reservado
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="warning.main">
                            {inv.quantity_reserved}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Disponible
                          </Typography>
                          <Typography variant="body2" fontWeight={700} color="success.main">
                            {inv.available_quantity}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin movimientos de inventario registrados.
                </Typography>
              )}

              <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
                Historial de movimientos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Próximamente podrás ver el historial de entradas y salidas de stock aquí.
              </Typography>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary">
                Actividad detallada próximamente.
              </Typography>
            </Box>
          )}
        </Box>
      }
      scroll="content"
    />
  );
}
