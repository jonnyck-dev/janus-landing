// JANUS Landing — Auth (Supabase: Google OAuth + Magic Link + Email/Password)
// Tras registrarse, los botones navbar/hero disparan el mailto original.

// ============================================================
// CONFIGURACIÓN — reemplaza con tus valores de Supabase.
// En Vercel: Settings → Environment Variables, o edita aquí directo.
// La anon key es PÚBLICA (protegida por Row Level Security).
// ============================================================
var SUPABASE_URL = 'https://wefxhvrdwckqtytxtbos.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_mhBHcFeFaBjEACWQjpOZuQ_CqJ5SfWH';

// URL de la app JANUS (Cloudflare tunnel) — usada solo para chequear sesión viva.
var JANUS_APP_URL = 'https://buf-sat-open-hall.trycloudflare.com';

// mailto original que disparan navbar/hero tras registrarse
var MAILTO_HREF = 'mailto:jonnyck.dev@icloud.com?subject=Quiero%20probar%20JANUS&body=Hola%2C%20me%20gustar%C3%ADa%20probar%20JANUS%20para%20doblar%20mis%20videos.';

var _supabase = null;
var _afterAuthMailto = false;

function janusInitSupabase() {
    if (_supabase || typeof supabase === 'undefined') return _supabase;
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    _supabase.auth.onAuthStateChange(function (event, session) {
        if (event === 'SIGNED_IN' && _afterAuthMailto) {
            _afterAuthMailto = false;
            window.location.href = MAILTO_HREF;
        }
    });

    return _supabase;
}

function janusIsConfigured() {
    return SUPABASE_URL && SUPABASE_URL.indexOf('TU_SUPABASE') !== 0 &&
           SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.indexOf('TU_SUPABASE') !== 0;
}

// ---------- Modal ----------
function janusBuildModal() {
    if (document.getElementById('janus-auth-modal')) return;

    var overlay = document.createElement('div');
    overlay.id = 'janus-auth-modal';
    overlay.className = 'janus-auth-overlay';
    overlay.innerHTML =
        '<div class="janus-auth-card" role="dialog" aria-modal="true" aria-label="Regístrate en JANUS">' +
            '<button class="janus-auth-close" id="janus-auth-close" aria-label="Cerrar">✕</button>' +
            '<div class="janus-auth-logo">JANUS</div>' +
            '<h2 class="janus-auth-title">Regístrate para probar JANUS</h2>' +
            '<p class="janus-auth-sub">Crea tu cuenta y te enviaremos los datos para doblar tu video.</p>' +

            '<button class="janus-auth-btn janus-auth-google" id="janus-btn-google">' +
                '<span class="janus-auth-gicon">G</span> Continuar con Google' +
            '</button>' +

            '<div class="janus-auth-divider"><span>o</span></div>' +

            '<form class="janus-auth-form" id="janus-auth-form" novalidate>' +
                '<input type="email" id="janus-auth-email" class="janus-auth-input" placeholder="tu@email.com" autocomplete="email" required>' +
                '<div class="janus-auth-pw-wrap" id="janus-auth-pw-wrap" style="display:none;">' +
                    '<input type="password" id="janus-auth-password" class="janus-auth-input" placeholder="Contraseña (mín. 6)" autocomplete="current-password">' +
                '</div>' +
                '<button type="submit" class="janus-auth-btn janus-auth-primary" id="janus-btn-submit">Enviar enlace mágico</button>' +
            '</form>' +

            '<button class="janus-auth-toggle" id="janus-auth-toggle">Usar contraseña en su lugar</button>' +

            '<p class="janus-auth-msg" id="janus-auth-msg"></p>' +
            '<p class="janus-auth-foot">Al continuar aceptas los Términos de JANUS Studio.</p>' +
        '</div>';

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) janusCloseModal();
    });
    document.getElementById('janus-auth-close').addEventListener('click', janusCloseModal);
    document.getElementById('janus-btn-google').addEventListener('click', janusLoginGoogle);
    document.getElementById('janus-auth-toggle').addEventListener('click', janusTogglePassword);
    document.getElementById('janus-auth-form').addEventListener('submit', janusSubmitForm);
}

