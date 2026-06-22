import { useMemo } from 'react';
import i18n from '@i18n';
import useUser from '@auth/useUser';
import useI18n from '@i18n/useI18n';
import FuseUtils from '@fuse/utils';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import { useTenantModules } from '@/contexts/TenantModulesContext';
import { useNavigationContext } from '../contexts/useNavigationContext';

function useNavigationItems() {
	const { navigationItems: navigationData } = useNavigationContext();

	const { data: user } = useUser();
	const userRole = user?.role;
	const { languageId } = useI18n();
	const { hasModule, hasAnyModule } = useTenantModules();

	const data = useMemo(() => {
		const _navigation = FuseNavigationHelper.unflattenNavigation(navigationData);

		function setAdditionalData(data: FuseNavItemType[], parentModuleAccess = true): FuseNavItemType[] {
			if (!data) return [];
			return data.map((item) => {
				const hasModuleAccess = parentModuleAccess && (item?.module
					? Array.isArray(item.module)
						? hasAnyModule(item.module)
						: hasModule(item.module)
					: true);

				const processedChildren = item?.children ? setAdditionalData(item?.children, hasModuleAccess) : undefined;

				let hasPermission = Boolean(FuseUtils.hasPermission(item?.auth, userRole)) && hasModuleAccess;

				// If it's a group or collapse, it should only have permission if it has at least one child with permission
				if (hasPermission && processedChildren && (item.type === 'group' || item.type === 'collapse')) {
					hasPermission = processedChildren.some((child) => child.hasPermission);
				}

				return {
					...item,
					hasPermission,
					...(item?.translate && item?.title ? { title: i18n.t(`navigation:${item?.translate}`) } : {}),
					...(processedChildren ? { children: processedChildren } : {})
				};
			});
		}

		const translatedValues = setAdditionalData(_navigation);

		return translatedValues;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigationData, userRole, languageId, hasModule, hasAnyModule]);

	const flattenData = useMemo(() => {
		return FuseNavigationHelper.flattenNavigation(data);
	}, [data]);

	return { data, flattenData };
}

export default useNavigationItems;
