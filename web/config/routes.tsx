/**
 * 路由配置 入口
 * @author LiQingSong
 */

import { lazy, memo, Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { createUseRoutes, pathKeyCreateUseRoutes } from '@/utils/router';

import PageLoading from '@/components/PageLoading';

// BlankLayout
import BlankLayout from '@/layouts/BlankLayout';

// DefaultLayout
import DefaultLayoutRoutes from '@/layouts/DefaultLayout/routes';
import DefaultLayout from '@/layouts/DefaultLayout';

import { IRouter } from '@/@types/router';

/**
 * 配置所有路由
 */
export const originalRoutes: IRouter[] = [
  {
    path: '/',
    children: DefaultLayoutRoutes,
  },
];

/**
 * 配置的路由转RouteObject[]
 */
export const routes = createUseRoutes([
  ...originalRoutes,
  {
    path: '*',
    component: lazy(() => import('@/pages/404')),
  },
]);

/**
 * 配置框架对应的路由
 */
const layoutToRoutes = {
  DefaultLayout: pathKeyCreateUseRoutes([routes[0]]),
};

export const SuspenseLazy = memo(
  ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<PageLoading />}>{children}</Suspense>
  )
);

export default memo(() => {
  const routesElement = useRoutes(routes);
  const location = useLocation();

  // 属于 DefaultLayout
  if (layoutToRoutes.DefaultLayout[location.pathname]) {
    return (
      <DefaultLayout>
        <SuspenseLazy>{routesElement}</SuspenseLazy>
      </DefaultLayout>
    );
  }

  // 默认 BlankLayout
  return (
    <BlankLayout>
      <SuspenseLazy>{routesElement}</SuspenseLazy>
    </BlankLayout>
  );
});
