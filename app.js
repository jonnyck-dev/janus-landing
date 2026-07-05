var JANUS_APP_URL = 'https://looking-gold-legend-okay.trycloudflare.com';

document.addEventListener('DOMContentLoaded', function() {
    function redirectToApp(e) {
        e.preventDefault();
        window.open(JANUS_APP_URL, '_blank');
    }

    // Todos los botones "Probar ahora" van directo a la app
    var ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(function(btn) {
        btn.href = JANUS_APP_URL;
        btn.addEventListener('click', redirectToApp);
    });

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
});
