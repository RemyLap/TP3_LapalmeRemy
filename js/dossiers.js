const folderButtons = document.querySelectorAll(".folder-grid__item");
const detail = {
  icon: document.querySelector('[data-detail="icon"]'),
  file: document.querySelector('[data-detail="file"]'),
  description: document.querySelector('[data-detail="description"]'),
  meta: document.querySelector('[data-detail="meta"]'),
  cases: document.querySelector('[data-detail="cases"]'),
  stability: document.querySelector('[data-detail="stability"]'),
  reversibility: document.querySelector('[data-detail="reversibility"]'),
  action: document.querySelector('[data-detail="action"]'),
};

function selectFolder(button) {
  folderButtons.forEach((item) => {
    item.classList.remove("folder-grid__item--selected");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.add("folder-grid__item--selected");
  button.setAttribute("aria-pressed", "true");

  const data = button.dataset;
  const corrupted = data.corrupted === "true";

  detail.icon.classList.toggle("folder-icon--corrupted", corrupted);
  detail.file.textContent = data.file;
  detail.description.textContent = data.description;

  if (corrupted) {
    detail.cases.textContent = "cas archivés : —";
    detail.stability.textContent = "stabilité : —";
    detail.reversibility.textContent = "réversibilité : inconnue";
    detail.reversibility.className = "folder-detail__meta-item--danger";
    detail.reversibility.setAttribute("data-detail", "reversibility");
    detail.action.classList.add("folder-detail__action--hidden");
    detail.action.tabIndex = -1;
  } else {
    detail.cases.textContent = `${data.cases} cas archivés`;
    detail.stability.textContent = `stabilité ${data.stability}%`;
    detail.reversibility.textContent = `réversibilité : ${data.reversibility}`;
    const level = data.reversibilityLevel;
    detail.reversibility.className = level ? `folder-detail__meta-item--${level}` : "";
    detail.reversibility.setAttribute("data-detail", "reversibility");
    const notRequestable = data.requestable === "false";
    detail.action.classList.toggle("folder-detail__action--hidden", notRequestable);
    detail.action.tabIndex = notRequestable ? -1 : 0;
    detail.action.href = `demande.html?type=${encodeURIComponent(data.name)}`;
  }
}

folderButtons.forEach((button) => {
  button.addEventListener("click", () => selectFolder(button));
});

const progressFill = document.querySelector(".system-status__progress-fill");
const progressSegment = 16;

function snapProgressFill() {
  if (!progressFill) return;
  const track = progressFill.parentElement;
  const percent = Number(progressFill.dataset.progress);
  const trackWidth = track.getBoundingClientRect().width;
  const targetWidth = (trackWidth * percent) / 100;
  const snappedWidth = Math.floor(targetWidth / progressSegment) * progressSegment;
  progressFill.style.width = `${snappedWidth}px`;
}

if (progressFill) {
  snapProgressFill();
  window.addEventListener("resize", snapProgressFill);
}
