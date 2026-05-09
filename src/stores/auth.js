import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PRESET_USERS } from '@/data/users'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const registeredUsers = ref([...PRESET_USERS])

  // Restore from localStorage on init
  const saved = localStorage.getItem('kigali_auth_user')
  if (saved) {
    try {
      currentUser.value = JSON.parse(saved)
    } catch {}
  }
  const savedRegistered = localStorage.getItem('kigali_registered_users')
  if (savedRegistered) {
    try {
      const extra = JSON.parse(savedRegistered)
      // Merge without duplicates
      extra.forEach(u => {
        if (!registeredUsers.value.find(r => r.email === u.email)) {
          registeredUsers.value.push(u)
        }
      })
    } catch {}
  }

  const isLoggedIn = computed(() => !!currentUser.value)

  function login(email, password) {
    const user = registeredUsers.value.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return { success: false, error: 'Invalid email or password.' }
    currentUser.value = { ...user }
    localStorage.setItem('kigali_auth_user', JSON.stringify(currentUser.value))
    return { success: true }
  }

  function register(name, email, password) {
    if (registeredUsers.value.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered.' }
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      avatar: `https://i.pravatar.cc/80?u=${email}`,
      role: 'Developer',
      online: true,
    }
    registeredUsers.value.push(newUser)
    // Persist extra registered users
    const extras = registeredUsers.value.filter(u => !PRESET_USERS.find(p => p.email === u.email))
    localStorage.setItem('kigali_registered_users', JSON.stringify(extras))
    currentUser.value = { ...newUser }
    localStorage.setItem('kigali_auth_user', JSON.stringify(currentUser.value))
    return { success: true }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('kigali_auth_user')
  }

  return { currentUser, registeredUsers, isLoggedIn, login, register, logout }
})
