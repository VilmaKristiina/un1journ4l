const loginButton = document.getElementById('login-btn');
const signupButton = document.getElementById('signup-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const buttonContainer = document.querySelector('.button-container');
const loadingIcon = document.getElementById('loading');
const logoContainer = document.querySelector('.logo-container');

// Näyttää lomakkeen ja piilottaa napit
function showForm(formToShow) {
  if (buttonContainer) {
    buttonContainer.style.visibility = 'hidden';
  }

  if (loginForm) loginForm.classList.add('hidden');
  if (signupForm) signupForm.classList.add('hidden');

  if (formToShow) {
    formToShow.classList.remove('hidden');
    formToShow.classList.add('show');
  }
}

// Näyttää latauskuvakkeen
function showLoading() {
  if (loadingIcon) {
    loadingIcon.classList.remove('hidden');
  }
}

// Piilottaa latauskuvakkeen
function hideLoading() {
  if (loadingIcon) {
    loadingIcon.classList.add('hidden');
  }
}

// Login-painike
if (loginButton && loginForm) {
  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    showForm(loginForm);
  });
}

// Signup-painike
if (signupButton && signupForm) {
  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    showForm(signupForm);
  });
}

// Kirjautumislomakkeen lähetys
if (loginForm) {
  const loginSubmit = loginForm.querySelector('form');
  if (loginSubmit) {
    loginSubmit.addEventListener('submit', function (e) {
      e.preventDefault();
      loginForm.classList.add('hidden');
      if (logoContainer) logoContainer.classList.add('hidden');
      showLoading();

      setTimeout(function () {
        hideLoading();
        window.location.href = 'home.html';
      }, 2000);
    });
  }
}

// Rekisteröitymislomakkeen lähetys
if (signupForm) {
  const signupSubmit = signupForm.querySelector('form');
  if (signupSubmit) {
    signupSubmit.addEventListener('submit', function (e) {
      e.preventDefault();
      signupForm.classList.add('hidden');
      if (logoContainer) logoContainer.classList.add('hidden');
      showLoading();

      setTimeout(function () {
        hideLoading();
        window.location.href = 'home.html';
      }, 2000);
    });
  }
}

const calendarDaysContainer = document.getElementById('calendar-days');
const monthNameElem = document.getElementById('month-name');
const prevButton = document.getElementById('prev-days');
const nextButton = document.getElementById('next-days');
const statusElem = document.getElementById('journal-status');
const openJournalBtn = document.getElementById('open-journal-btn');

const today = new Date();
let currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
let dayOffset = today.getDate() - 3;

// Palauttaa päivämäärän muodossa "YYYY-MM-DD"
function formatDateKey(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateCalendar() {
  calendarDaysContainer.innerHTML = '';
  const baseDate = new Date(currentDate);

  const visibleCenterDate = new Date(baseDate);
  visibleCenterDate.setDate(visibleCenterDate.getDate() + dayOffset + 2);

  const visibleMonth = visibleCenterDate.toLocaleString('en-US', { month: 'long' });
  const visibleYear = visibleCenterDate.getFullYear();
  monthNameElem.textContent = `${visibleMonth.charAt(0).toUpperCase() + visibleMonth.slice(1)} ${visibleYear}`;

  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(baseDate);
    dayDate.setDate(dayDate.getDate() + dayOffset + i);
    const dateKey = formatDateKey(dayDate);
    const dateLabel = dayDate.toLocaleDateString('en-US');

    const dayElem = document.createElement('div');
    dayElem.className = 'day-circle';
    dayElem.setAttribute('data-date', dateLabel);

    // Lisää päivämäärän numeron
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = dayDate.getDate();
    dayElem.appendChild(dayNumber);

    // Lisää emoji-div ja sijoitetaan se alemmaksi
    const emojiDiv = document.createElement('div');
    emojiDiv.className = 'mood-emoji';
    dayElem.appendChild(emojiDiv);

    if (i === 2) {
      dayElem.classList.add('selected');
      updateJournalStatus(dateKey);
      dayElem.addEventListener('click', () => openJournal(dateKey));
    } else {
      dayElem.addEventListener('click', () => openJournal(dateKey));
    }

    if (dayDate.toDateString() === today.toDateString()) {
      dayElem.classList.add('today');
    }

    calendarDaysContainer.appendChild(dayElem);
  }

  // Päivitä kalenterin näkyvät emojit localStoragesta
  document.querySelectorAll('.day-circle').forEach(dayElem => {
    const date = dayElem.getAttribute('data-date');
    const savedMood = localStorage.getItem(date);
    const emojiDiv = dayElem.querySelector('.mood-emoji');

    if (savedMood && emojiDiv) {
      switch (savedMood) {
        case 'happy':
          emojiDiv.textContent = '😀';
          break;
        case 'neutral':
          emojiDiv.textContent = '😐';
          break;
        case 'sad':
          emojiDiv.textContent = '😢';
          break;
        case 'angry':
          emojiDiv.textContent = '😠';
          break;
        case 'tired':
          emojiDiv.textContent = '🥱';
          break;
        case 'love':
          emojiDiv.textContent = '🥰';
          break;
      }
    }
  });
}

