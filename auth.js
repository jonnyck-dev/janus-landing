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
var _postAuthCallback = null;

function janusSetPostAuthCallback(fn) {
    _postAuthCallback = fn;
}

function janusInitSupabase() {
    if (_supabase || typeof supabase === 'undefined') return _supabase;
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    _supabase.auth.onAuthStateChange(function (event, session) {
        if (event === 'SIGNED_IN') {
            janusRenderNav(session);
            if (_postAuthCallback) {
                var cb = _postAuthCallback;
                _postAuthCallback = null;
                _afterAuthMailto = false;
                cb(session);
            } else if (_afterAuthMailto) {
                _afterAuthMailto = false;
                window.location.href = MAILTO_HREF;
            }
        } else if (event === 'SIGNED_OUT') {
            janusRenderNav(null);
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
            '<p class="janus-auth-foot">Al continuar aceptas los Términos de JANUS.</p>' +
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
    if (!_postAuthCallback) {
        _afterAuthMailto = true;
    }
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
                    if (_postAuthCallback) {
                        var cb = _postAuthCallback;
                        _postAuthCallback = null;
                        janusCloseModal();
                        cb(res.data.session);
                    } else {
                        window.location.href = MAILTO_HREF;
                    }
                } else {
                    janusSetMsg('Revisa tu email para confirmar tu cuenta.');
                }
            })
            .catch(function (err) {
                janusSetMsg('Error: ' + err.message, true);
            });
    } else {
        // Magic link
        if (!_postAuthCallback) {
            _afterAuthMailto = true;
        }
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
        if (btn) janusWireCta(btn);
    });
    // CTAs genéricos (pricing, etc.)
    document.querySelectorAll('.janus-cta').forEach(function (btn) {
        janusWireCta(btn);
    });
}

function janusWireCta(btn) {
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
}

// ---------- Nav de usuario (chip + menú) ----------
function janusFillUserChip(name, avatarUrl) {
    var nameEl = document.getElementById('janus-user-name');
    var imgEl = document.getElementById('janus-user-avatar-img');
    var fbEl = document.getElementById('janus-user-avatar-fallback');
    if (!nameEl || !imgEl || !fbEl) return;

    var display = (name || 'Usuario').trim();
    nameEl.textContent = display;
    fbEl.textContent = display.charAt(0).toUpperCase();

    imgEl.onerror = function () {
        imgEl.style.display = 'none';
        fbEl.style.display = 'inline-flex';
    };
    if (avatarUrl) {
        imgEl.src = avatarUrl;
        imgEl.style.display = 'block';
        fbEl.style.display = 'none';
    } else {
        imgEl.style.display = 'none';
        fbEl.style.display = 'inline-flex';
    }
}

function janusRenderNav(session) {
    var navUser = document.getElementById('janus-nav-user');
    var navTry = document.getElementById('btn-nav-try');
    if (!navUser || !navTry) return;

    if (!session || !session.user) {
        navUser.style.display = 'none';
        navTry.style.display = '';
        return;
    }

    navTry.style.display = 'none';
    navUser.style.display = 'block';

    var user = session.user;
    var meta = user.user_metadata || {};
    // Relleno inmediato con datos de la sesión
    janusFillUserChip(meta.full_name || user.email, meta.avatar_url);
    // Refinar con la tabla profiles (fuente de verdad: avatar de Google guardado en DB)
    _supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle()
        .then(function (res) {
            if (res.data) {
                janusFillUserChip(
                    res.data.full_name || meta.full_name || user.email,
                    res.data.avatar_url || meta.avatar_url
                );
            }
        });
}

function janusLogout() {
    janusInitSupabase();
    _supabase.auth.signOut().then(function () {
        janusRenderNav(null);
    });
}

function janusInitUserNav() {
    if (!janusIsConfigured()) return;
    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        janusRenderNav(res.data && res.data.session);
    });

    var chip = document.getElementById('janus-user-chip');
    var menu = document.getElementById('janus-user-menu');
    if (!chip || !menu) return;

    chip.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('open');
    });
    document.addEventListener('click', function () {
        menu.classList.remove('open');
    });
    document.getElementById('janus-menu-profile').addEventListener('click', function () {
        menu.classList.remove('open');
        janusOpenProfile();
    });
    document.getElementById('janus-menu-logout').addEventListener('click', function () {
        menu.classList.remove('open');
        janusLogout();
    });
}

