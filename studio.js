// JANUS Studio — base de operaciones del cliente.
(function () {
  var _uid = null;
  var _email = null;
  var _jobsCache = null;

  function t(key) {
    return window.janusTr ? window.janusTr(key) : key;
  }

  function statusClass(s) {
    return 'studio-job-status--' + (s || 'pending');
  }

  function statusText(s) {
    return t('studio.status.' + (s || 'pending'));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString(); }
    catch (e) { return ''; }
  }

  function renderCreditsLogin() {
    var box = document.getElementById('studio-credits');
    if (!box) return;
    box.innerHTML = '<button type="button" class="studio-credits-login" id="studio-credits-login">' + t('studio.credits_login') + '</button>';
    var btn = document.getElementById('studio-credits-login');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); window.janusOpenModal(); });
  }

  function loadCredits() {
    var box = document.getElementById('studio-credits');
    if (!box) return;
    if (!_uid) { renderCreditsLogin(); return; }
    window._supabase.from('user_credits')
      .select('plan, status, expires_at')
      .eq('user_id', _uid)
      .eq('status', 'available')
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true })
      .then(function (r) {
        if (r.error) { box.innerHTML = '<p class="studio-muted">' + t('studio.credits_empty') + '</p>'; return; }
        var rows = (r.data || []).filter(function (c) { return c && c.plan && c.expires_at; });
        if (!rows.length) { box.innerHTML = '<p class="studio-muted">' + t('studio.credits_empty') + '</p>'; return; }
        var now = Date.now();
        var counter = '<div class="janus-pf-credits-counter">' +
          t('auth.profile.credits_count').replace('%s', String(rows.length)) + '</div>';
        var items = rows.map(function (c) {
          var days = Math.max(0, Math.ceil((new Date(c.expires_at).getTime() - now) / 86400000));
          var exp = days === 0 ? t('auth.profile.credits_today') : t('auth.profile.credits_expires').replace('%s', String(days));
          return '<div class="janus-pf-credit-item">' +
            '<span class="janus-pf-credit-left">' +
              '<span class="janus-pf-credit-icon janus-pf-credit-icon--' + c.plan + '" data-plan="' + c.plan + '" aria-hidden="true">' +
                '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/></svg>' +
              '</span>' +
              '<span class="janus-pf-credit-plan">' + (t('pr.' + c.plan + '.name') || c.plan) + '</span>' +
            '</span>' +
            '<span class="janus-pf-credit-exp">' + exp + '</span>' +
          '</div>';
        });
        box.innerHTML = counter + items.join('');
      });
  }

  function jobItem(j) {
    return '<div class="studio-job">' +
      '<span class="studio-job-url">' + (j.video_url || '') + '</span>' +
      '<span class="studio-job-meta">' +
        '<span class="studio-job-date">' + fmtDate(j.created_at) + '</span>' +
        '<span class="studio-job-status ' + statusClass(j.status) + '">' + statusText(j.status) + '</span>' +
      '</span>' +
    '</div>';
  }

  function renderJobs() {
    var queueBox = document.getElementById('studio-queue');
    var histBox = document.getElementById('studio-history');
    var formCard = document.getElementById('studio-form-card');
    if (!_jobsCache) return;
    var rows = _jobsCache;
    var queue = rows.filter(function (j) { return j.status === 'pending' || j.status === 'processing' || j.status === 'pending_payment'; });
    var hist = rows.filter(function (j) { return j.status === 'done' || j.status === 'failed' || j.status === 'cancelled'; });

    if (queueBox) queueBox.innerHTML = queue.length
      ? queue.map(jobItem).join('')
      : '<p class="studio-muted">' + t('studio.queue_empty') + '</p>';

    if (histBox) histBox.innerHTML = hist.length
      ? hist.map(jobItem).join('')
      : '<p class="studio-muted">' + t('studio.history_empty') + '</p>';

    if (formCard) formCard.style.display = queue.length ? 'none' : '';
  }

  function loadJobs() {
    if (!_uid) { _jobsCache = []; renderJobs(); return; }
    window._supabase.from('dub_jobs')
      .select('id, video_url, status, created_at')
      .eq('user_id', _uid)
      .order('created_at', { ascending: false })
      .then(function (r) {
        if (r.error) return;
        _jobsCache = (r.data || []).filter(function (j) { return j && j.video_url; });
        renderJobs();
      });
  }

  function createJob(url, lang, status, cb) {
    window._supabase.from('dub_jobs')
      .insert({ user_id: _uid, email: _email, video_url: url, target_lang: lang, status: status })
      .then(function (r) {
        cb(!r.error);
      });
  }

  function consumeCredit(creditId, cb) {
    window._supabase.from('user_credits')
      .update({ status: 'used', used_at: new Date().toISOString() })
      .eq('id', creditId)
      .then(cb);
  }

  function wireForm() {
    var form = document.getElementById('studio-form');
    var msg = document.getElementById('studio-msg');
    var btn = document.getElementById('studio-submit');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!msg || !btn) return;
      var url = (document.getElementById('studio-url').value || '').trim();
      var lang = (document.getElementById('studio-lang') || {}).value || 'es';
      if (!url || url.indexOf('http') !== 0) {
        msg.textContent = t('studio.err_url');
        msg.className = 'studio-msg studio-msg-error';
        return;
      }
      // Sin sesión: cliente nuevo va directo al embudo (Pase Esencial)
      if (!_uid) {
        var ck = window.JANUS_CHECKOUT && window.JANUS_CHECKOUT.essential;
        if (ck) { window.location.href = ck; return; }
        msg.textContent = t('studio.err_nocredit');
        msg.className = 'studio-msg studio-msg-error';
        return;
      }
      // Animación de cargando dentro del botón mientras se valida el crédito
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.textContent = t('studio.adding');
      msg.textContent = '';
      msg.className = 'studio-msg';
      setTimeout(function () {
        window._supabase.from('user_credits')
          .select('id')
          .eq('user_id', _uid)
          .eq('status', 'available')
          .gte('expires_at', new Date().toISOString())
          .limit(1)
          .then(function (cr) {
            var credit = cr.data && cr.data[0];
            var reset = function () {
              btn.disabled = false;
              btn.classList.remove('is-loading');
              btn.textContent = t('studio.start');
            };
            if (cr.error || !credit) {
              // Sin créditos: guarda el trabajo como pendiente de pago (mejor esfuerzo)
              // y redirige siempre al checkout Esencial (misma estrategia que sin sesión).
              createJob(url, lang, 'pending_payment', function () {
                reset();
                var ck = window.JANUS_CHECKOUT && window.JANUS_CHECKOUT.essential;
                if (ck) { window.location.href = ck; return; }
                msg.textContent = t('studio.err_nocredit');
                msg.className = 'studio-msg studio-msg-error';
              });
              return;
            }
            // Con crédito: crea el trabajo 'en cola' y consume el crédito
            createJob(url, lang, 'pending', function (ok) {
              if (!ok) { reset(); msg.textContent = t('studio.err_submit'); msg.className = 'studio-msg studio-msg-error'; return; }
              consumeCredit(credit.id, function () {
                reset();
                document.getElementById('studio-url').value = '';
                msg.textContent = t('studio.job_submitted');
                msg.className = 'studio-msg';
                loadCredits();
                loadJobs();
              });
            });
          });
      }, 2500);
    });
  }

  function init() {
    if (!window.janusIsConfigured || !window.janusInitSupabase) return;
    window.janusInitSupabase();
    var app = document.getElementById('studio-app');
    if (app) app.style.display = 'block';
    wireForm();
    window._supabase.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (session && session.user) {
        _uid = session.user.id;
        _email = session.user.email || null;
        loadCredits();
        loadJobs();
      } else {
        loadCredits(); // muestra "Iniciar sesión para ver créditos"
        loadJobs();    // cola/historial vacíos
      }
    });
  }

  document.addEventListener('janus:langchange', function () {
    loadCredits();
    if (_jobsCache) renderJobs();
  });

  init();
})();
