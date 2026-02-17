// =============================================
//   FRANCESCA CANTINI – PORTFOLIO
//   script.js
// =============================================

const EMAILJS_CONFIG = {
  publicKey: "XdTpBKSrBdtpQti8j",        // ← Sostituisci con la tua Public Key
  serviceID: "service_ucmekca",        // ← Sostituisci con il tuo Service ID
  templateID: "template_rijeund"       // ← Sostituisci con il tuo Template ID
};

// ---- EMAILJS INIT ----
document.addEventListener("DOMContentLoaded", () => {
  // Inizializza EmailJS con la tua Public Key
  emailjs.init(EMAILJS_CONFIG.publicKey);

  // Avvia tutte le funzionalità
  initContactForm();
  initScrollAnimations();
  initNavbarHighlight();
  initHeroParallax();
  initHamburgerMenu();
});

// =============================================
//   CONTACT FORM – EMAILJS
// =============================================
function initContactForm() {
  const form       = document.getElementById("contact-form");
  const sendBtn    = document.getElementById("send-btn");
  const btnText    = document.getElementById("btn-text");
  const btnSpinner = document.getElementById("btn-spinner");
  const status     = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validazione base
    const name    = form.from_name.value.trim();
    const email   = form.reply_to.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus(status, "⚠️ Per favore compila tutti i campi.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showStatus(status, "⚠️ Inserisci un indirizzo email valido.", "error");
      return;
    }

    // Stato: invio in corso
    setLoading(sendBtn, btnText, btnSpinner, true);
    clearStatus(status);

    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        form
      );

      showStatus(status, "✅ Messaggio inviato! Ti risponderò al più presto.", "success");
      form.reset();

    } catch (error) {
      console.error("EmailJS error:", error);
      showStatus(status, "❌ Errore nell'invio. Riprova o scrivimi direttamente.", "error");
    } finally {
      setLoading(sendBtn, btnText, btnSpinner, false);
    }
  });
}

// ---- Helpers form ----
function setLoading(btn, text, spinner, isLoading) {
  btn.disabled    = isLoading;
  text.style.display    = isLoading ? "none" : "inline";
  spinner.style.display = isLoading ? "inline" : "none";
}

function showStatus(el, message, type) {
  el.textContent  = message;
  el.className    = "form-status " + type;
  setTimeout(() => clearStatus(el), 6000);
}

function clearStatus(el) {
  el.textContent = "";
  el.className   = "form-status";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================================
//   SCROLL ANIMATIONS (Intersection Observer)
// =============================================
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".skill-card, .softskill-item, .bg-right, .bg-left, .hero-text, .hero-image-wrap"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeSlideUp 0.6s ease both";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el, i) => {
    el.style.opacity    = "0";
    el.style.animationDelay = `${i * 0.06}s`;
    observer.observe(el);
  });
}

// =============================================
//   NAVBAR – active link on scroll
// =============================================
function initNavbarHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

// =============================================
//   HERO – subtle parallax on scroll
// =============================================
function initHeroParallax() {
  const heroImage = document.querySelector(".hero-image-placeholder");
  if (!heroImage) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
  }, { passive: true });
}

// =============================================
//   HAMBURGER MENU (mobile)
// =============================================
function initHamburgerMenu() {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-btn");

  if (!hamburger || !mobileMenu) return;

  // Toggle apertura/chiusura
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  // Chiudi il menu quando si clicca un link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Chiudi il menu premendo Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  function closeMenu() {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }
}