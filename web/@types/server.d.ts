import { ParsedUrl } from 'query-string';
/**
 * 自定义扩展方法的公共参数类型
 */
export interface IServerFunProps {
  paresUrl: ParsedUrl; // 当前地址栏url paresUrl格式后的值
}

/**
 * 自定义扩展方法asyncData的参数类型
 */
export type IAsyncDataProps = IServerFunProps;

/**
 * 自定义扩展方法seo的参数类型
 * <T> asyncData方法返回的数据类型
 */
export interface ISeoProps<T> extends IServerFunProps {
  asyncData: T; // asyncData方法返回的数据
}

/**
 * 自定义扩展方法seo返回数据类型
 */
export interface ISeoResponse {
  title?: string;
  keywords?: string;
  description?: string;
}

/**
 * 字段莹莹页面函数组件定义类型
 * <T> 函数组件 props 类型
 * <D> 函数组件 asyncData方法 返回数据的类型
 */
export interface IServerPage<D = any, T = any> {
  (props: T): JSX.Element;
  asyncData?(config: IAsyncDataProps): Promise<D>;
  seo?(config: ISeoProps<D>): ISeoResponse;
}
