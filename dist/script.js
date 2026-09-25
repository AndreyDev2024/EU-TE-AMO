const pages = [...document.querySelectorAll(".stage")];
const pager = document.querySelector(".pager");
const startDate = new Date("2026-07-23T19:12:00-03:00");
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

function elapsedParts(from, to) {
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

  return { months: Math.max(0, months), days, hours, minutes, seconds };
}

function updateCounter() {
  const now = new Date();
  const elapsed = elapsedParts(startDate, now);

  document.querySelector("#monthsKnown").textContent = elapsed.months;
  document.querySelector("#daysKnown").textContent = elapsed.days;
  document.querySelector("#hoursKnown").textContent = elapsed.hours;
  document.querySelector("#minutesKnown").textContent = elapsed.minutes;
  document.querySelector("#secondsKnown").textContent = elapsed.seconds;
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showPage(currentPage + 1));
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => showPage(Number(dot.dataset.jump)));
});

const restartButton = document.querySelector("[data-restart]");
if (restartButton) {
  restartButton.addEventListener("click", () => showPage(0));
}

const finalizeButton = document.querySelector("[data-finalize]");
const loveEnding = document.querySelector("#loveEnding");
const loveLineOne = document.querySelector("#loveLineOne");
const loveLineTwo = document.querySelector("#loveLineTwo");
const finalVideo = document.querySelector(".final-video-card video");
let finalMessageStarted = false;

function typeLine(element, text, speed = 55) {
  element.textContent = "";
  element.classList.remove("is-done");
  return new Promise((resolve) => {
    let index = 0;
    const timer = window.setInterval(() => {
      element.textContent += text[index] || "";
      index += 1;
      if (index > text.length) {
        window.clearInterval(timer);
        element.classList.add("is-done");
        resolve();
      }
    }, speed);
  });
}

if (finalizeButton && loveEnding) {
  finalizeButton.addEventListener("click", async () => {
    if (finalMessageStarted) return;
    finalMessageStarted = true;
    if (finalVideo) finalVideo.pause();
    loveEnding.hidden = false;
    loveEnding.scrollIntoView({ behavior: "smooth", block: "center" });
    finalizeButton.hidden = true;
    await typeLine(loveLineOne, "EU TE amo mil milhoes minha garota", 58);
    await typeLine(loveLineTwo, "Voce e minha escolha todos os dias e sempre sera", 42);
  });
}

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

const verseDock = document.querySelector("#verseDock");
const versePopover = document.querySelector("#versePopover");
const versePopupText = document.querySelector("#versePopupText");
const verses = [
  {
    text: '"Acima de tudo, porem, revistam-se do amor, que e o elo perfeito."',
    cite: "Colossenses 3:14",
  },
  {
    text: '"O amor e paciente, o amor e bondoso."',
    cite: "1 Corintios 13:4",
  },
  {
    text: '"Assim, permanecem agora estes tres: a fe, a esperanca e o amor."',
    cite: "1 Corintios 13:13",
  },
];

document.querySelectorAll("[data-verse-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const verse = verses[Number(button.dataset.verseJump)] || verses[0];
    versePopupText.innerHTML = `${verse.text}<cite>${verse.cite}</cite>`;
    versePopover.hidden = false;
    verseDock.classList.add("highlight");
    versePopover.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => verseDock.classList.remove("highlight"), 1200);
  });
});

document.querySelector("[data-close-verse]").addEventListener("click", () => {
  versePopover.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") showPage(currentPage + 1);
  if (event.key === "ArrowLeft") showPage(currentPage - 1);
  if (event.key === "Escape") versePopover.hidden = true;
});

updateCounter();
window.setInterval(updateCounter, 1000);
