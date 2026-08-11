// JANUS — Panel de administración.
(function () {
  var ADMIN_EMAIL = 'admin@janusdubber.website';
  var _filter = 'pending';
  var _all = [];

  function t(key) {
    return window.janusTr ? window.janusTr(key) : key;
  }

  function statusClass(s) {
    return 'studio-job-status--' + (s || 'pending');
  }

  function statusText(s) {
    return t('studio.status.' + (s || 'pending'));
  }

  function fmt(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleString(); } catch (e) { return ''; }
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function jobCard(j) {
    var status = j.status || 'pending';
    var actions = '';
    if (status === 'pending') {
      actions += '<button class="admin-act admin-act--proc" data-id="' + j.id + '" data-status="processing">' + t('admin.btn_processing') + '</button>';
      actions += '<button class="admin-act admin-act--done" data-id="' + j.id + '" data-status="done">' + t('admin.btn_done') + '</button>';
      actions += '<button class="admin-act admin-act--fail" data-id="' + j.id + '" data-status="failed">' + t('admin.btn_failed') + '</button>';
    } else if (status === 'processing') {
      actions += '<button class="admin-act admin-act--done" data-id="' + j.id + '" data-status="done">' + t('admin.btn_done') + '</button>';
      actions += '<button class="admin-act admin-act--fail" data-id="' + j.id + '" data-status="failed">' + t('admin.btn_failed') + '</button>';
    } else {
      actions += '<button class="admin-act" data-id="' + j.id + '" data-status="pending">' + t('admin.btn_reopen') + '</button>';
    }

    return '<div class="admin-job">' +
      '<div class="admin-job-head">' +
        '<div class="admin-job-main">' +
          '<div class="admin-job-email">' + esc(j.email || '—') + '</div>' +
          '<div class="admin-job-url"><a href="' + esc(j.video_url) + '" target="_blank" rel="noopener">' + esc(j.video_url) + '</a></div>' +
          '<div class="admin-job-meta">' +
            '<span class="studio-job-status ' + statusClass(status) + '">' + statusText(status) + '</span>' +
            '<span class="studio-job-date">' + fmt(j.created_at) + '</span>' +
            (j.delivered_at ? '<span class="studio-job-date">· ' + t('admin.delivered') + ': ' + fmt(j.delivered_at) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="admin-job-actions">' + actions + '</div>' +
      '</div>' +
      '<div class="admin-job-note-row">' +
        '<input class="studio-input admin-note" data-id="' + j.id + '" placeholder="' + esc(t('admin.note_ph')) + '" value="' + esc(j.admin_note || '') + '">' +
        '<button class="admin-act admin-act--save" data-id="' + j.id + '" data-save="1">' + t('admin.btn_save') + '</button>' +
      '</div>' +
    '</div>';
  }

  function render() {
    var box = document.getElementById('admin-jobs');
    if (!box) return;
    var rows = _filter === 'all' ? _all : _all.filter(function (j) { return j.status === _filter; });
    if (!rows.length) {
      box.innerHTML = '<p class="studio-muted">' + t('admin.empty') + '</p>';
      return;
    }
    box.innerHTML = rows.map(jobCard).join('');
    wireActions(box);
  }

  function wireActions(box) {
    box.querySelectorAll('.admin-act[data-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setStatus(btn.getAttribute('data-id'), btn.getAttribute('data-status'));
      });
    });
    box.querySelectorAll('.admin-act[data-save]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var noteInput = box.querySelector('.admin-note[data-id="' + id + '"]');
        var note = noteInput ? noteInput.value : '';
        saveNote(id, note);
      });
    });
  }

  function load() {
    window._supabase.from('dub_jobs')
      .select('id, email, video_url, target_lang, status, created_at, delivered_at, admin_note')
      .order('created_at', { ascending: false })
      .then(function (r) {
        if (r.error) return;
        _all = (r.data || []).filter(function (j) { return j && j.id; });
        render();
      });
  }

  function setStatus(id, status) {
    var payload = { status: status, updated_at: new Date().toISOString() };
    if (status === 'done') payload.delivered_at = new Date().toISOString();
    window._supabase.from('dub_jobs').update(payload).eq('id', id).then(function (r) {
      if (r.error) { alert(r.error.message); return; }
      load();
    });
  }

  function saveNote(id, note) {
    window._supabase.from('dub_jobs')
      .update({ admin_note: note, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(function (r) {
        if (r.error) { alert(r.error.message); return; }
        load();
      });
  }

  function init() {
    if (!window.janusIsConfigured || !window.janusInitSupabase) return;
    window.janusInitSupabase();
    window._supabase.auth.getSession().then(function (res) {
      var user = res.data && res.data.session && res.data.session.user;
      if (!user || user.email !== ADMIN_EMAIL) {
        var gate = document.getElementById('admin-gate');
        if (gate) gate.style.display = 'block';
        return;
      }
      var app = document.getElementById('admin-app');
      if (app) app.style.display = 'block';
      document.querySelectorAll('.admin-filter').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('.admin-filter').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          _filter = btn.getAttribute('data-filter');
          render();
        });
      });
      load();
    });
  }

  document.addEventListener('janus:langchange', function () {
    render();
  });

  init();
})();
