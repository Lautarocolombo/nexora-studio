(() => {
  'use strict';

  // Helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ─── NAVBAR SCROLL ───────────────────────────────────────
  const initNavbar = () => {
    const navbar = $('#navbar');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  // ─── MOBILE NAV ──────────────────────────────────────────
  const initMobileNav = () => {
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobileNav');
    const closeBtn = $('#mobileNavClose');

    if (!hamburger || !mobileNav) return;

    const open = () => mobileNav.classList.add('open');
    const close = () => mobileNav.classList.remove('open');

    hamburger.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    $$('a', mobileNav).forEach(link => link.addEventListener('click', close));
  };

  // ─── SCROLL REVEAL ───────────────────────────────────────
  const initReveal = () => {
    const targets = $$('.reveal, .process-step');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(el => observer.observe(el));
  };

  // ─── FAQ ACCORDION ───────────────────────────────────────
  const initFaq = () => {
    const items = $$('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const question = $('.faq-question', item);
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        $$('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  };

  // ─── PORTFOLIO FILTER ────────────────────────────────────
  const initPortfolioFilter = () => {
    const buttons = $$('.filter-btn');
    const cards = $$('.portfolio-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const cat = card.dataset.category || card.dataset.cat;
          const show = filter === 'all' || cat === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  };

  // ─── PROJECTS (data-driven) ─────────────────────────────
  const initProjects = () => {
    const grids = $$('[data-projects]');
    if (!grids.length || !Array.isArray(window.NEXORA_PROJECTS)) return;

    grids.forEach(grid => {
      const link = grid.dataset.link || 'portfolio.html';
      const label = grid.dataset.label || 'Ver proyecto';

      grid.innerHTML = window.NEXORA_PROJECTS.map(p => `
        <article class="portfolio-card reveal" data-category="${p.category}">
          <div class="portfolio-preview">
            <div class="portfolio-preview-bg ${p.previewClass}">
              <div class="preview-mockup"><div class="preview-mockup-bar accent"></div><div class="preview-mockup-line"></div><div class="preview-mockup-line"></div><div class="preview-mockup-line"></div></div>
              <div class="preview-glow"></div>
            </div>
            <div class="portfolio-overlay"><a href="${link}" class="btn btn-primary">${label}</a></div>
          </div>
          <div class="portfolio-info">
            <div class="portfolio-type">${p.type}</div>
            <div class="portfolio-title">${p.title}</div>
            <p class="portfolio-desc">${p.desc}</p>
            <div class="portfolio-tags">${p.tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>
          </div>
        </article>`).join('');
    });
  };

  // ─── BACK TO TOP ──────────────────────────────
  const initBackToTop = () => {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    const onScroll = () => btn.classList.toggle('visible', window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  };

  // ─── COOKIE CONSENT ───────────────────────────
  const initCookieConsent = () => {
    const KEY = 'nexora_cookie_consent';
    let consented = null;
    try { consented = localStorage.getItem(KEY); } catch (_) {}
    if (consented) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = `
      <p>Usamos cookies para mejorar tu experiencia y medir el tráfico. Al continuar aceptás nuestra <a href="privacidad.html">Política de Privacidad</a>.</p>
      <div class="cookie-banner__actions">
        <button class="btn btn-ghost" data-cookie="reject">Rechazar</button>
        <button class="btn btn-primary" data-cookie="accept">Aceptar</button>
      </div>`;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('visible'));

    banner.addEventListener('click', (e) => {
      const t = e.target.closest('[data-cookie]');
      if (!t) return;
      try { localStorage.setItem(KEY, t.dataset.cookie); } catch (_) {}
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 400);
    });
  };

  // ─── INIT ────────────────────────────────────────────────
  const init = () => {
    initNavbar();
    initMobileNav();
    initProjects();
    initReveal();
    initFaq();
    initPortfolioFilter();
    initBackToTop();
    initCookieConsent();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
