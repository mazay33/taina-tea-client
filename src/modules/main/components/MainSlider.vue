<script setup lang="ts">
// Массив слайдов
const slides = [
  {
    image: 'https://cdn.teaworkshop.ru/media/image/38/42/60dfc358c81c16e6d5343f7703b8.jpg',
    title: 'Мудрая Панда!',
    description: 'Четвертый выпуск культового шу пуэра'
  },
  {
    image: 'https://cdn.teaworkshop.ru/media/image/d8/b1/d5b19542bcf78176f44e663a6884.jpeg',
    title: 'Как выбрать пуэр?',
    description: 'Пошаговое руководство от чайного мастера'
  },
  {
    image: 'https://cdn.teaworkshop.ru/media/image/b8/67/8684ff725629f43fe41e2937a563.jpeg',
    title: 'Приятный 10% дисконт',
    description: 'на первывй заказ в нашем интернет-магазине'
  },
  {
    image: 'https://cdn.teaworkshop.ru/media/image/74/7e/92f46d92e4895f76d450c3ec0640.jpg',
    title: 'Как начать пить китайский чай?',
    description: 'Руководство для быстрого старта в китайском чае'
  }
];

// Индекс текущего слайда
const currentIndex = ref(0);

// Статус автопрокрутки
const isAutoSliding = ref(true);

// Переключение на следующий слайд
const nextSlide = (): void => {
  if (currentIndex.value < slides.length - 1) {
    currentIndex.value++;
  }
  else {
    currentIndex.value = 0; // Переход к первому слайду
  }
};

// Переключение на предыдущий слайд
const prevSlide = (): void => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
  else {
    currentIndex.value = slides.length - 1; // Переход на последний слайд
  }
};

// Автоматическая прокрутка слайдов
let autoSlideInterval: ReturnType<typeof setInterval>;

const startAutoSlide = (): void => {
  if (isAutoSliding.value) {
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 3000); // Автопереключение каждые 3 секунды
  }
};

// Остановка автопереключения
const stopAutoSlide = (): void => {
  clearInterval(autoSlideInterval);
};

// Запуск автопереключения при монтировании компонента
onMounted(() => {
  startAutoSlide();
});

// Остановка автопереключения при взаимодействии с кнопками
watch(currentIndex, () => {
  stopAutoSlide();
  startAutoSlide();
});

// Тоггл для паузы и продолжения автопрокрутки
const toggleAutoSlide = (): void => {
  isAutoSliding.value = !isAutoSliding.value;
  if (isAutoSliding.value) {
    startAutoSlide();
  }
  else {
    stopAutoSlide();
  }
};

// Переключение на слайд при клике на точку
const goToSlide = (index: number): void => {
  currentIndex.value = index;
};
</script>

<template>
  <div class="slider">
    <div
      class="slider__slides"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="slider__slide">
        <div class="slider__content">
          <div class="slider__text">
            <h2 class="slider__title">
              {{ slide.title }}
            </h2>
            <h3 class="slider__description">{{ slide.description }}</h3>
          </div>
        </div>
        <img
          :src="slide.image"
          :alt="'Slide ' + (index + 1)"
          class="slider__image" />
      </div>
    </div>

    <div class="slider__controls">
      <button
        class="slider__btn slider__btn--prev btn"
        @click="prevSlide">
        <i class="iconify size-6 prime--chevron-left" />
      </button>
      <button
        class="slider__btn slider__btn--next btn"
        @click="nextSlide">
        <i class="iconify size-6 prime--chevron-right" />
      </button>
    </div>

    <button
      class="slider__pause-btn"
      @click="toggleAutoSlide">
      <i
        v-if="isAutoSliding"
        class="iconify size-8 prime--pause-circle" />
      <i
        v-else
        class="iconify size-8 prime--play-circle" />
    </button>

    <div class="slider__dots">
      <div
        v-for="(_slide, index) in slides"
        :key="index"
        class="slider__dot"
        :class="{ 'slider__dot--active': currentIndex === index }"
        @click="goToSlide(index)"/>
    </div>
  </div>
</template>

<style scoped>
.slider {
  max-height: 320px;
  height: 100%;

  overflow: hidden;
  position: relative;
  border-radius: 24px;
}

.slider__slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slider__slide {
  position: relative;
  min-width: 100%;
  box-sizing: border-box;
}

.slider__slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.slider__image {
  width: 100%;
  height: 100%;
  max-height: 320px;
  object-fit: cover;
  z-index: 0;
}

.slider__content {
  position: absolute;
  left: 25%;
  top: 25%;
  z-index: 10;
  transform: translate(-25%, -25%);
}

.slider__text {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: white;
}

.slider__title {
  font-size: 52px;
  font-weight: bold;
  color:  #fcd34d ;
}

.slider__description {
  font-size: 28px;
  font-weight: 600;
}

.slider__controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.slider__btn {
  padding: 0 12px 0 12px;
}

.slider__btn--prev {
  margin-left: 12px;
}

.slider__btn--next {
  margin-right: 12px;
}

.slider__pause-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

.slider__dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.slider__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.slider__dot--active {
  background-color:#fcd34d;
  transform : scale(1.2);
}

.slider__dot:hover {
  background-color: #fcd34d;
}
</style>
