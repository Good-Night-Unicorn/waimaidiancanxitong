<template>
  <div class="assistant">
    <transition name="assistant-fade">
      <section v-if="isOpen" class="assistant__panel card">
        <header class="assistant__header">
          <div class="title">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI美食助手</span>
          </div>
          <el-button text type="primary" @click="isOpen = false">
            <el-icon><Close /></el-icon>
          </el-button>
        </header>
        <main class="assistant__body" ref="messageContainer">
          <div v-for="message in messages" :key="message.id" class="message" :class="`message--${message.role}`">
            <div class="message__bubble">
              <p v-for="segment in splitContent(message.content)" :key="segment" v-text="segment" />
            </div>
            <span class="message__time">{{ formatTime(message.createdAt) }}</span>
          </div>
          <el-empty v-if="messages.length === 0" description="你好，我是你的AI助手，可以帮你推荐餐厅～" />
        </main>
        <footer class="assistant__footer">
          <el-input
            v-model="draft"
            placeholder="告诉我们想吃什么..."
            clearable
            :maxlength="80"
            @keyup.enter="handleSend"
          >
            <template #append>
              <el-button type="primary" :loading="isGenerating" @click="handleSend">发送</el-button>
            </template>
          </el-input>
        </footer>
      </section>
    </transition>
    <el-tooltip content="AI助手" placement="left">
      <el-button class="assistant__trigger" type="primary" circle @click="toggle">
        <el-icon><Opportunity /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ChatDotRound, Close, Opportunity } from '@element-plus/icons-vue';
import { useRestaurantStore } from '@/stores/restaurant';
import type { ChatMessage } from '@/types';

const restaurantStore = useRestaurantStore();

const isOpen = ref(false);
const draft = ref('');
const messages = ref<ChatMessage[]>([]);
const isGenerating = ref(false);
const messageContainer = ref<HTMLElement | null>(null);

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const splitContent = (content: string) => content.split('\n');

const recommendations = computed(() => {
  if (!draft.value.trim()) {
    return restaurantStore.recommendedRestaurants;
  }
  return restaurantStore.searchRestaurants(draft.value.trim());
});

const scrollToBottom = () => {
  requestAnimationFrame(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

watch(
  () => messages.value.length,
  () => scrollToBottom()
);

const appendMessage = (payload: Omit<ChatMessage, 'id' | 'createdAt'>) => {
  messages.value.push({
    id: Math.random().toString(36).slice(2),
    createdAt: Date.now(),
    ...payload
  });
};

const buildAssistantReply = () => {
  if (recommendations.value.length === 0) {
    return '根据您的需求，暂时没有找到合适的餐厅，试试换个关键词吧～';
  }
  const lines = recommendations.value.slice(0, 3).map(
    (restaurant, index) =>
      `${index + 1}. ${restaurant.name} - ${restaurant.rating.toFixed(1)}分，月售${restaurant.monthlySales}单，${restaurant.deliveryTime}分钟送达`
  );
  return `根据您的需求「${draft.value || '美食推荐'}」，我为您推荐以下餐厅：\n${lines.join('\n')}\n点击下方按钮查看详情，或继续告诉我您的需求。`;
};

const handleSend = () => {
  const content = draft.value.trim();
  if (!content) {
    return;
  }
  appendMessage({ role: 'user', content });
  draft.value = '';
  isGenerating.value = true;
  setTimeout(() => {
    appendMessage({ role: 'assistant', content: buildAssistantReply() });
    isGenerating.value = false;
  }, 620);
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

onMounted(() => {
  appendMessage({
    role: 'assistant',
    content: '你好！我是你的AI助手，可以帮你推荐餐厅。请告诉我你想吃什么？'
  });
});
</script>

<style scoped lang="scss">
.assistant {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;

  &__panel {
    width: min(340px, 88vw);
    height: 440px;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }

  &__header {
    padding: 16px 20px;
    background: linear-gradient(90deg, #ff8a5d, #ff6d39);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
    }

    :deep(.el-button) {
      color: #fff;
    }
  }

  &__body {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
    background: #fffaf7;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__footer {
    padding: 16px 20px 20px;
    background: #fff;
    border-top: 1px solid rgba(255, 109, 57, 0.16);
  }

  &__trigger {
    width: 56px;
    height: 56px;
    font-size: 24px;
    box-shadow: 0 18px 30px rgba(255, 109, 57, 0.35);
  }
}

.message {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &--user {
    align-self: flex-end;

    .message__bubble {
      background: #fff;
      border: 1px solid rgba(255, 109, 57, 0.4);
      color: #333;
      border-radius: 18px 2px 16px 18px;
    }

    .message__time {
      text-align: right;
    }
  }

  &--assistant {
    align-self: flex-start;

    .message__bubble {
      background: rgba(255, 109, 57, 0.08);
      border-radius: 2px 18px 18px 18px;
      color: #333;
    }
  }

  &__bubble {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.6;
    max-width: 240px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__time {
    font-size: 12px;
    color: #999;
  }
}

.assistant-fade-enter-from,
.assistant-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.assistant-fade-enter-active,
.assistant-fade-leave-active {
  transition: all 0.2s ease;
}

@media (max-width: 680px) {
  .assistant {
    right: 16px;
    bottom: 16px;

    &__trigger {
      width: 48px;
      height: 48px;
    }
  }
}
</style>

