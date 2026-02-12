<template>
  <div class="auth">
    <div class="auth__illustration">
      <img src="https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=900&q=80" alt="注册" />
    </div>
    <div class="auth__panel card">
      <h1>创建账号</h1>
      <p class="tagline">注册成为会员，享受专属优惠与一键下单体验。</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item label="常用城市" prop="city">
          <el-select v-model="form.city" placeholder="请选择所在城市">
            <el-option v-for="city in cities" :key="city.value" :label="city.label" :value="city.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="常住区域" prop="district">
          <el-select v-model="form.district" placeholder="请选择所在区域">
            <el-option v-for="district in districts" :key="district" :label="district" :value="district" />
          </el-select>
        </el-form-item>
        <el-button type="primary" size="large" block :loading="loading" @click="handleSubmit">注册</el-button>
      </el-form>
      <p class="actions">
        已经有账号？
        <el-button link type="primary" @click="router.push({ name: 'login' })">立即登录</el-button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRestaurantStore } from '@/stores/restaurant';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const restaurantStore = useRestaurantStore();
const userStore = useUserStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  city: restaurantStore.state.city,
  district: restaurantStore.state.district
});

const cities = computed(() => restaurantStore.cityOptions);
const districts = computed(() => cities.value.find((item) => item.value === form.city)?.districts ?? []);

watch(
  () => form.city,
  () => {
    if (!districts.value.includes(form.district)) {
      form.district = '';
    }
  }
);

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '用户名长度为2-16个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  city: [{ required: true, message: '请选择所在城市', trigger: 'change' }],
  district: [{ required: true, message: '请选择所在区域', trigger: 'change' }]
};

const handleSubmit = async () => {
  if (!formRef.value) {
    return;
  }
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) {
    return;
  }
  loading.value = true;
  try {
    userStore.register({
      username: form.username,
      phone: form.phone,
      password: form.password,
      city: form.city,
      district: form.district
    });
    restaurantStore.updateCity(form.city);
    restaurantStore.updateDistrict(form.district);
    router.push({ name: 'login' });
  } catch (error) {
    ElMessage.error((error as Error).message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.auth {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;
  align-items: center;
  min-height: calc(100vh - 220px);

  &__illustration {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      border-radius: 32px;
      box-shadow: 0 20px 50px rgba(15, 35, 95, 0.16);
    }
  }

  &__panel {
    max-width: 460px;
    justify-self: center;

    h1 {
      margin-top: 0;
      color: #ff6d39;
      font-size: 32px;
    }

    .tagline {
      margin-bottom: 24px;
      color: #666;
    }

    .actions {
      margin-top: 16px;
      color: #666;
      text-align: center;
    }
  }
}

@media (max-width: 900px) {
  .auth {
    grid-template-columns: 1fr;
    gap: 32px;

    &__illustration {
      order: 2;
    }
  }
}
</style>

