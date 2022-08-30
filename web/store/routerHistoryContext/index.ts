import { createContext, useContext } from 'react';
import type { Location } from 'history';

// RouterHistoryContext
export const RouterHistoryContext = createContext<Location[]>([]);

/**
 * 返回 RouterHistory 所有 数据
 * @returns Location[]
 */
export const useRouterHistoryContext = (): Location[] => {
  return useContext(RouterHistoryContext);
};

/**
 * 返回 RouterHistory 最后一条 数据
 * @returns Location | null
 */
export const useRouterHistoryContextLast = (): Location | null => {
  const history = useContext(RouterHistoryContext);
  const historyLen = history.length;
  return historyLen > 0 ? history[historyLen - 1] : null;
};

// RouterHistoryUpateContext
export const RouterHistoryUpateContext = createContext<
  (val: Location[]) => void
>(() => {});

/**
 * 返回 RouterHistory数据 的修改函数
 * @returns (val: Location[]) => void
 */
export const useRouterHistoryUpateContext = () => {
  return useContext(RouterHistoryUpateContext);
};
