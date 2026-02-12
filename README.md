## 美食外卖平台（Vue3 + TypeScript 纯前端）
**毕业设计所有选题地址： https://github.com/Good-Night-Unicorn?tab=repositories**

**完整代码收费可以加QQ：3042127848 咨询接毕业设计论文**

**作者QQ：3042127848 备用q：2777345948 (支持修改、部署调试、支持代做毕设)**

**接网站建设、小程序、H5、APP、各种系统等**

**选题+开题报告+任务书+程序定制+安装调试+论文+答辩ppt都可以做**
**详细视频演示**
# 美食外卖平台（Vue3 + TypeScript 纯前端）

一个基于 Vue3 + TypeScript + Vite + Pinia + Vue Router + Element Plus 的纯前端外卖点餐系统。无后端、无数据库，所有数据均通过本地模拟与 localStorage 持久化，适合学习与演示。

## 1. 技术栈
- 框架：Vue 3（Composition API, `<script setup>`）
- 语言：TypeScript
- 构建：Vite
- 组件库：Element Plus
- 路由：Vue Router 4（带路由守卫与 404 处理）
- 状态：Pinia（用户认证、餐厅筛选、购物车/订单）
- 样式：SCSS（移动端响应式）

## 2. 项目结构
```
├─ src
│  ├─ components
│  │  ├─ assistant/        # AI 助手组件（模拟推荐）
│  │  ├─ layout/           # 页头/页脚
│  │  └─ restaurant/       # 餐厅列表/详情/筛选组件
│  ├─ mock                 # 模拟数据（城市/餐厅/订单）
│  ├─ stores               # Pinia 仓库（user/restaurant/order/cart）
│  ├─ styles               # 全局样式
│  ├─ types                # TS 类型定义
│  ├─ views                # 页面：首页/登录/注册/订单列表/详情/我的订单/404
│  ├─ router               # 路由与守卫
│  ├─ App.vue
│  └─ main.ts
├─ index.html
├─ vite.config.ts
├─ tsconfig*.json
└─ package.json
```

## 3. 启动与构建
要求 Node.js ≥ 14.18（建议 ≥ 16），npm ≥ 8 更佳。

```bash
# 安装依赖
npm install

# 开发启动
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

提示：
- 如果出现 rollup/npm 版本提示，升级 npm 至 8+ 可消除大部分警告：`npm i -g npm@latest`
- Sass 的 legacy API 弃用仅为警告，不影响运行

## 4. 页面与功能
- 首页（餐厅列表）：
  - 城市选择、分类筛选、热门筛选（满减、免配送、到店自取）
  - 排序：综合、评分、销量、距离（以配送时长模拟）
  - 搜索：支持通过头部搜索框传参，实时筛选结果
  - 查看餐厅详情，下单（数量加减、合计金额、表单校验）
- 登录/注册：
  - 纯前端本地认证，账号信息存储在 `localStorage`
  - 注册：用户名/手机号/密码/城市/区域
  - 登录：用户名或手机号 + 密码
- 订单列表：
  - 全部订单查看、状态过滤、状态流转（待确认/制作中/配送中/已送达/已完成/已取消）
- 订单详情：
  - 展示订单商品、金额、配送信息、状态快捷更新
- 我的订单：
  - 当前登录用户的个人订单时间线视图，可“确认收货”
- 404：
  - 未匹配路由的友好提示
- AI 美食助手（模拟）：
  - 悬浮按钮打开对话框，输入“想吃的内容”给出推荐（基于当前筛选/搜索逻辑）

## 5. 数据来源与持久化
- 模拟数据：`src/mock`（城市、餐厅、订单）
- 用户与认证：`localStorage` 键
  - `vd-users`：注册用户列表
  - `vd-auth-token`：登录后的模拟 token
  - `vd-profile`：当前登录用户信息
- 订单：`vd-orders`（初始化时合并内置 mock，再持久化）

## 6. 关键模块说明
### 6.1 路由与守卫
文件：`src/router/index.ts`
- 路由元信息 `meta.requiresAuth` 控制鉴权页面（订单相关页面）
- 未登录访问受限页面时跳转登录，并携带 `redirect` 返回
- 进入路由时设置页面 `title`

### 6.2 餐厅与筛选
文件：`src/stores/restaurant.ts`
- 城市、区域、关键词与筛选条件集中管理
- 支持分类、满减、免配送、到店自取、排序
- `filteredRestaurants` 为最终列表，`recommendedRestaurants` 为“今日推荐”

### 6.3 用户认证
文件：`src/stores/user.ts`
- `register/login/logout/updateCity/updateDistrict`
- 使用 `localStorage` 持久化 token 与 profile

### 6.4 订单
文件：`src/stores/order.ts`
- `createOrder` 负责生成订单编号、计算金额/时间、入库
- `updateStatus` 更新订单状态（到达时写入送达时间）
- 查询：按 id / 餐厅 / 收货人

### 6.5 餐厅详情与下单
组件：`src/components/restaurant/RestaurantDetailPanel.vue`
- 商品数量加减、金额计算、表单校验（收货人/手机号/地址）
- 下单后写入订单并跳转详情

### 6.6 AI 助手（模拟）
组件：`src/components/assistant/AiAssistant.vue`
- 简单消息队列与“延迟回复”
- 回复内容基于 Pinia 的筛选结果，取 Top 3 作为推荐

## 7. 代码规范与最佳实践
- TypeScript + `src/types` 统一声明实体类型
- 组件化与职责单一：页面（views）负责编排，组件（components）负责展示/交互
- Pinia 仅存放可共享业务状态与纯函数式计算
- 路由懒加载与按需拆分（已配置动态 import）
- 样式 BEM 风格，优先使用组件库变量与响应式断点

## 8. 自定义与拓展
- 添加餐厅/菜品：修改 `src/mock/restaurants.ts`
- 自定义城市/区域：修改 `src/mock/restaurants.ts` 中 `cities`
- 更换占位图片：推荐将图片放入 `public/` 并用相对路径引用，避免外链波动
- 若需接入后端：将 `stores` 中的数据读写替换为 API 调用，并移除 `localStorage` 逻辑

## 9. 常见问题
1) 构建体积偏大  
   - 按需引入 Element Plus 组件或手动 `manualChunks` 拆包  
2) Sass 弃用警告  
   - 来自 Dart Sass legacy JS API 的警告，可忽略；升级工具链可消除  
3) npm/rollup 版本提示  
   - 建议升级 npm 至 8+：`npm i -g npm@latest`

## 10. 许可证
本项目用于学习与演示，可自由克隆与二次开发。商业使用请自测并完善真实后端与安全策略。


效果图:
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3bac33dbc7194fb89a9c925393eacfe6.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e468cf61010d4dfc92d6fb6719172cf0.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/54fd4eee3b4b4788a471a9ab55a0a74c.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/edd8c894d80c4153b59427d0a8c7e1c5.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b0db0b1fc8ce48c9b55ba1f5462da00b.png)






