import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from 'react-dom/server';
import { matchRoutes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import querystring from 'query-string';
import AsyncDataContextElement from '@/store/asyncDataContext/element';
import { isPromise } from '@/utils/promise';
import { formatRoutes } from '@/utils/router';
import { originalRoutes, routes } from '@/config/routes';

import settings from '@/config/settings';

import App from '@/App';

import { IAsyncDataProps, ISeoProps } from '@/@types/server.d';
import { IAsyncDataContext } from '@/@types/store.d';

export async function render(
  url: string,
  options?: RenderToPipeableStreamOptions
) {
  const paresUrl = querystring.parseUrl(url);
  const routerPathKeyRouter = formatRoutes(originalRoutes);

  // 获取当前pathname对应的自定义路由
  const routeItem = routerPathKeyRouter.pathKeyRouter[paresUrl.url] || {};
  // 获取meta
  const meta = routeItem.meta || {};
  meta.title = `${meta.title}-${settings.siteTitle}`;
  meta.keywords = meta.keywords || '';
  meta.description = meta.description || '';

  // 获取 react-router match后的所有routes
  const routeMatched = matchRoutes(routes, url);

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
  /* 获取 asyncDataFun 集合 */
  const asyncDataFuncs: any = [];
  /* 获取 seoFun, 已页面为准（最后一个组件） */
  let seoFun: any = null;
  matchedComponents.map(item => {
    const prototype =
      item.type && item.type.type
        ? item.type.type
        : item.type &&
          item.type._payload &&
          item.type._payload._result &&
          item.type._payload._result.default &&
          item.type._payload._result.default.type
        ? item.type._payload._result.default.type
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
    meta.title = seo.title ? `${seo.title}-${settings.siteTitle}` : meta.title;
    meta.keywords = seo.keywords || meta.keywords;
    meta.description = seo.description || meta.description;
  }

  const stream = renderToPipeableStream(
    <StaticRouter location={url}>
      <AsyncDataContextElement value={asyncDataStroe}>
        <App />
      </AsyncDataContextElement>
    </StaticRouter>,
    options
  );
  return [stream, meta, JSON.stringify(asyncDataStroe)];
}
