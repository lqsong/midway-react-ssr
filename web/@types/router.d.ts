/**
 * 路由 ts定义
 * @author LiQingSong
 */
import { RouteObject } from 'react-router-dom';

/**
 * json path key RouteObject路由类型
 */
export interface IPathKeyRouteObject {
  [path: string]: RouteObject;
}

/**
 * meta 自定义
 */
export interface IRouteMeta {
  // 标题，路由在菜单、浏览器title 或 面包屑中展示的文字
  title?: string;
  keywords?: string; // 关键字
  description?: string; // 说明
  navActive?: string; // 选中的导航
  parentPath?: string[]; // 所有父元素的path,下标key按照父元素的顺序
}

export type RouteComponent = React.FC<BrowserRouterProps> | (() => any);

/**
 * 路由类型
 */
export interface IRouter {
  path: string;
  meta?: IRouteMeta;
  redirect?: string;
  component?: RouteComponent;
  children?: IRouter[];
}

/**
 * json path key 路由类型
 */
export interface IPathKeyRouter {
  [path: string]: IRouter;
}

/**
 * 路由类型 IRouter 与 json path key 路由类型 集合
 */
export interface IRouterPathKeyRouter {
  router: IRouter[];
  pathKeyRouter: IPathKeyRouter;
}
