import { ChangeCompanyUseCase } from '@/application/use_cases/companies/ChangeCompanyUseCase';
import { ShowCompanyUseCase } from '@/application/use_cases/companies/ShowCompanyUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ICompany } from '@/types/company.types';
import { toast } from 'sonner';
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

export default function useChangeCompany() {
	const queryClient = useQueryClient();
	const { updateUser, authState } = useAuth();
	const use_case = container.get<ChangeCompanyUseCase>(TYPES.ChangeCompanyUseCase);
	const show_company_use_case = container.get<ShowCompanyUseCase>(TYPES.ShowCompanyUseCase);

	const mutation = useMutation({
		mutationFn: (companyId: ICompany['id']) => use_case.execute(companyId),

		onSuccess: async (message, companyId) => {
			if (updateUser) {
				await updateUser({ active_company_id: companyId }, { onlyLocal: true });
				queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			}

			toast('Empresa cambiada', {
				description: message ?? 'La empresa activa fue actualizada correctamente.',
				className: 'my-toast-success',
				duration: 5000,
				icon: <FuseSvgIcon className="text-green-600">heroicons-outline:check-circle</FuseSvgIcon>
			});
		},

		onError: (error: unknown) => {
			toast('Error al cambiar empresa', {
				description: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
				className: 'my-toast-error',
				duration: 6000
			});
		}
	});

	return {
		changeCompany: mutation.mutate,
		changeCompanyAsync: mutation.mutateAsync,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
