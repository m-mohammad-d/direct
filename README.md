

# 🟢 Direct – Real-Time Chat App

A **real-time chat app** built with **Expo + React Native + TypeScript**, focusing on clean architecture and real-world chat functionality.
Designed for scalability, real-time communication, and a smooth cross-platform experience.

---

## ⚡ Features

* ✏️ Edit & 🗑️ Delete messages
* 🆕 Create new chats
* 🔗 Join chats via invite code
* 🖼️ User avatars & profile management
* 📦 Real-time updates via Socket.IO
* 😄 Emoji support in chats
* 🔐 Authentication & user management

---

## 🧰 Tech Stack

* **Expo & React Native** – Cross-platform mobile app
* **TypeScript** – Type safety
* **React Query** – Server state management
* **Socket.IO** – Real-time communication
* **Tailwind CSS & NativeWind** – Styling
* **React Hook Form + Zod** – Form handling & validation
* **Lucide React Native & Expo Vector Icons** – Icons & visuals
* **AsyncStorage** – Persistent user data
* **Day.js** – Date formatting
* **NetInfo** – Online/offline detection

---

## 🚀 Getting Started

Follow these steps to **run the app locally**:

### 1️⃣ Clone the repository

```bash
git clone https://github.com/m-mohammad-d/direct.git
cd direct
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start Expo

```bash
npm start
```

This will open the **Expo Dev Tools** in your browser.

### 4️⃣ Run on your preferred platform

* **Android**: Press `a` or click **Run on Android device/emulator**
* **iOS**: Press `i` or click **Run on iOS simulator**
* **Web**: Press `w` or click **Run in web browser**

### 5️⃣ Environment Variables

If needed, create a `.env` file for backend URL or API keys:

```
API_URL=https://your-backend.com/api
```

---

## 💡 Tips for Development

* Hot Reloading is enabled – code changes appear instantly
* All chat data is **cached via React Query** for smoother UI
* Custom hooks separate logic from UI for maintainability
* Socket.IO ensures **real-time updates** for messages, edits, deletions

---

## 🎨 Visuals & Styling

* Tailwind CSS via NativeWind for responsive and clean UI
* Lucide icons for sleek, modern look
* Emojis supported in messages for fun interaction

