// ===== THEME =====
function setTheme(isDark) {
  const app = document.getElementById("app");

  if (isDark) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  setTheme(!isDark);
}

// загрузка темы
window.addEventListener("load", () => {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    setTheme(true);
  }
});


// ====== STORAGE ======
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let habitsHistory = JSON.parse(localStorage.getItem("habitsHistory")) || [];

function saveData() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("habitsHistory", JSON.stringify(habitsHistory));
}

// ===== PAGE =====
function openPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "stats") updateStats();
}

// ===== DATE =====
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// ===== PROFILE / NOTES / HABITS (оставил твою логику без изменений)
function changePhoto() {
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("avatar").src = e.target.result;
    localStorage.setItem("avatar", e.target.result);
  };
  reader.readAsDataURL(file);
});

function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const age = document.getElementById("ageInput").value;

  localStorage.setItem("profile", JSON.stringify({ name, age }));
  alert("Профиль сохранен!");
}

// NOTES
function addNote() {
  const title = document.getElementById("noteTitle").value;
  const text = document.getElementById("noteText").value;

  if (!title && !text) return;

  const note = { title, text, date: getToday() };
  notes.push(note);
  saveData();

  const div = document.createElement("div");
  div.className = "note";
  div.innerHTML = `<h4>${title}</h4><p>${text}</p>`;

  document.getElementById("notesList").appendChild(div);
}

// HABITS
let current = 0, step = 0, unit = "", target = 0, habitName = "";

function createHabit() {
  habitName = document.getElementById("habitName").value;
  target = +document.getElementById("habitTarget").value;
  step = +document.getElementById("habitStep").value;
  unit = document.getElementById("habitUnit").value;

  current = 0;

  document.getElementById("habitBlock").style.display = "block";
  document.getElementById("habitTitle").textContent = habitName;

  updateHabitText();
}

function increaseHabit() {
  current += step;
  updateHabitText();
}

function updateHabitText() {
  document.getElementById("habitProgress").textContent =
    `${current} / ${target} ${unit}`;
}

function saveHabit() {
  habitsHistory.push({ name: habitName, value: current, date: getToday() });
  saveData();
  alert("Сохранено");
}

// ===== SLEEP =====
let sleepData = JSON.parse(localStorage.getItem("sleep")) || [];

function saveSleep() {
  const start = new Date(document.getElementById("sleepStart").value);
  const end = new Date(document.getElementById("sleepEnd").value);

  if (!start || !end || end <= start) return;

  const hours = ((end - start) / 3600000).toFixed(1);

  const item = { start, end, hours };
  sleepData.push(item);

  localStorage.setItem("sleep", JSON.stringify(sleepData));

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `💤 ${hours} ч`;

  document.getElementById("sleepList").appendChild(div);
}

// ===== WALK =====
let walkData = JSON.parse(localStorage.getItem("walk")) || [];

function saveWalk() {
  const start = new Date(document.getElementById("walkStart").value);
  const end = new Date(document.getElementById("walkEnd").value);

  if (!start || !end || end <= start) return;

  const min = ((end - start) / 60000).toFixed(0);

  const item = { start, end, min };
  walkData.push(item);

  localStorage.setItem("walk", JSON.stringify(walkData));

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `🚶 ${min} мин`;

  document.getElementById("walkList").appendChild(div);
}

// ===== STATS =====
function updateStats() {
  document.getElementById("statNotes").textContent =
    "Заметки: " + notes.length;

  document.getElementById("statHabits").textContent =
    "Привычки: " + habitsHistory.length;

  document.getElementById("statSleep").textContent =
    "Сон записей: " + sleepData.length;

  document.getElementById("statWalk").textContent =
    "Прогулок: " + walkData.length;
}