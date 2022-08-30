/**
 * 站点配置 ts定义
 * @author LiQingSong
 */

export interface SettingsType {
  /**
   * 站点名称
   */
  siteTitle: string;

  /**
   * 站点本地存储Token 的 Key值
   */
  siteTokenKey: string;

  /**
   * Ajax请求头发送Token 的 Key值
   */
  ajaxHeadersTokenKey: string;

  /**
   * Ajax返回值不参加统一验证的api地址
   */
  ajaxResponseNoVerifyUrl: string[];
}
