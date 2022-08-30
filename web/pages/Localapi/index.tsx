import { memo } from 'react';

import { useAsyncDataPageContext } from '@/store/asyncDataContext';

import { ResponseData } from '@/utils/request';
import { queryUser } from './service';
import { User } from './data';

import { IServerPage } from '@/@types/server';

const Localapi: IServerPage<User> = () => {
  // 取出数据
  const user = useAsyncDataPageContext<User>();

  return (
    <div className="user">
      <p>{user.uid}</p>
      <p>{user.phone}</p>
      <p>{user.username}</p>
    </div>
  );
};

Localapi.asyncData = async ({ paresUrl }) => {
  const uid = paresUrl.query.uid?.toString() || '1';
  const response: ResponseData<User> = await queryUser(uid);
  return response.data || {};
};

Localapi.seo = ({ asyncData }) => {
  return {
    title: asyncData.uid + '-测试',
  };
};

export default memo(Localapi);
