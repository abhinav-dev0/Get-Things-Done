// GetThingsDone - Multi-tool Productivity Extension
// All state is persisted to browser localStorage

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

// ----------------------------------------------------
// 1. Data Migration & Theme Initialization
// ----------------------------------------------------
function migrateLegacyData() {
  const legacyEvents = JSON.parse(localStorage.getItem('events'));
  if (Array.isArray(legacyEvents) && legacyEvents.length > 0) {
    let existingCountdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
    let existingTimers = JSON.parse(localStorage.getItem('timers')) || [];
    if (existingCountdowns.length === 0 && existingTimers.length === 0) {
      legacyEvents.forEach(item => {
        if (item.type === 'timer') {
          existingTimers.push({
            id: generateId(),
            title: item.title,
            startDate: item.startDate || item.date || new Date().toISOString()
          });
        } else {
          existingCountdowns.push({
            id: generateId(),
            title: item.title,
            date: item.date,
            createdAt: new Date().toISOString()
          });
        }
      });
      localStorage.setItem('countdowns', JSON.stringify(existingCountdowns));
      localStorage.setItem('timers', JSON.stringify(existingTimers));
    }
  }
}

migrateLegacyData();

// Theme Management (Defaults to Dark)
const themeToggleBtn = document.getElementById('theme-toggle-btn');
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggleBtn) {
    themeToggleBtn.innerText = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
  }
}

applyTheme(currentTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// App State
let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
let timers = JSON.parse(localStorage.getItem('timers')) || [];
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let activeTodoFilter = 'all';
let tickerInterval = null;

// ----------------------------------------------------
// 2. Navigation, Tabs, Shortcuts & Live Clock
// ----------------------------------------------------
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function switchTab(tabId) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
  localStorage.setItem('activeTab', tabId);
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.getAttribute('data-tab'));
  });
});

const savedTab = localStorage.getItem('activeTab') || 'countdowns';
switchTab(savedTab);

// Number Key Shortcuts (1, 2, 3, 4)
window.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable)) {
    return;
  }
  const tabMap = {
    '1': 'countdowns',
    '2': 'timers',
    '3': 'todos',
    '4': 'notes'
  };
  if (tabMap[e.key]) {
    switchTab(tabMap[e.key]);
  }
});

// Live Date & Time in Header
const liveClock = document.getElementById('live-clock');

function updateLiveClock() {
  if (!liveClock) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  liveClock.innerText = `${timeStr} • ${dateStr}`;
}

updateLiveClock();
setInterval(updateLiveClock, 1000);

// ----------------------------------------------------
// 3. Countdowns Tab
// ----------------------------------------------------
const cdTitleInput = document.getElementById('cd-title-input');
const cdDateInput = document.getElementById('cd-date-input');
const addCdBtn = document.getElementById('add-cd-btn');
const countdownsList = document.getElementById('countdowns-list');

const today = new Date().toLocaleDateString('en-CA');
if (cdDateInput) {
  cdDateInput.setAttribute('min', today);
  cdDateInput.value = today;
}

function renderCountdowns() {
  countdowns.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (countdowns.length === 0) {
    countdownsList.innerHTML = `<div class="empty-state">No countdowns yet. Add an upcoming event or deadline above!</div>`;
    return;
  }

  let html = '';
  countdowns.forEach((item, index) => {
    const themeClass = `card-theme-${index % 6}`;
    const parts = item.date.split('-');
    const eventDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    html += `
      <div class="event-card ${themeClass}">
        <div class="card-top">
          <div class="card-title" title="${item.title}">${item.title}</div>
          <div class="card-subtitle">📅 Target: ${formattedDate}</div>
        </div>
        <div class="card-timer-display cd-display" data-date="${item.date}">--</div>
        <div class="card-bottom">
          <button class="delete-card-btn" data-action="delete-cd" data-id="${item.id}">Delete</button>
        </div>
      </div>
    `;
  });
  countdownsList.innerHTML = html;
  updateTimerDisplays();
}

