<template>
  <div class="page-container detail" v-if="order">
    <section class="card detail__header">
      <div>
        <h1>{{ order.restaurantName }}</h1>
        <p class="meta">
          <span>下单时间：{{ order.createdAt }}</span>
          <span>配送地址：{{ order.contact.address }}</span>
        </p>
      </div>
      <div class="status">
        <el-tag :type="statusTag(order.status)" size="large">{{ statusText(order.status) }}</el-tag>
        <div class="actions">
          <el-button round type="primary" @click="updateStatus('delivered')">标记已送达</el-button>
          <el-button round @click="router.push({ name: 'orders' })">返回列表</el-button>
        </div>
      </div>
    </section>
    <section class="card detail__body">
      <div class="items">
        <h3>菜品信息</h3>
        <div class="items__list">
          <article v-for="item in order.items" :key="item.menuId" class="item">
            <img :src="item.image" :alt="item.name" />
            <div class="info">
              <h4>{{ item.name }}</h4>
              <p>数量：{{ item.quantity }}</p>
            </div>
            <strong>¥{{ (item.price * item.quantity).toFixed(2) }}</strong>
          </article>
        </div>
      </div>
      <aside class="summary card">
        <h3>订单金额</h3>
        <p>
          商品金额
          <span>¥{{ goodsAmount }}</span>
        </p>
        <p>
          配送费
          <span>¥{{ order.deliveryFee.toFixed(2) }}</span>
        </p>
        <p class="total">
          合计
          <span>¥{{ order.totalAmount.toFixed(2) }}</span>
        </p>
        <el-divider />
        <h3>收货信息</h3>
        <p>收货人：{{ order.contact.name }}（{{ order.contact.phone }}）</p>
        <p>地址：{{ order.contact.address }}</p>
        <p v-if="order.note">备注：{{ order.note }}</p>
      </aside>
    </section>
  </div>
  <el-empty v-else description="未找到订单，返回重试">
    <el-button type="primary" @click="router.push({ name: 'orders' })">返回订单列表</el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import type { OrderStatus } from '@/types';

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();

const orderId = route.params.id as string;
const order = computed(() => orderStore.getOrderById(orderId));

const goodsAmount = computed(() => {
  if (!order.value) {
    return '0.00';
  }
  const sum = order.value.items.reduce((total, item) => total + item.price * item.quantity, 0);
  return sum.toFixed(2);
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
      return '未知状态';
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

const updateStatus = (status: OrderStatus) => {
  if (!order.value) return;
  orderStore.updateStatus(order.value.id, status);
};
</script>

<style scoped lang="scss">
.detail {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .meta {
      margin: 8px 0 0;
      color: #666;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
}

.status {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;

  .actions {
    display: flex;
    gap: 12px;
  }
}

.items {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background: #fff7f3;

  img {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
  }

  .info h4 {
    margin: 0 0 8px;
  }
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    margin: 0;
    display: flex;
    justify-content: space-between;
  }

  .total span {
    color: #ff6d39;
    font-size: 20px;
  }
}

@media (max-width: 900px) {
  .detail__body {
    grid-template-columns: 1fr;
  }

  .status {
    align-items: flex-start;
  }
}
</style>

