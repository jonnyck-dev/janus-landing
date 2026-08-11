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
var JANUS_APP_URL = 'https://app.janusdubber.website';

// mailto original que disparan navbar/hero tras registrarse
var MAILTO_HREF = 'mailto:support@janusdubber.website?subject=Quiero%20probar%20JANUS&body=Hola%2C%20me%20gustar%C3%ADa%20probar%20JANUS%20para%20doblar%20mis%20videos.';

function janusTr(key) {
    if (typeof window.janusT === 'function') return window.janusT(key);
    var es = window.JANUS_I18N && window.JANUS_I18N.es;
    return (es && es[key]) || key;
}

function janusErr(msg) {
    return janusTr('chat.error_prefix').replace('%s', msg);
}

var _supabase = null;
var _afterAuthMailto = false;
var _postAuthCallback = null;

function janusMailtoIntent() {
    var has = _afterAuthMailto;
    try { has = has || sessionStorage.getItem('janus_mailto_after_auth') === '1'; } catch (e) {}
    return has;
}
function janusMarkMailtoIntent() {
    _afterAuthMailto = true;
    try { sessionStorage.setItem('janus_mailto_after_auth', '1'); } catch (e) {}
}
function janusClearMailtoIntent() {
    _afterAuthMailto = false;
    try { sessionStorage.removeItem('janus_mailto_after_auth'); } catch (e) {}
}
function janusConsumeMailtoIntent() {
    var has = janusMailtoIntent();
    janusClearMailtoIntent();
    return has;
}

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
                janusClearMailtoIntent();
                cb(session);
            } else if (janusConsumeMailtoIntent()) {
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
        '<div class="janus-auth-card" role="dialog" aria-modal="true" aria-label="' + janusTr('auth.modal.title') + '">' +
            '<button class="janus-auth-close" id="janus-auth-close" aria-label="' + janusTr('nav.close_aria') + '">✕</button>' +
            '<div class="janus-auth-logo">JANUS</div>' +
            '<h2 class="janus-auth-title">' + janusTr('auth.modal.title') + '</h2>' +
            '<p class="janus-auth-sub">' + janusTr('auth.modal.sub') + '</p>' +

            '<button class="janus-auth-btn janus-auth-google" id="janus-btn-google">' +
                '<span class="janus-auth-gicon">G</span><span class="janus-auth-google-text">' + janusTr('auth.google') + '</span>' +
            '</button>' +

            '<div class="janus-auth-divider"><span>' + janusTr('auth.or') + '</span></div>' +

            '<form class="janus-auth-form" id="janus-auth-form" novalidate>' +
                '<input type="email" id="janus-auth-email" class="janus-auth-input" placeholder="' + janusTr('auth.email_placeholder') + '" autocomplete="email" required>' +
                '<div class="janus-auth-pw-wrap" id="janus-auth-pw-wrap" style="display:none;">' +
                    '<input type="password" id="janus-auth-password" class="janus-auth-input" placeholder="' + janusTr('auth.pw_placeholder') + '" autocomplete="current-password">' +
                '</div>' +
                '<button type="submit" class="janus-auth-btn janus-auth-primary" id="janus-btn-submit">' + (_passwordMode ? janusTr('auth.submit_btn') : janusTr('auth.magic_btn')) + '</button>' +
            '</form>' +

            '<button class="janus-auth-toggle" id="janus-auth-toggle">' + (_passwordMode ? janusTr('auth.toggle_magic') : janusTr('auth.toggle_pw')) + '</button>' +

            '<p class="janus-auth-msg" id="janus-auth-msg"></p>' +
            '<p class="janus-auth-foot">' + janusTr('auth.foot') + '</p>' +
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
        toggle.textContent = janusTr('auth.toggle_magic');
        submit.textContent = janusTr('auth.submit_btn');
    } else {
        wrap.style.display = 'none';
        toggle.textContent = janusTr('auth.toggle_pw');
        submit.textContent = janusTr('auth.magic_btn');
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
        janusSetMsg(janusTr('auth.err_credentials'), true);
        return;
    }
    janusInitSupabase();
    var redirect = window.location.origin + window.location.pathname;
    _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirect }
    });
}

