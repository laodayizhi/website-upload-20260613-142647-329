(function () {
    function setupPlayer() {
        var video = document.getElementById('movieVideo');
        var cover = document.getElementById('playCover');
        if (!video || !cover) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var ready = false;
        var hls = null;
        function prepare() {
            if (ready || !stream) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                return;
            }
            video.src = stream;
        }
        function start() {
            prepare();
            cover.classList.add('is-hidden');
            video.controls = true;
            var playRequest = video.play();
            if (playRequest && typeof playRequest.catch === 'function') {
                playRequest.catch(function () {
                    cover.classList.remove('is-hidden');
                });
            }
        }
        cover.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            cover.classList.add('is-hidden');
        });
        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }
    document.addEventListener('DOMContentLoaded', setupPlayer);
}());
