<template>
  <section v-if="restaurant" class="detail page-container">
    <div class="detail__grid">
      <div class="detail__main card">
        <el-button type="text" class="back-button" @click="$emit('close')">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="detail__header">
          <img :src="restaurant.cover" :alt="restaurant.name" />
          <div class="detail__header-info">
            <h2>{{ restaurant.name }}</h2>
            <p class="summary">
              <span><el-icon><StarFilled /></el-icon> {{ restaurant.rating.toFixed(1) }} 分</span>
              <span>月售 {{ restaurant.monthlySales }}</span>
              <span>{{ restaurant.deliveryTime }} 分钟送达</span>
              <span>配送费 ¥{{ restaurant.deliveryFee }}</span>
            </p>
            <p class="meta">
              起送价 ¥{{ restaurant.startingFee }} ｜ 营业时间 {{ restaurant.businessHours }}
            </p>
            <div class="promotions">
              <el-tag v-for="promotion in restaurant.promotions" :key="promotion.label" :type="promotion.type" effect="light">
                {{ promotion.label }}
              </el-tag>
            </div>
          </div>
        </div>
        <div class="menu">
          <h3 class="section-title">菜单</h3>
          <div class="menu__grid">
            <article v-for="dish in restaurant.signatureDishes" :key="dish.id" class="menu__item card">
              <img :src="dish.image" :alt="dish.name" />
              <div class="menu__info">
                <h4>{{ dish.name }}</h4>
                <p class="desc">{{ dish.description }}</p>
                <p class="sold">月售 {{ dish.soldMonthly }}</p>
                <div class="menu__actions">
                  <strong class="price">¥{{ dish.price }}</strong>
                  <div class="actions">
                    <el-button type="primary" circle plain size="small" @click="decrease(dish.id)">
                      <el-icon><Minus /></el-icon>
                    </el-button>
                    <span class="quantity">{{ quantities[dish.id] ?? 0 }}</span>
                    <el-button type="primary" circle size="small" @click="increase(dish)">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <aside class="detail__aside card">
        <el-form label-position="top" :model="form" :rules="rules" ref="formRef">
          <h3 class="section-title">配送信息</h3>
          <el-form-item label="收货人" prop="name">
            <el-input v-model="form.name" placeholder="请输入收货人姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="收货地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="有什么特殊要求或口味偏好" />
          </el-form-item>
          <el-divider />
          <h3 class="section-title">订单信息</h3>
          <div class="summary">
            <p>
              商品金额
              <span>¥{{ goodsAmount }}</span>
            </p>
            <p>
              配送费
              <span>¥{{ restaurant.deliveryFee.toFixed(2) }}</span>
            </p>
            <p class="total">
              合计
              <span>¥{{ totalAmount }}</span>
            </p>
          </div>
          <el-button type="primary" size="large" :disabled="!canSubmit" block @click="submitOrder">
            提交订单
          </el-button>
        </el-form>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Minus, Plus, StarFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { Restaurant } from '@/types';
import { useOrderStore } from '@/stores/order';

const props = defineProps<{
  restaurant: Restaurant | null;
  contactName?: string;
  contactPhone?: string;
}>();

defineEmits<{
  (event: 'close'): void;
}>();

const router = useRouter();
const orderStore = useOrderStore();

const formRef = ref<FormInstance>();

const form = reactive({
  name: props.contactName ?? '',
  phone: props.contactPhone ?? '',
  address: '',
  remark: ''
});

watch(
  () => [props.contactName, props.contactPhone],
  ([name, phone]) => {
    form.name = name ?? '';
    form.phone = phone ?? '';
  }
);

const quantities = reactive<Record<string, number>>({});

watch(
  () => props.restaurant?.signatureDishes,
  (dishes) => {
    if (dishes) {
      dishes.forEach((dish) => {
        quantities[dish.id] = quantities[dish.id] ?? 0;
      });
    }
  },
  { immediate: true }
);

const goodsAmount = computed(() => {
  if (!props.restaurant) {
    return 0;
  }
  return props.restaurant.signatureDishes.reduce((sum, dish) => {
    const quantity = quantities[dish.id] ?? 0;
    return sum + dish.price * quantity;
  }, 0);
});

const totalAmount = computed(() => {
  if (!props.restaurant) {
    return 0;
  }
  return (goodsAmount.value + props.restaurant.deliveryFee).toFixed(2);
});

const canSubmit = computed(() => goodsAmount.value > 0);

const rules: FormRules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
};

const increase = (dish: Restaurant['signatureDishes'][number]) => {
  quantities[dish.id] = (quantities[dish.id] ?? 0) + 1;
};

const decrease = (dishId: string) => {
  const current = quantities[dishId] ?? 0;
  if (current <= 0) {
    return;
  }
  quantities[dishId] = current - 1;
};

const submitOrder = async () => {
  if (!props.restaurant) {
    return;
  }
  if (!formRef.value) {
    return;
  }
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) {
    return;
  }
  const items = props.restaurant.signatureDishes
    .filter((dish) => (quantities[dish.id] ?? 0) > 0)
    .map((dish) => ({
      menuId: dish.id,
      name: dish.name,
      quantity: quantities[dish.id] ?? 0,
      price: dish.price,
      image: dish.image
    }));
  const order = orderStore.createOrder({
    restaurantId: props.restaurant.id,
    restaurantName: props.restaurant.name,
    items,
    goodsAmount: goodsAmount.value,
    deliveryFee: props.restaurant.deliveryFee,
    contact: {
      name: form.name,
      phone: form.phone,
      address: form.address,
      remark: form.remark
    },
    note: form.remark
  });
  Object.keys(quantities).forEach((key) => {
    quantities[key] = 0;
  });
  form.remark = '';
  ElMessage.success('订单已提交，正在为您处理');
  router.push({ name: 'order-detail', params: { id: order.id } });
};
</script>

<style scoped lang="scss">
.detail {
  margin-top: 32px;

  &__grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  &__main {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__aside {
    position: sticky;
    top: 108px;
    align-self: start;
  }
}

.back-button {
  align-self: flex-start;
  color: #ff6d39;
  font-weight: 500;
}

.detail__header {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 16px;
  }
}

.detail__header-info {
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    margin: 0;
    font-size: 26px;
  }

  .summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0;
    color: #666;

    span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }

  .meta {
    margin: 0;
    color: #999;
  }

  .promotions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px;
  }

  &__item {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 12px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h4 {
      margin: 0;
      font-size: 18px;
    }

    .desc {
      margin: 0;
      color: #777;
      font-size: 14px;
      min-height: 40px;
    }

    .sold {
      margin: 0;
      color: #999;
      font-size: 13px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }
}

.actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  .quantity {
    min-width: 24px;
    text-align: center;
    font-weight: 600;
  }
}

.price {
  font-size: 18px;
  color: #ff6d39;
}

.summary p {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 15px;

  span {
    font-weight: 600;
  }
}

.summary .total span {
  color: #ff6d39;
  font-size: 18px;
}

@media (max-width: 1024px) {
  .detail__grid {
    grid-template-columns: 1fr;
  }

  .detail__aside {
    position: static;
  }
}

@media (max-width: 768px) {
  .detail__header {
    grid-template-columns: 1fr;

    img {
      height: 200px;
    }
  }
}
</style>

