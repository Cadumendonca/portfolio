const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const revealGroups = [
    ['.skills article', 0.1],
    ['.services .commercial-head > *, .service-grid article', 0.08],
    ['.about .section-label, .about-main > *, .stats > div', 0.1],
    ['.projects .section-label, .projects-head > *, .project-card', 0.08],
    ['.process .section-label, .process > h2, .steps article', 0.1],
    ['.diagnostic > *, .faq-title, .faq-list details', 0.08],
    ['.contact > p, .contact > h2, .contact > a, .contact footer', 0.12]
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
}

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
