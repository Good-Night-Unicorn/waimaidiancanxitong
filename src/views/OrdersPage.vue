<template>
  <div class="page-container orders">
    <section class="card orders__header">
      <h1>订单列表</h1>
      <p class="subtitle">查看所有餐厅订单状态，掌握每一笔订单动态。</p>
      <el-segmented v-model="statusFilter" :options="statusOptions" />
    </section>
    <section class="card">
      <el-table :data="filteredOrders" border stripe>
        <el-table-column prop="id" label="订单号" width="160" />
        <el-table-column prop="restaurantName" label="餐厅" width="160" />
        <el-table-column label="菜品">
          <template #default="{ row }">
            <div class="items">
              <p v-for="item in row.items" :key="item.menuId">
                {{ item.name }} × {{ item.quantity }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template #default="{ row }">¥{{ row.totalAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="160" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-space>
              <el-button link type="primary" @click="router.push({ name: 'order-detail', params: { id: row.id } })">详情</el-button>
              <el-dropdown>
                <span class="el-dropdown-link">更新状态</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="option in statusOptions.filter((s) => s.value !== 'all')" :key="option.value" @click="updateStatus(row.id, option.value)">
                      {{ option.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import type { OrderStatus } from '@/types';

const orderStore = useOrderStore();
const router = useRouter();

const statusFilter = ref<'all' | OrderStatus>('all');

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '待确认', value: 'pending' },
  { label: '制作中', value: 'preparing' },
  { label: '配送中', value: 'on-the-way' },
  { label: '已送达', value: 'delivered' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
];

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') {
    return orderStore.sortedOrders;
  }
  return orderStore.sortedOrders.filter((order) => order.status === statusFilter.value);
});

const statusText = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return '待确认';
    case 'preparing':
      return '制作中';
    case 'on-the-way':
      return '配送中';
    case 'delivered':
      return '已送达';
    case 'completed':
      return '已完成';
    case 'cancelled':
      return '已取消';
    default:
      return '未知';
  }
};

const statusTag = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'preparing':
      return 'warning';
    case 'on-the-way':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'info';
  }
};

const updateStatus = (orderId: string, status: string | number | boolean) => {
  orderStore.updateStatus(orderId, status as OrderStatus);
};
</script>

<style scoped lang="scss">
.orders {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .subtitle {
      margin: 0;
      color: #666;
    }
  }
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  p {
    margin: 0;
    background: #f5f7ff;
    border-radius: 12px;
    padding: 6px 12px;
  }
}
</style>

