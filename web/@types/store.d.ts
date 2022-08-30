import { ParsedUrl } from 'query-string';
import { IRouteMeta } from './router';

export interface IAsyncDataContext<T> {
  paresUrl: ParsedUrl; // 当前页面路由经过query-string处理后的pareUrl
  meta: IRouteMeta; // 当前页面对应的meta
  app: any; // 当前应用 asyncData 的所有数据
  page: T; // 当前页面的 asyncData 数据
}
