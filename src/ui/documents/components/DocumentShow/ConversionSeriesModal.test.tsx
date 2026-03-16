import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversionSeriesModal } from './ConversionSeriesModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

// Mock del repositorio
vi.mock('@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud', () => {
    return {
        NumberSeriesRepositoryCrud: vi.fn().mockImplementation(() => ({
            index: vi.fn().mockResolvedValue([
                { id: 1, serie: 'F2024', current_number: 100 }
            ])
        }))
    };
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const mockDocument = {
    id: 123,
    company_id: 1,
    document_type_code: 'DLV',
    lines: [
        { id: 10, name: 'Product A', quantity: 10, processed_quantity: 4 }, // Pendiente: 6
        { id: 11, name: 'Product B', quantity: 5, processed_quantity: 5 }, // Pendiente: 0 (Facturado)
    ]
} as unknown as DocumentEntity;

describe('ConversionSeriesModal', () => {
    const onConvert = vi.fn();
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render lines with pending quantities in partial mode', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ConversionSeriesModal
                    open={true}
                    onClose={onClose}
                    document={mockDocument}
                    onConvert={onConvert}
                    isConverting={false}
                    mode="partial"
                />
            </QueryClientProvider>
        );

        // Verificar que aparezca el producto con pendiente
        expect(screen.getByText('Product A')).toBeInTheDocument();
        expect(screen.getByText('6.00')).toBeInTheDocument(); // Cantidad pendiente

        // Verificar que el producto facturado aparezca como tal
        expect(screen.getByText('Product B')).toBeInTheDocument();
        expect(screen.getByText('FACTURADO')).toBeInTheDocument();
    });

    it('should disable confirm button until a series is selected', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ConversionSeriesModal
                    open={true}
                    onClose={onClose}
                    document={mockDocument}
                    onConvert={onConvert}
                    isConverting={false}
                    mode="partial"
                />
            </QueryClientProvider>
        );

        const confirmButton = screen.getByRole('button', { name: /Emitir Factura/i });
        expect(confirmButton).toBeDisabled();
    });

    it('should call onConvert with selected lines and quantities', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ConversionSeriesModal
                    open={true}
                    onClose={onClose}
                    document={mockDocument}
                    onConvert={onConvert}
                    isConverting={false}
                    mode="partial"
                />
            </QueryClientProvider>
        );

        // 1. Seleccionar serie (Simulamos la carga y selección)
        // Nota: Mui Select es complejo de testear con fireEvent, buscamos el input hidden o el botón del select
        const select = screen.getByLabelText(/Seleccione serie legal/i);
        fireEvent.mouseDown(select);
        
        await waitFor(() => {
            const option = screen.getByText(/Serie F2024/i);
            fireEvent.click(option);
        });

        // 2. Cambiar cantidad de Product A a 3
        const qtyInput = screen.getByDisplayValue('6');
        fireEvent.change(qtyInput, { target: { value: '3' } });

        // 3. Confirmar
        const confirmButton = screen.getByRole('button', { name: /Emitir Factura/i });
        fireEvent.click(confirmButton);

        expect(onConvert).toHaveBeenCalledWith(expect.objectContaining({
            number_series_id: 1,
            lines: [
                { source_line_id: 10, quantity: 3 }
            ]
        }));
    });
});