function janusSubmitForm(e) {
    e.preventDefault();
    if (!janusIsConfigured()) {
        janusSetMsg(janusTr('auth.err_credentials'), true);
        return;
    }
    janusInitSupabase();
    var email = document.getElementById('janus-auth-email').value.trim();
    if (!email || email.indexOf('@') === -1) {
        janusSetMsg(janusTr('auth.err_email'), true);
        return;
    }
    janusSetMsg(janusTr('auth.processing'));

    if (_passwordMode) {
        var password = document.getElementById('janus-auth-password').value;
        if (!password || password.length < 6) {
            janusSetMsg(janusTr('auth.err_password'), true);
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
                    janusSetMsg(janusErr(res.error.message), true);
                    return;
                }
                if (res.data.session) {
                    if (_postAuthCallback) {
                        var cb = _postAuthCallback;
                        _postAuthCallback = null;
                        janusCloseModal();
                        janusClearMailtoIntent();
                        cb(res.data.session);
                    } else if (janusConsumeMailtoIntent()) {
                        window.location.href = MAILTO_HREF;
                    } else {
                        janusCloseModal();
                        janusRenderNav(res.data.session);
                    }
                } else {
                    janusSetMsg(janusTr('auth.check_email'));
                }
            })
            .catch(function (err) {
                janusSetMsg(janusErr(err.message), true);
            });
    } else {
        // Magic link
        _supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        })
        .then(function (res) {
            if (res.error) {
                janusSetMsg(janusErr(res.error.message), true);
                _afterAuthMailto = false;
                return;
            }
            janusSetMsg(janusTr('auth.sent'));
        })
        .catch(function (err) {
            janusSetMsg(janusErr(err.message), true);
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
    // "Ver créditos" abre el perfil (que gestiona login si no hay sesión)
    var creditsBtn = document.getElementById('btn-nav-credits');
    if (creditsBtn) creditsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        janusOpenProfile();
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
                janusMarkMailtoIntent();
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
    var navGuest = document.getElementById('janus-nav-guest');
    var navTry = document.getElementById('btn-nav-try');
    if (!navUser || !navTry) return;

    var navStudio = document.getElementById('btn-nav-studio');
    var navAdmin = document.getElementById('btn-nav-admin');

    if (!session || !session.user) {
        navUser.style.display = 'none';
        navTry.style.display = '';
        if (navGuest) navGuest.style.display = 'block';
        if (navStudio) navStudio.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
        return;
    }

    navTry.style.display = '';
    navUser.style.display = 'block';
    if (navGuest) navGuest.style.display = 'none';
    if (navStudio) navStudio.style.display = '';
    if (navAdmin) navAdmin.style.display = (session.user.email === 'admin@janusdubber.website') ? '' : 'none';

    var user = session.user;
    var meta = user.user_metadata || {};
    // "Panel Admin" solo visible para el administrador
    var adminItem = document.getElementById('janus-menu-admin');
    if (adminItem) adminItem.style.display = (user.email === 'admin@janusdubber.website') ? '' : 'none';
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
    if (chip && menu) {
        chip.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('open');
        });
        document.getElementById('janus-menu-profile').addEventListener('click', function () {
            menu.classList.remove('open');
            janusOpenProfile();
        });
        var studioItem = document.getElementById('janus-menu-studio');
        if (studioItem) studioItem.addEventListener('click', function () {
            menu.classList.remove('open');
            window.location.href = 'studio.html';
        });
        var adminItem = document.getElementById('janus-menu-admin');
        if (adminItem) adminItem.addEventListener('click', function () {
            menu.classList.remove('open');
            window.location.href = 'admin.html';
        });
        document.getElementById('janus-menu-logout').addEventListener('click', function () {
            menu.classList.remove('open');
            janusLogout();
        });
    }

    var guestChip = document.getElementById('janus-guest-chip');
    var guestMenu = document.getElementById('janus-guest-menu');
    if (guestChip && guestMenu) {
        guestChip.addEventListener('click', function (e) {
            e.stopPropagation();
            guestMenu.classList.toggle('open');
        });
        var loginBtn = document.getElementById('janus-menu-login');
        if (loginBtn) loginBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            guestMenu.classList.remove('open');
            janusClearMailtoIntent();
            janusOpenModal();
        });
        var signupBtn = document.getElementById('janus-menu-signup');
        if (signupBtn) signupBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            guestMenu.classList.remove('open');
            janusClearMailtoIntent();
            janusOpenModal();
        });
    }

    document.addEventListener('click', function () {
        if (menu) menu.classList.remove('open');
        if (guestMenu) guestMenu.classList.remove('open');
    });
}