prevButton.addEventListener('click', () => {
  dayOffset--;
  updateCalendar();
});

nextButton.addEventListener('click', () => {
  dayOffset++;
  updateCalendar();
});

function openJournal(dateKey) {
  const journalEntry = document.getElementById('journal-entry');
  const journalDate = document.getElementById('journal-date');
  const journalText = document.getElementById('journal-text');
  const saveButton = document.getElementById('save-journal');

  journalDate.textContent = "What was your dream about?";
  journalEntry.style.display = 'block';
  openJournalBtn.style.display = 'none';

  const savedText = localStorage.getItem(dateKey);
  journalText.value = savedText || '';

  saveButton.onclick = () => {
    localStorage.setItem(dateKey, journalText.value);
    journalEntry.style.display = 'none';
    openJournalBtn.style.display = 'block';
    updateJournalStatus(dateKey);
  };
}

function updateJournalStatus(dateKey) {
  const savedText = localStorage.getItem(dateKey);
  if (savedText && savedText.trim() !== '') {
    statusElem.textContent = 'Logged';
  } else {
    statusElem.textContent = 'No dreams logged';
  }
}

openJournalBtn.addEventListener('click', () => {
  const selected = document.querySelector('.day-circle.selected');
  if (selected) {
    const selectedIndex = Array.from(calendarDaysContainer.children).indexOf(selected);
    const selectedDate = new Date(currentDate);
    selectedDate.setDate(selectedDate.getDate() + dayOffset + selectedIndex);
    openJournal(formatDateKey(selectedDate));
  }
});

updateCalendar();

// Käsitellään moodi-emoji painikkeet
document.querySelectorAll('.emoji-btn').forEach(button => {
  button.addEventListener('click', function () {
    const mood = this.getAttribute('data-mood');
    const emoji = this.textContent;
    const date = new Date().toLocaleDateString('en-US');

    const calendarDay = document.querySelector(`.day-circle[data-date="${date}"]`);
    if (calendarDay) {
      let emojiElement = calendarDay.querySelector('.mood-emoji');
      if (emojiElement) {
        emojiElement.textContent = emoji;
      }
    }

    localStorage.setItem(date, mood);

    // Skrollaa sivu aivan ylös
    window.scrollTo(0, 0);

    // Piilota päiväkirjanäkymä ja palauta kalenteri
    document.getElementById('journal-entry').style.display = 'none';
    document.getElementById('open-journal-btn').style.display = 'block';
    updateCalendar();
  });
});


// Modal-elementit ja painikkeet
// UNI-MODAALI & CHART
const sleepModal = document.getElementById("sleep-modal");
const openSleepModalBtn = document.getElementById("open-sleep-modal-btn");
const closeModalBtn = document.getElementById("close-modal");
const saveSleepBtn = document.getElementById("save-sleep");
const sleepInput = document.getElementById("sleep-input");
const modalMessage = document.getElementById("modal-message");
const modalDateLabel = document.getElementById("modal-date-label");
let sleepChart = null;

let sleepDate = new Date();

function updateModalDate() {
  modalDateLabel.textContent = sleepDate.toLocaleDateString("fi-FI");
  const isoDate = sleepDate.toISOString().split("T")[0];
  const saved = localStorage.getItem(`sleep-${isoDate}`);
  sleepInput.value = saved || "";
  drawChart();
}

openSleepModalBtn.addEventListener("click", () => {
  sleepModal.style.display = "block";
  updateModalDate();
});

closeModalBtn.addEventListener("click", () => {
  sleepModal.style.display = "none";
});

document.getElementById("prev-day-btn").addEventListener("click", () => {
  sleepDate.setDate(sleepDate.getDate() - 1);
  updateModalDate();
});
document.getElementById("next-day-btn").addEventListener("click", () => {
  sleepDate.setDate(sleepDate.getDate() + 1);
  updateModalDate();
});

saveSleepBtn.addEventListener("click", () => {
  const value = parseFloat(sleepInput.value);
  if (isNaN(value) || value < 0 || value > 24) {
    modalMessage.textContent = "Syötä tuntimäärä väliltä 0–24.";
    return;
  }
  const isoDate = sleepDate.toISOString().split("T")[0];
  localStorage.setItem(`sleep-${isoDate}`, value.toString());
  modalMessage.textContent = "Tallennettu!";
  drawChart();
});

// Piirrä uni-kaavio
function drawChart() {
  const labels = [];
  const data = [];
  const tempDate = new Date(sleepDate);
  tempDate.setDate(tempDate.getDate() - 6);

  for (let i = 0; i < 7; i++) {
    const iso = tempDate.toISOString().split("T")[0];
    labels.push(tempDate.toLocaleDateString("fi-FI", { weekday: "short" }));
    const value = parseFloat(localStorage.getItem(`sleep-${iso}`));
    data.push(isNaN(value) ? 0 : value);
    tempDate.setDate(tempDate.getDate() + 1);
  }

  if (sleepChart) sleepChart.destroy();
  const ctx = document.getElementById("sleep-chart").getContext("2d");
  sleepChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Uni (h)",
        data,
        borderColor: "#7ba4ff",
        backgroundColor: "#c6dcff66",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 12
        }
      }
    }
  });
}