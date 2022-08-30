import { memo, useEffect, useCallback, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Location,
  matchRoutes,
  useLocation,
} from 'react-router-dom';
import querystring from 'query-string';
import AsyncDataContextElement from '@/store/asyncDataContext/element';
import { useAsyncDataUpateContext } from '@/store/asyncDataContext';
import { isPromise } from '@/utils/promise';
import { formatRoutes } from '@/utils/router';
import { originalRoutes, routes } from '@/config/routes';

import settings from '@/config/settings';

import PageLoading from '@/components/PageLoading';

import App from './App';

import { IAsyncDataProps, ISeoProps } from '@/@types/server';
import { IAsyncDataContext } from '@/@types/store';

const asyncDataStroe: IAsyncDataContext<any> = {
  paresUrl: { url: '', query: {} },
  meta: {},
  app: [],
  page: {},
};

if (window.__INITIAL_DATA__) {
  asyncDataStroe.paresUrl = window.__INITIAL_DATA__.paresUrl || {
    url: '',
    query: {},
  };
  asyncDataStroe.meta = window.__INITIAL_DATA__.meta || {};
  asyncDataStroe.app = window.__INITIAL_DATA__.app || [];
  asyncDataStroe.page = window.__INITIAL_DATA__.page || {};
}

// 格式化路由集
const routerPathKeyRouter = formatRoutes(originalRoutes);

const RouterBefore = memo(({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const routerHistoryLast = useRef<Location>();
  const upateAsyncData = useAsyncDataUpateContext();
  const [loading, setLoading] = useState<boolean>(false);

  const beforeFun = useCallback(async () => {
    setLoading(true);

    const paresUrl = {
      url: location.pathname,
      query: querystring.parse(location.search),
    };

    // 获取当前pathname对应的自定义路由
    const routeItem =
      routerPathKeyRouter.pathKeyRouter[location.pathname] || {};
    // 获取meta
    const meta = routeItem.meta || {};
    meta.title = `${meta.title}-${settings.siteTitle}`;
    meta.keywords = meta.keywords || '';
    meta.description = meta.description || '';

    // 获取 react-router match后的所有routes
    const routeMatched = matchRoutes(routes, location);

    /* 获取当前路由对应所有的组件 */
    const matchedComponents: any = [];
    routeMatched?.map(item => {
      if (item.route.element) {
        matchedComponents.push(item.route.element);
      }
    });

    const asyncDataConfig: IAsyncDataProps = {
      paresUrl,
    };

    /* 设置 prototypeFuncs 集合 */
    const prototypeFuncs: any = [];
    matchedComponents.map(item => {
      if (item.type && item.type.type) {
        prototypeFuncs.push(Promise.resolve(item.type));
      } else if (
        item.type &&
        item.type._payload &&
        item.type._payload._result
      ) {
        const _result =
          typeof item.type._payload._result === 'function'
            ? item.type._payload._result()
            : Promise.resolve(item.type._payload._result);
        prototypeFuncs.push(_result);
      }
    });

    /* 获取 asyncDataFun 集合 */
    const asyncDataFuncs: any = [];
    /* 获取 seoFun, 已页面为准（最后一个组件） */
    let seoFun: any = null;
    const prototypeVals = await Promise.all(prototypeFuncs);
    prototypeVals.map(item => {
      const prototype = item.type
        ? item.type
        : item.default && item.default.type
        ? item.default.type
        : null;
      if (prototype && prototype.asyncData) {
        const asyncData = prototype.asyncData;
        if (isPromise(asyncData) === false) {
          asyncDataFuncs.push(Promise.resolve(asyncData(asyncDataConfig)));
        } else {
          asyncDataFuncs.push(asyncData(asyncDataConfig));
        }
      }

      if (prototype && prototype.seo) {
        seoFun = prototype.seo;
      }
    });

    // 执行asyncDataFuncs（在页面生成之前）
    const asyncDataVals = await Promise.all(asyncDataFuncs);
    const asyncDataValsLen = asyncDataVals.length;
    const asyncDataStroe: IAsyncDataContext<any> = {
      paresUrl,
      meta: {
        ...meta,
      },
      app: [],
      page: {},
    };
    if (asyncDataValsLen > 0) {
      asyncDataStroe.app = asyncDataVals;
      asyncDataStroe.page = asyncDataVals[asyncDataValsLen - 1];
    }

    // seo 赋值(在页面生成之前,asyncDataFuncs之后)
    if (seoFun) {
      const seo = seoFun({
        paresUrl,
        asyncData: asyncDataStroe.page,
      } as ISeoProps<any>);
      meta.title = seo.title
        ? `${seo.title}-${settings.siteTitle}`
        : meta.title;
      meta.keywords = seo.keywords || meta.keywords;
      meta.description = seo.description || meta.description;
    }
    document.title = meta.title || '';

    upateAsyncData({ ...asyncDataStroe });

    setLoading(false);
  }, [location]);

  useEffect(() => {
    if (
      routerHistoryLast.current &&
      routerHistoryLast.current.pathname !== location.pathname
    ) {
      beforeFun();
    }
    return () => {
      routerHistoryLast.current = {
        ...location,
      };
    };
  }, [location]);

  return loading ? <PageLoading /> : <>{children}</>;
});

ReactDOM.hydrateRoot(
  document.getElementById('app') as HTMLElement,
  <BrowserRouter>
    <AsyncDataContextElement value={asyncDataStroe}>
      <RouterBefore>
        <App />
      </RouterBefore>
    </AsyncDataContextElement>
  </BrowserRouter>
);
