(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var previous = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = setInterval(function () {
          show(current + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      if (previous) {
        previous.addEventListener('click', function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          start();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
          start();
        });
      });

      show(0);
      start();
    });

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
      var target = document.querySelector(input.getAttribute('data-filter-input'));
      if (!target) {
        return;
      }
      var cards = Array.prototype.slice.call(target.querySelectorAll('[data-search]'));
      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = card.getAttribute('data-search').toLowerCase();
          card.style.display = haystack.indexOf(keyword) !== -1 ? '' : 'none';
        });
      });
    });

    var resultRoot = document.querySelector('[data-search-results]');
    if (resultRoot && Array.isArray(window.MOVIE_SEARCH_INDEX)) {
      var params = new URLSearchParams(window.location.search);
      var query = (params.get('q') || '').trim();
      var input = document.querySelector('[data-search-page-input]');
      if (input) {
        input.value = query;
      }
      var lower = query.toLowerCase();
      var results = lower
        ? window.MOVIE_SEARCH_INDEX.filter(function (movie) {
            return movie.title.toLowerCase().indexOf(lower) !== -1 ||
              movie.oneLine.toLowerCase().indexOf(lower) !== -1 ||
              movie.tags.join(' ').toLowerCase().indexOf(lower) !== -1 ||
              movie.genre.toLowerCase().indexOf(lower) !== -1 ||
              movie.region.toLowerCase().indexOf(lower) !== -1;
          }).slice(0, 80)
        : window.MOVIE_SEARCH_INDEX.slice(0, 40);

      if (!results.length) {
        resultRoot.innerHTML = '<div class="card-zen content-card"><h2>未找到相关内容</h2><p>可以更换关键词，或从分类页面继续浏览更多影片。</p></div>';
        return;
      }

      resultRoot.innerHTML = results.map(function (movie) {
        return '<a class="movie-card card-zen" href="movies/' + escapeHtml(movie.file) + '">' +
          '<div class="poster-wrap"><img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy"><span class="poster-badge">' + escapeHtml(movie.type) + '</span><span class="poster-year">' + escapeHtml(movie.year) + '</span></div>' +
          '<div class="card-body"><h2 class="movie-title line-clamp-2">' + escapeHtml(movie.title) + '</h2><p class="movie-desc line-clamp-2">' + escapeHtml(movie.oneLine) + '</p><div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.score) + ' 分</span></div></div>' +
          '</a>';
      }).join('');
    }
  });
})();
