<script setup lang="ts">

const items = [
  {
    title: 'Быстро',
    description: 'отправим в день заказа в любой регион',
    icon: 'mingcute--lightning-line'
  },
  {
    title: 'Бесплатно',
    description: 'заказы от 3 900 руб. доставим сами',
    icon: 'mingcute--happy-line'
  },
  {
    title: 'Душевно',
    description: 'сюрпризы и угощения в каждой посылке',
    icon: 'mingcute--gift-line'
  },
  {
    title: 'Профессионально',
    description: '12 лет на рынке, полжизни в чае',
    icon: 'mingcute--group-3-line'
  }
];
</script>

<template>
  <div class="grid grid-cols-4">
    <div
      v-for="item in items"
      :key="item.title"
      class="flex flex-col items-center justify-center">
      <div class="mb-4 rounded-full bg-gray-200/80 px-5 py-4">
        <i
          :class="item.icon"
          class="iconify size-16 text-amber-400/80 "/>
      </div>

      <div class="flex max-w-[170px] flex-col items-center justify-center ">
        <p class="mb-1 text-2xl font-bold">{{ item.title }}</p>
        <span class="text-center text-gray-400">
          {{ item.description }}
        </span>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