var _passwordMode = false;
function janusTogglePassword() {
    _passwordMode = !_passwordMode;
    var wrap = document.getElementById('janus-auth-pw-wrap');
    var toggle = document.getElementById('janus-auth-toggle');
    var submit = document.getElementById('janus-btn-submit');
    if (_passwordMode) {
        wrap.style.display = 'block';
        toggle.textContent = 'Enviar enlace mágico en su lugar';
        submit.textContent = 'Registrarme / Entrar';
    } else {
        wrap.style.display = 'none';
        toggle.textContent = 'Usar contraseña en su lugar';
        submit.textContent = 'Enviar enlace mágico';
    }
}

function janusOpenModal() {
    janusBuildModal();
    var overlay = document.getElementById('janus-auth-modal');
    overlay.classList.add('janus-auth-open');
    document.body.style.overflow = 'hidden';
}

function janusCloseModal() {
    var overlay = document.getElementById('janus-auth-modal');
    if (!overlay) return;
    overlay.classList.remove('janus-auth-open');
    document.body.style.overflow = '';
    janusSetMsg('');
}

function janusSetMsg(text, isError) {
    var el = document.getElementById('janus-auth-msg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'janus-auth-msg' + (isError ? ' janus-auth-msg-error' : '');
}

// ---------- Acciones ----------
function janusLoginGoogle() {
    if (!janusIsConfigured()) {
        janusSetMsg('Faltan las credenciales de Supabase (auth.js).', true);
        return;
    }
    janusInitSupabase();
    _afterAuthMailto = true;
    var redirect = window.location.origin + window.location.pathname;
    _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirect }
    });
}

function janusSubmitForm(e) {
    e.preventDefault();
    if (!janusIsConfigured()) {
        janusSetMsg('Faltan las credenciales de Supabase (auth.js).', true);
        return;
    }
    janusInitSupabase();
    var email = document.getElementById('janus-auth-email').value.trim();
    if (!email || email.indexOf('@') === -1) {
        janusSetMsg('Ingresa un email válido.', true);
        return;
    }
    janusSetMsg('Procesando...');

    if (_passwordMode) {
        var password = document.getElementById('janus-auth-password').value;
        if (!password || password.length < 6) {
            janusSetMsg('La contraseña debe tener al menos 6 caracteres.', true);
            return;
        }
        // Intenta login; si no existe, registra.
        _supabase.auth.signInWithPassword({ email: email, password: password })
            .then(function (res) {
                if (res.error) {
                    return _supabase.auth.signUp({ email: email, password: password });
                }
                return res;
            })
            .then(function (res) {
                if (res.error) {
                    janusSetMsg(res.error.message, true);
                    return;
                }
                if (res.data.session) {
                    window.location.href = MAILTO_HREF;
                } else {
                    janusSetMsg('Revisa tu email para confirmar tu cuenta.');
                }
            })
            .catch(function (err) {
                janusSetMsg('Error: ' + err.message, true);
            });
    } else {
        // Magic link
        _afterAuthMailto = true;
        _supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        })
        .then(function (res) {
            if (res.error) {
                janusSetMsg(res.error.message, true);
                _afterAuthMailto = false;
                return;
            }
            janusSetMsg('¡Listo! Revisa tu correo y haz clic en el enlace para continuar.');
        })
        .catch(function (err) {
            janusSetMsg('Error: ' + err.message, true);
            _afterAuthMailto = false;
        });
    }
}

// ---------- Hook de botones ----------
function janusWireButtons() {
    var buttons = ['btn-nav-try', 'btn-hero-try'];
    buttons.forEach(function (id) {
        var btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!janusIsConfigured()) {
                // Fallback: comportamiento original (mailto) si no hay Supabase.
                window.location.href = MAILTO_HREF;
                return;
            }
            janusInitSupabase();
            _supabase.auth.getSession().then(function (res) {
                if (res.data && res.data.session) {
                    window.location.href = MAILTO_HREF;
                } else {
                    janusOpenModal();
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', janusWireButtons);
