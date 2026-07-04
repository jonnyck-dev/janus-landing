document.addEventListener('DOMContentLoaded', function() {
    const btnTryNow = document.getElementById('btn-try-now');
    
    if (btnTryNow) {
        btnTryNow.addEventListener('click', function(e) {
            e.preventDefault();
            alert('El enlace al tunnel de Cloudflare se configurará aquí. Por ahora, usa la URL de tu servidor local.');
        });
    }
    
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cta') {
                e.preventDefault();
                const target = document.querySelector(href);
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