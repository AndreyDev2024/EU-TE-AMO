const pages = [...document.querySelectorAll(".stage")];
const pager = document.querySelector(".pager");
const noteOutput = document.querySelector("#noteOutput");
const futureOutput = document.querySelector("#futureOutput");
const wishInput = document.querySelector("#wishInput");
const wishLine = document.querySelector("#wishLine");
const finalTitle = document.querySelector("#finalTitle");

const startDate = new Date("2026-07-23T00:00:00-03:00");
const twoMonthDate = new Date("2026-09-23T00:00:00-03:00");
let currentPage = 0;

pages.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.dataset.jump = String(index);
  dot.setAttribute("aria-label", `Ir para a pagina ${index + 1}`);
  if (index === 0) dot.classList.add("active");
  pager.appendChild(dot);
});

const dots = [...document.querySelectorAll("[data-jump]")];

function showPage(index) {
  const nextPage = Math.max(0, Math.min(index, pages.length - 1));
  document.body.classList.toggle("turning-forward", nextPage > currentPage);
  document.body.classList.toggle("turning-back", nextPage < currentPage);
  currentPage = nextPage;

  pages.forEach((page, pageIndex) => {
    page.hidden = pageIndex !== currentPage;
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentPage);
  });
}

function diffCalendar(from, to) {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  const monthAnchor = new Date(from);
  monthAnchor.setMonth(from.getMonth() + months);
  if (monthAnchor > to) {
    months -= 1;
    monthAnchor.setMonth(from.getMonth() + months);
  }

  const remainder = Math.max(0, to - monthAnchor);
  const days = Math.floor(remainder / 86400000);
  const hours = Math.floor((remainder % 86400000) / 3600000);
  const minutes = Math.floor((remainder % 3600000) / 60000);
  const seconds = Math.floor((remainder % 60000) / 1000);

  return { months, days, hours, minutes, seconds };
}

function updateCounter() {
  const now = new Date();
  const known = diffCalendar(startDate, now);
  document.querySelector("#monthsKnown").textContent = known.months;
  document.querySelector("#daysKnown").textContent = known.days;
  document.querySelector("#hoursKnown").textContent = known.hours;
  document.querySelector("#minutesKnown").textContent = known.minutes;
  document.querySelector("#secondsKnown").textContent = known.seconds;

  const line = document.querySelector("#twoMonthLine");
  if (now < twoMonthDate) {
    const totalMs = twoMonthDate - now;
    const days = Math.floor(totalMs / 86400000);
    const hours = Math.floor((totalMs % 86400000) / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    line.textContent = `Faltam ${days} dias, ${hours} horas e ${minutes} minutos para os 2 meses.`;
  } else {
    line.textContent = "Dia 23 de setembro de 2026: a gente completou 2 meses de conversa.";
  }
}

function saveEditableFields() {
  document.querySelectorAll("[data-save]").forEach((field) => {
    const key = `pedido-romantico:${field.dataset.save}`;
    field.value = localStorage.getItem(key) || "";
    field.addEventListener("input", () => {
      localStorage.setItem(key, field.value);
    });
  });
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showPage(currentPage + 1));
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => showPage(Number(dot.dataset.jump)));
});

document.querySelector("[data-restart]").addEventListener("click", () => showPage(0));

document.querySelectorAll("[data-note]").forEach((button) => {
  button.addEventListener("click", () => {
    noteOutput.textContent = button.dataset.note;
  });
});

document.querySelectorAll("[data-future]").forEach((button) => {
  button.addEventListener("click", () => {
    futureOutput.textContent = button.dataset.future;
  });
});

wishInput.addEventListener("input", () => {
  const value = wishInput.value.trim();
  wishLine.textContent = value
    ? `${value} merece uma pagina so dele.`
    : "Esse momento vai virar parte da historia.";
});

document.querySelector("[data-yes]").addEventListener("click", () => {
  const burst = document.createElement("div");
  burst.className = "burst";
  document.body.appendChild(burst);
  finalTitle.textContent = "Agora a nossa historia tem um sim.";
  showPage(pages.length - 1);
  window.setTimeout(() => burst.remove(), 950);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") showPage(currentPage + 1);
  if (event.key === "ArrowLeft") showPage(currentPage - 1);
});

saveEditableFields();
updateCounter();
window.setInterval(updateCounter, 1000);
