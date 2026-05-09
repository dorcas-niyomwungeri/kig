<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100 dark:bg-brand-900/20 blur-3xl opacity-60"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-100 dark:bg-emerald-900/20 blur-3xl opacity-60"></div>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-brand-500 rounded-2xl mb-4 shadow-lg">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-display">Kigali ChatHub</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Connect with Kigali's dev community</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white font-display mb-6">Sign in</h2>

        <div v-if="error" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@dev.rw"
              @keydown.enter="handleLogin"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                @keydown.enter="handleLogin"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm pr-10"
              />
              <button @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!showPass" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              </button>
            </div>
          </div>

          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-150 text-sm shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <span v-if="!loading">Sign in</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Signing in...
            </span>
          </button>
        </div>

        <!-- Demo accounts -->
        <div class="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Demo accounts (password: pass123)</p>
          <div class="space-y-1">
            <button v-for="demo in demoAccounts" :key="demo.email"
              @click="email = demo.email; password = 'pass123'"
              class="block w-full text-left text-xs text-brand-600 dark:text-brand-400 hover:underline font-mono py-0.5"
            >{{ demo.email }}</button>
          </div>
        </div>

        <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          No account?
          <router-link to="/register" class="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Create one</router-link>
        </p>
      </div>

      <!-- Theme toggle -->
      <div class="flex justify-center mt-4">
        <button @click="themeStore.toggle()" class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1.5 transition-colors">
          <svg v-if="!themeStore.isDark" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
          <svg v-else class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>
          {{ themeStore.isDark ? 'Light mode' : 'Dark mode' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPass = ref(false)

const demoAccounts = [
  { email: 'amara@dev.rw' },
  { email: 'keza@dev.rw' },
  { email: 'dev1@dev.rw' },
]

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  const result = authStore.login(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/chat')
  } else {
    error.value = result.error
  }
}
</script>
