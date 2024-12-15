<script setup lang="ts">
import DefaultLayout from './app/layout/DefaultLayout.vue';

const route = useRoute();

const layouts = {
  DefaultLayout
};

const layout = computed(() => {
  const layoutKey = route.meta.layout as keyof typeof layouts;

  return layouts[layoutKey || 'DefaultLayout'];
});

</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped>

</style>
