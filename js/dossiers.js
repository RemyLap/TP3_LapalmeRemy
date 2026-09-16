const folderButtons = document.querySelectorAll(".folder-grid__item[data-name]");
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
  detail.icon.classList.toggle("folder-icon--recyclebin", data.iconClass === "recyclebin");
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
    detail.action.textContent = data.actionLabel || "Faire une demande";
    detail.action.href = data.openHref || `demande.html?type=${encodeURIComponent(data.name)}`;
  }
}

folderButtons.forEach((button) => {
  button.addEventListener("click", () => selectFolder(button));

  if (button.dataset.openHref) {
    button.addEventListener("dblclick", () => {
      window.location.href = button.dataset.openHref;
    });
  }
});

// Fichier caché révélé après avoir été restauré depuis la Corbeille.
let mysteryRestored = false;
try {
  mysteryRestored = localStorage.getItem("system-mystery-file-restored") === "true";
  if (mysteryRestored) {
    const mysteryFolder = document.querySelector("[data-mystery-folder]");
    if (mysteryFolder) mysteryFolder.hidden = false;

    const corruptedCount = document.querySelector("[data-corrupted-count]");
    if (corruptedCount) corruptedCount.textContent = "3";
  }
} catch {
  // Stockage indisponible (navigation privée, etc.) : le fichier reste caché.
}

const progressFill = document.querySelector(".system-status__progress-fill");
const progressPercentEl = document.querySelector(".system-status__progress-percent");
const progressSegment = 16;

function setProgressValue(percent) {
  if (!progressFill) return;
  progressFill.dataset.progress = percent;
  progressFill.parentElement.setAttribute("aria-valuenow", percent);
  if (progressPercentEl) progressPercentEl.textContent = `${percent}%`;
  snapProgressFill();
}

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

// Le système est compromis (fichier "6-7" retrouvé) : l'intégrité chute
// jusqu'à 2%, puis boucle sur la séquence 2%-4%-3%-4%-2% en vibrant tout du
// long, comme un capteur défectueux. La grande descente initiale (61% → 2%)
// ne rejoue qu'une seule fois, jamais aux visites suivantes.
if (mysteryRestored && progressFill) {
  const restValue = 2;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let alreadyCollapsed = false;
  try {
    alreadyCollapsed = localStorage.getItem("system-integrity-collapsed") === "true";
  } catch {
    // Stockage indisponible : la descente rejouera à chaque visite.
  }

  if (reduceMotion) {
    setProgressValue(restValue);
  } else {
    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

    progressFill.style.transition = "none";

    function animateProgressTo(target, duration) {
      return new Promise((resolve) => {
        const from = Number(progressFill.dataset.progress);
        let startTime = null;
        function frame(now) {
          if (startTime === null) startTime = now;
          const t = Math.min((now - startTime) / duration, 1);
          setProgressValue(Math.round(from + (target - from) * easeInOutQuad(t)));
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    }

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const progressContainer = document.querySelector(".system-status__progress");
    const BUMP_SEQUENCE = [4, 3, 4, restValue];

    async function glitchLoop() {
      if (progressContainer) progressContainer.classList.add("system-status__progress--glitching");
      for (;;) {
        await wait(3500 + Math.random() * 2500);
        for (const value of BUMP_SEQUENCE) {
          await animateProgressTo(value, 350);
        }
      }
    }

    if (alreadyCollapsed) {
      setProgressValue(restValue);
      glitchLoop();
    } else {
      setTimeout(async () => {
        await animateProgressTo(restValue, 2600);
        try {
          localStorage.setItem("system-integrity-collapsed", "true");
        } catch {
          // Stockage indisponible : tant pis, la descente rejouera.
        }
        glitchLoop();
      }, 900);
    }
  }
}
