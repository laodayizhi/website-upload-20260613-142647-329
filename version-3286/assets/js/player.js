(function () {
  window.initStaticPlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var playButton = document.getElementById(options.playId);
    var muteButton = document.getElementById(options.muteId);
    var fullButton = document.getElementById(options.fullId);
    var status = document.getElementById(options.statusId);
    var source = options.source;
    var hls = null;
    var prepared = false;
    var pendingPlay = false;

    function showStatus(text) {
      if (status) {
        status.textContent = text;
        status.classList.add('show');
      }
    }

    function hideStatus() {
      if (status) {
        status.classList.remove('show');
        status.textContent = '';
      }
    }

    function updateButtons() {
      var label = video.paused ? '播放' : '暂停';
      if (playButton) {
        playButton.textContent = label;
        playButton.setAttribute('aria-label', label);
      }
      if (overlay) {
        overlay.classList.toggle('hidden', !video.paused);
      }
      if (muteButton) {
        muteButton.textContent = video.muted ? '取消静音' : '静音';
      }
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;
      hideStatus();

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (pendingPlay) {
            video.play().catch(function () {});
          }
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showStatus('播放暂不可用');
          }
        });
        return;
      }

      showStatus('播放暂不可用');
    }

    function start() {
      prepare();
      pendingPlay = true;
      video.play().catch(function () {});
    }

    function togglePlay() {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    }

    if (!video) {
      return;
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }
    if (playButton) {
      playButton.addEventListener('click', togglePlay);
    }
    if (muteButton) {
      muteButton.addEventListener('click', function () {
        video.muted = !video.muted;
        updateButtons();
      });
    }
    if (fullButton) {
      fullButton.addEventListener('click', function () {
        var box = video.closest('.player-shell') || video;
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (box.requestFullscreen) {
          box.requestFullscreen();
        }
      });
    }

    video.addEventListener('click', togglePlay);
    video.addEventListener('play', updateButtons);
    video.addEventListener('pause', updateButtons);
    video.addEventListener('ended', updateButtons);
    video.addEventListener('loadedmetadata', hideStatus);
    updateButtons();
  };
})();
