<script setup lang="ts">
import { useAuthStore } from '../store';

const authStore = useAuthStore();
const router = useRouter();

const authState = reactive({
  email: 'user@example.com',
  password: 'password123'
});

const login = (): Promise<void> => {
  return authStore.login(authState);
};
</script>

<template>
  <input
    v-model="authState.email"
    type="text"
    placeholder="Email"
    class="input input-bordered w-full max-w-xs"/>
  <input
    v-model="authState.password"
    type="password"
    placeholder="Password"
    class="input input-bordered w-full max-w-xs"/>

  <button
    class="btn btn-primary"
    @click="login">
    Войти
  </button>
</template>

<style scoped>

</style>