// ---------- Modal de perfil ----------
function janusBuildProfileModal() {
    if (document.getElementById('janus-profile-modal')) return;

    var overlay = document.createElement('div');
    overlay.id = 'janus-profile-modal';
    overlay.className = 'janus-auth-overlay';
    overlay.innerHTML =
        '<div class="janus-auth-card janus-profile-card" role="dialog" aria-modal="true" aria-label="' + janusTr('auth.profile.title') + '">' +
            '<button class="janus-auth-close" id="janus-pf-close" aria-label="' + janusTr('nav.close_aria') + '">✕</button>' +
            '<div class="janus-auth-logo">JANUS</div>' +
            '<h2 class="janus-auth-title">' + janusTr('auth.profile.title') + '</h2>' +
            '<p class="janus-auth-sub">' + janusTr('auth.profile.sub') + '</p>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" for="janus-pf-name">' + janusTr('auth.profile.name_label') + '</label>' +
                '<form class="janus-profile-row" id="janus-pf-name-form">' +
                    '<input type="text" id="janus-pf-name" class="janus-auth-input" placeholder="' + janusTr('auth.profile.name_placeholder') + '" autocomplete="name">' +
                    '<button type="submit" class="janus-auth-btn janus-auth-primary janus-profile-save">' + janusTr('auth.profile.save') + '</button>' +
                '</form>' +
            '</div>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" for="janus-pf-email">' + janusTr('auth.profile.email_label') + '</label>' +
                '<form class="janus-profile-row" id="janus-pf-email-form">' +
                    '<input type="email" id="janus-pf-email" class="janus-auth-input" placeholder="' + janusTr('auth.profile.email_placeholder') + '" autocomplete="email">' +
                    '<button type="submit" class="janus-auth-btn janus-auth-primary janus-profile-save">' + janusTr('auth.profile.save') + '</button>' +
                '</form>' +
                '<p class="janus-profile-note">' + janusTr('auth.profile.email_note') + '</p>' +
                '<p class="janus-pf-email-status" id="janus-pf-email-status"></p>' +
                '<button type="button" class="janus-pf-verify-btn" id="janus-pf-verify-email" style="display:none;">' + janusTr('auth.profile.verify_email') + '</button>' +
            '</div>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" for="janus-pf-pw">' + janusTr('auth.profile.pw_label') + '</label>' +
                '<form class="janus-profile-row" id="janus-pf-pw-form">' +
                    '<input type="password" id="janus-pf-pw" class="janus-auth-input" placeholder="' + janusTr('auth.profile.pw_placeholder') + '" autocomplete="new-password">' +
                    '<button type="submit" class="janus-auth-btn janus-auth-primary janus-profile-save">' + janusTr('auth.profile.save') + '</button>' +
                '</form>' +
            '</div>' +

            '<div class="janus-profile-section">' +
                '<label class="janus-profile-label" id="janus-pf-credits-title">' + janusTr('auth.profile.credits_title') + '</label>' +
                '<div class="janus-pf-credits" id="janus-pf-credits">' +
                    '<p class="janus-profile-note">' + janusTr('auth.profile.credits_empty') + '</p>' +
                '</div>' +
                '<a href="index.html#pricing" class="janus-pf-credits-cta">' + janusTr('auth.profile.credits_cta') + '</a>' +
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
    document.getElementById('janus-pf-verify-email').addEventListener('click', janusVerifyEmail);
}

function janusVerifyEmail() {
    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        var user = res.data && res.data.session && res.data.session.user;
        if (!user || !user.email) return;
        janusProfileMsg(janusTr('auth.profile.saving'));
        _supabase.auth.resend({ type: 'signup', email: user.email })
            .then(function (r) {
                if (r.error) {
                    janusProfileMsg(janusErr(r.error.message), true);
                    return;
                }
                janusProfileMsg(janusTr('auth.profile.verify_sent'));
            });
    });
}

function janusOpenProfile() {
    janusBuildProfileModal();
    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        var session = res.data && res.data.session;
        if (!session || !session.user) {
            janusCloseProfile();
            janusClearMailtoIntent();
            janusOpenModal();
            return;
        }
        var user = session.user;
        var meta = user.user_metadata || {};
        document.getElementById('janus-pf-email').value = user.email || '';
        document.getElementById('janus-pf-name').value = meta.full_name || '';
        janusRenderEmailStatus(user);
        _supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
            .then(function (r) {
                if (r.data && r.data.full_name) {
                    document.getElementById('janus-pf-name').value = r.data.full_name;
                }
            });
        janusProfileMsg('');
        document.getElementById('janus-profile-modal').classList.add('janus-auth-open');
        document.body.style.overflow = 'hidden';
        janusLoadCredits();
    });
}

