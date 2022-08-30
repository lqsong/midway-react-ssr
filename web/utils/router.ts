/**
 * 路由工具
 * @author LiQingSong
 */

import { createElement } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { merge } from 'lodash/fp';
import { isExternal } from '@/utils/validate';
import {
  IRouter,
  IPathKeyRouter,
  IRouterPathKeyRouter,
  IPathKeyRouteObject,
} from '@/@types/router';

/**
 * 根据 configRoutes: IRouter[] 生成 useRoutes 的参数 routes: RouteObject[] 的数据
 * @param configRoutes IRouter[] config配置的路由
 * @param parentPath  string 上级path
 * @returns RouteObject[]
 * @author LiQingSong
 */
export const createUseRoutes = (
  configRoutes: IRouter[],
  parentPath = '/'
): RouteObject[] => {
  const routes: RouteObject[] = [];
  for (let index = 0; index < configRoutes.length; index++) {
    const item = configRoutes[index];
    const routesItem: RouteObject = {};

    // path
    routesItem.path = item.path.startsWith('/')
      ? item.path
      : `${parentPath.endsWith('/') ? parentPath : `${parentPath}/`}${
          item.path
        }`;
    // element
    if (item.component) {
      routesItem.element = createElement(item.component);
    }
    // children
    const children: RouteObject[] = [];
    if (item.redirect) {
      children.push({
        path: routesItem.path,
        element: createElement(Navigate, { to: item.redirect }),
      });
    }
    if (item.children) {
      children.push(...createUseRoutes(item.children, routesItem.path));
    }
    if (children.length > 0) {
      routesItem.children = children;
    }

    // newItem push
    routes.push(routesItem);
  }

  return routes;
};

/**
 * createUseRoutes处理后的数据转成 IPathKeyRouteObject 格式
 * @param routes  RouteObject[] 经过 createUseRoutes 处理后的routes
 * @returns IPathKeyRouteObject
 * @author LiQingSong
 */
export const pathKeyCreateUseRoutes = (
  routes: RouteObject[]
): IPathKeyRouteObject => {
  let jsonItems: IPathKeyRouteObject = {};
  for (let index = 0; index < routes.length; index++) {
    const item = routes[index];
    jsonItems[item.path || ''] = {
      ...item,
    };

    if (item.children) {
      jsonItems = merge(jsonItems, pathKeyCreateUseRoutes(item.children));
    }
  }
  return jsonItems;
};

/**
 * 根据 routes: IRouter[] 重置
 * @param routes IRouter[] 路由配置
 * @param parentPath string 上级path
 * @param parentPaths string[] 父级数组集合
 * @returns IRouterPathKeyRouter
 * @author LiQingSong
 */
export const formatRoutes = (
  routes: IRouter[],
  parentPath = '/',
  parentPaths: string[] = []
): IRouterPathKeyRouter => {
  const items: IRouter[] = [];
  let jsonItems: IPathKeyRouter = {};

  for (let index = 0; index < routes.length; index++) {
    const item = routes[index];
    const newItem: IRouter = {
      ...item,
    };

    // 设置路径
    let path = item.path || '';
    if (!isExternal(item.path)) {
      path = item.path.startsWith('/')
        ? item.path
        : `${parentPath.endsWith('/') ? parentPath : `${parentPath}/`}${
            item.path
          }`;
    }
    newItem.path = path;

    // 设置 meta
    const meta = item.meta || {};
    // 设置 meta.parentPath
    const pPaths =
      meta.parentPath && meta.parentPath.length > 0
        ? meta.parentPath
        : parentPaths;
    meta.parentPath = pPaths;
    newItem.meta = meta;

    // children赋值
    let children: IRouter[] | undefined;
    let pkChildren: IPathKeyRouter | undefined;
    if (item.children) {
      const fRoutes = formatRoutes(item.children, path, [...pPaths, path]);

      children = fRoutes.router;
      newItem.children = children;

      pkChildren = fRoutes.pathKeyRouter;
    }

    // 最终 item 赋值
    items.push(newItem);
    jsonItems[path] = newItem;
    if (pkChildren) {
      jsonItems = merge(jsonItems, pkChildren);
    }
  }

  return {
    router: items,
    pathKeyRouter: jsonItems,
  };
};

/**
 * 根据路由 pathname 数组 - 返回对应的 route 数组
 * @param pathname string[] 路由path数组
 * @param jsonRoutesData IPathKeyRouter 经过formatRoutes处理，框架的所有pathKeyRouter路由
 * @returns IRouter[]
 * @author LiQingSong
 */
export const getPathsTheRoutes = (
  pathname: string[],
  jsonRoutesData: IPathKeyRouter
): IRouter[] => {
  const routeItem: IRouter[] = [];

  for (let index = 0, len = pathname.length; index < len; index += 1) {
    const element = pathname[index];
    const item = jsonRoutesData[element] || {};
    if (item.path !== '') {
      routeItem.push(item);
    }
  }

  return routeItem;
};
