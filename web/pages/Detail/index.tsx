import { memo } from 'react';
import { useAsyncDataPageContext } from '@/store/asyncDataContext';

import { ResponseData } from '@/utils/request';
import { queryDetail } from './service';
import { Article } from './data';

import { IServerPage } from '@/@types/server';

const Detail: IServerPage<Article> = () => {
  // 取出数据
  const article = useAsyncDataPageContext<Article>();

  return (
    <div className="detail">
      <p>{article.title}</p>
      <p>{article.addtime}</p>
      <p>{article.content}</p>
    </div>
  );
};

Detail.asyncData = async ({ paresUrl }) => {
  const id = paresUrl.query.id?.toString() || '1';
  const response: ResponseData<Article> = await queryDetail(id);
  return response.data || {};
};

Detail.seo = ({ asyncData }) => {
  return {
    title: asyncData.title + '-详情测试',
  };
};

export default memo(Detail);
