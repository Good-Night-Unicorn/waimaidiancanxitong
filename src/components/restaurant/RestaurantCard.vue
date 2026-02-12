<template>
  <article class="restaurant-card card" @click="$emit('view', restaurant)">
    <div class="cover">
      <img :src="restaurant.cover" :alt="restaurant.name" loading="lazy" />
      <el-tag v-if="restaurant.deliveryFee === 0" size="small" type="success" class="cover__tag">免配送费</el-tag>
    </div>
    <div class="info">
      <header class="info__header">
        <h3>{{ restaurant.name }}</h3>
        <el-rate v-model="rateValue" disabled show-score :score-template="`${restaurant.rating.toFixed(1)}分`" />
      </header>
      <p class="info__meta">
        <span>月售 {{ restaurant.monthlySales }}</span>
        <span>起送 ¥{{ restaurant.startingFee }}</span>
        <span>{{ restaurant.deliveryTime }} 分钟送达</span>
      </p>
      <p class="info__categories">
        <el-tag v-for="tag in restaurant.categories.slice(0, 3)" :key="tag" size="small">{{ tag }}</el-tag>
      </p>
      <div v-if="restaurant.promotions.length" class="info__promotions">
        <el-tag
          v-for="promotion in restaurant.promotions"
          :key="promotion.label"
          :type="promotion.type"
          size="small"
          effect="plain"
        >
          {{ promotion.label }}
        </el-tag>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Restaurant } from '@/types';

const props = defineProps<{
  restaurant: Restaurant;
}>();

defineEmits<{
  (event: 'view', restaurant: Restaurant): void;
}>();

const rateValue = computed(() => props.restaurant.rating);
</script>

<style scoped lang="scss">
.restaurant-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 35px rgba(15, 35, 95, 0.12);
  }
}

.cover {
  position: relative;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }

  &__tag {
    position: absolute;
    top: 12px;
    left: 12px;
    backdrop-filter: blur(4px);
  }
}

.info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  &__meta {
    margin: 0;
    display: flex;
    gap: 14px;
    color: #666;
    font-size: 14px;
  }

  &__categories {
    display: flex;
    gap: 8px;
    margin: 0;
  }

  &__promotions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .restaurant-card {
    grid-template-columns: 1fr;
  }

  .cover img {
    height: 200px;
  }
}
</style>

