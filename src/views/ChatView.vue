<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar overlay on mobile -->
    <div v-if="showSidebar && isMobile" @click="showSidebar = false"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"></div>

    <!-- Sidebar -->
    <aside :class="[
      'flex-shrink-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 transition-transform duration-300',
      'lg:relative lg:translate-x-0',
      isMobile ? 'fixed inset-y-0 left-0' : '',
      isMobile && !showSidebar ? '-translate-x-full' : 'translate-x-0'
    ]">
      <!-- Sidebar header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span class="font-bold text-gray-900 dark:text-white font-display text-lg">ChatHub</span>
        </div>
        <div class="flex items-center gap-1">
          <button @click="themeStore.toggle()" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
            <svg v-if="!themeStore.isDark" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>
          </button>
          <button @click="handleLogout" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Logout">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>

      <!-- Current user info -->
      <div class="px-5 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/80">
        <div class="relative">
          <img :src="authStore.currentUser?.avatar" class="w-9 h-9 rounded-full object-cover ring-2 ring-brand-400" />
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-white truncate font-display">{{ authStore.currentUser?.name }}</p>
          <p class="text-xs text-gray-400 truncate">{{ authStore.currentUser?.email }}</p>
        </div>
      </div>

      <!-- Search -->
      <div class="px-4 py-3 flex-shrink-0">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" type="text" placeholder="Search contacts..."
            class="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-600 transition" />
        </div>
      </div>

      <!-- User list -->
      <div class="flex-1 overflow-y-auto">
        <div class="px-4 py-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contacts ({{ filteredUsers.length }})</p>
        </div>
        <div v-for="user in filteredUsers" :key="user.id"
          @click="selectUser(user)"
          :class="[
            'flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 mx-2 rounded-xl mb-0.5',
            chatStore.activeUserId === user.id
              ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          ]">
          <div class="relative flex-shrink-0">
            <img :src="user.avatar" class="w-11 h-11 rounded-full object-cover" />
            <span :class="['absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800', user.online ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600']"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate font-display">{{ user.name }}</p>
              <span v-if="lastMsgTime(user.id)" class="text-xs text-gray-400 flex-shrink-0 ml-1">{{ lastMsgTime(user.id) }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                <span v-if="chatStore.isTyping(user.id)" class="text-brand-500 italic">typing...</span>
                <span v-else-if="chatStore.getLastMessage(user.id)">
                  <span v-if="chatStore.getLastMessage(user.id).from === authStore.currentUser?.id" class="text-brand-500">You: </span>
                  {{ chatStore.getLastMessage(user.id).text }}
                </span>
                <span v-else class="text-gray-400 italic">{{ user.role }}</span>
              </p>
              <span v-if="chatStore.getUnread(user.id) > 0"
                class="ml-1 flex-shrink-0 min-w-[18px] h-[18px] bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-semibold px-1">
                {{ chatStore.getUnread(user.id) > 9 ? '9+' : chatStore.getUnread(user.id) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="px-6 py-8 text-center">
          <p class="text-sm text-gray-400">No contacts found</p>
        </div>
      </div>
    </aside>

    <!-- Main chat area -->
    <main class="flex-1 flex flex-col min-w-0 relative">
      <!-- Mobile header -->
      <div v-if="isMobile" class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button @click="showSidebar = true" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <span class="font-bold text-gray-900 dark:text-white font-display">ChatHub</span>
      </div>

      <!-- Chat window or empty state -->
      <ChatWindow v-if="selectedUser" :user="selectedUser" />

      <!-- Empty state -->
      <div v-else class="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white font-display mb-2">Kigali ChatHub</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Select a contact from the sidebar to start chatting with Kigali's dev community.</p>
        <button v-if="isMobile" @click="showSidebar = true" class="mt-4 px-5 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl">
          Open contacts
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { useThemeStore } from '@/stores/theme'
import ChatWindow from '@/components/ChatWindow.vue'
import { format } from 'date-fns'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const themeStore = useThemeStore()

const search = ref('')
const showSidebar = ref(false)
const isMobile = ref(window.innerWidth < 1024)
const selectedUser = ref(null)

const otherUsers = computed(() =>
  authStore.registeredUsers.filter(u => u.id !== authStore.currentUser?.id)
)

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return otherUsers.value
  return otherUsers.value.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

function selectUser(user) {
  selectedUser.value = user
  chatStore.setActiveUser(user.id)
  chatStore.loadPersistedMessages(user.id)
  if (isMobile.value) showSidebar.value = false
}

function lastMsgTime(userId) {
  const msg = chatStore.getLastMessage(userId)
  if (!msg) return null
  return format(new Date(msg.timestamp), 'HH:mm')
}

function handleLogout() {
  chatStore.setActiveUser(null)
  selectedUser.value = null
  authStore.logout()
  router.push('/login')
}

// Online status toggling simulation
let onlineInterval = null
function startOnlineSimulation() {
  onlineInterval = setInterval(() => {
    authStore.registeredUsers.forEach(u => {
      if (u.id !== authStore.currentUser?.id && Math.random() < 0.2) {
        u.online = !u.online
      }
    })
  }, 15000)
}

// Handle resize
function handleResize() {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) showSidebar.value = false
}

onMounted(() => {
  chatStore.loadAllPersistedConversations()
  startOnlineSimulation()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (onlineInterval) clearInterval(onlineInterval)
  window.removeEventListener('resize', handleResize)
})
</script>
