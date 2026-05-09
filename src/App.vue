<template>
  <div :class="['h-full font-body', themeStore.isDark ? 'dark' : '']">
    <div class="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <router-view />
      <!-- Toast Notifications -->
      <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <transition-group name="toast">
          <div
            v-for="toast in toastStore.toasts"
            :key="toast.id"
            class="pointer-events-auto flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 min-w-[260px] max-w-xs animate-slide-in"
          >
            <img :src="toast.avatar" class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-900 dark:text-white truncate font-display">{{ toast.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ toast.message }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import { useToastStore } from '@/stores/toast'

const themeStore = useThemeStore()
const toastStore = useToastStore()
</script>

<style>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
