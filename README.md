# GetThingsDone ⚡

A lightweight productivity tool for your browser, available as both a website and a new-tab extension. Manage countdowns, timers, to-do lists, and quick notes in one place, with dark and light themes. Your data stays stored locally in your browser.

### [🚀 Live Demo](https://abhinav-dev0.github.io/Get-Things-Done/)

---

## 🧭 Key Features

- ⏳ **Countdowns:** Track days, hours, minutes, and seconds until upcoming events, launches, flights, or exams.

- ⏱️ **Habit & Streak Timers:** Enter only a title—the timer starts counting up automatically from the moment you create it, displaying live elapsed time and creation timestamps.

- ✅ **To-Do List:** Fast task manager with neo-brutalist checkboxes, strikethrough completion, filter pills (*All*, *Active*, *Completed*), and a *Clear Completed* action.

- 📝 **Quick Notes / Scratchpad:** Auto-saving notepad with debounced storage, live word and character counters, and a 1-click *Copy to Clipboard* button.

- 🌙 **Dark & Light: High-contrast retro aesthetic with crisp 2px borders, tactile drop shadows, and a 1-click theme switcher (defaulting to a sleek matte charcoal dark mode).

- ⌨️ **Keyboard Shortcuts:** Press `1`, `2`, `3`, or `4` on your keyboard to instantly jump between Countdowns, Timers, To-Do, and Notes (disabled while typing in input fields).

- 🔒 **100% Offline & Private:** Zero analytics, zero cloud tracking. Everything is saved strictly in browser `localStorage`.

---

## 🧩 Tech Stack

- **HTML5** & **CSS3** (CSS custom properties, flexbox & CSS grid)
- **Vanilla JavaScript (ES6+)**
- **Chrome Extension Manifest v3**

---

## ⚙️ Installation

### 🌐 Use as a Website

You can use **GetThingsDone** directly in your browser without installing anything.

👉 **[Open GetThingsDone](https://abhinav-dev0.github.io/Get-Things-Done/)**

### 🧩 Install as a Chrome Extension (Unpacked)

1. Clone or download this repository:

   ```bash
   git clone https://github.com/abhinav-dev0/countdowns-extension.git
   ```

2. Open Google Chrome or another Chromium-based browser (Brave, Edge, or Arc).
3. Navigate to `chrome://extensions/`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the project folder containing `manifest.json`.
7. Open a new tab (`Ctrl + T` / `Cmd + T`) to start using **GetThingsDone**.

### 💻 Run Locally in Your Browser

You can also open `index.html` directly in your browser without installing the extension.

---

## ⌨️ Keyboard Navigation
---

## ⌨️ Keyboard Navigation

| Key | Action |
| :--- | :--- |
| `1` | Jump to **⏳ Countdowns** |
| `2` | Jump to **⏱️ Timers** |
| `3` | Jump to **✅ To-Do** |
| `4` | Jump to **📝 Notes** |
| `Enter` | Submit in input fields |
