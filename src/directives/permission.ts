import { Directive } from 'vue';
import { getUserStore } from '@/store';

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = getUserStore();
    const { btns } = userStore;
    if (!btns.includes('*') && !btns.includes(value)) {
      el.style.display = 'none';
    }
  },
};