function addCountdown() {
  const title = cdTitleInput.value.trim();
  const date = cdDateInput.value;
  if (!title || !date) {
    alert('Please enter both a title and a target date.');
    return;
  }
  countdowns.push({
    id: generateId(),
    title,
    date,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('countdowns', JSON.stringify(countdowns));
  cdTitleInput.value = '';
  cdDateInput.value = today;
  renderCountdowns();
}

addCdBtn.addEventListener('click', addCountdown);
cdTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addCountdown();
});

countdownsList.addEventListener('click', (e) => {
  if (e.target && e.target.getAttribute('data-action') === 'delete-cd') {
    const id = e.target.getAttribute('data-id');
    countdowns = countdowns.filter(item => item.id !== id);
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    renderCountdowns();
  }
});

// ----------------------------------------------------
// 4. Timers Tab
// ----------------------------------------------------
const timerTitleInput = document.getElementById('timer-title-input');
const addTimerBtn = document.getElementById('add-timer-btn');
const timersList = document.getElementById('timers-list');

function renderTimers() {
  timers.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  if (timers.length === 0) {
    timersList.innerHTML = `<div class="empty-state">No active timers. Start tracking a habit, streak, or project above!</div>`;
    return;
  }

  let html = '';
  timers.forEach((item, index) => {
    const themeClass = `card-theme-${(index + 3) % 6}`;
    const startDateObj = new Date(item.startDate);
    const dateStr = startDateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = startDateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    html += `
      <div class="event-card ${themeClass}">
        <div class="card-top">
          <div class="card-title" title="${item.title}">${item.title}</div>
          <div class="card-subtitle">⏱️ Started: ${dateStr}, ${timeStr}</div>
        </div>
        <div class="card-timer-display timer-display" data-start="${item.startDate}">--</div>
        <div class="card-bottom">
          <button class="delete-card-btn" data-action="delete-timer" data-id="${item.id}">Delete</button>
        </div>
      </div>
    `;
  });
  timersList.innerHTML = html;
  updateTimerDisplays();
}

function addTimer() {
  const title = timerTitleInput.value.trim();
  if (!title) {
    alert('Please enter a timer title.');
    return;
  }
  timers.push({
    id: generateId(),
    title,
    startDate: new Date().toISOString()
  });
  localStorage.setItem('timers', JSON.stringify(timers));
  timerTitleInput.value = '';
  renderTimers();
}

addTimerBtn.addEventListener('click', addTimer);
timerTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTimer();
});

timersList.addEventListener('click', (e) => {
  if (e.target && e.target.getAttribute('data-action') === 'delete-timer') {
    const id = e.target.getAttribute('data-id');
    timers = timers.filter(item => item.id !== id);
    localStorage.setItem('timers', JSON.stringify(timers));
    renderTimers();
  }
});

// ----------------------------------------------------
// 5. Unified Live Timer Ticker
// ----------------------------------------------------
function formatDuration(diffMs) {
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60).toString().padStart(2, '0');
  const seconds = Math.floor((diffMs / 1000) % 60).toString().padStart(2, '0');
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateTimerDisplays() {
  const now = new Date();

  // Update Countdowns
  document.querySelectorAll('.cd-display').forEach(el => {
    const dateStr = el.getAttribute('data-date');
    if (!dateStr) return;
    const parts = dateStr.split('-');
    const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const diff = targetDate - now;
    if (diff <= 0) {
      el.innerText = 'Event has passed';
    } else {
      el.innerText = formatDuration(diff);
    }
  });

  // Update Timers
  document.querySelectorAll('.timer-display').forEach(el => {
    const startStr = el.getAttribute('data-start');
    if (!startStr) return;
    const startDate = new Date(startStr);
    const diff = Math.max(0, now - startDate);
    el.innerText = formatDuration(diff);
  });
}

