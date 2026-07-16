// JANUS Landing — ROI Calculator
// Calculadora interactiva que muestra el costo de no doblar videos.
// Tras autenticarse, guarda el cálculo en Supabase y muestra el informe.

var ROI_STORAGE_KEY = 'janus_roi_calculation';

// Factores de multiplicación según dirección del doblaje
var ROI_FACTORS = {
    'en_to_es': 0.4,   // Inglés → Español: CPM más bajo pero más volumen
    'es_to_en': 2.5    // Español → Inglés: CPM mucho más alto
};

var ROI_FREQUENCY_FACTORS = {
    '1_week': 4,
    '2_week': 8,
    '1_month': 1
};

function roiFormatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US');
}

function roiAnimateNumber(el, target, duration) {
    duration = duration || 600;
    var start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(start + (target - start) * eased);
        el.textContent = roiFormatCurrency(current);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

function roiCalculate() {
    var language = document.querySelector('input[name="roi-language"]:checked').value;
    var views = parseInt(document.getElementById('roi-views').value);
    var cpm = parseFloat(document.getElementById('roi-cpm').value);
    var frequency = document.getElementById('roi-frequency').value;

    var monthlyRevenue = (views / 1000) * cpm;
    var factor = ROI_FACTORS[language];
    var potentialAdditional = monthlyRevenue * factor;
    var freqFactor = ROI_FREQUENCY_FACTORS[frequency];
    var annualLoss = potentialAdditional * 12 * (freqFactor / 4);

    return {
        language: language,
        monthly_views: views,
        cpm: cpm,
        frequency: frequency,
        monthly_revenue: monthlyRevenue,
        potential_additional: potentialAdditional,
        annual_loss: annualLoss
    };
}

function roiUpdateDisplay(data) {
    var currentEl = document.getElementById('roi-current');
    var potentialEl = document.getElementById('roi-potential');
    var lossEl = document.getElementById('roi-loss');
    var barCurrent = document.getElementById('roi-bar-current');
    var barPotential = document.getElementById('roi-bar-potential');
    var viewsDisplay = document.getElementById('roi-views-display');
    var cpmDisplay = document.getElementById('roi-cpm-display');

    roiAnimateNumber(currentEl, data.monthly_revenue);
    roiAnimateNumber(potentialEl, data.potential_additional);
    roiAnimateNumber(lossEl, data.annual_loss);

    if (viewsDisplay) {
        viewsDisplay.textContent = data.monthly_views.toLocaleString();
    }
    if (cpmDisplay) {
        cpmDisplay.textContent = '$' + data.cpm.toFixed(2);
    }

    var maxBar = Math.max(data.monthly_revenue, data.potential_additional);
    if (maxBar > 0) {
        barCurrent.style.width = (data.monthly_revenue / maxBar * 100) + '%';
        barPotential.style.width = (data.potential_additional / maxBar * 100) + '%';
    }

    var langLabel = data.language === 'en_to_es' ? 'inglés → español' : 'español → inglés';
    document.getElementById('roi-lang-label').textContent = langLabel;
}

function roiSaveCalculation(data) {
    try {
        sessionStorage.setItem(ROI_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('No se pudo guardar en sessionStorage:', e);
    }
}

function roiLoadCalculation() {
    try {
        var stored = sessionStorage.getItem(ROI_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function roiClearCalculation() {
    try {
        sessionStorage.removeItem(ROI_STORAGE_KEY);
    } catch (e) {}
}

function roiSaveToSupabase(session, data) {
    if (!session || !session.user) return Promise.resolve({ error: 'No session' });

    return _supabase.from('roi_leads').insert({
        user_id: session.user.id,
        name: session.user.user_metadata?.full_name || session.user.email,
        email: session.user.email,
        channel_language: data.language,
        monthly_views: data.monthly_views,
        cpm: data.cpm,
        estimated_loss: data.annual_loss
    });
}

function roiShowReport(data) {
    var reportEl = document.getElementById('roi-report');
    if (!reportEl) return;

    var langLabel = data.language === 'en_to_es' ? 'Inglés → Español' : 'Español → Inglés';

    reportEl.innerHTML =
        '<h3 class="roi-report-title">📊 Tu Informe de ROI Personalizado</h3>' +
        '<div class="roi-report-grid">' +
            '<div class="roi-report-item">' +
                '<span class="roi-report-label">Dirección del doblaje</span>' +
                '<span class="roi-report-value">' + langLabel + '</span>' +
            '</div>' +
            '<div class="roi-report-item">' +
                '<span class="roi-report-label">Views mensuales</span>' +
                '<span class="roi-report-value">' + data.monthly_views.toLocaleString() + '</span>' +
            '</div>' +
            '<div class="roi-report-item">' +
                '<span class="roi-report-label">CPM estimado</span>' +
                '<span class="roi-report-value">$' + data.cpm.toFixed(2) + '</span>' +
            '</div>' +
            '<div class="roi-report-item">' +
                '<span class="roi-report-label">Ingreso mensual actual</span>' +
                '<span class="roi-report-value">' + roiFormatCurrency(data.monthly_revenue) + '</span>' +
            '</div>' +
            '<div class="roi-report-item roi-report-highlight">' +
                '<span class="roi-report-label">Potencial adicional mensual</span>' +
                '<span class="roi-report-value">' + roiFormatCurrency(data.potential_additional) + '</span>' +
            '</div>' +
            '<div class="roi-report-item roi-report-loss">' +
                '<span class="roi-report-label">Pérdida anual estimada</span>' +
                '<span class="roi-report-value">' + roiFormatCurrency(data.annual_loss) + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="roi-report-cta">' +
            '<p>¿Listo para recuperar ese ingreso?</p>' +
            '<a href="#" id="roi-try-janus" class="btn btn-primary">Probar JANUS ahora</a>' +
        '</div>';

    reportEl.style.display = 'block';
    reportEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    var tryBtn = document.getElementById('roi-try-janus');
    if (tryBtn) {
        tryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(JANUS_APP_URL, '_blank');
        });
    }
}

function roiHandleDownload() {
    var data = roiCalculate();
    roiSaveCalculation(data);

    if (!janusIsConfigured()) {
        roiShowReport(data);
        return;
    }

    janusInitSupabase();
    _supabase.auth.getSession().then(function (res) {
        if (res.data && res.data.session) {
            roiSaveToSupabase(res.data.session, data).then(function (saveRes) {
                if (saveRes.error) {
                    console.warn('Error guardando ROI:', saveRes.error);
                }
                roiShowReport(data);
            });
        } else {
            janusSetPostAuthCallback(function (session) {
                roiSaveToSupabase(session, data).then(function (saveRes) {
                    if (saveRes.error) {
                        console.warn('Error guardando ROI:', saveRes.error);
                    }
                    roiShowReport(data);
                });
            });
            janusOpenModal();
        }
    });
}

function roiInit() {
    var viewsSlider = document.getElementById('roi-views');
    var cpmSlider = document.getElementById('roi-cpm');
    var frequencySelect = document.getElementById('roi-frequency');
    var langRadios = document.querySelectorAll('input[name="roi-language"]');
    var downloadBtn = document.getElementById('roi-download');

    if (!viewsSlider || !cpmSlider || !downloadBtn) return;

    function update() {
        var data = roiCalculate();
        roiUpdateDisplay(data);
    }

    viewsSlider.addEventListener('input', update);
    cpmSlider.addEventListener('input', update);
    frequencySelect.addEventListener('change', update);
    langRadios.forEach(function (radio) {
        radio.addEventListener('change', update);
    });

    downloadBtn.addEventListener('click', roiHandleDownload);

    update();

    var stored = roiLoadCalculation();
    if (stored) {
        roiShowReport(stored);
    }
}

document.addEventListener('DOMContentLoaded', roiInit);
