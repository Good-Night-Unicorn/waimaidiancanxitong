<template>
  <header class="header">
    <div class="header__inner page-container">
      <div class="header__left" @click="goHome">
        <div class="logo">logo</div>
        <div class="city-select">
          <el-select v-model="selectedCity" size="small" class="city-select__control" @change="handleCityChange">
            <template #label>
              <el-icon><Location /></el-icon>
              <span>{{ currentCityLabel }}</span>
            </template>
            <el-option v-for="city in cityOptions" :key="city.value" :label="city.label" :value="city.value" />
          </el-select>
        </div>
      </div>
      <div class="header__center">
        <el-input
          v-model="keyword"
          placeholder="搜索商家、商品名称"
          size="large"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div class="header__right">
        <nav class="nav-links">
          <a :class="{ active: route.name === 'home' }" @click="goHome">首页</a>
          <a :class="{ active: route.name?.toString().startsWith('orders') }" @click="goOrders">我的订单</a>
        </nav>
        <div class="user-actions">
          <template v-if="userStore.isAuthenticated">
            <span class="welcome">欢迎 {{ userStore.profile?.username }}</span>
            <el-button link type="primary" @click="handleLogout">退出</el-button>
          </template>
          <template v-else>
            <el-button link type="primary" @click="router.push({ name: 'login' })">登录</el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary" @click="router.push({ name: 'register' })">注册</el-button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Location, Search } from '@element-plus/icons-vue';
import { useRestaurantStore } from '@/stores/restaurant';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const restaurantStore = useRestaurantStore();
const userStore = useUserStore();

const keyword = ref<string>((route.query.keyword as string) || '');
const selectedCity = ref<string>(userStore.profile?.city || restaurantStore.defaultCity);

const cityOptions = computed(() => restaurantStore.cityOptions);
const currentCityLabel = computed(() => cityOptions.value.find((item) => item.value === selectedCity.value)?.label ?? '选择城市');

watch(
  () => route.query.keyword,
  (value) => {
    keyword.value = (value as string) || '';
  }
);

const goHome = () => {
  router.push({ name: 'home' });
};

const goOrders = () => {
  if (!userStore.isAuthenticated) {
    ElMessage.warning('请先登录后查看订单');
    router.push({ name: 'login' });
    return;
  }
  router.push({ name: 'my-orders' });
};

const handleSearch = () => {
  restaurantStore.updateSearchKeyword(keyword.value);
  router.push({ name: 'home', query: keyword.value ? { keyword: keyword.value } : {} });
};

const handleCityChange = (value: string) => {
  restaurantStore.updateCity(value);
  userStore.updateCity(value);
  ElMessage.success(`已切换城市：${currentCityLabel.value}`);
};

const handleLogout = () => {
  userStore.logout();
  ElMessage.success('已退出登录');
  router.push({ name: 'home' });
};
</script>

<style scoped lang="scss">
.header {
  background: #fff;
  box-shadow: 0 6px 30px rgba(15, 35, 95, 0.05);
  position: sticky;
  top: 0;
  z-index: 99;

  &__inner {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 16px 0;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
  }

  &__center {
    flex: 1;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #ff6d39;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.city-select {
  &__control {
    min-width: 140px;
  }
}

.search-input {
  max-width: 540px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;

  a {
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover,
    &.active {
      color: #ff6d39;
    }
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  .welcome {
    color: #333;
  }
}

@media (max-width: 992px) {
  .header__inner {
    flex-wrap: wrap;
    gap: 16px;
  }

  .header__center {
    order: 3;
    flex: 1 0 100%;
  }
}

@media (max-width: 600px) {
  .logo {
    font-size: 20px;
  }

  .search-input {
    max-width: 100%;
  }

  .nav-links {
    display: none;
  }

  .header__inner {
    padding: 12px 0;
  }
}
</style>

