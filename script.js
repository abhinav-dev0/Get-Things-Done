var events = []

const today = new Date().toLocaleDateString('en-CA');

const colors = [
  'peachpuff',
  'paleturquoise',
  'thistle',
  'powderblue',
  'mistyrose',
  'lavender',
  'lightgoldenrodyellow',
  'lightcyan'
];

document.getElementById('date-input').setAttribute('min', today);
document.getElementById('date-input').value = today;
document.getElementById('add-btn').addEventListener('click', addHandler);
document.getElementById('add-btn').addEventListener('click', addHandler);
document.getElementById('events-list').addEventListener('click', function (e) {
  if (e.target && e.target.matches('button.delete-btn')) {
    const index = e.target.getAttribute('data-index');
    removeEvent(index);
  }
});

loadEvents();

function addHandler() {
  const title = document.getElementById('title-input');
  const date = document.getElementById('date-input');
  if (title.value.trim() === '' || date.value.trim() === '') {
    alert('Please add title and date.');
    return;
  }
  events.push({ title: title.value, date: date.value });
  localStorage.setItem('events', JSON.stringify(events));
  loadEvents();
  title.value = '';
  date.value = today;
}

function loadEvents() {
  events = JSON.parse(localStorage.getItem('events')) || [];
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
  const list = document.getElementById('events-list');
  list.innerHTML = '';
  for (var i in events) {
    const item = events[i];
    const eventDateObj = new Date(item.date);
    const formattedDate = eventDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    list.innerHTML += `<li id="${i}" class="event-item">
    <p class="title">${item.title}</p>
      <p class='date'>${formattedDate}</p>
      <p class='countdown'></p>
      <button class="delete-btn" data-index="${i}">Delete</button>
    </li>`;
  }
  if (events.length === 0) {
    list.innerHTML = `<li class='countdown'>No events added yet.</li>`;
  } else {
    startTimer();
    getRandomColor();
  }
}

function removeEvent(i) {
  events.splice(i, 1);
  localStorage.setItem('events', JSON.stringify(events));
  loadEvents()
}

function startTimer() {
  setInterval(() => {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach((element, index) => {
      if (!events[index]) return;
      const parts = events[index].date.split('-');
      const eventDate = new Date(parts[0], parts[1] - 1, parts[2]);
      const now = new Date();
      const diff = eventDate - now;
      if (diff <= 0) {
        element.innerText = 'Event has passed';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      element.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    });
  }, 1000);
}


function getRandomColor() {
  const cards = document.querySelectorAll('.event-item');
  for (let i = 0; i < cards.length; i++) {
    const colorIndex = i % colors.length;
    cards[i].style.backgroundColor = colors[colorIndex];
  }
}
