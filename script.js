const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const revealGroups = [
    ['.skills article', 0.1],
    ['.services .commercial-head > *, .service-workbench', 0.08],
    ['.about .section-label, .profile-sheet > *', 0.1],
    ['.projects .section-label, .projects-head > *, .project-card', 0.08],
    ['.process .section-label, .process-intro > *, .steps article', 0.1],
    ['.testimonials > *, .case-tabs button, .case-panels, .diagnostic > *, .faq-title, .faq-list details', 0.08],
    ['.briefing-head > *, .briefing-options a, .briefing-status, .contact footer', 0.1]
  ];

  revealGroups.forEach(([selector, stagger]) => {
    gsap.utils.toArray(selector).forEach((element, index) => {
      gsap.from(element, {
        y: 42,
        opacity: 0,
        duration: 0.45,
        delay: Math.min(index * 0.015, 0.06),
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 96%',
          once: true
        }
      });
    });
  });

  const processLineProperty = matchMedia('(max-width: 800px)').matches ? { scaleY: 0 } : { scaleX: 0 };
  gsap.from('.process-path span', {
    ...processLineProperty,
    duration: 1.1,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.process-board',
      start: 'top 78%',
      once: true
    }
  });
}

const serviceTabs = [...document.querySelectorAll('.service-tabs [role="tab"]')];

const selectServiceTab = (selectedTab, moveFocus = false) => {
  serviceTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !isSelected;
  });
  if (moveFocus) selectedTab.focus();
};

serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectServiceTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % serviceTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + serviceTabs.length) % serviceTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = serviceTabs.length - 1;
    if (nextIndex === index && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    selectServiceTab(serviceTabs[nextIndex], true);
  });
});

const caseTabs = [...document.querySelectorAll('.case-tabs [role="tab"]')];

const selectCaseTab = (selectedTab, moveFocus = false) => {
  caseTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !isSelected;
  });
  if (moveFocus) selectedTab.focus();
};

caseTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCaseTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % caseTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + caseTabs.length) % caseTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = caseTabs.length - 1;
    if (nextIndex === index && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    selectCaseTab(caseTabs[nextIndex], true);
  });
});

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details[open]').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

document.querySelectorAll('.track-contact').forEach((link) => {
  link.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_click',
      contact_location: link.closest('section')?.id || link.dataset.service || 'navigation',
      contact_label: link.textContent.trim()
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  });
});

const projectLightbox = document.querySelector('.project-lightbox');
const lightboxImage = projectLightbox?.querySelector('.lightbox-canvas img');
const lightboxTitle = projectLightbox?.querySelector('#lightbox-title');
const lightboxClose = projectLightbox?.querySelector('.lightbox-close');
let lastProjectTrigger = null;

document.querySelectorAll('.project-card .shot').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!projectLightbox || !lightboxImage || !lightboxTitle) return;
    const book = trigger.closest('.project-card');
    if (projectLightbox.open || book?.classList.contains('is-pulling')) return;
    lastProjectTrigger = trigger;
    book?.classList.add('is-pulling');

    const openProject = () => {
      lightboxTitle.textContent = trigger.dataset.project;
      lightboxImage.src = trigger.dataset.full;
      lightboxImage.alt = `Captura completa da página do projeto ${trigger.dataset.project}`;
      document.body.classList.add('lightbox-open');
      if (typeof projectLightbox.showModal === 'function') {
        projectLightbox.showModal();
      } else {
        projectLightbox.setAttribute('open', '');
        projectLightbox.setAttribute('aria-modal', 'true');
      }
      projectLightbox.querySelector('.lightbox-canvas').scrollTop = 0;
      book?.classList.remove('is-pulling');
    };

    if (reduced) {
      openProject();
    } else {
      window.setTimeout(openProject, 260);
    }
  });
});

const closeProjectLightbox = () => {
  if (!projectLightbox?.open) return;
  if (typeof projectLightbox.close === 'function') {
    projectLightbox.close();
  } else {
    projectLightbox.removeAttribute('open');
    projectLightbox.removeAttribute('aria-modal');
  }
  document.body.classList.remove('lightbox-open');
  lightboxImage.removeAttribute('src');
  lastProjectTrigger?.focus();
};

lightboxClose?.addEventListener('click', closeProjectLightbox);
projectLightbox?.addEventListener('click', (event) => {
  if (event.target === projectLightbox) closeProjectLightbox();
});
projectLightbox?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProjectLightbox();
});


if (!reduced && window.gsap) {
  [
    { track: '.orbit-track-1', duration: 55, turn: 360 },
    { track: '.orbit-track-2', duration: 70, turn: -360 },
    { track: '.orbit-track-3', duration: 85, turn: 360 }
  ].forEach(({ track, duration, turn }) => {
    gsap.to(track, { rotation: turn, duration, repeat: -1, ease: 'none' });
    gsap.to(track + ' .code', { rotation: -turn, duration, repeat: -1, ease: 'none' });
  });
}
