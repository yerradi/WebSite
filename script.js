/* ===================================================
   YOUSSEF ERRADI — Premium Interactions v3.0
   Performance-optimized, accessible, production-ready
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // --- 1. Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // --- 2. Mobile Menu ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 3. Hero Entrance Animations ---
  if (!prefersReducedMotion) {
    const animateEntrance = () => {
      const animate = (selector, delay, transform = 'translateY(0)') => {
        const el = document.querySelector(selector);
        if (el) {
          el.style.transition = `opacity 0.8s ${easing} ${delay}s, transform 0.8s ${easing} ${delay}s`;
          el.style.opacity = '1';
          el.style.transform = transform;
        }
      };

      // Title lines with stagger
      document.querySelectorAll('.hero-title span').forEach((line, i) => {
        line.style.transition = `opacity 0.8s ${easing} ${i * 0.08 + 0.1}s, transform 0.8s ${easing} ${i * 0.08 + 0.1}s`;
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });

      animate('.hero-badge', 0);
      animate('.hero-desc', 0.35);
      animate('.hero-checks', 0.45);
      animate('.hero-cta', 0.55);

      const visual = document.querySelector('.hero-visual');
      if (visual) {
        visual.style.transition = `opacity 1s ${easing} 0.3s, transform 1s ${easing} 0.3s`;
        visual.style.opacity = '1';
        visual.style.transform = 'scale(1)';
      }

      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.style.transition = `opacity 1s ${easing} 1.2s`;
        scrollIndicator.style.opacity = '1';
      }
    };

    requestAnimationFrame(() => setTimeout(animateEntrance, 80));
  } else {
    // Instantly show everything for reduced motion
    document.querySelectorAll('.reveal-text span, .reveal-fade-up, .reveal-scale, .reveal-fade').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // --- 4. Scroll Reveal (Intersection Observer) ---
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-fade');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.style.transitionDelay || '0s';
          const isScale = el.classList.contains('reveal-scale');

          el.style.transition = `opacity 0.7s ${easing} ${delay}, transform 0.7s ${easing} ${delay}`;
          el.style.opacity = '1';
          el.style.transform = isScale ? 'scale(1)' : 'translateY(0)';
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Staggered Card Animations ---
    const staggerContainers = document.querySelectorAll('.services-grid, .app-showcase-grid, .timeline-grid, .pricing-grid, .value-grid, .trust-list');

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach((child, i) => {
            child.style.transition = `opacity 0.6s ${easing} ${i * 0.08}s, transform 0.6s ${easing} ${i * 0.08}s`;
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    staggerContainers.forEach(container => {
      Array.from(container.children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
      });
      staggerObserver.observe(container);
    });
  }

  // --- 5b. Cinematic Story Animation ---
  const storyBlock = document.getElementById('storyBlock');
  if (storyBlock && !prefersReducedMotion) {
    const storyLines = storyBlock.querySelectorAll('.story-line');

    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          storyLines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add('visible');
            }, i * 300);
          });
          storyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    storyObserver.observe(storyBlock);
  } else if (storyBlock) {
    storyBlock.querySelectorAll('.story-line').forEach(l => l.classList.add('visible'));
  }

  // --- 6. Animated Number Counters ---
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/([\d.]+)/);
        if (!match) return;

        const target = parseFloat(match[1]);
        const suffix = text.replace(match[1], '').trim();
        const prefix = text.startsWith('+') ? '+' : text.startsWith('<') ? '<' : '';
        const isDecimal = text.includes('.');
        const duration = 1500;
        const start = performance.now();

        const step = (now) => {
          const elapsed = Math.min((now - start) / duration, 1);
          // Ease out cubic
          const progress = 1 - Math.pow(1 - elapsed, 3);
          const current = target * progress;

          if (isDecimal) {
            el.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            el.textContent = prefix + Math.round(current) + suffix;
          }

          if (elapsed < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.proof-number[data-count], .stat-value[data-count], .mini-stat-value[data-count]').forEach(el => {
    countObserver.observe(el);
  });

  // --- 7. Parallax on Mouse Move (Desktop) ---
  const heroSection = document.querySelector('.hero');
  const parallaxElements = document.querySelectorAll('.parallax-element');
  const parallaxImg = document.querySelector('.parallax-img');

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches && heroSection) {
    let rafId = null;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    const lerp = (a, b, f) => a + (b - a) * f;

    const updateParallax = () => {
      currentX = lerp(currentX, mouseX, 0.08);
      currentY = lerp(currentY, mouseY, 0.08);

      parallaxElements.forEach(el => {
        el.style.transform = `translate(${currentX * -1.2}px, ${currentY * -1.2}px)`;
      });
      if (parallaxImg) {
        parallaxImg.style.transform = `translate(${currentX * 0.4}px, ${currentY * 0.4}px)`;
      }
      rafId = requestAnimationFrame(updateParallax);
    };

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    }, { passive: true });

    heroSection.addEventListener('mouseenter', () => {
      rafId = requestAnimationFrame(updateParallax);
    });

    heroSection.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      const returnToOrigin = () => {
        currentX = lerp(currentX, 0, 0.06);
        currentY = lerp(currentY, 0, 0.06);
        mouseX = 0;
        mouseY = 0;
        parallaxElements.forEach(el => {
          el.style.transform = `translate(${currentX * -1.2}px, ${currentY * -1.2}px)`;
        });
        if (parallaxImg) {
          parallaxImg.style.transform = `translate(${currentX * 0.4}px, ${currentY * 0.4}px)`;
        }
        if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
          requestAnimationFrame(returnToOrigin);
        }
      };
      requestAnimationFrame(returnToOrigin);
    });
  }

  // --- 8. Smooth Scroll Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // --- 9. Button Hover Ripple Effect ---
  if (!prefersReducedMotion) {
    document.querySelectorAll('.btn-primary, .btn-whatsapp').forEach(btn => {
      btn.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position:absolute;width:0;height:0;border-radius:50%;
          background:rgba(255,255,255,0.12);transform:translate(-50%,-50%);
          left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
          animation:ripple .6s ease-out forwards;pointer-events:none;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    const style = document.createElement('style');
    style.textContent = '@keyframes ripple{to{width:300px;height:300px;opacity:0}}';
    document.head.appendChild(style);
  }

  // --- 10. Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--color-white)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- 11. Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 12. Card Spotlight Effect (Mouse-tracking radial gradient) ---
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.service-card, .app-showcase-card, .value-item, .pricing-card, .timeline-step, .problem-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }

  // --- 13. Magnetic Buttons ---
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary.btn-lg, .btn-whatsapp.btn-lg').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        btn.style.transform = '';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  // --- 14. Keyboard Accessibility ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      mobileMenuBtn.focus();
    }
  });

  // --- 15. i18n hook: react when the active language changes ---
  // The i18n engine (js/i18n.js) swaps all text in-place, so reveal/counter
  // animations don't need to re-run. We only close the mobile drawer if it
  // happens to be open (user picked the language from the mobile switcher).
  document.addEventListener('languagechange', () => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

});
