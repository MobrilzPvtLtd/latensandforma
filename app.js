/**
 * LATENS & FORMA — MINIMALIST SWISS GALLERY CONTROLLER
 * Architecture: Clean standalone pages (Home | Projects | About | Blog | Contact)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageRouter();
  initLightbox();
  initInquirySystem();
  initContactForm();
  initMobileMenu();
});

// --------------------------------------------------------------------------
// 1. PAGE ROUTER (Home | Projects | About | Blog | Contact + Individual Projects)
// --------------------------------------------------------------------------
function initPageRouter() {
  const navItems = document.querySelectorAll('.main-nav .nav-item');
  const panels = document.querySelectorAll('.view-panel');

  function navigate(targetId) {
    if (!targetId) targetId = 'home';
    
    // Normalize targetId
    const cleanId = targetId.replace('#', '');
    const panel = document.getElementById('view-' + cleanId);

    if (panel) {
      // Hide all panels
      panels.forEach(p => p.classList.remove('active-panel'));
      // Show selected panel
      panel.classList.add('active-panel');

      // Update nav active states
      navItems.forEach(item => {
        const itemRoute = item.getAttribute('data-nav');
        if (itemRoute === cleanId || (cleanId.startsWith('project-') && itemRoute === 'projects')) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Close mobile menu if open
      const mainNav = document.querySelector('.main-nav');
      if (mainNav) mainNav.classList.remove('mobile-open');

      // Sync URL hash
      if (window.location.hash !== '#' + cleanId) {
        window.history.pushState(null, '', '#' + cleanId);
      }
    } else {
      // Fallback to home
      document.getElementById('view-home')?.classList.add('active-panel');
    }
  }

  // Bind clicks on all internal route triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-route]');
    if (trigger) {
      e.preventDefault();
      const route = trigger.getAttribute('data-route');
      navigate(route);
    }
  });

  // Handle URL hash changes & browser back/forward
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    navigate(hash || 'home');
  });

  // Initial load
  const initialHash = window.location.hash.replace('#', '');
  navigate(initialHash || 'home');
}

// --------------------------------------------------------------------------
// 2. LIGHTBOX (Clean, non-distracting inspection)
// --------------------------------------------------------------------------
function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay) return;

  const imgEl = overlay.querySelector('img');
  const captionEl = overlay.querySelector('.lightbox-caption-text');
  const closeBtn = overlay.querySelector('.modal-close-btn');

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-zoom]');
    if (target) {
      const src = target.getAttribute('data-zoom') || target.querySelector('img')?.src;
      const caption = target.getAttribute('data-caption') || target.querySelector('img')?.alt || '';
      
      imgEl.src = src;
      captionEl.textContent = caption;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}

// --------------------------------------------------------------------------
// 3. INQUIRY SYSTEM (Required for each project page)
// --------------------------------------------------------------------------
function initInquirySystem() {
  const modal = document.getElementById('inquiry-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const projectInput = modal.querySelector('#inquiry-project-field');
  const fileDrop = modal.querySelector('#file-drop-area');
  const fileInput = modal.querySelector('#inquiry-file-input');
  const fileLabel = modal.querySelector('#file-status-label');
  const form = modal.querySelector('#inquiry-form');

  // Trigger inquiry modal
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-inquiry]');
    if (trigger) {
      e.preventDefault();
      const projectName = trigger.getAttribute('data-project') || 'General Project Inquiry';
      if (projectInput) projectInput.value = projectName;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });

  // File upload handling
  if (fileDrop && fileInput) {
    fileDrop.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        fileLabel.textContent = `Attached: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024).toFixed(1)} KB)`;
        fileLabel.style.color = '#401b53';
        fileLabel.style.fontWeight = '600';
      }
    });
  }

  // Simulated Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Transmitting to hello@latensandforma.com...';
      btn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 30px 10px;">
            <h3 style="color: #401b53; font-size: 1.25rem; margin-bottom: 12px;">Inquiry Sent</h3>
            <p style="color: #666; font-size: 0.92rem; margin-bottom: 24px; line-height: 1.6;">
              Thank you. Your message has been routed to <strong>hello@latensandforma.com</strong>.
            </p>
            <button type="button" class="btn-submit" onclick="document.getElementById('inquiry-modal').classList.remove('open'); document.body.style.overflow='';" style="width: auto; padding: 10px 24px;">Close</button>
          </div>
        `;
      }, 900);
    });
  }
}

// --------------------------------------------------------------------------
// 4. CONTACT FORM
// --------------------------------------------------------------------------
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      const col = contactForm.closest('.contact-form-col');
      const heading = col ? col.querySelector('h3') : null;
      if (heading) heading.style.display = 'none';

      contactForm.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <h3 style="color: #401b53; font-size: 1.2rem; margin-bottom: 10px;">Message Delivered</h3>
          <p style="color: #666; font-size: 0.9rem; line-height: 1.6;">
            Your message has been sent to the studio in Zurich (<strong>hello@latensandforma.com</strong>).
          </p>
        </div>
      `;
    }, 800);
  });
}

// --------------------------------------------------------------------------
// 5. MOBILE MENU
// --------------------------------------------------------------------------
function initMobileMenu() {
  const btn = document.querySelector('.mobile-btn');
  const nav = document.querySelector('.main-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }
}
