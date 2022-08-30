/**
 * 站点配置
 * @author LiQingSong
 */
import { SettingsType } from '@/@types/settings.d';

const settings: SettingsType = {
  siteTitle: 'MIDWAY-REACT-SSR',

  siteTokenKey: 'midway_react_ssr_token',
  ajaxHeadersTokenKey: 'x-token',
  ajaxResponseNoVerifyUrl: [
    '/user/login', // 用户登录
  ],
};

export default settings;
