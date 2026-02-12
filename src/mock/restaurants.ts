import type { CityOption, Restaurant } from '@/types';

export const cities: CityOption[] = [
  {
    label: '上海市',
    value: 'shanghai',
    districts: ['黄浦区', '徐汇区', '浦东新区', '长宁区', '静安区']
  },
  {
    label: '北京市',
    value: 'beijing',
    districts: ['朝阳区', '海淀区', '东城区', '西城区', '丰台区']
  },
  {
    label: '广州市',
    value: 'guangzhou',
    districts: ['天河区', '越秀区', '荔湾区', '海珠区', '番禺区']
  }
];

export const restaurantCategories = [
  { label: '美食', icon: 'dish' },
  { label: '快餐便当', icon: 'takeaway-box' },
  { label: '甜点饮品', icon: 'ice-cream' },
  { label: '生鲜果蔬', icon: 'goblet' },
  { label: '早餐', icon: 'coffee' },
  { label: '午餐', icon: 'knife-fork' },
  { label: '晚餐', icon: 'chicken' },
  { label: '夜宵', icon: 'moon' }
];

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: '蜀香园川菜馆',
    cover: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=900&q=80',
    categories: ['美食', '晚餐', '川菜'],
    rating: 4.8,
    monthlySales: 2580,
    deliveryTime: 28,
    startingFee: 15,
    deliveryFee: 5,
    promotions: [
      { label: '满100减20', type: 'warning' },
      { label: '新用户优惠', type: 'danger' }
    ],
    signatureDishes: [
      {
        id: 'm1',
        name: '招牌菜品1',
        price: 38,
        image: 'https://picsum.photos/seed/dish-m1/600/400',
        description: '经典麻辣口味，香气四溢，回味无穷',
        soldMonthly: 820
      },
      {
        id: 'm2',
        name: '招牌菜品2',
        price: 28,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
        description: '酸辣爽口，开胃小菜',
        soldMonthly: 540
      }
    ],
    address: '上海市黄浦区新天地路88号',
    city: 'shanghai',
    district: '黄浦区',
    businessHours: '10:00 - 22:00'
  },
  {
    id: 'r2',
    name: '江浙小馆',
    cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
    categories: ['美食', '午餐', '江浙菜'],
    rating: 4.9,
    monthlySales: 2180,
    deliveryTime: 30,
    startingFee: 0,
    deliveryFee: 6,
    promotions: [
      { label: '满80减15', type: 'success' },
      { label: '双人套餐优惠', type: 'danger' }
    ],
    signatureDishes: [
      {
        id: 'm3',
        name: '招牌菜品3',
        price: 48,
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=600&q=80',
        description: '江南经典红烧肉，入口即化',
        soldMonthly: 620
      },
      {
        id: 'm4',
        name: '招牌菜品4',
        price: 32,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
        description: '鲜美笋干焖鸡，营养丰富',
        soldMonthly: 410
      }
    ],
    address: '上海市徐汇区淮海中路688号',
    city: 'shanghai',
    district: '徐汇区',
    businessHours: '09:00 - 21:30'
  },
  {
    id: 'r3',
    name: '北海渔港',
    cover: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80',
    categories: ['美食', '海鲜', '晚餐'],
    rating: 4.7,
    monthlySales: 2180,
    deliveryTime: 32,
    startingFee: 25,
    deliveryFee: 8,
    promotions: [
      { label: '满200减40', type: 'warning' },
      { label: '双人豪华套餐', type: 'danger' }
    ],
    signatureDishes: [
      {
        id: 'm5',
        name: '招牌菜品5',
        price: 68,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        description: '新鲜海捕大虾，蒜蓉蒸制',
        soldMonthly: 530
      },
      {
        id: 'm6',
        name: '招牌菜品6',
        price: 56,
        image: 'https://images.unsplash.com/photo-1579055932018-638c8ae085b9?auto=format&fit=crop&w=600&q=80',
        description: '香辣蟹钳，肉质饱满',
        soldMonthly: 480
      }
    ],
    address: '上海市浦东新区滨江大道168号',
    city: 'shanghai',
    district: '浦东新区',
    businessHours: '11:00 - 23:00'
  },
  {
    id: 'r4',
    name: '东北饺子馆',
    cover: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80',
    categories: ['美食', '夜宵', '东北菜'],
    rating: 4.7,
    monthlySales: 2850,
    deliveryTime: 20,
    startingFee: 0,
    deliveryFee: 4,
    promotions: [
      { label: '满70减15', type: 'warning' },
      { label: '第二份半价', type: 'danger' }
    ],
    signatureDishes: [
      {
        id: 'm7',
        name: '三鲜水饺',
        price: 26,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479a?auto=format&fit=crop&w=600&q=80',
        description: '手工包制，皮薄馅大',
        soldMonthly: 980
      },
      {
        id: 'm8',
        name: '锅包肉',
        price: 32,
        image: 'https://images.unsplash.com/photo-1606117333648-a2998fd0676e?auto=format&fit=crop&w=600&q=80',
        description: '酸甜可口，金黄酥脆',
        soldMonthly: 860
      }
    ],
    address: '上海市静安区共和新路288号',
    city: 'shanghai',
    district: '静安区',
    businessHours: '10:30 - 24:00'
  }
];

