document.querySelectorAll(".popup__close").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    if (!popup) return;
    popup.classList.add("popup--closing");
    popup.addEventListener("animationend", () => popup.remove(), { once: true });
  });
});
