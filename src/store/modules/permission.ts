import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import router, { allRoutes } from '@/router';
import { store, useUserStore } from '@/store';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
    removeRoutes: [],
    asyncRoutes: [],
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes;

      // 在菜单展示全部路由
      // this.routers = [...homepageRouterList, ...accessedRouters, ...fixedRouterList];
      // 在菜单只展示动态路由和首页
      // this.routers = [...homepageRouterList, ...accessedRouters];
      // 在菜单只展示动态路由
      this.routers = [...accessedRouters];
    },
    async buildAsyncRoutes() {
      try {
        // 直接在前端构建菜单列表
        // 刷新用户信息
        const userStore = useUserStore();
        await userStore.getUserInfo();
        this.asyncRoutes = this.buildMenus();
        // 发起菜单权限请求 获取菜单列表
        // const asyncRoutes: Array<RouteItem> = (await getMenuList()).list;
        // this.asyncRoutes = transformObjectToRoute(asyncRoutes);
        await this.initRoutes();
        return this.asyncRoutes;
      } catch (e) {
        throw new Error("Can't build routes:", e);
      }
    },
    buildMenus() {
      const userStore = useUserStore();
      const { menus } = userStore;
      const routes = [];
      const all = allRoutes.map((item: RouteRecordRaw) => {
        return { ...item } as RouteRecordRaw;
      });
      if (menus.includes('*')) {
        all.forEach((route) => {
          routes.push(route);
        });
      } else {
        all.forEach((route) => {
          const children = [];
          route.children?.forEach((childRouter) => {
            const menu = `${route.path}/${childRouter.path}`;
            if (menus.indexOf('*') !== -1 || menus.indexOf(menu) !== -1) {
              children.push(childRouter);
            } else {
              this.removeRoutes.push({
                parent: route,
                child: childRouter,
              });
            }
          });
          if (children.length > 0) {
            route.children = children;
            routes.push(route);
          }
        });
      }
      return routes;
    },
    async restoreRoutes() {
      this.removeRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item);
      });
      this.removeRoutes = [];
      this.asyncRoutes = [];
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
