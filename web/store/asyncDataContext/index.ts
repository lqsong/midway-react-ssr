import { createContext, useContext, useState } from 'react';
import { useLocation, Location } from 'react-router-dom';
import querystring from 'query-string';
import { IAsyncDataContext } from '@/@types/store.d';
import { IAsyncDataProps } from '@/@types/server';

// AsyncDataContext
export const AsyncDataContext = createContext<IAsyncDataContext<any>>({
  paresUrl: {
    url: '',
    query: {},
  },
  meta: {},
  app: [],
  page: {},
});

/**
 * 返回 AsyncData集的所有数据与当前页面的AsyncData数据、meta、paresUrl
 * @returns IAsyncDataContext: {app, page}
 */
export const useAsyncDataContext = <T>(): IAsyncDataContext<T> => {
  return useContext<IAsyncDataContext<T>>(AsyncDataContext);
};

/**
 * 返回 当前页面ParesUrl
 * @returns any IAsyncDataContext.app
 */
export const useAsyncDataParesUrlContext = () => {
  return useContext(AsyncDataContext).paresUrl;
};

/**
 * 返回 当前页面meta
 * @returns any IAsyncDataContext.app
 */
export const useAsyncDataMetaContext = () => {
  return useContext(AsyncDataContext).meta;
};

/**
 * 返回 AsyncData集的所有数据
 * @returns any IAsyncDataContext.app
 */
export const useAsyncDataAppContext = () => {
  return useContext(AsyncDataContext).app;
};

/**
 * 返回 当前页面的AsyncData数据
 * @returns T IAsyncDataContext.page
 */
export const useAsyncDataPageContext = <T>(): T => {
  return useContext<IAsyncDataContext<T>>(AsyncDataContext).page;
};

// AsyncDataUpateContext
export const AsyncDataUpateContext = createContext<
  (val: IAsyncDataContext<any>) => void
>(() => {});

/**
 * 返回 AsyncData集 的修改函数 - 慎用
 * @returns (val: IAsyncDataContext<any>) => void
 */
export const useAsyncDataUpateContext = () => {
  return useContext(AsyncDataUpateContext);
};

/**
 * 返回 AsyncData当前页面数据的修改函数
 * @returns (val: T) => void
 */
export const useAsyncDataUpatePageContext = <T>() => {
  const location = useLocation();
  const asyncData = useAsyncDataContext<T>();
  const upateAsyncData = useContext(AsyncDataUpateContext);

  return (val: T) => {
    const app = [...asyncData.app];
    const appLen = app.length;
    if (appLen > 0) {
      app.splice(appLen - 1, 1, val);
    } else {
      app.push(val);
    }
    upateAsyncData({
      ...asyncData,
      paresUrl: {
        url: location.pathname,
        query: querystring.parse(location.search),
      },
      app,
      page: val,
    });
  };
};

/**
 * 返回 发送请求当前页面数据 dispatch
 * @param cb (config: IAsyncDataProps) => Promise<T> 回调函数传入当前页面page.asyncData()
 * @returns  [loading: boolean, dispatch: () => Promise<void>, location:Location, parsedUrl: querystring.ParsedUrl]
 */
export const useEffectDispatchAsyncDataPage = <T>(
  cb: (config: IAsyncDataProps) => Promise<T | undefined>
): [boolean, () => Promise<void>, Location, querystring.ParsedUrl] => {
  const location = useLocation();
  const parsedUrl = useAsyncDataParesUrlContext();
  const upateAsyncDataPage = useAsyncDataUpatePageContext<T>();
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = async () => {
    setLoading(true);
    try {
      const asyncDataConfig: IAsyncDataProps = {
        paresUrl: {
          url: location.pathname,
          query: querystring.parse(location.search),
        },
      };
      const data = await cb(asyncDataConfig);
      data && upateAsyncDataPage(data);
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };

  return [loading, dispatch, location, parsedUrl];
};