function janusRenderEmailStatus(user) {
    var statusEl = document.getElementById('janus-pf-email-status');
    var btnEl = document.getElementById('janus-pf-verify-email');
    if (!statusEl || !btnEl) return;
    var confirmed = user && user.email_confirmed_at;
    if (confirmed) {
        statusEl.textContent = janusTr('auth.profile.email_verified');
        statusEl.className = 'janus-pf-email-status janus-pf-email-status--ok';
        btnEl.style.display = 'none';
    } else {
        statusEl.textContent = janusTr('auth.profile.email_unverified');
        statusEl.className = 'janus-pf-email-status janus-pf-email-status--warn';
        btnEl.style.display = '';
    }
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

var janusCreditsCache = null;

function janusLoadCredits() {
    var box = document.getElementById('janus-pf-credits');
    if (!box) return;
    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        var session = res.data && res.data.session;
        if (!session || !session.user) return;
        _supabase.from('user_credits')
            .select('plan, status, expires_at')
            .eq('user_id', session.user.id)
            .eq('status', 'available')
            .gte('expires_at', new Date().toISOString())
            .order('expires_at', { ascending: true })
            .then(function (r) {
                if (r.error) return;
                janusCreditsCache = (r.data || []).filter(function (c) {
                    return c && c.plan && c.expires_at;
                });
                janusRenderCredits();
            });
    });
}

function janusRenderCredits() {
    var box = document.getElementById('janus-pf-credits');
    if (!box) return;
    if (!janusCreditsCache || !janusCreditsCache.length) {
        box.innerHTML = '<p class="janus-profile-note">' + janusTr('auth.profile.credits_empty') + '</p>';
        return;
    }
    var now = Date.now();
    var counter = '<div class="janus-pf-credits-counter">' +
        janusTr('auth.profile.credits_count').replace('%s', String(janusCreditsCache.length)) +
        '</div>';
    var items = janusCreditsCache.map(function (c) {
        var planName = janusTr('pr.' + c.plan + '.name') || c.plan;
        var days = Math.max(0, Math.ceil((new Date(c.expires_at).getTime() - now) / 86400000));
        var exp = days === 0 ? janusTr('auth.profile.credits_today') : janusTr('auth.profile.credits_expires').replace('%s', String(days));
        return '<div class="janus-pf-credit-item">' +
            '<span class="janus-pf-credit-left">' +
                '<span class="janus-pf-credit-icon janus-pf-credit-icon--' + c.plan + '" data-plan="' + c.plan + '" aria-hidden="true">' +
                    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/></svg>' +
                '</span>' +
                '<span class="janus-pf-credit-plan">' + planName + '</span>' +
            '</span>' +
            '<span class="janus-pf-credit-exp">' + exp + '</span>' +
        '</div>';
    });
    box.innerHTML = counter + items.join('');
}

