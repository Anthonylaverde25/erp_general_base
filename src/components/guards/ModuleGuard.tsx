import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useTenantModules } from '@/contexts/TenantModulesContext';
import FuseLoading from '@fuse/core/FuseLoading';
import { toast } from 'sonner';

interface ModuleGuardProps {
	module: string | string[];
	children?: ReactNode;
	fallbackPath?: string;
}

/**
 * ModuleGuard
 * Component to protect routes based on licensed tenant modules.
 */
export default function ModuleGuard({
	module,
	children,
	fallbackPath = '/dashboard'
}: ModuleGuardProps) {
	const { isLoading, hasModule, hasAnyModule } = useTenantModules();
	const toastShownRef = useRef(false);

	const hasAccess = Array.isArray(module)
		? hasAnyModule(module)
		: hasModule(module);

	useEffect(() => {
		if (!isLoading && !hasAccess && !toastShownRef.current) {
			toastShownRef.current = true;
			toast.error('No tienes acceso a este módulo para la empresa activa.');
		}
	}, [isLoading, hasAccess]);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!hasAccess) {
		return <Navigate to={fallbackPath} replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}
