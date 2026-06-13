(function () {
  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playButton');
    var attached = false;
    var hlsInstance = null;

    function attachStream() {
      if (!video || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        return;
      }
      video.src = streamUrl;
    }

    function startPlayback() {
      if (!video) {
        return;
      }
      attachStream();
      if (button) {
        button.classList.add('is-hidden');
      }
      var playing = video.play();
      if (playing && typeof playing.catch === 'function') {
        playing.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
