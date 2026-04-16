
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let habitsHistory = JSON.parse(localStorage.getItem("habitsHistory")) || [];
let profile = JSON.parse(localStorage.getItem("profile")) || {};
let avatar = localStorage.getItem("avatar") || "";


function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function saveHabits() {
  localStorage.setItem("habitsHistory", JSON.stringify(habitsHistory));
}

function saveProfileData(data) {
  localStorage.setItem("profile", JSON.stringify(data));
}

function saveAvatar(data) {
  localStorage.setItem("avatar", data);
}


function openPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}


function getToday() {
  return new Date().toISOString().split("T")[0];
}


function changePhoto() {
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("avatar").src = e.target.result;
    saveAvatar(e.target.result);
  };
  reader.readAsDataURL(file);
});


function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const age = document.getElementById("ageInput").value;

  const data = { name, age };
  saveProfileData(data);

  document.getElementById("displayName").textContent =
    name ? `${name}, ${age} лет` : "Имя";

  alert("Профиль сохранен!");
}


function addNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const text = document.getElementById("noteText").value.trim();

  if (!title && !text) return;

  const note = {
    title,
    text,
    date: getToday()
  };

  notes.push(note);
  saveNotes();

  renderNote(note);

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteText").value = "";
}

function renderNote(note) {
  const el = document.createElement("div");
  el.className = "note";
  el.innerHTML = `
    <h4>${note.title}</h4>
    <p>${note.text}</p>
    <small>${note.date}</small>
  `;
  document.getElementById("notesList").appendChild(el);
}


let current = 0;
let step = 0;
let unit = "";
let target = 0;
let habitName = "";

function createHabit() {
  habitName = document.getElementById("habitName").value;
  target = parseFloat(document.getElementById("habitTarget").value);
  step = parseFloat(document.getElementById("habitStep").value);
  unit = document.getElementById("habitUnit").value;

  if (!habitName || !step || !unit) return;

  current = 0;

  document.getElementById("habitTitle").textContent = habitName;
  updateHabitText();

  document.getElementById("habitBlock").style.display = "block";
}

function increaseHabit() {
  current += step;
  updateHabitText();
}

function updateHabitText() {
  document.getElementById("habitProgress").textContent =
    `Сегодня: ${current} ${unit} / ${target} ${unit}`;
}

function saveHabit() {
  habitsHistory.push({
    name: habitName,
    value: current,
    date: getToday()
  });

  saveHabits();

  alert("Прогресс сохранен!");
}


function updateStats() {
  document.getElementById("statNotes").textContent =
    "Заметок: " + notes.length;

  const uniqueHabits = [...new Set(habitsHistory.map(h => h.name))];

  document.getElementById("statHabits").textContent =
    "Привычки: " + (uniqueHabits.join(", ") || "-");

  const dates = [...new Set(habitsHistory.map(h => h.date))].sort().reverse();

  let streak = 0;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) streak++;
    else {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      const diff = (d1 - d2) / (1000 * 60 * 60 * 24);

      if (diff === 1) streak++;
      else break;
    }
  }

  document.getElementById("statStreak").textContent =
    "Дней подряд: " + streak;
}


window.addEventListener("load", () => {

  if (avatar) {
    document.getElementById("avatar").src = avatar;
  }

  if (profile.name) {
    document.getElementById("nameInput").value = profile.name;
    document.getElementById("ageInput").value = profile.age;
    document.getElementById("displayName").textContent =
      `${profile.name}, ${profile.age} лет`;
  }

  notes.forEach(renderNote);

  updateStats();
});

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

window.addEventListener("load", () => {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark");
  }
});



function calculateDuration(start, end) {
  const s = new Date(start);
  const e = new Date(end);

  const diff = (e - s) / (1000 * 60 * 60);
  return diff.toFixed(2);
}

function saveSleep() {
  const start = document.getElementById("sleepStart").value;
  const end = document.getElementById("sleepEnd").value;

  if (!start || !end) return;

  const duration = calculateDuration(start, end);

  const data = {
    start,
    end,
    duration,
    date: getToday()
  };

  let sleep = JSON.parse(localStorage.getItem("sleep")) || [];
  sleep.push(data);
  localStorage.setItem("sleep", JSON.stringify(sleep));

  renderSleep();
}

function renderSleep() {
  const sleep = JSON.parse(localStorage.getItem("sleep")) || [];

  document.getElementById("sleepList").innerHTML = "";

  sleep.forEach(s => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerText = `Сон: ${s.duration}ч`;
    document.getElementById("sleepList").appendChild(el);
  });
}


function saveWalk() {
  const start = document.getElementById("walkStart").value;
  const end = document.getElementById("walkEnd").value;

  if (!start || !end) return;

  const duration = calculateDuration(start, end);

  const data = {
    start,
    end,
    duration,
    date: getToday()
  };

  let walk = JSON.parse(localStorage.getItem("walk")) || [];
  walk.push(data);
  localStorage.setItem("walk", JSON.stringify(walk));

  renderWalk();
}

function renderWalk() {
  const walk = JSON.parse(localStorage.getItem("walk")) || [];

  document.getElementById("walkList").innerHTML = "";

  walk.forEach(w => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerText = `Прогулка: ${w.duration}ч`;
    document.getElementById("walkList").appendChild(el);
  });
}
