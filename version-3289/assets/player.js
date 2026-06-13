(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var video = document.querySelector('.movie-video');
    var overlay = document.querySelector('.player-overlay');
    if (!video || typeof currentVideoUrl === 'undefined') {
      return;
    }

    var attached = false;
    var hlsInstance = null;

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentVideoUrl;
      } else if (window.Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          maxBufferLength: 45,
          enableWorker: true
        });
        hlsInstance.loadSource(currentVideoUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = currentVideoUrl;
      }
    }

    function playVideo() {
      attachSource();
      video.controls = true;
      if (overlay) {
        overlay.classList.add('hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
