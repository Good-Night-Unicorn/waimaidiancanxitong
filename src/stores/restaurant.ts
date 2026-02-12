import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { cities, restaurantCategories, restaurants } from '@/mock/restaurants';
import type { CityOption, Restaurant } from '@/types';

type SortKey = 'default' | 'rating' | 'sales' | 'distance';

interface FilterState {
  category: string;
  onlyFreeDelivery: boolean;
  onlyDiscount: boolean;
  selfPickup: boolean;
  sortBy: SortKey;
}

interface RestaurantState {
  city: string;
  district: string;
  keyword: string;
  filters: FilterState;
}

const defaultFilters: FilterState = {
  category: '综合排序',
  onlyDiscount: false,
  onlyFreeDelivery: false,
  selfPickup: false,
  sortBy: 'default'
};

export const useRestaurantStore = defineStore('restaurant', () => {
  const state = reactive<RestaurantState>({
    city: 'shanghai',
    district: '',
    keyword: '',
    filters: { ...defaultFilters }
  });

  const cityOptions = computed<CityOption[]>(() => cities);

  const categoryOptions = computed(() => restaurantCategories.map((item) => item.label));

  const defaultCity = computed(() => cityOptions.value[0]?.value ?? 'shanghai');

  const restaurantsInCity = computed<Restaurant[]>(() => restaurants.filter((item) => item.city === state.city));

  const keywordFilter = (item: Restaurant) => {
    if (!state.keyword) {
      return true;
    }
    const target = `${item.name}${item.categories.join('')}`;
    return target.toLowerCase().includes(state.keyword.toLowerCase());
  };

  const categoryFilter = (item: Restaurant) => {
    if (!state.filters.category || state.filters.category === '综合排序') {
      return true;
    }
    return item.categories.includes(state.filters.category);
  };

  const discountFilter = (item: Restaurant) => {
    if (!state.filters.onlyDiscount) {
      return true;
    }
    return item.promotions.length > 0;
  };

  const freeDeliveryFilter = (item: Restaurant) => {
    if (!state.filters.onlyFreeDelivery) {
      return true;
    }
    return item.deliveryFee === 0;
  };

  const filteredRestaurants = computed<Restaurant[]>(() => {
    let result = restaurantsInCity.value.filter(keywordFilter).filter(categoryFilter).filter(discountFilter).filter(freeDeliveryFilter);
    if (state.filters.selfPickup) {
      result = result.filter((item) => item.deliveryFee === 0 || item.startingFee <= 10);
    }
    switch (state.filters.sortBy) {
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        result = [...result].sort((a, b) => b.monthlySales - a.monthlySales);
        break;
      case 'distance':
        result = [...result].sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      default:
        break;
    }
    return result;
  });

  const recommendedRestaurants = computed(() => filteredRestaurants.value.slice(0, 3));

  const updateCity = (city: string) => {
    state.city = city;
    state.district = '';
    state.keyword = '';
    state.filters = { ...defaultFilters };
  };

  const updateDistrict = (district: string) => {
    state.district = district;
  };

  const updateSearchKeyword = (keyword: string) => {
    state.keyword = keyword;
  };

  const updateFilters = (filters: Partial<FilterState>) => {
    state.filters = { ...state.filters, ...filters };
  };

  const resetFilters = () => {
    state.filters = { ...defaultFilters };
  };

  const searchRestaurants = (keyword: string) => {
    const normalized = keyword.toLowerCase();
    return restaurantsInCity.value.filter((item) => `${item.name}${item.categories.join('')}`.toLowerCase().includes(normalized));
  };

  const getRestaurantById = (id: string) => restaurants.find((item) => item.id === id) ?? null;

  return {
    state,
    cityOptions,
    categoryOptions,
    defaultCity,
    restaurantsInCity,
    filteredRestaurants,
    recommendedRestaurants,
    updateCity,
    updateDistrict,
    updateSearchKeyword,
    updateFilters,
    resetFilters,
    searchRestaurants,
    getRestaurantById
  };
});

