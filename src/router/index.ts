import { useRoute, createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import uniq from 'lodash/uniq';

const env = import.meta.env.MODE || 'development';

// 导入homepage相关固定路由
const homepageModules = import.meta.globEager('./modules/**/homepage.ts');

// 导入modules非homepage相关固定路由
const fixedModules = import.meta.globEager('./modules/**/!(homepage).ts');

// 其他固定路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard/base',
  },
];

// 根router排序
const rootRouterSort = ['/dashboard', '/system', '/oss', '/result', '/user', '/loginRedirect', '/login', '/'];

// 存放固定路由
export const homepageRouterList: Array<RouteRecordRaw> = mapModuleRouterList(homepageModules);
export const fixedRouterList: Array<RouteRecordRaw> = mapModuleRouterList(fixedModules);

export const beforeSortRoutes = [...homepageRouterList, ...fixedRouterList, ...defaultRouterList];

const afterSortRoutes = [];
for (const v1 of rootRouterSort) {
  for (const v2 of beforeSortRoutes) {
    if (v2.path === v1) {
      afterSortRoutes.push(v2);
    }
  }
}
export const allRoutes = afterSortRoutes;

console.log(allRoutes);
// 固定路由模块转换为路由
export function mapModuleRouterList(modules: Record<string, unknown>): Array<RouteRecordRaw> {
  const routerList: Array<RouteRecordRaw> = [];
  Object.keys(modules).forEach((key) => {
    // @ts-ignore
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routerList.push(...modList);
  });
  return routerList;
}

export const getRoutesExpanded = () => {
  const expandedRoutes = [];

  fixedRouterList.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path);
          expandedRoutes.push(`${item.path}/${child.path}`);
        });
    }
  });
  return uniq(expandedRoutes);
};

export const getActive = (maxLevel = 3): string => {
  const route = useRoute();
  if (!route.path) {
    return '';
  }
  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('');
};

const router = createRouter({
  history: createWebHistory(env === 'site' ? '/starter/vue-next/' : null),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;
