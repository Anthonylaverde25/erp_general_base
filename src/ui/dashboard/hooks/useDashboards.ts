import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import { useSnackbar } from 'notistack';
import { Dashboard, DashboardWidget } from '../types/dashboard.types';

export function useDashboards() {
  return useQuery<Dashboard[]>({
    queryKey: ['dashboards'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/dashboards');
      return data;
    },
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload: { name: string; is_default?: boolean }) => {
      const { data } = await axiosInstance.post('/dashboards', payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      enqueueSnackbar('Tablero creado correctamente.', { variant: 'success' });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Error al crear el tablero.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: { name?: string; is_default?: boolean } }) => {
      const { data } = await axiosInstance.put(`/dashboards/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      enqueueSnackbar('Tablero actualizado correctamente.', { variant: 'success' });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Error al actualizar el tablero.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/dashboards/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      enqueueSnackbar('Tablero eliminado correctamente.', { variant: 'success' });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Error al eliminar el tablero.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    },
  });
}

export function useAddWidget() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ dashboardId, payload }: { dashboardId: number; payload: Omit<DashboardWidget, 'id' | 'dashboard_id'> }) => {
      const { data } = await axiosInstance.post(`/dashboards/${dashboardId}/widgets`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      enqueueSnackbar('Widget añadido correctamente.', { variant: 'success' });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Error al añadir el widget.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    },
  });
}

export function useRemoveWidget() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ dashboardId, widgetId }: { dashboardId: number; widgetId: number }) => {
      const { data } = await axiosInstance.delete(`/dashboards/${dashboardId}/widgets/${widgetId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      enqueueSnackbar('Widget removido correctamente.', { variant: 'success' });
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Error al remover el widget.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    },
  });
}

export function useUpdateLayouts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dashboardId, layouts }: { dashboardId: number; layouts: { id: number; layout: any }[] }) => {
      const { data } = await axiosInstance.put(`/dashboards/${dashboardId}/widgets/layout`, { layouts });
      return data;
    },
    onSuccess: () => {
      // Invalidate queries but don't show toast to prevent noise during resize/drag saves
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
}
