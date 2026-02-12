import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { mockOrders } from '@/mock/orders';
import type { ContactInfo, Order, OrderItem } from '@/types';

interface OrderState {
  orders: Order[];
}

const STORAGE_KEY = 'vd-orders';

const readOrders = (): Order[] => {
  try {
    const cache = localStorage.getItem(STORAGE_KEY);
    if (cache) {
      return JSON.parse(cache) as Order[];
    }
  } catch (error) {
    console.warn(error);
  }
  return mockOrders;
};

const writeOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const useOrderStore = defineStore('order', () => {
  const state = reactive<OrderState>({
    orders: readOrders()
  });

  const sortedOrders = computed(() => [...state.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));

  const getOrderById = (orderId: string) => state.orders.find((item) => item.id === orderId) ?? null;

  const getOrdersByRestaurant = (restaurantId: string) =>
    state.orders.filter((item) => item.restaurantId === restaurantId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const getOrdersByContact = (name: string) => state.orders.filter((item) => item.contact.name === name);

  const generateOrderId = () => {
    const now = new Date();
    const stamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 9000 + 1000);
    return `O${stamp}${random}`;
  };

  const createOrder = (payload: {
    restaurantId: string;
    restaurantName: string;
    items: OrderItem[];
    goodsAmount: number;
    deliveryFee: number;
    contact: ContactInfo;
    note?: string;
  }) => {
    const order: Order = {
      id: generateOrderId(),
      restaurantId: payload.restaurantId,
      restaurantName: payload.restaurantName,
      status: 'pending',
      items: payload.items,
      totalAmount: payload.goodsAmount + payload.deliveryFee,
      deliveryFee: payload.deliveryFee,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      contact: payload.contact,
      note: payload.note
    };
    state.orders.unshift(order);
    writeOrders(state.orders);
    return order;
  };

  const updateStatus = (orderId: string, status: Order['status']) => {
    const target = getOrderById(orderId);
    if (!target) {
      return;
    }
    target.status = status;
    if (status === 'delivered') {
      target.deliveredAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    }
    writeOrders(state.orders);
  };

  return {
    state,
    sortedOrders,
    createOrder,
    updateStatus,
    getOrderById,
    getOrdersByRestaurant,
    getOrdersByContact
  };
});

