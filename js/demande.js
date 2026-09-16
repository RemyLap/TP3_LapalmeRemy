// Synchroniser le décor flouté (fausse page Dossiers) avec le vrai état du
// système : si "6-7" a déjà été révélé, il reproduit aussi l'animation de
// jauge instable (2% + glitch) ; sinon il reste fixe à 61%.
try {
  if (localStorage.getItem("system-mystery-file-restored") === "true") {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      const mysteryFolder = backdrop.querySelector("[data-mystery-folder]");
      if (mysteryFolder) mysteryFolder.hidden = false;

      const corruptedCount = backdrop.querySelector("[data-corrupted-count]");
      if (corruptedCount) corruptedCount.textContent = "3";

      const percentEl = backdrop.querySelector(".system-status__progress-percent");
      const fillEl = backdrop.querySelector(".system-status__progress-fill");
      const progressContainer = backdrop.querySelector(".system-status__progress");
      const restValue = 2;

      function setBackdropValue(value) {
        if (percentEl) percentEl.textContent = `${value}%`;
        if (fillEl) fillEl.style.width = `${value}%`;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion || !fillEl) {
        setBackdropValue(restValue);
      } else {
        fillEl.style.transition = "none";

        const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

        function animateBackdropTo(target, duration) {
          return new Promise((resolve) => {
            const from = parseFloat(fillEl.style.width) || 61;
            let startTime = null;
            function frame(now) {
              if (startTime === null) startTime = now;
              const t = Math.min((now - startTime) / duration, 1);
              setBackdropValue(Math.round(from + (target - from) * easeInOutQuad(t)));
              if (t < 1) requestAnimationFrame(frame);
              else resolve();
            }
            requestAnimationFrame(frame);
          });
        }

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const BUMP_SEQUENCE = [4, 3, 4, restValue];

        async function backdropGlitchLoop() {
          if (progressContainer) progressContainer.classList.add("system-status__progress--glitching");
          setBackdropValue(restValue);
          for (;;) {
            await wait(3500 + Math.random() * 2500);
            for (const value of BUMP_SEQUENCE) {
              await animateBackdropTo(value, 350);
            }
          }
        }

        backdropGlitchLoop();
      }
    }
  }
} catch {
  // Stockage indisponible (navigation privée, etc.) : le décor garde son état par défaut.
}

// Onglets Général / Avancé
const tabButtons = document.querySelectorAll("[data-tab-button]");
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((b) => {
      b.classList.remove("dialog__tab--active");
      b.setAttribute("aria-selected", "false");
    });
    button.classList.add("dialog__tab--active");
    button.setAttribute("aria-selected", "true");

    document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== button.dataset.tabButton;
    });
  });
});

// Pré-remplir le type depuis l'URL (?type=Possession) en arrivant depuis Dossiers
const params = new URLSearchParams(window.location.search);
const requestedType = params.get("type");
const typeField = document.getElementById("field-type");
if (requestedType && typeField) {
  const match = Array.from(typeField.options).find((option) => option.value === requestedType);
  if (match) typeField.value = requestedType;
}

// Slider Courage : afficher la valeur en direct
const courageInput = document.querySelector("[data-courage-input]");
const courageValue = document.querySelector("[data-courage-value]");
courageInput.addEventListener("input", () => {
  courageValue.textContent = courageInput.value;
});

// Case "Rien" exclusive avec les autres choix d'"Apporter"
const apporterRien = document.querySelector("[data-apporter-rien]");
const apporterOptions = document.querySelectorAll("[data-apporter-option]");
apporterRien.addEventListener("change", () => {
  if (apporterRien.checked) {
    apporterOptions.forEach((option) => (option.checked = false));
  }
});
apporterOptions.forEach((option) => {
  option.addEventListener("change", () => {
    if (option.checked) apporterRien.checked = false;
  });
});

// Icône calendrier personnalisée : l'icône native ignore le curseur CSS dans
// certains navigateurs, donc on la neutralise (pointer-events: none) et on
// ouvre le sélecteur natif via ce déclencheur superposé à la place.
const dateInput = document.getElementById("field-date");
const dateTrigger = document.querySelector("[data-date-trigger]");
if (dateInput && dateTrigger) {
  dateTrigger.addEventListener("click", () => {
    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
  });
}

// Validation JS personnalisée (validation HTML5 native désactivée via novalidate)
const form = document.getElementById("form-demande");
const successPanel = document.querySelector("[data-form-success]");
const submitButton = document.querySelector("[data-submit-button]");

function showError(field, message) {
  const errorEl = document.querySelector(`[data-error-for="${field}"]`);
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

function markInput(input, isValid) {
  input.classList.toggle("form__input--invalid", !isValid);
  input.setAttribute("aria-invalid", String(!isValid));
}

function validate() {
  let firstInvalid = null;
  const data = new FormData(form);

  const nom = form.elements.nom;
  const nomValide = nom.value.trim().length >= 2;
  showError("nom", nomValide ? "" : "Veuillez entrer votre nom complet.");
  markInput(nom, nomValide);
  if (!nomValide && !firstInvalid) firstInvalid = nom;

  const age = form.elements.age;
  const ageNombre = Number(age.value);
  const ageValide = age.value.trim() !== "" && Number.isInteger(ageNombre) && ageNombre >= 1 && ageNombre <= 120;
  showError("age", ageValide ? "" : "Entrez un âge valide entre 1 et 120.");
  markInput(age, ageValide);
  if (!ageValide && !firstInvalid) firstInvalid = age;

  const genreValide = Boolean(data.get("genre"));
  showError("genre", genreValide ? "" : "Sélectionnez une option.");
  if (!genreValide && !firstInvalid) firstInvalid = form.querySelector('[name="genre"]');

  const ville = form.elements.ville;
  const villeValide = ville.value.trim().length >= 2;
  showError("ville", villeValide ? "" : "Veuillez indiquer votre ville.");
  markInput(ville, villeValide);
  if (!villeValide && !firstInvalid) firstInvalid = ville;

  const type = form.elements.type;
  const typeValide = type.value !== "";
  showError("type", typeValide ? "" : "Choisissez un type de phénomène.");
  markInput(type, typeValide);
  if (!typeValide && !firstInvalid) firstInvalid = type;

  const date = form.elements.date;
  const dateValide = date.value !== "";
  showError("date", dateValide ? "" : "Choisissez une date.");
  markInput(date, dateValide);
  if (!dateValide && !firstInvalid) firstInvalid = date;

  const creneauValide = Boolean(data.get("creneau"));
  showError("creneau", creneauValide ? "" : "Sélectionnez un créneau.");
  if (!creneauValide && !firstInvalid) firstInvalid = form.querySelector('[name="creneau"]');

  const signature = form.elements.signature;
  const signatureValide = signature.value.trim().length >= 2;
  showError("signature", signatureValide ? "" : "Une signature est requise.");
  markInput(signature, signatureValide);
  if (!signatureValide && !firstInvalid) firstInvalid = signature;

  const acceptValide = form.elements.accept.checked;
  showError("accept", acceptValide ? "" : "Vous devez accepter les conditions.");
  if (!acceptValide && !firstInvalid) firstInvalid = form.elements.accept;

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validate()) return;

  form.hidden = true;
  submitButton.hidden = true;
  successPanel.hidden = false;
});
