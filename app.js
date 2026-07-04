var JANUS_APP_URL = 'https://planning-trustees-portraits-care.trycloudflare.com';

document.addEventListener('DOMContentLoaded', function() {
    var btnTryNow = document.getElementById('btn-try-now');
    
    if (btnTryNow) {
        btnTryNow.href = JANUS_APP_URL;
        btnTryNow.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(JANUS_APP_URL, '_blank');
        });
    }

    var navBtn = document.querySelector('.navbar .btn-primary');
    if (navBtn) {
        navBtn.href = JANUS_APP_URL;
        navBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(JANUS_APP_URL, '_blank');
        });
    }
    
    var smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href !== '#' && href !== '#cta') {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});