import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ListPending = lazy(() => import('@/ui/lists/pages/ListPending'));
const ListAccounting = lazy(() => import('@/ui/lists/pages/ListAccounting'));

/**
 * The Items page route.
 */
const route: FuseRouteItemType = {
  path: 'lists/pending',
  children: [
    {
      path: 'accounting/:type',
      element: <ListAccounting />
    },
    {
      path: ':type',
      element: <ListPending />
    }
  ]
};

export default route;
