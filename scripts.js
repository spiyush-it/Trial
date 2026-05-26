const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileNav = document.getElementById("mobile-nav");

mobileMenuButton.addEventListener("click", () => {
  mobileNav.classList.toggle("hidden");
});

// Brand text animation for page load
const brand = document.querySelector(".brand");
if (brand) {
  const text = "Balaji Associates";
  brand.textContent = "";
  text.split("").forEach((char, idx) => {
    const el = document.createElement("span");
    el.textContent = char;
    el.style.animationDelay = `${idx * 0.04}s`;
    brand.appendChild(el);
  });

  // Keep the logo styling consistent with the original appearance.
  // (Animation completes in text spans; no color/size change needed.)
}


const dropdownWrappers = document.querySelectorAll(".nav-dropdown");
let navHoverTimeout;

dropdownWrappers.forEach((wrapper) => {
  const menu = wrapper.querySelector(".dropdown-menu");
  const btn = wrapper.querySelector(".dropdown-btn");

  if (!menu || !btn) return;

  const closeAll = () => {
    dropdownWrappers.forEach((other) => {
      if (other === wrapper) return;
      const otherMenu = other.querySelector(".dropdown-menu");
      const otherBtn = other.querySelector(".dropdown-btn");
      other.classList.remove("open");
      if (otherMenu) otherMenu.style.display = "none";
      if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
    });
  };

  const showMenu = () => {
    if (navHoverTimeout) clearTimeout(navHoverTimeout);
    closeAll();
    wrapper.classList.add("open");
    menu.style.display = "block";
    btn.setAttribute("aria-expanded", "true");
  };

  const hideMenu = () => {
    navHoverTimeout = setTimeout(() => {
      wrapper.classList.remove("open");
      menu.style.display = "none";
      btn.setAttribute("aria-expanded", "false");
    }, 220);
  };

  wrapper.addEventListener("mouseenter", showMenu);
  wrapper.addEventListener("mouseleave", hideMenu);

  menu.addEventListener("mouseenter", () => {
    if (navHoverTimeout) clearTimeout(navHoverTimeout);
  });

  menu.addEventListener("mouseleave", hideMenu);

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    if (wrapper.classList.contains("open")) {
      wrapper.classList.remove("open");
      menu.style.display = "none";
      btn.setAttribute("aria-expanded", "false");
    } else {
      showMenu();
    }
  });
});

const newsletterForm = document.getElementById("newsletter-form");
const newsletterMsg = document.getElementById("newsletter-msg");

newsletterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const emailInput = document.getElementById("email");
  const emailValue = emailInput.value.trim();

  if (!emailValue) {
    newsletterMsg.textContent = "Please enter a valid email address.";
    newsletterMsg.style.color = "#b91c1c";
    return;
  }

  newsletterMsg.textContent = "Thanks for subscribing! You will hear from us soon.";
  newsletterMsg.style.color = "#166534";
  emailInput.value = "";
});

const remoteDataFallback = {
  heroTitle: "Engineering, Manufacturing and Project Delivery Expertise",
  heroText: "Leader in process equipment and general structure fabrication for Sugar, Distillery, Cement, Pharma and Power industries.",
  businessAreas: [
    { title: "Technological & General Structure", desc: "Structures for Sugar, Ethanol, Pharma, Power, Food and Cement industries." },
    { title: "PEB (Pre-Engineering Buildings)", desc: "Warehouses, cold storages and commercial buildings, delivered fast and robust." },
    { title: "Process Equipments", desc: "Process vessels, boilers, columns, reactors, evaporators and separators." },
    { title: "Machining Products", desc: "Manholes, flanges, pipe fittings, templates, dampers and precision components." },
    { title: "Erection & Commissioning", desc: "On-site assembly and start-up for distillery, sugar and chemical plants." },
    { title: "Civil Work", desc: "Turnkey civil construction including foundation, structural and finishing work." }
  ]
};

/* populateFromBalajiProjects removed — content loads instantly via applyFallbackContent */

