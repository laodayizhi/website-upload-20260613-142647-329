(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, pos) {
        slide.classList.toggle('active', pos === current);
      });
      dots.forEach(function (dot, pos) {
        dot.classList.toggle('active', pos === current);
      });
    }

    dots.forEach(function (dot, pos) {
      dot.addEventListener('click', function () {
        showSlide(pos);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panelItem) {
      var root = panelItem.parentElement || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
      var empty = root.querySelector('[data-empty-state]');
      var controls = Array.prototype.slice.call(panelItem.querySelectorAll('[data-filter]'));

      function applyFilters() {
        var values = {};
        controls.forEach(function (control) {
          values[control.getAttribute('data-filter')] = normalize(control.value);
        });

        var visibleCount = 0;
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.textContent
          ].join(' '));
          var year = normalize(card.getAttribute('data-year'));
          var region = normalize(card.getAttribute('data-region'));
          var type = normalize(card.getAttribute('data-type'));
          var category = normalize(card.getAttribute('data-category'));
          var ok = true;

          if (values.keyword && text.indexOf(values.keyword) === -1) {
            ok = false;
          }
          if (values.year && year !== values.year) {
            ok = false;
          }
          if (values.region && region !== values.region) {
            ok = false;
          }
          if (values.type && type !== values.type) {
            ok = false;
          }
          if (values.category && category !== values.category) {
            ok = false;
          }

          card.style.display = ok ? '' : 'none';
          if (ok) {
            visibleCount += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('show', visibleCount === 0);
        }
      }

      controls.forEach(function (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      });

      applyFilters();
    });

    var searchRoot = document.querySelector('[data-search-page]');
    if (searchRoot) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q') || '';
      var input = searchRoot.querySelector('[data-filter="keyword"]');
      if (input && q) {
        input.value = q;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
})();
