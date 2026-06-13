(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function nextSlide() {
      if (slides.length > 0) {
        showSlide((current + 1) % slides.length);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        if (timer) {
          clearInterval(timer);
          timer = setInterval(nextSlide, 5000);
        }
      });
    });

    if (slides.length > 1) {
      timer = setInterval(nextSlide, 5000);
    }
  }

  var filterInput = document.querySelector('[data-local-filter]');
  var filterArea = document.querySelector('[data-filter-area]');
  var yearFilter = document.querySelector('[data-year-filter]');

  function applyFilter() {
    if (!filterArea) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    var items = filterArea.querySelectorAll('[data-search]');
    items.forEach(function (item) {
      var haystack = item.getAttribute('data-search') || '';
      var itemYear = item.getAttribute('data-year') || '';
      var matchedText = !keyword || haystack.indexOf(keyword) !== -1;
      var matchedYear = !year || itemYear === year;
      item.classList.toggle('is-filtered-out', !(matchedText && matchedYear));
    });
  }

  if (filterInput) {
    var query = new URLSearchParams(window.location.search).get('q');
    if (query) {
      filterInput.value = query;
    }
    filterInput.addEventListener('input', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }

  applyFilter();
})();
