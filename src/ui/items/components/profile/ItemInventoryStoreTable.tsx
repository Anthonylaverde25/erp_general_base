import { Box, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ItemInventoryStoreTableProps {
    inventory: {
        id: number;
        store_name: string;
        quantity_on_hand: number;
        quantity_reserved: number;
        available_quantity: number;
        last_count_at?: string | null;
    }[];
}

export default function ItemInventoryStoreTable({ inventory }: ItemInventoryStoreTableProps) {
    if (inventory.length === 0) {
        return (
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Sin movimientos de inventario registrados.
            </Typography>
        );
    }

    return (
        <Box sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Almacén</TableHead>
                        <TableHead className="text-center">En stock</TableHead>
                        <TableHead className="text-center">Reservado</TableHead>
                        <TableHead className="text-center">Disponible</TableHead>
                        <TableHead className="text-right">Último conteo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventory.map((inv) => (
                        <TableRow key={inv.id}>
                            <TableCell>
                                <Typography variant="body2" fontWeight={500} color="text.primary">
                                    {inv.store_name}
                                </Typography>
                            </TableCell>
                            <TableCell className="text-center">
                                <Typography variant="body2" color="text.primary">
                                    {inv.quantity_on_hand}
                                </Typography>
                            </TableCell>
                            <TableCell className="text-center">
                                <Typography variant="body2" fontWeight={500} color="warning.main">
                                    {inv.quantity_reserved}
                                </Typography>
                            </TableCell>
                            <TableCell className="text-center">
                                <Typography variant="body2" fontWeight={500} color="success.main">
                                    {inv.available_quantity}
                                </Typography>
                            </TableCell>
                            <TableCell className="text-right">
                                <Typography variant="body2" color="text.secondary">
                                    {inv.last_count_at ? new Date(inv.last_count_at).toLocaleDateString('es-ES') : 'N/A'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
