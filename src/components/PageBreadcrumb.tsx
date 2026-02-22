'use client';

import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import usePathname from '@fuse/hooks/usePathname';
import Link from '@fuse/core/Link';
import { cn } from '@/lib/utils';
import useNavigationItems from './theme-layouts/components/navigation/hooks/useNavigationItems';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

type PageBreadcrumbProps = {
	className?: string;
	skipHome?: boolean;
};

// Function to get the navigation item based on URL
function getNavigationItem(url: string, navigationItems: FuseNavItemType[]): FuseNavItemType {
	for (const item of navigationItems) {
		if (item.url === url) {
			return item;
		}

		if (item.children) {
			const childItem = getNavigationItem(url, item.children);

			if (childItem) {
				return childItem;
			}
		}
	}
	return null;
}

function PageBreadcrumb(props: PageBreadcrumbProps) {
	const { className, skipHome = false } = props;
	const pathname = usePathname();
	const { data: navigation } = useNavigationItems();

	const crumbs = pathname
		.split('/')
		.filter(Boolean)
		.reduce(
			(acc: { title: string; url: string }[], part, index, array) => {
				const url = `/${array.slice(0, index + 1).join('/')}`;
				const navItem = getNavigationItem(url, navigation);
				const title = navItem?.title || part;

				acc.push({ title, url });
				return acc;
			},
			skipHome ? [] : [{ title: 'Home', url: '/' }]
		);

	return (
		<Breadcrumb className={cn(className)}>
			<BreadcrumbList>
				{crumbs.map((item, index) => {
					const isLast = index === crumbs.length - 1;

					return (
						<BreadcrumbItem key={index}>
							{isLast ? (
								<BreadcrumbPage className="max-w-32 truncate capitalize">{item.title}</BreadcrumbPage>
							) : (
								<>
									<BreadcrumbLink asChild>
										<Link
											to={item.url}
											className="max-w-32 truncate capitalize"
										>
											{item.title}
										</Link>
									</BreadcrumbLink>
									<BreadcrumbSeparator />
								</>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default PageBreadcrumb;
