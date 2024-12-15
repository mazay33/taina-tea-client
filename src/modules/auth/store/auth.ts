import type { IApiError } from '@/app/utils';
import type { ILoginPaylaod, IUser } from '../types';

import { defineStore } from 'pinia';

import { useApiService } from '@/app/services';
import { useUserStore } from '@/app/store/user';
import { ExpiringStorage } from '@/app/utils';

export const useAuthStore = defineStore('auth', () => {
  const apiService = useApiService();
  const user = ref<IUser>();
  const accessToken = ref<string>();
  const isAuthenticated = computed<boolean>(() => !!user.value);
  const router = useRouter();
  const error = ref<IApiError>();

  const login = async (data: ILoginPaylaod): Promise<void> => {
    const response = await apiService.auth.login(data);

    if (response.isError()) {
      error.value = response.error;
      return;
    }

    accessToken.value = response.value.data.accessToken;

    console.log(accessToken.value);

    await getMe();
  };

  const getMe = async (): Promise<void> => {
    const response = await apiService.auth.me();

    if (response.isError()) {
      router.push('/auth/login');
      return;
    }

    user.value = response.value.data;
    const userStore = useUserStore();
    userStore.setUser(user.value);
  };

  const refreshToken = async (): Promise<void> => {
    const response = await apiService.auth.refresh();

    if (response.isError()) {
      router.push('/auth/login');
      return;
    }

    accessToken.value = response.value.data.accessToken;

    console.log(accessToken.value);
  };

  const logout = async (): Promise<void> => {
    const response = await apiService.auth.logout();

    if (response.isError()) {
      return;
    }

    user.value = undefined;
    const userStore = useUserStore();
    userStore.clearUser();
    router.push('/auth/login');
  };

  return {
    user,
    login,
    getMe,
    refreshToken,
    isAuthenticated,
    error,
    logout,
    accessToken
  };
});
