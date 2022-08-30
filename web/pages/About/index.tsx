import { memo, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Spin } from 'antd';
import {
  useAsyncDataPageContext,
  useEffectDispatchAsyncDataPage,
} from '@/store/asyncDataContext';

import PaginationBase from '@/components/Pagination/Base';

import { ResponseData } from '@/utils/request';
import { queryList } from './service';
import { ResponseDataType, TableListItem, ITableData } from './data';

import styles from './index.module.less';

import { IServerPage } from '@/@types/server';

const About: IServerPage<ITableData> = () => {
  const [searchParams] = useSearchParams();
  // 获取当前页码
  const page = useMemo(
    () => Number(searchParams.get('page') || 1),
    [searchParams]
  );

  // 取出数据
  const asyncDataStore = useAsyncDataPageContext<ITableData>();
  const list = useMemo<TableListItem[]>(
    () => asyncDataStore.list || [],
    [asyncDataStore]
  );
  const total = useMemo<number>(
    () => asyncDataStore?.pagination?.total || 0,
    [asyncDataStore]
  );
  const current = useMemo<number>(
    () => asyncDataStore?.pagination?.current || 1,
    [asyncDataStore]
  );

  // 生成请求数据 dispatch
  const [loading, dispatch, location, parsedUrl] =
    useEffectDispatchAsyncDataPage<ITableData>(async config => {
      return About.asyncData && (await About.asyncData(config));
    });

  // 客户端 - 请求数据
  useEffect(() => {
    const parsedUrlQueryPage = Number(parsedUrl.query.page || 1);
    if (parsedUrl.url === location.pathname && parsedUrlQueryPage !== page) {
      dispatch();
    }
  }, [page]);

  return (
    <div className="about">
      <h1>This is an about page</h1>
      <Spin spinning={loading}>
        <div className={styles.box}>
          <ul>
            {list.map(item => (
              <li key={item.id}>
                <Link to={`/detail?id=${item.id}`}>{item.title}</Link>
                <span>{item.addtime}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <PaginationBase
            total={total}
            currentPage={current}
            pageUrl="/about?page={page}"
          />
        </div>
      </Spin>
    </div>
  );
};

About.asyncData = async ({ paresUrl }) => {
  const current = Number(paresUrl.query.page || 1);
  const response: ResponseData<ResponseDataType> = await queryList({
    current,
  });
  const data = response.data || { list: [], total: 0 };
  return {
    list: data.list || [],
    pagination: {
      total: data.total || 0,
      current,
      pageSize: 10,
    },
  };
};

export default memo(About);
