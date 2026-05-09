<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100 dark:bg-brand-900/20 blur-3xl opacity-60"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-100 dark:bg-emerald-900/20 blur-3xl opacity-60"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-brand-500 rounded-2xl mb-4 shadow-lg">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-display">Kigali ChatHub</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Join Kigali's dev community</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white font-display mb-6">Create account</h2>

        <div v-if="error" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input v-model="name" type="text" placeholder="Your name" @keydown.enter="handleRegister"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input v-model="email" type="email" placeholder="you@dev.rw" @keydown.enter="handleRegister"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input v-model="password" type="password" placeholder="••••••••" @keydown.enter="handleRegister"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
            <input v-model="confirm" type="password" placeholder="••••••••" @keydown.enter="handleRegister"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm" />
          </div>

          <button @click="handleRegister" :disabled="loading"
            class="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-150 text-sm shadow-sm hover:shadow-md active:scale-[0.98]">
            <span v-if="!loading">Create account</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Creating account...
            </span>
          </button>
        </div>

        <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <router-link to="/login" class="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  if (!name.value || !email.value || !password.value || !confirm.value) {
    error.value = 'Please fill in all fields.'; return
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'; return
  }
  if (password.value.length < 4) {
    error.value = 'Password must be at least 4 characters.'; return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 700))
  const result = authStore.register(name.value, email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/chat')
  } else {
    error.value = result.error
  }
}
</script>