function startGlobalTicker() {
  if (tickerInterval) clearInterval(tickerInterval);
  updateTimerDisplays();
  tickerInterval = setInterval(updateTimerDisplays, 1000);
}

// ----------------------------------------------------
// 6. To-Do Tab
// ----------------------------------------------------
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');

function renderTodos() {
  const total = todos.length;
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = total - activeCount;

  countAll.innerText = total;
  countActive.innerText = activeCount;
  countCompleted.innerText = completedCount;

  let filtered = todos;
  if (activeTodoFilter === 'active') {
    filtered = todos.filter(t => !t.completed);
  } else if (activeTodoFilter === 'completed') {
    filtered = todos.filter(t => t.completed);
  }

  if (filtered.length === 0) {
    const emptyMsg = total === 0
      ? 'All caught up! Add a new task above.'
      : (activeTodoFilter === 'active' ? 'No active tasks! Nice work.' : 'No completed tasks yet.');
    todoList.innerHTML = `<li class="empty-state">${emptyMsg}</li>`;
    return;
  }

  let html = '';
  filtered.forEach(todo => {
    html += `
      <li class="todo-item ${todo.completed ? 'completed' : ''}">
        <div class="todo-left">
          <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
          <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <button class="delete-todo-btn" data-action="delete-todo" data-id="${todo.id}">✕</button>
      </li>
    `;
  });
  todoList.innerHTML = html;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    alert('Please enter a task.');
    return;
  }
  todos.unshift({
    id: generateId(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  todoInput.value = '';
  renderTodos();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

todoList.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('todo-checkbox')) {
    const id = target.getAttribute('data-id');
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = target.checked;
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    }
  } else if (target.getAttribute('data-action') === 'delete-todo') {
    const id = target.getAttribute('data-id');
    todos = todos.filter(t => t.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTodoFilter = btn.getAttribute('data-filter');
    renderTodos();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
});

// ----------------------------------------------------
// 7. Notes Tab
// ----------------------------------------------------
const notesTextarea = document.getElementById('notes-textarea');
const notesStatus = document.getElementById('notes-status');
const notesWordCount = document.getElementById('notes-word-count');
const notesCharCount = document.getElementById('notes-char-count');
const notesCopyBtn = document.getElementById('notes-copy-btn');
const notesClearBtn = document.getElementById('notes-clear-btn');

let saveTimeout = null;

function updateNotesStats(text) {
  notesCharCount.innerText = `${text.length} chars`;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  notesWordCount.innerText = `${words} words`;
}

// Load saved note
const savedNote = localStorage.getItem('quickNotes') || '';
if (notesTextarea) {
  notesTextarea.value = savedNote;
  updateNotesStats(savedNote);

  notesTextarea.addEventListener('input', () => {
    const content = notesTextarea.value;
    updateNotesStats(content);
    notesStatus.innerText = '● Saving...';
    notesStatus.style.color = '#f97316';

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem('quickNotes', content);
      notesStatus.innerText = '● Saved in browser';
      notesStatus.style.color = '#22c55e';
    }, 300);
  });
}

if (notesCopyBtn) {
  notesCopyBtn.addEventListener('click', () => {
    const text = notesTextarea.value;
    navigator.clipboard.writeText(text).then(() => {
      const originalText = notesCopyBtn.innerText;
      notesCopyBtn.innerText = 'Copied!';
      setTimeout(() => {
        notesCopyBtn.innerText = originalText;
      }, 1500);
    });
  });
}

if (notesClearBtn) {
  notesClearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your notes?')) {
      notesTextarea.value = '';
      localStorage.setItem('quickNotes', '');
      updateNotesStats('');
      notesStatus.innerText = '● Saved in browser';
      notesStatus.style.color = '#22c55e';
    }
  });
}

// ----------------------------------------------------
// Initial Render & Start
// ----------------------------------------------------
renderCountdowns();
renderTimers();
renderTodos();
startGlobalTicker();
