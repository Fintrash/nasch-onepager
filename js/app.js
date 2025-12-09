document.addEventListener("DOMContentLoaded", function () {
  // Elemente sammeln
  const loginToggleBtn = document.querySelector(".login-toggle");
  const loginDialog = document.getElementById("login-dialog");
  const loginCloseBtn = loginDialog ? loginDialog.querySelector(".login-dialog-close") : null;
  const loginForm = loginDialog ? loginDialog.querySelector(".form-login") : null;
  const scrollTopBtn = document.querySelector(".scroll-to-top");
  const menuToggleBtn = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");

  const memberSections = document.querySelectorAll(".section-members-only");
  const memberNavItems = document.querySelectorAll(".nav-item-members-only");
  const loggedOutBlocks = document.querySelectorAll(".section-members-logged-out, .download-locked");
  const loginIcon = document.querySelector(".login-icon");

  let lastFocusedBeforeDialog = null;

  // Login Zustand (optional in Session speichern)
  const SESSION_KEY = "naschMemberLoggedIn";
  let isMember = sessionStorage.getItem(SESSION_KEY) === "1";

  // Member Zustand anwenden
  function updateMemberVisibility() {
    if (isMember) {
      memberSections.forEach(el => el.classList.remove("is-hidden"));
      memberNavItems.forEach(el => el.classList.remove("is-hidden"));
      loggedOutBlocks.forEach(el => el.classList.add("is-hidden"));
      if (loginIcon) {
        loginIcon.classList.remove("login-icon-logged-out");
        loginIcon.classList.add("login-icon-logged-in");
      }
    } else {
      memberSections.forEach(el => el.classList.add("is-hidden"));
      memberNavItems.forEach(el => el.classList.add("is-hidden"));
      loggedOutBlocks.forEach(el => el.classList.remove("is-hidden"));
      if (loginIcon) {
        loginIcon.classList.add("login-icon-logged-out");
        loginIcon.classList.remove("login-icon-logged-in");
      }
    }
  }

  updateMemberVisibility();

  // Login Dialog
  function openLoginDialog() {
    if (!loginDialog) return;
    lastFocusedBeforeDialog = document.activeElement;
    loginDialog.hidden = false;
    loginDialog.setAttribute("aria-hidden", "false");
    if (loginToggleBtn) {
      loginToggleBtn.setAttribute("aria-expanded", "true");
    }

    const firstInput = loginDialog.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeLoginDialog() {
    if (!loginDialog) return;
    loginDialog.hidden = true;
    loginDialog.setAttribute("aria-hidden", "true");
    if (loginToggleBtn) {
      loginToggleBtn.setAttribute("aria-expanded", "false");
    }
    if (lastFocusedBeforeDialog && typeof lastFocusedBeforeDialog.focus === "function") {
      lastFocusedBeforeDialog.focus();
    }
  }

  // Klick auf Login Icon
  if (loginToggleBtn) {
    loginToggleBtn.addEventListener("click", function () {
      if (loginDialog && loginDialog.hidden) {
        openLoginDialog();
      } else {
        closeLoginDialog();
      }
    });
  }

  // Dialog schließen Button
  if (loginCloseBtn) {
    loginCloseBtn.addEventListener("click", function () {
      closeLoginDialog();
    });
  }

  // Klick auf Overlay schließt Dialog
  if (loginDialog) {
    loginDialog.addEventListener("click", function (event) {
      if (event.target === loginDialog) {
        closeLoginDialog();
      }
    });
  }

  // ESC schließt Dialog
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && loginDialog && !loginDialog.hidden) {
      closeLoginDialog();
    }
  });

  // Login Formular behandeln
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const usernameInput = loginForm.querySelector("#login-username");
      const passwordInput = loginForm.querySelector("#login-password");

      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      // Prüfungszugang
      if (username === "Mitglied" && password === "lecker") {
        isMember = true;
        sessionStorage.setItem(SESSION_KEY, "1");
        updateMemberVisibility();
        closeLoginDialog();
      } else {
        alert("Benutzername oder Passwort sind falsch.");
      }
    });
  }

  // Smooth Scroll für interne Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Mobile Menü schließen nach Klick
      if (mainNav && mainNav.classList.contains("is-open")) {
        mainNav.classList.remove("is-open");
        if (menuToggleBtn) {
          menuToggleBtn.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // Scroll to top
  function updateScrollTopButton() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", updateScrollTopButton);
    updateScrollTopButton();
  }

  // Mobile Menü Toggle
  if (menuToggleBtn && mainNav) {
    menuToggleBtn.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
});
