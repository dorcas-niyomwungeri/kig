import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { useToastStore } from './toast'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  // conversations keyed by OTHER user's id
  const conversations = ref({})
  const activeUserId = ref(null)

  function ensureConversation(userId) {
    if (!conversations.value[userId]) {
      conversations.value[userId] = {
        messages: [],
        // these flags mean: IS the other person doing this action right now?
        theyAreTyping: false,
        theyAreRecording: false,
        unread: 0
      }
    }
  }

  // ── Send a message ────────────────────────────────────────────
  function sendMessage(toUserId, text, type = 'text', meta = {}) {
    ensureConversation(toUserId)
    const msg = {
      id: Date.now(),
      from: authStore.currentUser.id,
      to: toUserId,
      text,
      type,
      timestamp: new Date(),
      status: 'sending',
      read: false,
      ...meta
    }
    conversations.value[toUserId].messages.push(msg)
    persistMessages(toUserId)

    // Simulate status progression: sending → sent → delivered
    setTimeout(() => {
      const m = conversations.value[toUserId]?.messages.find(x => x.id === msg.id)
      if (m) { m.status = 'sent'; persistMessages(toUserId) }
    }, 400)
    setTimeout(() => {
      const m = conversations.value[toUserId]?.messages.find(x => x.id === msg.id)
      if (m) { m.status = 'delivered'; persistMessages(toUserId) }
    }, 1200)

    return msg
  }

  // ── Typing indicator: "I am typing to userId" ─────────────────
  // This sets a flag in localStorage that the OTHER user reads
  function setIAmTyping(toUserId, value) {
    const myId = authStore.currentUser?.id
    if (!myId) return
    const key = getConversationKey(myId, toUserId)
    // Key format: typing_<convKey>_by_<myId>
    localStorage.setItem(`typing_${key}_by_${myId}`, value ? '1' : '0')
  }

  // ── Voice recording: "I am recording to userId" ───────────────
  function setIAmRecording(toUserId, value) {
    const myId = authStore.currentUser?.id
    if (!myId) return
    const key = getConversationKey(myId, toUserId)
    localStorage.setItem(`recording_${key}_by_${myId}`, value ? '1' : '0')
  }

  // ── Read from the OTHER user's perspective ────────────────────
  function isTyping(userId) {
    // Is the other user (userId) typing to ME?
    return conversations.value[userId]?.theyAreTyping || false
  }

  function isRecordingVoice(userId) {
    // Is the other user (userId) recording to ME?
    return conversations.value[userId]?.theyAreRecording || false
  }

  function setActiveUser(userId) {
    activeUserId.value = userId
    if (userId && conversations.value[userId]) {
      conversations.value[userId].unread = 0
      conversations.value[userId].messages.forEach(m => {
        if (m.from === userId) {
          m.read = true
          m.status = 'read'
        }
      })
      persistMessages(userId)
    }
  }

  function getMessages(userId) {
    return conversations.value[userId]?.messages || []
  }

  function getUnread(userId) {
    return conversations.value[userId]?.unread || 0
  }

  function getLastMessage(userId) {
    const msgs = conversations.value[userId]?.messages
    if (!msgs || msgs.length === 0) return null
    return msgs[msgs.length - 1]
  }

  function totalUnread() {
    return Object.values(conversations.value).reduce((s, c) => s + (c.unread || 0), 0)
  }

  function getConversationKey(id1, id2) {
    return [String(id1), String(id2)].sort().join('_')
  }

  function persistMessages(userId) {
    const myId = authStore.currentUser?.id
    if (!myId) return
    const key = getConversationKey(myId, userId)
    try {
      // Don't store blob URLs (they don't survive across tabs)
      const msgs = (conversations.value[userId]?.messages || []).map(m => {
        if (m.type === 'voice' && m.text && m.text.startsWith('blob:')) {
          return { ...m, text: 'voice_sim' }
        }
        return m
      })
      localStorage.setItem(`chat_${key}`, JSON.stringify(msgs))
    } catch {}
  }

  function loadPersistedMessages(userId) {
    const myId = authStore.currentUser?.id
    if (!myId) return
    const key = getConversationKey(myId, userId)

    try {
      // Load messages
      const stored = localStorage.getItem(`chat_${key}`)
      if (stored) {
        const msgs = JSON.parse(stored)
        ensureConversation(userId)
        const existingIds = new Set(conversations.value[userId].messages.map(m => m.id))
        const newMsgs = msgs.filter(m => !existingIds.has(m.id))
        newMsgs.forEach(m => { m.timestamp = new Date(m.timestamp) })
        conversations.value[userId].messages.push(...newMsgs)
        conversations.value[userId].messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        // Sync status updates (e.g. read receipts set by other user)
        msgs.forEach(stored => {
          const local = conversations.value[userId].messages.find(m => m.id === stored.id)
          if (local && stored.status) local.status = stored.status
          if (local && stored.read !== undefined) local.read = stored.read
        })

        if (activeUserId.value !== userId) {
          conversations.value[userId].unread = conversations.value[userId].messages.filter(
            m => m.from === userId && !m.read
          ).length
        }
      }

      // Read THEIR typing flag (they wrote it, I read it)
      const theirTypingKey = `typing_${key}_by_${userId}`
      const theirTyping = localStorage.getItem(theirTypingKey)
      ensureConversation(userId)
      conversations.value[userId].theyAreTyping = theirTyping === '1'

      // Read THEIR recording flag
      const theirRecordingKey = `recording_${key}_by_${userId}`
      const theirRecording = localStorage.getItem(theirRecordingKey)
      conversations.value[userId].theyAreRecording = theirRecording === '1'

    } catch {}
  }

  function loadAllPersistedConversations() {
    const myId = authStore.currentUser?.id
    if (!myId) return
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('chat_')) {
        const parts = k.replace('chat_', '').split('_')
        if (parts.includes(String(myId))) {
          const otherId = parts.find(p => p !== String(myId))
          if (otherId) loadPersistedMessages(otherId)
        }
      }
    }
  }

  return {
    conversations,
    activeUserId,
    sendMessage,
    setIAmTyping,
    setIAmRecording,
    isTyping,
    isRecordingVoice,
    setActiveUser,
    getMessages,
    getUnread,
    getLastMessage,
    totalUnread,
    loadPersistedMessages,
    loadAllPersistedConversations,
    persistMessages,
    ensureConversation,
  }
})
