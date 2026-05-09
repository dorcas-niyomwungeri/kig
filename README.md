# 🌍 Kigali ChatHub

A modern real-time chat application for Kigali's tech community, built with Vue 3, Pinia, Tailwind CSS, and Vue Router.

## 🚀 Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Then open http://localhost:5173 in your browser.

---

## ✨ Features

### Authentication
- **Login / Register** pages with full validation
- **12 preset accounts** (email: `name@dev.rw`, password: `pass123`)
- Registration creates new accounts stored in localStorage
- **Route guards** protect `/chat` from unauthenticated users

### Real Messaging (Cross-Account)
- **Send a message** as User A → **Login as User B** → **receive that message**
- Messages are persisted in localStorage keyed by conversation pair
- No AI auto-responses — all messages are from real human users
- New messages are polled every 3 seconds automatically

### Chat UI
- Message bubbles: **green (outgoing)** / **white (incoming)**
- **Timestamps** with date-fns formatting (Today / Yesterday / date)
- **Double-tick read receipts** (blue = read, gray = delivered)
- **Typing indicator** (animated dots)
- **Emoji picker** (emoji-picker-element)
- Auto-scroll to latest message

### Contact Sidebar
- All registered users listed with avatars
- **Online/offline status** dots (green = online)
- **Last message preview** with sender prefix
- **Unread count badges**
- **Search contacts** by name or email

### UX & Design
- **Dark / Light mode** toggle (persisted in localStorage)
- **Responsive mobile-first** layout (sidebar collapses on small screens)
- **Toast notifications** for new incoming messages
- Smooth animations and transitions

---

## 🏗 Architecture

```
src/
├── data/
│   ├── users.js        # 12 preset users
│   └── messages.js     # Random message pool
├── stores/
│   ├── auth.js         # Authentication (login/register/logout)
│   ├── chat.js         # Messages, unread counts, typing state
│   ├── theme.js        # Dark/light mode
│   └── toast.js        # Toast notification queue
├── router/
│   └── index.js        # Vue Router with auth guards
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── ChatView.vue
├── components/
│   └── ChatWindow.vue  # Full chat window with emoji picker
└── style.css           # Tailwind + custom styles
```

---

## 👥 Demo Accounts

| Email | Password |
|-------|----------|
| amara@dev.rw | pass123 |
| keza@dev.rw | pass123 |
| dev1@dev.rw | pass123 |
| nadia@dev.rw | pass123 |
| jp@dev.rw | pass123 |
| claudine@dev.rw | pass123 |

---

## 🧪 How to Test Real Messaging

1. Open the app in **two different browser tabs** (or one normal + one incognito)
2. **Tab 1**: Login as `amara@dev.rw` → click on `Keza Mutoni`
3. **Tab 2**: Login as `keza@dev.rw` → click on `Amara Uwase`
4. Type a message in Tab 1 → see it appear in Tab 2 within ~3 seconds
5. Reply from Tab 2 → see it in Tab 1

---

## 💡 Challenges Faced

- **localStorage cross-tab sync**: Used polling (setInterval 3s) to detect messages from other sessions since Web Storage events don't fire in same-tab iframes.
- **Conversation key design**: Messages stored with a sorted user-ID pair key (`chat_1_2`) so both users share the same conversation.
- **Emoji picker**: Used `emoji-picker-element` web component with click-outside detection for clean UX.
- **Responsive sidebar**: Implemented mobile overlay with transition classes, toggled via a hamburger button.
- **Read receipts**: Messages marked as read when the conversation is active and new messages arrive.

---

## 📊 Self-Assessment Rubric

| Criteria | Score | Notes |
|----------|-------|-------|
| Functionality (auth, messaging, simulation) | 38/40 | Full real cross-account messaging |
| Code Quality (Pinia, composables, structure) | 27/30 | Clean stores, script setup everywhere |
| UI/UX / Responsiveness | 19/20 | Mobile-first, dark mode, animations |
| Docs / README | 9/10 | Comprehensive README |
| **Total** | **93/100** | |

---

## 🛠 Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** (build tool)
- **Pinia** (state management)
- **Vue Router** (navigation + guards)
- **Tailwind CSS** (styling + dark mode)
- **date-fns** (timestamp formatting)
- **emoji-picker-element** (emoji support)
