const pages = [...document.querySelectorAll(".stage")];
const pager = document.querySelector(".pager");
const startDate = new Date("2026-07-23T00:00:00-03:00");
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

function fullMonthsBetween(from, to) {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  const monthAnchor = new Date(from);
  monthAnchor.setMonth(from.getMonth() + months);
  if (monthAnchor > to) months -= 1;
  return Math.max(0, months);
}

function updateCounter() {
  const now = new Date();
  const totalMs = Math.max(0, now - startDate);
  const seconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = fullMonthsBetween(startDate, now);

  document.querySelector("#monthsKnown").textContent = months;
  document.querySelector("#weeksKnown").textContent = weeks;
  document.querySelector("#daysKnown").textContent = days;
  document.querySelector("#hoursKnown").textContent = hours;
  document.querySelector("#minutesKnown").textContent = minutes;
  document.querySelector("#secondsKnown").textContent = seconds;
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showPage(currentPage + 1));
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => showPage(Number(dot.dataset.jump)));
});

document.querySelector("[data-restart]").addEventListener("click", () => showPage(0));

const topicImage = document.querySelector("#topicImage");
const topicText = document.querySelector("#topicText");

document.querySelectorAll("[data-topic]").forEach((button, index) => {
  if (index === 0) button.classList.add("active");
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-topic]").forEach((item) => {
      item.classList.remove("active");
    });
    button.classList.add("active");
    topicImage.classList.remove("is-missing");
    topicImage.src = button.dataset.photo;
    topicImage.alt = `Foto do topico ${button.dataset.topic}`;
    topicText.textContent = button.dataset.text;
  });
});

topicImage.addEventListener("error", () => {
  topicImage.classList.add("is-missing");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") showPage(currentPage + 1);
  if (event.key === "ArrowLeft") showPage(currentPage - 1);
});

updateCounter();
window.setInterval(updateCounter, 1000);
