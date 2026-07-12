var JANUS_APP_URL = 'https://joyce-prescribed-inc-maiden.trycloudflare.com';

document.addEventListener('DOMContentLoaded', function() {
    function redirectToApp(e) {
        e.preventDefault();
        window.open(JANUS_APP_URL, '_blank');
    }

    // Último CTA (final de página) abre la app vía Cloudflare
    var finalCta = document.getElementById('btn-try-now');
    if (finalCta) {
        finalCta.href = JANUS_APP_URL;
        finalCta.addEventListener('click', redirectToApp);
    }

    // Smooth scroll solo para links internos que NO son CTA
    var smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(link) {
        if (link.classList.contains('btn-primary')) return;
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Demo videos carousel + toggle
    var demos = [
        { name: 'Gameplay', original: 'assets/video_demos/video_piewdepie.mp4', dubbed: 'assets/video_demos/video_dubbed_piewdepie.mp4', poster: 'assets/video_demos/poster_video_piewdepie.jpg', desc: 'Escena del juego Piewdiepie doblada al español' },
        { name: 'Review', original: 'assets/video_demos/video_review.mp4', dubbed: 'assets/video_demos/video_dubbed_review.mp4', poster: 'assets/video_demos/poster_video_review.jpg', desc: 'Review de producto con voz clonada' },
        { name: 'Anime', original: 'assets/video_demos/video_anime.mp4', dubbed: 'assets/video_demos/video_dubbed_anime.mp4', poster: 'assets/video_demos/poster_video_anime.jpg', desc: 'Anime doblado con sincronización labial' }
    ];
    var demoIndex = 0;
    var demoMode = 'original';
    var demoVideo = document.getElementById('demo-video');
    var toggleBtns = document.querySelectorAll('.demo-toggle-btn');
    var dots = document.querySelectorAll('.demo-dot');
    var demoLabel = document.getElementById('demo-label');
    var demoDescription = document.getElementById('demo-description');

    function loadDemo(index, forcePlay) {
        demoIndex = index;
        var demo = demos[index];
        var wasPlaying = !demoVideo.paused;

        demoVideo.poster = demo.poster;
        demoVideo.src = demo[demoMode];
        demoVideo.load();

        if (wasPlaying || forcePlay) {
            demoVideo.addEventListener('loadedmetadata', function onMeta() {
                demoVideo.removeEventListener('loadedmetadata', onMeta);
                demoVideo.play();
            });
        }

        // Update dots
        dots.forEach(function(d, i) {
            d.classList.toggle('active', i === index);
        });

        // Update label
        demoLabel.textContent = demo.name;

        // Update description
        demoDescription.textContent = demo.desc;
    }

    // Toggle Original/Doblado
    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var mode = btn.getAttribute('data-mode');
            if (mode === demoMode) return;

            demoMode = mode;
            toggleBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var wasPlaying = !demoVideo.paused;
            var currentTime = demoVideo.currentTime || 0;

            demoVideo.poster = demos[demoIndex].poster;
            demoVideo.src = demos[demoIndex][mode];
            demoVideo.load();

            if (wasPlaying) {
                demoVideo.addEventListener('loadedmetadata', function onMeta() {
                    demoVideo.removeEventListener('loadedmetadata', onMeta);
                    demoVideo.currentTime = currentTime;
                    demoVideo.play();
                });
            }
        });
    });

    // Carousel dots
    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var index = parseInt(dot.getAttribute('data-index'));
            if (index === demoIndex) return;
            loadDemo(index);
        });
    });

    // Arrow navigation
    document.querySelector('.demo-arrow-left').addEventListener('click', function() {
        var prev = (demoIndex - 1 + demos.length) % demos.length;
        loadDemo(prev);
    });

    document.querySelector('.demo-arrow-right').addEventListener('click', function() {
        var next = (demoIndex + 1) % demos.length;
        loadDemo(next);
    });

    // Touch swipe (mobile) — only on the video element, not on controls below
    var touchStartX = null;
    var touchStartY = null;

    demoVideo.addEventListener('touchstart', function(e) {
        var rect = demoVideo.getBoundingClientRect();
        var touchY = e.changedTouches[0].clientY - rect.top;
        // Ignore touches in bottom 25% (native controls area) to avoid
        // triggering demo change when scrubbing the seek bar
        if (touchY > rect.height * 0.75) {
            touchStartX = null;
            touchStartY = null;
            return;
        }
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    demoVideo.addEventListener('touchend', function(e) {
        if (touchStartX === null || touchStartY === null) return;
        var deltaX = e.changedTouches[0].screenX - touchStartX;
        var deltaY = e.changedTouches[0].screenY - touchStartY;
        var minSwipe = 50;

        if (Math.abs(deltaX) > minSwipe && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX > 0) {
                var prev = (demoIndex - 1 + demos.length) % demos.length;
                loadDemo(prev);
            } else {
                var next = (demoIndex + 1) % demos.length;
                loadDemo(next);
            }
        }

        touchStartX = null;
        touchStartY = null;
    }, { passive: true });

    // Initial autoplay (muted) — arranca desde el primer demo
    loadDemo(0, true);

    // Auto-advance: cuando un video termina, pasa al siguiente
    demoVideo.addEventListener('ended', function() {
        var next = (demoIndex + 1) % demos.length;
        loadDemo(next, true);
    });

    // Primer click en el video quita el mute
    var hasBeenUnmuted = false;
    demoVideo.addEventListener('click', function() {
        if (!hasBeenUnmuted) {
            demoVideo.muted = false;
            hasBeenUnmuted = true;
        }
    });
});