function janusRefreshAuthStrings() {
    var t = janusTr;
    var el;
    if ((el = document.getElementById('janus-auth-title'))) el.textContent = t('auth.modal.title');
    if ((el = document.getElementById('janus-auth-sub'))) el.textContent = t('auth.modal.sub');
    var googleText = document.querySelector('#janus-btn-google .janus-auth-google-text');
    if (googleText) googleText.textContent = t('auth.google');
    var dividerSpan = document.querySelector('.janus-auth-divider span');
    if (dividerSpan) dividerSpan.textContent = t('auth.or');
    if ((el = document.getElementById('janus-auth-email'))) el.setAttribute('placeholder', t('auth.email_placeholder'));
    if ((el = document.getElementById('janus-auth-password'))) el.setAttribute('placeholder', t('auth.pw_placeholder'));
    if ((el = document.getElementById('janus-btn-submit'))) el.textContent = _passwordMode ? t('auth.submit_btn') : t('auth.magic_btn');
    if ((el = document.getElementById('janus-auth-toggle'))) el.textContent = _passwordMode ? t('auth.toggle_magic') : t('auth.toggle_pw');
    var foot = document.querySelector('.janus-auth-foot');
    if (foot) foot.textContent = t('auth.foot');
    var authCard = document.getElementById('janus-auth-modal');
    if (authCard) authCard.setAttribute('aria-label', t('auth.modal.title'));
    if ((el = document.getElementById('janus-auth-close'))) el.setAttribute('aria-label', t('nav.close_aria'));

    if ((el = document.getElementById('janus-pf-close'))) el.setAttribute('aria-label', t('nav.close_aria'));
    if ((el = document.getElementById('janus-profile-modal'))) el.setAttribute('aria-label', t('auth.profile.title'));
    if ((el = document.getElementById('janus-pf-name-form'))) {
        var lbl = el.parentElement.querySelector('.janus-profile-label');
        if (lbl) lbl.textContent = t('auth.profile.name_label');
    }
    if ((el = document.getElementById('janus-pf-name'))) el.setAttribute('placeholder', t('auth.profile.name_placeholder'));
    if ((el = document.getElementById('janus-pf-email-form'))) {
        var lbl2 = el.parentElement.querySelector('.janus-profile-label');
        if (lbl2) lbl2.textContent = t('auth.profile.email_label');
    }
    if ((el = document.getElementById('janus-pf-email'))) el.setAttribute('placeholder', t('auth.profile.email_placeholder'));
    if ((el = document.getElementById('janus-pf-pw-form'))) {
        var lbl3 = el.parentElement.querySelector('.janus-profile-label');
        if (lbl3) lbl3.textContent = t('auth.profile.pw_label');
    }
    if ((el = document.getElementById('janus-pf-pw'))) el.setAttribute('placeholder', t('auth.profile.pw_placeholder'));
    document.querySelectorAll('.janus-profile-save').forEach(function (b) {
        b.textContent = t('auth.profile.save');
    });
    if ((el = document.getElementById('janus-profile-modal'))) {
        var h2 = el.querySelector('.janus-auth-title');
        if (h2) h2.textContent = t('auth.profile.title');
        var sub = el.querySelector('.janus-auth-sub');
        if (sub) sub.textContent = t('auth.profile.sub');
        var note = el.querySelector('.janus-profile-note');
        if (note) note.textContent = t('auth.profile.email_note');
        var credTitle = document.getElementById('janus-pf-credits-title');
        if (credTitle) credTitle.textContent = t('auth.profile.credits_title');
        var credCta = el.querySelector('.janus-pf-credits-cta');
        if (credCta) credCta.textContent = t('auth.profile.credits_cta');
        var verifyBtn = document.getElementById('janus-pf-verify-email');
        if (verifyBtn) verifyBtn.textContent = t('auth.profile.verify_email');
        var statusEl = document.getElementById('janus-pf-email-status');
        if (statusEl) {
            var u = _supabase && _supabase.auth ? _supabase.auth.getSession() : null;
            if (u && u.then) {
                u.then(function (res) {
                    var usr = res.data && res.data.session && res.data.session.user;
                    if (usr) janusRenderEmailStatus(usr);
                });
            }
        }
        janusRenderCredits();
    }
}

function janusSaveName(e) {
    e.preventDefault();
    var name = document.getElementById('janus-pf-name').value.trim();
    if (!name) {
        janusProfileMsg(janusTr('auth.profile.err_name'), true);
        return;
    }
    janusProfileMsg(janusTr('auth.profile.saving'));
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
                janusProfileMsg(janusTr('auth.profile.name_updated'));
                janusRenderNav(res.data.session);
            });
    });
}

function janusSaveEmail(e) {
    e.preventDefault();
    var email = document.getElementById('janus-pf-email').value.trim();
    if (!email || email.indexOf('@') === -1) {
        janusProfileMsg(janusTr('auth.profile.err_email'), true);
        return;
    }
    janusProfileMsg(janusTr('auth.profile.saving'));
    janusInitSupabase();
    _supabase.auth.updateUser({ email: email }).then(function (r) {
        if (r.error) {
            janusProfileMsg(janusErr(r.error.message), true);
            return;
        }
        janusProfileMsg(janusTr('auth.profile.email_sent'));
    });
}

function janusSavePassword(e) {
    e.preventDefault();
    var pw = document.getElementById('janus-pf-pw').value;
    if (!pw || pw.length < 6) {
        janusProfileMsg(janusTr('auth.err_password'), true);
        return;
    }
    janusProfileMsg(janusTr('auth.profile.saving'));
    janusInitSupabase();
    _supabase.auth.updateUser({ password: pw }).then(function (r) {
        if (r.error) {
            janusProfileMsg(janusErr(r.error.message), true);
            return;
        }
        document.getElementById('janus-pf-pw').value = '';
        janusProfileMsg(janusTr('auth.profile.pw_updated'));
    });
}

document.addEventListener('DOMContentLoaded', function () {
    janusWireButtons();
    janusInitUserNav();
});

document.addEventListener('janus:langchange', function () {
    janusRefreshAuthStrings();
});
