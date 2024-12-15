<script setup lang="ts">

</script>

<template>
  <div class="mx-auto max-w-[1170px]">
    <MainSlider/>

    <div class="mt-8">
      <MainAdvantages/>
    </div>

    <div class="mt-12 flex justify-center">
      <RouterLink
        to="/catalog"
        role="button"
        class="btn btn-primary btn-wide">
        Перейти в каталог
        <i class="iconify size-6 prime--arrow-right "/>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>
