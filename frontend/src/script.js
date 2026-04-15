
// ================= STORAGE =================
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let habitsHistory = JSON.parse(localStorage.getItem("habitsHistory")) || [];
let profile = JSON.parse(localStorage.getItem("profile")) || {};
let avatar = localStorage.getItem("avatar") || "";

// ================= SAVE =================
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

// ================= NAV =================
function openPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// ================= DATE =================
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// ================= PHOTO =================
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

// ================= PROFILE =================
function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const age = document.getElementById("ageInput").value;

  const data = { name, age };
  saveProfileData(data);

  document.getElementById("displayName").textContent =
    name ? `${name}, ${age} лет` : "Имя";

  alert("Профиль сохранен!");
}

// ================= NOTES =================
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

// ================= HABITS =================
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

// ================= STATS =================
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

// ================= INIT =================
window.addEventListener("load", () => {

  // avatar
  if (avatar) {
    document.getElementById("avatar").src = avatar;
  }

  // profile
  if (profile.name) {
    document.getElementById("nameInput").value = profile.name;
    document.getElementById("ageInput").value = profile.age;
    document.getElementById("displayName").textContent =
      `${profile.name}, ${profile.age} лет`;
  }

  // notes render
  notes.forEach(renderNote);

  // stats init
  updateStats();
});