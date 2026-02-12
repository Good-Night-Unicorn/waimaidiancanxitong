<template>
  <section class="filters card">
    <div class="filters__row">
      <div class="filters__categories">
        <span class="filters__label">商家分类：</span>
        <el-radio-group v-model="localCategory" size="small" @change="emitCategory">
          <el-radio-button label="综合排序" />
          <el-radio-button v-for="category in categories" :key="category" :label="category" />
        </el-radio-group>
      </div>
      <div class="filters__sorting">
        <span class="filters__label">排序：</span>
        <el-segmented v-model="localSort" :options="sortOptions" @change="handleSortChange" />
      </div>
    </div>
    <div class="filters__row secondary">
      <el-space alignment="center" wrap size="16">
        <el-check-tag :checked="localFilters.onlyDiscount" @change="toggleDiscount">满减优惠</el-check-tag>
        <el-check-tag :checked="localFilters.onlyFreeDelivery" @change="toggleFreeDelivery">免配送费</el-check-tag>
        <el-check-tag :checked="localFilters.selfPickup" @change="togglePickup">到店自取</el-check-tag>
        <el-button link type="primary" @click="handleReset">重置条件</el-button>
      </el-space>
      <slot name="extra" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

type SortKey = 'default' | 'rating' | 'sales' | 'distance';

interface Filters {
  onlyDiscount: boolean;
  onlyFreeDelivery: boolean;
  selfPickup: boolean;
}

const props = defineProps<{
  categories: string[];
  selectedCategory: string;
  sortBy: SortKey;
  filters: Filters;
}>();

const emit = defineEmits<{
  (event: 'updateCategory', category: string): void;
  (event: 'updateSort', sort: SortKey): void;
  (event: 'updateFilters', filters: Partial<Filters>): void;
  (event: 'reset'): void;
}>();

const localCategory = ref(props.selectedCategory || '综合排序');
const localSort = ref<SortKey>(props.sortBy);
const localFilters = reactive<Filters>({ ...props.filters });

watch(
  () => props.selectedCategory,
  (value) => {
    localCategory.value = value;
  }
);

watch(
  () => props.sortBy,
  (value) => {
    localSort.value = value;
  }
);

watch(
  () => props.filters,
  (value) => {
    Object.assign(localFilters, value);
  },
  { deep: true }
);

const sortOptions = computed(() => [
  { label: '综合排序', value: 'default' },
  { label: '评分最高', value: 'rating' },
  { label: '销量最高', value: 'sales' },
  { label: '距离最近', value: 'distance' }
]);

const emitCategory = (category: string) => {
  emit('updateCategory', category);
};

const handleSortChange = (sort: SortKey) => {
  emit('updateSort', sort);
};

const toggleDiscount = (checked: boolean) => {
  localFilters.onlyDiscount = checked;
  emit('updateFilters', { onlyDiscount: checked });
};

const toggleFreeDelivery = (checked: boolean) => {
  localFilters.onlyFreeDelivery = checked;
  emit('updateFilters', { onlyFreeDelivery: checked });
};

const togglePickup = (checked: boolean) => {
  localFilters.selfPickup = checked;
  emit('updateFilters', { selfPickup: checked });
};

const handleReset = () => {
  emit('reset');
};
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    &.secondary {
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }

  &__label {
    font-weight: 500;
    color: #333;
    margin-right: 10px;
  }

  &__categories,
  &__sorting {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  :deep(.el-radio-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 840px) {
  .filters__row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