// ---------- Modal de perfil ----------
function janusBuildProfileModal() {
    if (document.getElementById('janus-profile-modal')) return;

    var overlay = document.createElement('div');
    overlay.id = 'janus-profile-modal';
    overlay.className = 'janus-auth-overlay';
    overlay.innerHTML =
        '<div class="janus-auth-card janus-profile-card" role="dialog" aria-modal="true" aria-label="Mi perfil">' +
            '<button class="janus-auth-close" id="janus-pf-close" aria-label="Cerrar">✕</button>' +
            '<div class="janus-auth-logo">JANUS</div>' +
            '<h2 class="janus-auth-title">Mi perfil</h2>' +
            '<p class="janus-auth-sub">Actualiza tu nombre, correo o contraseña.</p>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" for="janus-pf-name">Nombre</label>' +
                '<form class="janus-profile-row" id="janus-pf-name-form">' +
                    '<input type="text" id="janus-pf-name" class="janus-auth-input" placeholder="Tu nombre" autocomplete="name">' +
                    '<button type="submit" class="janus-auth-btn janus-auth-primary janus-profile-save">Guardar</button>' +
                '</form>' +
            '</div>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" for="janus-pf-email">Correo</label>' +
                '<form class="janus-profile-row" id="janus-pf-email-form">' +
                    '<input type="email" id="janus-pf-email" class="janus-auth-input" placeholder="tu@email.com" autocomplete="email">' +
                    '<button type="submit" class="janus-auth-btn janus-auth-primary janus-profile-save">Guardar</button>' +
                '</form>' +
                '<p class="janus-profile-note">Al cambiar el correo te enviaremos un enlace de confirmación al nuevo email.</p>' +
            '</div>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" for="janus-pf-pw">Nueva contraseña</label>' +
                '<form class="janus-profile-row" id="janus-pf-pw-form">' +
                    '<input type="password" id="janus-pf-pw" class="janus-auth-input" placeholder="Mín. 6 caracteres" autocomplete="new-password">' +
                    '<button type="submit" class="janus-auth-btn janus-auth-primary janus-profile-save">Guardar</button>' +
                '</form>' +
            '</div>' +

            '<p class="janus-auth-msg" id="janus-pf-msg"></p>' +
        '</div>';

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) janusCloseProfile();
    });
    document.getElementById('janus-pf-close').addEventListener('click', janusCloseProfile);
    document.getElementById('janus-pf-name-form').addEventListener('submit', janusSaveName);
    document.getElementById('janus-pf-email-form').addEventListener('submit', janusSaveEmail);
    document.getElementById('janus-pf-pw-form').addEventListener('submit', janusSavePassword);
}

function janusOpenProfile() {
    janusBuildProfileModal();
    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        var session = res.data && res.data.session;
        if (!session || !session.user) {
            janusCloseProfile();
            janusOpenModal();
            return;
        }
        var user = session.user;
        var meta = user.user_metadata || {};
        document.getElementById('janus-pf-email').value = user.email || '';
        document.getElementById('janus-pf-name').value = meta.full_name || '';
        _supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
            .then(function (r) {
                if (r.data && r.data.full_name) {
                    document.getElementById('janus-pf-name').value = r.data.full_name;
                }
            });
        janusProfileMsg('');
        document.getElementById('janus-profile-modal').classList.add('janus-auth-open');
        document.body.style.overflow = 'hidden';
    });
}

function janusCloseProfile() {
    var overlay = document.getElementById('janus-profile-modal');
    if (!overlay) return;
    overlay.classList.remove('janus-auth-open');
    document.body.style.overflow = '';
    janusProfileMsg('');
}

function janusProfileMsg(text, isError) {
    var el = document.getElementById('janus-pf-msg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'janus-auth-msg' + (isError ? ' janus-auth-msg-error' : '');
}

function janusSaveName(e) {
    e.preventDefault();
    var name = document.getElementById('janus-pf-name').value.trim();
    if (!name) {
        janusProfileMsg('Ingresa tu nombre.', true);
        return;
    }
    janusProfileMsg('Guardando...');
    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        var user = res.data.session.user;
        _supabase.from('profiles')
            .update({ full_name: name, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .then(function (r) {
                if (r.error) {
                    janusProfileMsg(r.error.message, true);
                    return;
                }
                // Sincroniza metadata (el trigger de registro la usa como fallback)
                _supabase.auth.updateUser({ data: { full_name: name } });
                janusProfileMsg('Nombre actualizado.');
                janusRenderNav(res.data.session);
            });
    });
}

function janusSaveEmail(e) {
    e.preventDefault();
    var email = document.getElementById('janus-pf-email').value.trim();
    if (!email || email.indexOf('@') === -1) {
        janusProfileMsg('Ingresa un correo válido.', true);
        return;
    }
    janusProfileMsg('Guardando...');
    janusInitSupabase();
    _supabase.auth.updateUser({ email: email }).then(function (r) {
        if (r.error) {
            janusProfileMsg(r.error.message, true);
            return;
        }
        janusProfileMsg('Te enviamos un enlace de confirmación al nuevo correo. El cambio se aplica al confirmarlo.');
    });
}

function janusSavePassword(e) {
    e.preventDefault();
    var pw = document.getElementById('janus-pf-pw').value;
    if (!pw || pw.length < 6) {
        janusProfileMsg('La contraseña debe tener al menos 6 caracteres.', true);
        return;
    }
    janusProfileMsg('Guardando...');
    janusInitSupabase();
    _supabase.auth.updateUser({ password: pw }).then(function (r) {
        if (r.error) {
            janusProfileMsg(r.error.message, true);
            return;
        }
        document.getElementById('janus-pf-pw').value = '';
        janusProfileMsg('Contraseña actualizada.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    janusWireButtons();
    janusInitUserNav();
});
