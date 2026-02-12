import type { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'O202405150001',
    restaurantId: 'r1',
    restaurantName: '蜀香园川菜馆',
    status: 'completed',
    items: [
      { menuId: 'm1', name: '招牌菜品1', quantity: 2, price: 38, image: 'https://picsum.photos/seed/dish-m1/300/200' },
      { menuId: 'm2', name: '招牌菜品2', quantity: 1, price: 28, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=300&q=80' }
    ],
    totalAmount: 104,
    deliveryFee: 5,
    createdAt: '2024-05-15 12:30:00',
    deliveredAt: '2024-05-15 13:05:00',
    contact: {
      name: '张三',
      phone: '13800138000',
      address: '上海市黄浦区南京路100号',
      remark: '有特殊需求请告诉我们'
    },
    note: '不要太辣'
  },
  {
    id: 'O202405160021',
    restaurantId: 'r3',
    restaurantName: '北海渔港',
    status: 'delivered',
    items: [
      { menuId: 'm5', name: '招牌菜品5', quantity: 1, price: 68, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80' },
      { menuId: 'm6', name: '招牌菜品6', quantity: 2, price: 56, image: 'https://images.unsplash.com/photo-1579055932018-638c8ae085b9?auto=format&fit=crop&w=300&q=80' }
    ],
    totalAmount: 180,
    deliveryFee: 8,
    createdAt: '2024-05-16 18:20:00',
    deliveredAt: '2024-05-16 19:05:00',
    contact: {
      name: '李四',
      phone: '13900139000',
      address: '上海市浦东新区陆家嘴金融街16号'
    },
    note: '海鲜要保鲜'
  },
  {
    id: 'O202405170045',
    restaurantId: 'r4',
    restaurantName: '东北饺子馆',
    status: 'preparing',
    items: [
      { menuId: 'm7', name: '三鲜水饺', quantity: 3, price: 26, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479a?auto=format&fit=crop&w=300&q=80' },
      { menuId: 'm8', name: '锅包肉', quantity: 1, price: 32, image: 'https://images.unsplash.com/photo-1606117333648-a2998fd0676e?auto=format&fit=crop&w=300&q=80' }
    ],
    totalAmount: 110,
    deliveryFee: 4,
    createdAt: '2024-05-17 21:10:00',
    contact: {
      name: '王五',
      phone: '13700137000',
      address: '上海市静安区江宁路288号'
    }
  }
];

