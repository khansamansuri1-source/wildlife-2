/* =========================================================================
   WILDLIFE GIR RESORT — CINEMATIC INTERACTIONS
   Additive layer. Does not touch existing script.js behaviour
   (header.luxury-scrolled toggle, lightbox, owl carousel all stay intact).
   Uses GSAP if available (loaded via CDN before this file); degrades
   gracefully to plain IntersectionObserver + CSS transitions if not.
   ========================================================================= */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------------------
       1. SCROLL PROGRESS BAR
       --------------------------------------------------------------- */
    var bar = document.createElement('div');
    bar.id = 'gir-scroll-progress';
    document.body.appendChild(bar);
    function updateProgress() {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var max = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      var pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* ---------------------------------------------------------------
       2. CUSTOM CURSOR (fine pointer devices only)
       --------------------------------------------------------------- */
    var isFinePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (isFinePointer && !reduceMotion) {
      document.body.classList.add('gir-cursor-on');
      var dot = document.createElement('div');
      dot.className = 'gir-cursor-dot';
      var ring = document.createElement('div');
      ring.className = 'gir-cursor-ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);

      var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
      });
      (function ringLoop() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
        requestAnimationFrame(ringLoop);
      })();

      var hoverTargets = 'a, button, .luxury-btn, .gallery-item, .luxury-masonry-item, .service1, input, textarea, select';
      document.addEventListener('mouseover', function (e) {
        if (e.target.closest && e.target.closest(hoverTargets)) ring.classList.add('is-active');
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest && e.target.closest(hoverTargets)) ring.classList.remove('is-active');
      });
    }

    /* ---------------------------------------------------------------
       3. HERO — word-level text reveal + slow entrance
       --------------------------------------------------------------- */
    var heroHeading = document.querySelector('.home-hero .hero-copy h1');
    if (heroHeading) {
      var html = heroHeading.innerHTML;
      // Wrap each top-level text run / inner span content into word spans
      var temp = document.createElement('div');
      temp.innerHTML = html;
      var wrapWords = function (node) {
        var frag = document.createDocumentFragment();
        node.childNodes.forEach(function (child) {
          if (child.nodeType === 3) {
            child.textContent.split(/(\s+)/).forEach(function (word) {
              if (word.trim() === '') {
                frag.appendChild(document.createTextNode(word));
              } else {
                var outer = document.createElement('span');
                outer.className = 'gir-word';
                var inner = document.createElement('span');
                inner.textContent = word;
                outer.appendChild(inner);
                frag.appendChild(outer);
              }
            });
          } else if (child.nodeType === 1) {
            var clone = child.cloneNode(false);
            clone.appendChild(wrapWords(child));
            frag.appendChild(clone);
          }
        });
        return frag;
      };
      heroHeading.innerHTML = '';
      heroHeading.appendChild(wrapWords(temp));
      heroHeading.closest('.hero-copy').classList.add('gir-split');

      var wordSpans = heroHeading.querySelectorAll('.gir-word > span');
      if (hasGSAP && !reduceMotion) {
        gsap.timeline({ delay: 0.35 })
          .to(wordSpans, {
            y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.045
          })
          .from('.home-hero .section-kicker', { opacity: 0, x: -16, duration: 0.7, ease: 'power2.out' }, 0)
          .from('.home-hero .hero-copy p', { opacity: 0, y: 16, duration: 0.8, ease: 'power2.out' }, '-=0.6')
          .from('.home-hero .hero-actions a', { opacity: 0, y: 16, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.5')
          .from('.home-hero .scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.4');
      } else {
        wordSpans.forEach(function (s) { s.style.transform = 'translateY(0)'; s.style.transition = 'transform .8s ease'; });
      }
    }

    /* ---------------------------------------------------------------
       4. SCROLL REVEALS for cards / sections not already on AOS
       --------------------------------------------------------------- */
    var revealSelectors = [
      '.luxury-room-card .bloglist-post',
      '.service1',
      '.gallery-list > ul > li',
      '.luxury-masonry-item',
      '.luxury-feature-card',
      '.luxury-package-card',
      '.luxury-info-card',
      '.customer-review.luxury-testimonial',
      '.luxury-contact-card',
      '.luxury-booking-form'
    ];
    var revealEls = document.querySelectorAll(revealSelectors.join(','));
    revealEls.forEach(function (el, i) {
      if (!el.hasAttribute('data-aos')) {
        el.classList.add('gir-reveal');
        el.style.transitionDelay = (Math.min(i % 4, 4) * 0.08) + 's';
      }
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('gir-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.gir-reveal, .gir-reveal-scale').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.gir-reveal, .gir-reveal-scale').forEach(function (el) { el.classList.add('gir-in'); });
    }

    /* ---------------------------------------------------------------
       5. PARALLAX on hero background + section parallax bgs
       --------------------------------------------------------------- */
    if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
      document.querySelectorAll('.parallax, .fixed-bg2').forEach(function (el) {
        gsap.to(el, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }

    /* ---------------------------------------------------------------
       6. MAGNETIC BUTTONS
       --------------------------------------------------------------- */
    if (isFinePointer && !reduceMotion) {
      document.querySelectorAll('.luxury-btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var x = e.clientX - r.left - r.width / 2;
          var y = e.clientY - r.top - r.height / 2;
          if (hasGSAP) {
            gsap.to(btn, { x: x * 0.22, y: y * 0.35, duration: 0.4, ease: 'power3.out' });
          } else {
            btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.3) + 'px)';
          }
        });
        btn.addEventListener('mouseleave', function () {
          if (hasGSAP) gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
          else btn.style.transform = 'translate(0,0)';
        });
      });
    }

    /* ---------------------------------------------------------------
       7. ANIMATED COUNTERS — injected into the About section
       --------------------------------------------------------------- */
    var highlights = document.querySelector('.luxury-about-highlights');
    if (highlights && !document.querySelector('.gir-stats')) {
      var stats = [
        { value: 12, suffix: '+', label: 'Acres of Wild Greenery' },
        { value: 30, suffix: 'K+', label: 'Guests Hosted' },
        { value: 98, suffix: '%', label: 'Guest Satisfaction' },
        { value: 24, suffix: '/7', label: 'Concierge Service' }
      ];
      var wrap = document.createElement('div');
      wrap.className = 'gir-stats';
      stats.forEach(function (s) {
        var item = document.createElement('div');
        item.className = 'gir-stat';
        item.innerHTML = '<strong data-count="' + s.value + '">0<span class="gir-gold-suffix">' + s.suffix + '</span></strong><span>' + s.label + '</span>';
        wrap.appendChild(item);
      });
      highlights.insertAdjacentElement('afterend', wrap);

      var counted = false;
      var countEls = wrap.querySelectorAll('strong[data-count]');
      var runCount = function () {
        if (counted) return;
        counted = true;
        countEls.forEach(function (el) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffixEl = el.querySelector('.gir-gold-suffix');
          var obj = { val: 0 };
          if (hasGSAP) {
            gsap.to(obj, {
              val: target, duration: 1.6, ease: 'power2.out',
              onUpdate: function () {
                el.firstChild.textContent = Math.round(obj.val);
              },
              onComplete: function () { el.firstChild.textContent = target; }
            });
          } else {
            el.firstChild.textContent = target;
          }
        });
      };
      if ('IntersectionObserver' in window) {
        var statIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { runCount(); statIo.disconnect(); }
          });
        }, { threshold: 0.4 });
        statIo.observe(wrap);
      } else {
        runCount();
      }
    }

    /* ---------------------------------------------------------------
       8. ROOM / FEATURE CARD TILT (subtle 3D depth on hover)
       --------------------------------------------------------------- */
    if (isFinePointer && hasGSAP && !reduceMotion) {
      document.querySelectorAll('.luxury-feature-card, .luxury-package-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateX: py * -4, rotateY: px * 4, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
        });
      });
    }
  });
})();
