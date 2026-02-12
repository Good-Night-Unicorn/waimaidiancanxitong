import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import type { AuthState, UserProfile } from '@/types';

interface Credentials {
  username: string;
  phone: string;
  password: string;
  city: string;
  district: string;
}

const STORAGE_KEY = 'vd-users';
const TOKEN_KEY = 'vd-auth-token';
const PROFILE_KEY = 'vd-profile';

const readUsers = (): Credentials[] => {
  try {
    const cache = localStorage.getItem(STORAGE_KEY);
    return cache ? (JSON.parse(cache) as Credentials[]) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeUsers = (users: Credentials[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const persistAuthState = (state: AuthState) => {
  if (state.token) {
    localStorage.setItem(TOKEN_KEY, state.token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  if (state.profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
  } else {
    localStorage.removeItem(PROFILE_KEY);
  }
};

const getInitialState = (): AuthState => {
  const token = localStorage.getItem(TOKEN_KEY);
  const profileCache = localStorage.getItem(PROFILE_KEY);
  return {
    isAuthenticated: Boolean(token && profileCache),
    token,
    profile: profileCache ? (JSON.parse(profileCache) as UserProfile) : null
  };
};

export const useUserStore = defineStore('user', {
  state: (): AuthState => getInitialState(),
  getters: {
    username: (state) => state.profile?.username ?? '',
    city: (state) => state.profile?.city ?? 'shanghai',
    district: (state) => state.profile?.district ?? ''
  },
  actions: {
    register(payload: Credentials) {
      const users = readUsers();
      const exists = users.some((item) => item.phone === payload.phone || item.username === payload.username);
      if (exists) {
        throw new Error('账号已存在，请直接登录');
      }
      users.push(payload);
      writeUsers(users);
      ElMessage.success('注册成功，请登录');
    },
    login({ username, password }: { username: string; password: string }) {
      const users = readUsers();
      const matched = users.find((item) => (item.username === username || item.phone === username) && item.password === password);
      if (!matched) {
        throw new Error('账号或密码错误');
      }
      this.isAuthenticated = true;
      this.token = `${matched.username}-${Date.now()}`;
      this.profile = {
        username: matched.username,
        city: matched.city,
        district: matched.district
      };
      persistAuthState(this.$state);
    },
    logout() {
      this.isAuthenticated = false;
      this.token = null;
      this.profile = null;
      persistAuthState(this.$state);
    },
    updateCity(city: string) {
      if (!this.profile) {
        return;
      }
      this.profile = { ...this.profile, city };
      persistAuthState(this.$state);
    },
    updateDistrict(district: string) {
      if (!this.profile) {
        return;
      }
      this.profile = { ...this.profile, district };
      persistAuthState(this.$state);
    }
  }
});

