// ====================================================================
// GLOBAL phone input reference
// ====================================================================
let ph = null;

// ====================================================================
// Utility: Replace event handlers without duplication
// ====================================================================
function replaceNode(el) {
  if (!el) return null;
  const clone = el.cloneNode(true);
  el.parentNode.replaceChild(clone, el);
  return clone;
}

// ====================================================================
// GLOBAL INIT
// ====================================================================
window.initSharedUI = function () {

  // ---------------------------------------------------
  // YEAR
  // ---------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------------------------------
  // SEARCH FORM
  // ---------------------------------------------------
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    const sf = replaceNode(searchForm);
    sf.addEventListener("submit", e => {
      e.preventDefault();
      const q = document.getElementById("searchInput").value.trim();
      if (q) window.location.href = "catalogs.html?search=" + encodeURIComponent(q);
    });
  }

  // ====================================================================
  // PHONE MASK
  // ====================================================================
  const phoneInput = document.getElementById("qPhone");

  if (phoneInput) {
    ph = replaceNode(phoneInput);

    if (!ph.value.trim()) ph.value = "+998 ";

    ph.addEventListener("input", () => {
      let digits = ph.value.replace(/\D/g, "");

      if (!digits.startsWith("998")) digits = "998" + digits;

      const local = digits.slice(3, 12);

      const g1 = local.slice(0, 2);
      const g2 = local.slice(2, 5);
      const g3 = local.slice(5, 7);
      const g4 = local.slice(7, 9);

      ph.value = "+998 " + [g1, g2, g3, g4].filter(Boolean).join(" ");
    });

    ph.addEventListener("keydown", e => {
      if (ph.selectionStart <= 5 && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
      }
    });

    ph.isValidUzPhone = function () {
      const digits = this.value.replace(/\D/g, "");
      return digits.length === 12 && digits.startsWith("998");
    };
  }

  // ---------------------------------------------------
  // QUOTE BUTTON
  // ---------------------------------------------------
  document.querySelectorAll(".request-quote-btn").forEach(btn => {
    const b = replaceNode(btn);

    b.addEventListener("click", () => {
      document.getElementById("qProduct").value =
        b.dataset.product || "Unknown Forklift";

      new bootstrap.Modal(document.getElementById("quoteModal")).show();
    });
  });

  // ---------------------------------------------------
  // EmailJS Init (IMPORTANT)
  // ---------------------------------------------------
  if (typeof emailjs === "undefined") {
    console.error("⚠️ EmailJS SDK NOT LOADED!");
  } else {
    try {
      emailjs.init("LNsWUF2aP7Th7tjek"); // your PUBLIC KEY
      console.log("EmailJS initialized");
    } catch (e) {
      console.error("EmailJS Init Error:", e);
    }
  }

  // ====================================================================
  // QUOTE FORM SUBMIT
  // ====================================================================
  const qForm = document.getElementById("quoteForm");
  if (qForm) {

    qForm.addEventListener("submit", async e => {
      e.preventDefault();

      if (!emailjs) {
        alert("Email system not loaded. Please reload the page.");
        return;
      }

      const privacy = document.getElementById("privacyCheck");
      if (!privacy || !privacy.checked) {
        alert("Please agree to the Privacy Policy.");
        return;
      }

      if (!ph || !ph.isValidUzPhone()) {
        alert("Please enter a valid Uzbek phone number (+998).");
        return;
      }

      const data = {
        title: qProduct.value,
        product: qProduct.value,
        fname: qName.value,
        company: qCompany.value,
        phone: ph.value,
        city: qCity.value,
        email: qEmail.value,
        message: qQuestion.value
      };

      try {
        const res = await emailjs.send(
          "service_go6ktbe",
          "template_j9y2e5m",
          data
        );

        console.log("EmailJS response:", res);

                // Close modal
        bootstrap.Modal.getInstance(document.getElementById("quoteModal")).hide();

        // Show success toast
        const toastEl = document.getElementById("successToast");
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();


      } catch (err) {
        console.error("EmailJS ERROR:", err);
        alert("Error sending request. Check console.");
      }
    });
  }

  // ---------------------------------------------------
  // NAVBAR DROPDOWN
  // ---------------------------------------------------
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isDesktop) {
    document.querySelectorAll(".nav-item.dropdown > a.nav-link").forEach(link => {
      const newLink = replaceNode(link);
      newLink.addEventListener("click", () => {
        const href = newLink.getAttribute("href");
        if (href && href !== "#") window.location.href = href;
      });
    });

    document.querySelectorAll(".dropdown-toggle").forEach(el => {
      el.removeAttribute("data-bs-toggle");
    });

    document.querySelectorAll(".nav-item.dropdown").forEach(drop => {
      const d = replaceNode(drop);
      const menu = d.querySelector(".dropdown-menu");
      if (!menu) return;

      let closeTimer;

      d.addEventListener("mouseenter", () => {
        clearTimeout(closeTimer);
        menu.style.display = "block";
        setTimeout(() => {
          menu.style.opacity = "1";
          menu.style.visibility = "visible";
        }, 10);
      });

      d.addEventListener("mouseleave", () => {
        closeTimer = setTimeout(() => {
          menu.style.opacity = "0";
          menu.style.visibility = "hidden";
          setTimeout(() => { menu.style.display = "none"; }, 200);
        }, 180);
      });
    });
  }

}; // END initSharedUI


// ====================================================================
// AUTO-RUN
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".navbar")) {
    try { initSharedUI(); } catch (e) { console.error(e); }
  }
});

// ========================================================
// LANGUAGE SYSTEM
// ========================================================

window.currentLang = localStorage.getItem("heli-lang") || "uz";

window.loadLanguage = async function(lang) {
  const res = await fetch(`lang/${lang}.json`);
  const dict = await res.json();

  // text content
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });

  // placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.placeholder = dict[key];
  });

  localStorage.setItem("heli-lang", lang);
  window.currentLang = lang;
};

// switch btns
window.initLanguageSwitcher = function () {

  const current = window.currentLang;

  // Highlight the active button
  document.querySelectorAll(".language-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === current);

    // Add click handler
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;

      // Save language
      localStorage.setItem("heli-lang", lang);
      window.currentLang = lang;

      // 🔥 Reload the whole page so dynamic content updates correctly
      window.location.reload();
    });
  });
};


// load on first page load
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(window.currentLang);
  initLanguageSwitcher();
});



