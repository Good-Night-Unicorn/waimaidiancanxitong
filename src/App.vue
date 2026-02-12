<template>
  <div class="layout">
    <app-header />
    <main class="main-view">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    <app-footer />
    <ai-assistant />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import AiAssistant from '@/components/assistant/AiAssistant.vue';
</script>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdfbfa 0%, #f4f7fb 100%);
  display: flex;
  flex-direction: column;
}

.main-view {
  flex: 1;
  padding: 32px 0 48px;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.28s ease-in-out;
}

@media (max-width: 768px) {
  .main-view {
    padding: 16px 0 80px;
  }
}
</style>

