import { defineStore } from 'pinia';
import { TOKEN_NAME } from '@/config/global';
import { store, usePermissionStore } from '@/store';
import { login, userInfo } from '@/api/user';

const InitUserInfo = {
  id: '',
  username: '',
  code: '',
  permission: {
    resources: [],
    menus: [],
    btns: [],
  },
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_NAME) || 'main_token', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    menus: (state) => {
      return state.userInfo?.permission.menus;
    },
    btns: (state) => {
      return state.userInfo?.permission.btns;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const res = await login(userInfo);
      localStorage.setItem(TOKEN_NAME, res.token);
      this.token = res.token;
    },
    async getUserInfo() {
      this.userInfo = await userInfo();
    },
    async logout() {
      localStorage.removeItem(TOKEN_NAME);
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
    async removeToken() {
      this.token = '';
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
  },
});

export function getUserStore() {
  return useUserStore(store);
}
