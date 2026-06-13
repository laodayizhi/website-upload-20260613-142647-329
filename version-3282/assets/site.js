(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function setupMobileMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function setupHero() {
        var wrap = document.querySelector("[data-hero]");
        if (!wrap) {
            return;
        }
        var slides = Array.prototype.slice.call(wrap.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(wrap.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("hero-slide-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var nextIndex = parseInt(dot.getAttribute("data-hero-dot"), 10) || 0;
                show(nextIndex);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function uniqueValues(cards, key) {
        var values = [];
        cards.forEach(function (card) {
            var value = card.getAttribute(key) || "";
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        return values.sort(function (a, b) {
            return String(b).localeCompare(String(a), "zh-Hans-CN");
        });
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var list = scope.parentElement.querySelector("[data-card-list]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            var queryInput = scope.querySelector("[data-filter-query]");
            var yearSelect = scope.querySelector("[data-filter-year]");
            var regionSelect = scope.querySelector("[data-filter-region]");
            var typeSelect = scope.querySelector("[data-filter-type]");
            fillSelect(yearSelect, uniqueValues(cards, "data-year"));
            fillSelect(regionSelect, uniqueValues(cards, "data-region"));
            fillSelect(typeSelect, uniqueValues(cards, "data-type"));

            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";
            if (queryInput && initialQuery) {
                queryInput.value = initialQuery;
            }

            function apply() {
                var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var region = regionSelect ? regionSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-type") || "",
                        card.getAttribute("data-genre") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();
                    var matched = true;
                    if (query && haystack.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (year && card.getAttribute("data-year") !== year) {
                        matched = false;
                    }
                    if (region && card.getAttribute("data-region") !== region) {
                        matched = false;
                    }
                    if (type && card.getAttribute("data-type") !== type) {
                        matched = false;
                    }
                    card.classList.toggle("filtered-out", !matched);
                });
            }

            [queryInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    window.setupMoviePlayer = function (videoId, coverId, streamUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        if (!video || !cover || !streamUrl) {
            return;
        }
        var initialized = false;
        function loadStream() {
            if (initialized) {
                return;
            }
            initialized = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        function start() {
            loadStream();
            cover.classList.add("is-hidden");
            video.controls = true;
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {});
            }
        }
        cover.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
    };

    ready(function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
    });
})();
