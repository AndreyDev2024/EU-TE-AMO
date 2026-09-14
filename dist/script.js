const pages = [...document.querySelectorAll(".stage")];
const dots = [...document.querySelectorAll("[data-jump]")];
const noteOutput = document.querySelector("#noteOutput");
const wishInput = document.querySelector("#wishInput");
const wishLine = document.querySelector("#wishLine");
const finalTitle = document.querySelector("#finalTitle");

let currentPage = 0;

function showPage(index) {
  currentPage = Math.max(0, Math.min(index, pages.length - 1));
  pages.forEach((page, pageIndex) => {
    page.hidden = pageIndex !== currentPage;
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentPage);
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
  showPage(5);
  window.setTimeout(() => burst.remove(), 950);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") showPage(currentPage + 1);
  if (event.key === "ArrowLeft") showPage(currentPage - 1);
});
