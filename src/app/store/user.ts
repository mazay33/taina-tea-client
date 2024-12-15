import type { IUser } from '@/modules/auth/types';

import { defineStore } from 'pinia';

import { ExpiringStorage } from '../utils';

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(ExpiringStorage.get('user') as IUser || null);

  const isAdmin = computed<boolean>(() => user.value?.roles.includes('admin') || false);

  const setUser = (payload: IUser): void => {
    user.value = payload;
    ExpiringStorage.set('user', payload);
  };

  const clearUser = (): void => {
    user.value = null;
    ExpiringStorage.remove('user');
  };

  return {
    user,
    setUser,
    clearUser,
    isAdmin
  };
});
