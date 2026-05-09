<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="relative">
          <img :src="user.avatar" class="w-10 h-10 rounded-full object-cover" />
          <span :class="['absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-800', user.online ? 'bg-brand-500' : 'bg-gray-300']"></span>
        </div>
        <div>
          <h2 class="text-sm font-bold text-gray-900 dark:text-white font-display">{{ user.name }}</h2>
          <p class="text-xs">
            <span v-if="chatStore.isTyping(user.id)" class="text-brand-500">typing...</span>
            <span v-else-if="user.online" class="text-brand-500">Online</span>
            <span v-else class="text-gray-400">Offline · {{ user.role }}</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesEl"
      class="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50 dark:bg-gray-900/50"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0); background-size: 24px 24px;">

      <template v-for="(group, idx) in groupedMessages" :key="idx">
        <!-- Date separator -->
        <div class="flex items-center gap-3 py-2">
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span class="text-xs text-gray-400 font-medium px-2">{{ group.date }}</span>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <div v-for="msg in group.messages" :key="msg.id"
          :class="['flex animate-slide-in', isMyMessage(msg) ? 'justify-end' : 'justify-start']">

          <!-- Incoming avatar -->
          <img v-if="!isMyMessage(msg)" :src="user.avatar"
            class="w-7 h-7 rounded-full object-cover mr-2 self-end flex-shrink-0" />

          <div :class="['flex flex-col', isMyMessage(msg) ? 'items-end' : 'items-start']">
            <!-- Message bubble -->
            <div :class="isMyMessage(msg) ? 'message-bubble-out' : 'message-bubble-in'">
              {{ msg.text }}
            </div>

            <!-- Timestamp + status -->
            <div class="flex items-center gap-1 mt-0.5 px-1">
              <span class="text-[10px] text-gray-400">{{ formatTime(msg.timestamp) }}</span>
              <span v-if="isMyMessage(msg)">
                <!-- SENDING: clock icon -->
                <svg v-if="msg.status === 'sending'" class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
                </svg>
                <!-- SENT: single gray tick -->
                <svg v-else-if="msg.status === 'sent'" class="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <!-- DELIVERED: double gray tick -->
                <svg v-else-if="msg.status === 'delivered'" class="w-4 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12z"/>
                </svg>
                <!-- READ: double blue tick -->
                <svg v-else-if="msg.status === 'read'" class="w-4 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- Typing indicator -->
      <div v-if="chatStore.isTyping(user.id)" class="flex items-center gap-2 animate-fade-in">
        <img :src="user.avatar" class="w-7 h-7 rounded-full object-cover" />
        <div class="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div class="flex gap-1 items-center">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce-dot dot-1"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce-dot dot-2"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce-dot dot-3"></span>
          </div>
        </div>
      </div>

      <div ref="bottomEl"></div>
    </div>

    <!-- Input area -->
    <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 relative">
      <!-- Emoji picker -->
      <div v-if="showEmoji" class="absolute bottom-20 left-4 z-50" ref="emojiPickerContainer">
        <emoji-picker @emoji-click="onEmojiClick"></emoji-picker>
      </div>

      <div class="flex items-end gap-2">
        <!-- Emoji button -->
        <button @click="toggleEmoji"
          :class="['p-2.5 rounded-xl transition-colors flex-shrink-0', showEmoji ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500']">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>

        <!-- Text input -->
        <div class="flex-1 relative">
          <textarea
            ref="inputEl"
            v-model="inputText"
            @keydown.enter.exact.prevent="handleSend"
            @keydown.enter.shift.exact="() => {}"
            @input="handleTyping"
            @blur="stopTypingIndicator"
            placeholder="Type a message..."
            rows="1"
            class="w-full resize-none px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm max-h-32 overflow-y-auto"
          ></textarea>
        </div>

        <!-- Send button -->
        <button @click="handleSend" :disabled="!inputText.trim()"
          :class="['p-2.5 rounded-xl transition-all flex-shrink-0', inputText.trim() ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm active:scale-95' : 'bg-gray-100 dark:bg-gray-700 text-gray-300 cursor-not-allowed']">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <p class="text-[10px] text-gray-400 mt-1.5 ml-1">Press Enter to send · Shift+Enter for new line</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { format, isToday, isYesterday } from 'date-fns'
import 'emoji-picker-element'

const props = defineProps({
  user: { type: Object, required: true }
})

const authStore = useAuthStore()
const chatStore = useChatStore()

const inputText = ref('')
const messagesEl = ref(null)
const bottomEl = ref(null)
const inputEl = ref(null)
const showEmoji = ref(false)
const emojiPickerContainer = ref(null)

let typingTimeout = null

function isMyMessage(msg) {
  return msg.from === authStore.currentUser?.id
}

const messages = computed(() => chatStore.getMessages(props.user.id))

const groupedMessages = computed(() => {
  const groups = {}
  messages.value.forEach(msg => {
    const d = new Date(msg.timestamp)
    let label
    if (isToday(d)) label = 'Today'
    else if (isYesterday(d)) label = 'Yesterday'
    else label = format(d, 'MMM d, yyyy')
    if (!groups[label]) groups[label] = []
    groups[label].push(msg)
  })
  return Object.entries(groups).map(([date, msgs]) => ({ date, messages: msgs }))
})

function formatTime(ts) {
  return format(new Date(ts), 'HH:mm')
}

async function scrollToBottom() {
  await nextTick()
  bottomEl.value?.scrollIntoView({ behavior: 'smooth' })
}

watch(messages, scrollToBottom, { deep: true })
watch(() => chatStore.isTyping(props.user.id), scrollToBottom)

function handleTyping() {
  if (inputEl.value) {
    inputEl.value.style.height = 'auto'
    inputEl.value.style.height = Math.min(inputEl.value.scrollHeight, 128) + 'px'
  }
  chatStore.setIAmTyping(props.user.id, true)
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(stopTypingIndicator, 3000)
}

function stopTypingIndicator() {
  chatStore.setIAmTyping(props.user.id, false)
  clearTimeout(typingTimeout)
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text) return
  stopTypingIndicator()
  chatStore.sendMessage(props.user.id, text, 'text')
  inputText.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'
  scrollToBottom()
}

function toggleEmoji() {
  showEmoji.value = !showEmoji.value
}

function onEmojiClick(e) {
  inputText.value += e.detail.unicode
  showEmoji.value = false
  inputEl.value?.focus()
}

function handleClickOutside(e) {
  if (showEmoji.value && emojiPickerContainer.value && !emojiPickerContainer.value.contains(e.target)) {
    showEmoji.value = false
  }
}

let pollInterval = null

onMounted(() => {
  chatStore.loadPersistedMessages(props.user.id)
  scrollToBottom()
  document.addEventListener('click', handleClickOutside)
  pollInterval = setInterval(() => chatStore.loadPersistedMessages(props.user.id), 3000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (pollInterval) clearInterval(pollInterval)
  clearTimeout(typingTimeout)
  stopTypingIndicator()
})
</script>
