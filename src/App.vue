<script setup lang="ts">
import DefaultLayout from './app/layout/DefaultLayout.vue';
import { useAuthStore } from './modules/auth';

const route = useRoute();

const layouts = {
  DefaultLayout
};

const layout = computed(() => {
  const layoutKey = route.meta.layout as keyof typeof layouts;

  return layouts[layoutKey || 'DefaultLayout'];
});

onMounted(() => {
  const authStore = useAuthStore();
  authStore.getMe();
});

</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped>

</style>
