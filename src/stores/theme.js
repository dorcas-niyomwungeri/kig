import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const saved = localStorage.getItem('kigali_theme')
  const isDark = ref(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)

  watch(isDark, val => {
    localStorage.setItem('kigali_theme', val ? 'dark' : 'light')
  })

  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
})