function applyFallbackContent(data) {
  document.querySelector(".hero-content h1").textContent = data.heroTitle;
  document.querySelector(".hero-content p").textContent = data.heroText;

  const grid = document.querySelector(".product-grid");
  if (grid) {
    grid.innerHTML = "";
    data.businessAreas.forEach((area) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-photo" style="background-image: linear-gradient(135deg, #7dd5ff 0%, #4f9cff 100%);"></div>
        <h3>${area.title}</h3>
        <p>${area.desc}</p>
      `;
      grid.appendChild(card);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo({ top: 0, left: 0 });

  /* ── Apply content instantly — no remote fetch delay ── */
  applyFallbackContent(remoteDataFallback);

  /* ── BHGuard cross-check from scripts.js (second independent path) ── */
  (function () {
    var el = document.querySelector(".bh__built-by-link");
    if (typeof BHGuard !== "undefined" && BHGuard.verify) {
      BHGuard.verify({
        href  : el ? (el.getAttribute("href")        || "") : "",
        text  : el ? (el.textContent || "").trim()         : "",
        cls   : el ? (el.className                  || "") : "",
        label : el ? (el.getAttribute("aria-label") || "") : ""
      });
    }
  })();

  // Refresh animation for section headings: words appear one by one
  const sectionHeadings = document.querySelectorAll('section h2');
  sectionHeadings.forEach((heading, index) => {
    const words = heading.textContent.trim().split(' ');
    heading.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
    const spans = heading.querySelectorAll('span');
    spans.forEach((span, idx) => {
      span.style.opacity = '0';
      span.style.transform = 'translateY(10px)';
      span.style.display = 'inline-block';
      span.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 1000 + index * 500 + idx * 200); // Stagger headings and words
    });
  });

// Existing reveal animation for features/products - extended to product cards
  const revealTargets = document.querySelectorAll('.features .section-subtitle, .features .feature-card, .products .section-subtitle, .products .product-card');
  revealTargets.forEach((element, idx) => {
    element.classList.add('reveal-hidden');
    element.style.transitionDelay = `${idx * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        entry.target.classList.remove('reveal-hidden');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealTargets.forEach((element) => observer.observe(element));

  // New fade-heading scroll trigger
  const fadeHeadings = document.querySelectorAll('.fade-heading');
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade');
      }
    });
  }, { threshold: 0.3 });

  fadeHeadings.forEach(heading => headingObserver.observe(heading));

  // === GET QUOTE MODAL FUNCTIONALITY ===
  const modal = document.getElementById('quote-modal');
  const quoteForm = document.getElementById('quote-form');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButton = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  // No file handle needed for localStorage

  // Open modal
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const nameField = document.getElementById('full-name');
      if (nameField) nameField.focus();
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    quoteForm.reset();
  };

  closeModalButton.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Form validation helper
  const validateForm = (formData) => {
    const requiredFields = ['fullName', 'phone', 'email', 'requirement'];
    for (const field of requiredFields) {
      if (!formData.get(field)?.trim()) {
        return { valid: false, error: `Please fill ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}` };
      }
    }
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Please enter a valid email address' };
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.get('phone').replace(/\D/g, ''))) {
      return { valid: false, error: 'Please enter a valid phone number' };
    }
    return { valid: true };
  };

  // Append JSON to file
  const appendQuoteToFile = async (quoteData) => {
    try {
      let writable;
      if (!quotesFile) {
        // First time: show file picker
        return true; // localStorage only - works everywhere
        quotesFile = await fileHandle.createWritable();
        await quotesFile.write('[\n  ' + JSON.stringify(quoteData, null, 2) + '\n]');
      } else {
        // Append to existing
        writable = await fileHandle.createWritable({ keepExistingData: true });
        const quotes = JSON.parse(await fileHandle.getFile().then(f => f.text()));
        quotes.push(quoteData);
        await writable.seek(0);
        await writable.truncate();
        await writable.write(JSON.stringify(quotes, null, 2));
        writable.close();
      }
      return true;
    } catch (err) {
      console.error('File write error:', err);
      return false;
    }
  };

  // Quote form submit
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(quoteForm);
    const validation = validateForm(formData);
    if (!validation.valid) {
      alert(validation.error); // Replace with nicer UI message later
      return;
    }

    const quoteData = {
      fullName: formData.get('fullName'),
      companyName: formData.get('companyName') || '',
      phone: formData.get('phone'),
      email: formData.get('email'),
      requirement: formData.get('requirement'),
      timestamp: new Date().toISOString()
    };

    // Always saves to localStorage
    localStorage.setItem('quotes', JSON.stringify([...JSON.parse(localStorage.getItem('quotes') || '[]'), quoteData], null, 2));
    
    // Download
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Saved & downloaded quotes.json!\nData also in localStorage (persists on refresh)');
    closeModal();
  });
});



