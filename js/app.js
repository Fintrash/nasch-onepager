"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginToggleBtn");
  const loginText = document.querySelector(".nav__loginText");
  const loginIcon = document.getElementById("loginIcon");

  const loginModal = document.getElementById("loginModal");
  const closeModalBtn = document.getElementById("closeModal");
  const loginForm = document.getElementById("loginForm");

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const scrollTopBtn = document.getElementById("scrollTop");

  const memberOnlyEls = document.querySelectorAll(".member-only");
  const loggedOutBlocks = document.querySelectorAll(".downloads__locked");

  const heroButtons = document.querySelector(".hero__buttons");

  const SESSION_KEY = "naschMemberLoggedIn";
  let isMember = sessionStorage.getItem(SESSION_KEY) === "1";

  let lastFocusedBeforeModal = null;

  function applyMemberState() {
    if (isMember) {
      memberOnlyEls.forEach((el) => el.classList.remove("hidden"));
      loggedOutBlocks.forEach((el) => el.classList.add("hidden"));

      if (heroButtons) heroButtons.classList.add("hidden");

      if (loginText) loginText.textContent = "Logout";
      if (loginIcon) loginIcon.src = "assets/icons/Icon_Logout.svg";
    } else {
      memberOnlyEls.forEach((el) => el.classList.add("hidden"));
      loggedOutBlocks.forEach((el) => el.classList.remove("hidden"));

      if (heroButtons) heroButtons.classList.remove("hidden");

      if (loginText) loginText.textContent = "Mitglieder Login";
      if (loginIcon) loginIcon.src = "assets/icons/Icon_Login.svg";
    }
  }

  function openModal() {
    if (!loginModal) return;

    lastFocusedBeforeModal = document.activeElement;
    loginModal.classList.remove("hidden");
    loginBtn?.setAttribute("aria-expanded", "true");

    const firstInput = loginModal.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!loginModal) return;

    loginModal.classList.add("hidden");
    loginBtn?.setAttribute("aria-expanded", "false");

    if (lastFocusedBeforeModal?.focus) {
      lastFocusedBeforeModal.focus();
    }
  }

  applyMemberState();

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (isMember) {
        sessionStorage.removeItem(SESSION_KEY);
        isMember = false;
        applyMemberState();
        closeModal();
      } else {
        openModal();
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && loginModal && !loginModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = usernameInput?.value.trim() || "";
      const password = passwordInput?.value.trim() || "";

      if (username === "Mitglied" && password === "lecker") {
        isMember = true;
        sessionStorage.setItem(SESSION_KEY, "1");
        applyMemberState();
        closeModal();
        loginForm.reset();
      } else {
        alert("Benutzername oder Passwort sind falsch.");
      }
    });
  }

  function updateScrollTopVisibility() {
    if (!scrollTopBtn) return;

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
    updateScrollTopVisibility();
  }
});
