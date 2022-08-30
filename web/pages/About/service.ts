import request from '@/utils/request';
import { TableListQueryParams } from './data';
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/article/list',
    method: 'get',
    params,
  });
}
