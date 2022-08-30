import { lazy } from 'react';
import { IRouter } from '@/@types/router';
// import About from '@/pages/About';

const LayoutRoutes: IRouter[] = [
  {
    path: '/',
    meta: {
      title: '首页',
      keywords: '首页k',
      description: '首页d',
      navActive: 'home',
    },
    component: lazy(() => import('@/pages/Home')),
  },
  {
    path: '/about',
    meta: {
      title: '关于',
      keywords: '关于k',
      description: '关于d',
      navActive: 'about',
    },
    //component: About,
    component: lazy(() => import('@/pages/About')),
  },
  {
    path: '/detail',
    meta: {
      title: '详情',
      keywords: '详情k',
      description: '详情d',
      navActive: 'about',
    },
    component: lazy(() => import('@/pages/Detail')),
  },
  {
    path: '/localapi',
    meta: {
      title: '请求本地api样列',
      keywords: '请求本地,api样列',
      description: '请求本地midway服务api样列',
      navActive: 'localapi',
    },
    component: lazy(() => import('@/pages/Localapi')),
  },
];

export default LayoutRoutes;
