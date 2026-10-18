# GetThingsDone ⚡

A sleek, lightweight **Neo-Brutalist** new-tab dashboard extension for your browser. Track upcoming deadlines, monitor habit streaks, manage your daily to-do list, and jot down quick notes—all in one place, stored 100% locally in your browser memory.

### [🚀 Live Demo](https://abhinav-dev0.github.io/countdowns-extension/)

---

## 🧭 Key Features

- ⏳ **Countdowns:** Track days, hours, minutes, and seconds until upcoming events, launches, flights, or exams.
- ⏱️ **Habit & Streak Timers:** Enter only a title—the timer starts counting up automatically from the moment you create it, displaying live elapsed time and creation timestamps.
- ✅ **To-Do List:** Fast task manager with neo-brutalist checkboxes, strikethrough completion, filter pills (*All*, *Active*, *Completed*), and a *Clear Completed* action.
- 📝 **Quick Notes / Scratchpad:** Auto-saving notepad with debounced storage, live word and character counters, and a 1-click *Copy to Clipboard* button.
- 🌙 **Dark & Light Neo-Brutalism:** High-contrast retro aesthetic with crisp 2px borders, tactile drop shadows, and a 1-click theme switcher (defaulting to a sleek matte charcoal dark mode).
- ⌨️ **Keyboard Shortcuts:** Press `1`, `2`, `3`, or `4` on your keyboard to instantly jump between Countdowns, Timers, To-Do, and Notes (disabled while typing in input fields).
- 🕒 **Live Header Clock:** Real-time digital clock and local date built right into the top bar.
- 🔒 **100% Offline & Private:** Zero analytics, zero cloud tracking. Everything is saved strictly in browser `localStorage`.

---

## 🧩 Tech Stack

- **HTML5** & **CSS3** (CSS custom properties, flexbox & CSS grid)
- **Vanilla JavaScript (ES6+)**
- **Chrome Extension Manifest v3**

---

## ⚙️ Installation

### Load as Chrome Extension (Unpacked)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/abhinav-dev0/countdowns-extension.git
   ```
2. Open Google Chrome (or any Chromium browser like Brave, Edge, or Arc).
3. Navigate to `chrome://extensions/`.
4. Toggle on **Developer mode** in the top-right corner.
5. Click **Load unpacked** in the top-left corner.
6. Select the folder containing `manifest.json`.
7. Open a new tab (`Ctrl + T` / `Cmd + T`) to enjoy **GetThingsDone**!

### Run Locally in Browser

You can also simply open `index.html` directly in any web browser without installing the extension.

---

## ⌨️ Keyboard Navigation

| Key | Action |
| :--- | :--- |
| `1` | Jump to **⏳ Countdowns** |
| `2` | Jump to **⏱️ Timers** |
| `3` | Jump to **✅ To-Do** |
| `4` | Jump to **📝 Notes** |
| `Enter` | Submit in input fields |
