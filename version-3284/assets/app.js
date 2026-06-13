(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupMenu() {
        var toggle = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = panel.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.textContent = open ? '×' : '☰';
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        if (!slides.length || !dots.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    show(current + 1);
                }, 5200);
            });
        });
        timer = setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function setupFiltering() {
        var lists = Array.prototype.slice.call(document.querySelectorAll('.searchable-list'));
        if (!lists.length) {
            return;
        }
        var inputs = Array.prototype.slice.call(document.querySelectorAll('.movie-filter-input'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        inputs.forEach(function (input) {
            if (!input.value && query) {
                input.value = query;
            }
        });
        function apply(value) {
            var term = normalize(value);
            lists.forEach(function (list) {
                var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-search') || card.textContent);
                    var match = !term || text.indexOf(term) !== -1;
                    card.hidden = !match;
                    if (match) {
                        visible += 1;
                    }
                });
                var empty = list.parentElement.querySelector('.no-results');
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            });
        }
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                apply(input.value);
            });
        });
        document.querySelectorAll('.quick-filters button').forEach(function (button) {
            button.addEventListener('click', function () {
                document.querySelectorAll('.quick-filters button').forEach(function (item) {
                    item.classList.remove('is-active');
                });
                button.classList.add('is-active');
                var value = button.getAttribute('data-filter') === '全部' ? '' : button.getAttribute('data-filter');
                inputs.forEach(function (input) {
                    input.value = value || '';
                });
                apply(value);
            });
        });
        if (query) {
            apply(query);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupFiltering();
    });
}());
