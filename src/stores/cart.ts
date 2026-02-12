import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import type { OrderItem } from '@/types';

interface CartState {
  restaurantId: string | null;
  restaurantName: string;
  items: OrderItem[];
  note: string;
}

const initialState = (): CartState => ({
  restaurantId: null,
  restaurantName: '',
  items: [],
  note: ''
});

export const useCartStore = defineStore('cart', () => {
  const state = reactive<CartState>(initialState());

  const totalQuantity = computed(() => state.items.reduce((sum, item) => sum + item.quantity, 0));

  const goodsAmount = computed(() => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const resetCart = () => {
    Object.assign(state, initialState());
  };

  const addItem = (payload: OrderItem, restaurantId: string, restaurantName: string) => {
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      resetCart();
    }
    state.restaurantId = restaurantId;
    state.restaurantName = restaurantName;
    const current = state.items.find((item) => item.menuId === payload.menuId);
    if (current) {
      current.quantity += payload.quantity;
    } else {
      state.items.push({ ...payload });
    }
  };

  const removeItem = (menuId: string) => {
    state.items = state.items.filter((item) => item.menuId !== menuId);
    if (state.items.length === 0) {
      resetCart();
    }
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    const target = state.items.find((item) => item.menuId === menuId);
    if (!target) {
      return;
    }
    target.quantity = quantity;
    if (target.quantity <= 0) {
      removeItem(menuId);
    }
  };

  const updateNote = (note: string) => {
    state.note = note;
  };

  return {
    state,
    totalQuantity,
    goodsAmount,
    resetCart,
    addItem,
    removeItem,
    updateQuantity,
    updateNote
  };
});

