<script setup lang="ts">

</script>

<template>
  <!-- Обертка для всего контента сайта -->
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <AppHeader/>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <slot/>
    </main>

    <!-- Footer -->
    <AppFooter/>
  </div>
</template>

<style scoped>

</style>
