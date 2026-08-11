// JANUS — Internacionalización (ES/EN)
// Diccionario + detección de idioma + toggle en navbar.
// Cargar ANTES que cualquier otro script de la landing.

window.JANUS_LANG_STORAGE = 'janus_lang';

window.JANUS_I18N = {
  es: {
    // ---------- Nav ----------
    'nav.inicio': 'Inicio',
    'nav.agencia': 'Agencia',
    'nav.probar': 'Probar ahora',
    'nav.probar_lg': 'Probar JANUS ahora',
    'nav.ver_creditos': 'Ver créditos',
    'nav.perfil': 'Mi perfil',
    'nav.cerrar': 'Cerrar sesión',
    'nav.login': 'Iniciar sesión',
    'nav.signup': 'Registrarse',
    'nav.guest_aria': 'Cuenta',
    'nav.cuenta_aria': 'Mi cuenta',
    'nav.open_aria': 'Abrir chat',
    'nav.close_aria': 'Cerrar',

    // ---------- Meta ----------
    'meta.index.title': 'JANUS — AI Dubbing Platform | Doblaje y traducción con IA',
    'meta.index.desc': 'Dobla tus videos entre inglés y español automáticamente. Llega a más de 1,000 millones de personas sin editar ni un segundo.',
    'meta.agencia.title': 'JANUS — Servicio Gestionado | Agencia',
    'meta.agencia.desc': 'Delega la operación completa de tu canal secundario: doblaje, traducción, edición, SEO y publicación.',
    'meta.legal.title': 'Términos y Políticas — JANUS by Janus Media Labs',
    'meta.legal.desc': 'Términos de servicio, política de reembolsos, cancelación y promociones de JANUS, una marca de Janus Media Labs.',

    // ---------- Hero (index) ----------
    'hero.eyebrow': 'Doblaje con IA · Inglés ↔ Español',
    'hero.title.html': 'Duplica tu <em>audiencia</em>',
    'hero.subtitle.html': 'Dobla tus videos entre <strong>inglés y español</strong> automáticamente. Llega a más de <strong>1,000 millones</strong> de personas sin editar ni un segundo.',
    'hero.models': 'Modelos Activos',
    'hero.demo_label': 'Original  →  Doblado con JANUS',
    'hero.demo_original': 'Original',
    'hero.demo_dubbed': 'Doblado',
    'hero.demo_prev_aria': 'Video anterior',
    'hero.demo_next_aria': 'Video siguiente',
    'hero.cta_text': '¿Te gusta lo que ves? Prueba JANUS con tu propio video',

    // ---------- Demos (app.js) ----------
    'demo.gameplay.desc': 'Escena del juego Piewdiepie doblada al español',
    'demo.review.desc': 'Review de producto con voz clonada',
    'demo.anime.desc': 'Anime doblado con sincronización labial',

    // ---------- Cómo funciona ----------
    'how.eyebrow': 'Proceso',
    'how.title': 'Cómo funciona',
    'how.subtitle': '3 pasos simples',
    'how.step1.title': 'Pega tu URL',
    'how.step1.desc': 'Copia el link de YouTube de tu video y pégalo en JANUS.',
    'how.step2.title': 'Click "Comenzar"',
    'how.step2.desc': 'JANUS procesa tu video: separa voces, traduce, dobla y sincroniza.',
    'how.step3.title': 'Recibe tu video',
    'how.step3.desc': 'Descarga tu video doblado al español, listo para subir a tu canal.',

    // ---------- Features ----------
    'feat.eyebrow': 'Capacidades',
    'feat.title': 'Lo que hace JANUS',
    'feat.subtitle': 'Tecnología de IA que trabaja para ti',
    'feat1.title': 'Separa la voz del fondo',
    'feat1.desc': 'Aísla la voz original con precisión quirúrgica, preservando la música y efectos.',
    'feat2.title': 'Traducción natural',
    'feat2.desc': 'Traducción que suena como tú, no como Google Translate. Contexto, tono y modismos.',
    'feat3.title': 'Tu misma voz',
    'feat3.desc': 'Clonación de voz idéntica. Tu audiencia no notará la diferencia.',
    'feat4.title': 'Sincronización perfecta',
    'feat4.desc': 'Cada palabra en su momento exacto. Sincronización labial profesional.',
    'feat5.title': 'JANUS Studio',
    'feat5.desc': 'Timeline interactivo para ajustes finos. Regenera frases individuales en segundos.',
    'feat6.title': 'Rápido y automático',
    'feat6.desc': 'De URL a video doblado en minutos. Sin edición manual, sin complicaciones.',

    // ---------- Pricing ----------
    'pr.eyebrow': 'Precios',
    'pr.title': 'Créditos de procesamiento. Sin sorpresas.',
    'pr.subtitle': 'Compra pases de procesamiento digital y dobla tus videos al instante en JANUS Studio (videos de hasta 40 min).',
    'pr.unit': '/ crédito',
    'pr.cta': 'Comprar',
    'pr.badge': 'Más elegido',
    'pr.essential.name': 'Esencial',
    'pr.essential.tagline': '1 Crédito Esencial (válido para 1 video de 1 hablante).',
    'pr.essential.f1': 'Traducción inglés ↔ español',
    'pr.essential.f2': 'Clonación de voz del hablante principal',
    'pr.essential.f3': 'Sincronización de audio con calidad de estudio',
    'pr.essential.f4': 'Música y efectos de fondo preservados',
    'pr.essential.delivery': 'Acceso instantáneo',
    'pr.essential.revision': 'Renderizado en JANUS Studio',
    'pr.multivoice.name': 'Multi-Voz',
    'pr.multivoice.tagline': '1 Crédito Multi-Voz (válido para 1 video con hasta 3 voces).',
    'pr.multivoice.f1': 'Todo lo incluido en Esencial',
    'pr.multivoice.f2': 'Hasta 3 voces clonadas (principal + secundarias)',
    'pr.multivoice.f3': 'Ajuste avanzado de cadencia y tono emocional',
    'pr.multivoice.f4': 'Música y efectos de fondo preservados',
    'pr.multivoice.delivery': 'Acceso instantáneo',
    'pr.multivoice.revision': 'Renderizado en JANUS Studio',
    'pr.global.name': 'Global',
    'pr.global.tagline': '1 Crédito Global (válido para 1 video multi-idioma / hasta 5 voces).',
    'pr.global.f1': 'Todo lo incluido en Multi-Voz',
    'pr.global.f2': 'Francés o japonés, bidireccional',
    'pr.global.f3': 'Hasta 5 voces clonadas',
    'pr.global.f4': 'Música y efectos de fondo preservados',
    'pr.global.delivery': 'Acceso instantáneo',
    'pr.global.revision': 'Renderizado en JANUS Studio',
    'pr.note.html': 'Todos los créditos cubren videos de hasta 40 minutos. Al continuar aceptas nuestros <a href="legal.html#terminos">Términos de Servicio</a> y <a href="legal.html#reembolsos">Política de Reembolsos</a>.',

    // ---------- Banner servicio gestionado (index) ----------
    'serv.eyebrow': 'Servicio gestionado',
    'serv.title': '¿Quieres delegar completamente la operación de tu canal secundario?',
    'serv.body': 'Doblaje, traducción, edición, SEO y publicación para creadores y empresas. Tú solo te preocupas por cobrar los nuevos ingresos.',
    'serv.cta': 'Más información aquí',
    'serv.link': 'Agendar Llamada →',

    // ---------- CTA final ----------
    'cta.title': '¿Listo para duplicar tu audiencia?',
    'cta.subtitle': 'Únete a creadores que ya están llegando a millones de hispanohablantes',

    // ---------- Footer ----------
    'foot.tagline': 'Duplica tu audiencia',
    'foot.desc': 'Servicio de doblaje y traducción de video con IA: inglés ↔ español, clonación de voz natural y sincronización de estudio, con la música y los efectos de tu video intactos.',
    'foot.contacto': 'Contacto',
    'foot.support': 'Atención al cliente por correo electrónico',
    'foot.response': 'Respuesta en 24–48 h laborables',
    'foot.legal': 'Legal',
    'foot.terminos': 'Términos de Servicio',
    'foot.reembolsos': 'Reembolsos y Disputas',
    'foot.cancelacion': 'Política de Cancelación',
    'foot.promociones': 'Términos de Promociones',
    'foot.copyright': '© 2026 Janus Media Labs. Todos los derechos reservados.',
    'foot.nota': 'JANUS es una marca de Janus Media Labs.',

    // ---------- Agencia ----------
    'ag.title': 'Gestión completa de tu canal secundario',
    'ag.subtitle': 'Traducción, doblaje, edición, SEO y publicación por nuestro equipo. Tú solo te preocupas por cobrar los nuevos ingresos.',
    'ag.intro.html': 'Sabemos que no tienes tiempo para gestionar un segundo canal, subir videos, optimizar metadatos en otro idioma o configurar la plataforma. <strong>Por eso eliminamos la fricción por completo.</strong>',
    'ag.card1.title': 'Doblaje de Alta Precisión',
    'ag.card1.desc': 'JANUS traduce tus videos entre inglés y español conservando tu tono de voz original, tu intención y logrando una sincronización impecable.',
    'ag.card2.title': 'Gestión Completa',
    'ag.card2.desc': 'No tienes que mover un solo dedo. Nuestro equipo y tecnología se encargan de:',
    'ag.card2.l1': 'Crear y configurar tu canal secundario',
    'ag.card2.l2': 'Optimizar el SEO (títulos, descripciones y miniaturas)',
    'ag.card2.l3': 'Subir los videos doblados automáticamente',
    'ag.card2.l4': 'Gestionar la publicación y programación',
    'ag.card2.highlight': 'Tú solo te preocupas por cobrar los nuevos ingresos.',
    'ag.loss.eyebrow': 'El costo de esperar',
    'ag.loss.title': 'La matemática de tu inacción',
    'ag.loss.subtitle': 'Lo que estás perdiendo ahora mismo',
    'ag.loss.intro.html': 'Si creas contenido <strong>solo en inglés</strong> o <strong>solo en español</strong>, estás regalando tu alcance. Al no cruzar el puente de ambos idiomas, estás renunciando a un mercado combinado de más de <strong>1,000 millones de personas</strong>. Cada día que tus videos no están localizados, pierdes dinero y relevancia frente a competidores que sí lo están haciendo.',
    'ag.loss.badge_en': 'Creador en Inglés',
    'ag.loss.scenario_en.html': 'Tu canal genera <strong>$5,000 USD/mes</strong>',
    'ag.loss.amount_en': '-$1,500 a -$3,000',
    'ag.loss.period_en': 'USD/mes adicionales en el mercado hispano',
    'ag.loss.detail_en': 'Estás renunciando a este ingreso por el mismo contenido que ya grabaste.',
    'ag.loss.badge_es': 'Creador en Español',
    'ag.loss.scenario_es': 'No traduces al inglés',
    'ag.loss.amount_es': '-$5,000 a -$10,000',
    'ag.loss.period_es': 'USD/mes que dejas de percibir',
    'ag.loss.detail_es': 'El CPM del mercado angloparlante es mucho más alto. La pérdida es aún más dolorosa.',
    'ag.loss.conclusion.html': 'En cualquiera de los dos escenarios: <strong>estás tirando miles de dólares a la basura cada año</strong> simplemente por la barrera del idioma.',
    'ag.loss.solution.html': 'El doblaje tradicional te costaría miles de dólares por video, absorbiendo todo tu margen. <strong>JANUS frena esa fuga de ingresos en minutos por una fracción de ese costo.</strong>',
    'ag.res.eyebrow': 'Datos verificables',
    'ag.res.title': 'Estudio de mercado',
    'ag.res.subtitle': 'El momento de doblar tus videos es ahora',
    'ag.res1.title': 'Explosión de la educación online',
    'ag.res1.desc.html': 'El mercado de Online Language Learning está valorado en <strong>USD 24.39 mil millones (2026)</strong> y se proyecta que alcance los <strong>USD 50.82 mil millones para 2031</strong>, impulsado por un crecimiento anual sostenido (CAGR) del <strong>15.83%</strong>.',
    'ag.res1.source': 'Fuente: Mordor Intelligence →',
    'ag.res2.title': 'La industria de la localización en su pico histórico',
    'ag.res2.desc.html': 'Los servicios globales de traducción y localización mueven un mercado de <strong>USD 71.7 mil millones</strong> que crece con fuerza para responder a la demanda de contenido en idiomas locales.',
    'ag.res2.source': 'Fuente: Nimdzi Insights / Fortune Business Insights →',
    'ag.res3.title': 'Revolución de la IA en traducción',
    'ag.res3.desc.html': 'El software de traducción basado en Inteligencia Artificial (Language AI) crece a un ritmo masivo del <strong>24.8% CAGR</strong>, convirtiéndose en el segmento tecnológico de mayor aceleración global.',
    'ag.res3.source': 'Fuente: The Business Research Company / Slator 2026 →',
    'ag.res4.title': 'El poder demográfico del español',
    'ag.res4.desc.html': 'El español es la <strong>segunda lengua materna más hablada del mundo (~500 millones de personas)</strong>, y Latinoamérica se posiciona como la región de más rápido crecimiento en consumo digital y aprendizaje online.',
    'ag.res4.source': 'Fuente: Grand View Research →',
    'ag.res.highlight.html': '<strong>⚡ Efecto multiplicador (Inglés ↔ Español):</strong> Al romper de forma bidireccional la barrera del idioma, los creadores de contenido <strong>duplican de inmediato su mercado objetivo</strong> sin invertir un solo dólar en nueva producción, ganando acceso directo a una audiencia combinada de más de <strong>1,000 millones de personas</strong>.',
    'ag.roi.eyebrow': 'Calcula tu caso',
    'ag.roi.title': 'Calculadora de ROI',
    'ag.roi.subtitle': 'Descubre cuánto estás perdiendo al no doblar tus videos',
    'ag.roi.intro.html': 'Ajusta los valores según tu canal y mira en tiempo real el <strong>ingreso potencial</strong> que estás dejando sobre la mesa.',
    'ag.roi.lang_label': 'Idioma actual de tu canal',
    'ag.roi.lang_en': 'Inglés',
    'ag.roi.lang_es': 'Español',
    'ag.roi.views_label': 'Visualizaciones mensuales',
    'ag.roi.cpm_label': 'CPM estimado (USD)',
    'ag.roi.freq_label': 'Frecuencia de subida',
    'ag.roi.freq_1m': '1 video al mes',
    'ag.roi.freq_1w': '1 video a la semana',
    'ag.roi.freq_2w': '2 videos a la semana',
    'ag.roi.results_title': 'Resultados en tiempo real',
    'ag.roi.current_label': 'Ingreso mensual actual',
    'ag.roi.potential_label': 'Potencial adicional',
    'ag.roi.loss_label': 'Pérdida anual',
    'ag.roi.bar_current': 'Actual',
    'ag.roi.bar_potential': 'Con JANUS',
    'ag.roi.download': 'Ver mi plan de ingresos personalizado',
    'ag.cta.title': '¿Hablamos sobre tu canal?',
    'ag.cta.subtitle': 'Cuéntanos tu situación y te proponemos un plan de operación gestionada sin compromiso',
    'ag.cta.btn': 'Agendar Llamada',

    // ---------- Calculadora (reporte JS) ----------
    'calc.lang_en_to_es': 'Inglés → Español',
    'calc.lang_es_to_en': 'Español → Inglés',
    'calc.lang_label_en_to_es': 'inglés → español',
    'calc.lang_label_es_to_en': 'español → inglés',
    'calc.projection_month': 'Mes',
    'calc.projection_current': 'Ingreso actual',
    'calc.projection_janus': 'Con JANUS',
    'calc.projection_diff': 'Diferencia',
    'calc.projection_total_annual': 'Total anual',
    'calc.per_video': 'por video',
    'calc.report_title': 'Tu Plan de Ingresos Personalizado',
    'calc.report_subtitle.html': 'Dirección: <strong>%s</strong>',
    'calc.section_projection': 'Proyección a 12 meses',
    'calc.section_projection_desc': 'El crecimiento no es lineal. Tu audiencia en el nuevo idioma se construye gradualmente, generando un efecto compuesto.',
    'calc.section_costs': 'Comparativa de costos',
    'calc.cost_traditional': 'Doblaje tradicional',
    'calc.cost_janus': 'JANUS',
    'calc.cost_savings': 'Ahorro',
    'calc.cost_savings_value': 'Hasta %s%',
    'calc.section_recommend': 'Recomendaciones para tu perfil',
    'calc.recommend_en': 'Tu audiencia en español crecerá más rápido pero con CPM más bajo. <strong>Estrategia recomendada:</strong> Enfócate en volumen y frecuencia de publicación. Publica al menos 2 videos por semana en español para maximizar el crecimiento.',
    'calc.recommend_es': 'El mercado en inglés paga más pero requiere más tiempo para crecer. <strong>Estrategia recomendada:</strong> Enfócate en calidad y nicho específico. Publica 1 video por semana en inglés con contenido altamente especializado.',
    'calc.roi_estimated.html': '<strong>ROI estimado:</strong> Recuperas tu inversión en JANUS en las primeras 2-3 semanas de publicación.',
    'calc.report_cta': '¿Listo para recuperar ese ingreso?',

    // ---------- Auth (modal + perfil) ----------
    'auth.modal.title': 'Regístrate para probar JANUS',
    'auth.modal.sub': 'Crea tu cuenta y te enviaremos los datos para doblar tu video.',
    'auth.google': 'Continuar con Google',
    'auth.or': 'o',
    'auth.email_placeholder': 'tu@email.com',
    'auth.pw_placeholder': 'Contraseña (mín. 6)',
    'auth.magic_btn': 'Enviar enlace mágico',
    'auth.toggle_pw': 'Usar contraseña en su lugar',
    'auth.toggle_magic': 'Enviar enlace mágico en su lugar',
    'auth.submit_btn': 'Registrarme / Entrar',
    'auth.foot': 'Al continuar aceptas los Términos de JANUS.',
    'auth.err_credentials': 'Faltan las credenciales de Supabase (auth.js).',
    'auth.err_email': 'Ingresa un email válido.',
    'auth.processing': 'Procesando...',
    'auth.err_password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth.check_email': 'Revisa tu email para confirmar tu cuenta.',
    'auth.sent': '¡Listo! Revisa tu correo y haz clic en el enlace para continuar.',
    'auth.profile.title': 'Mi perfil',
    'auth.profile.sub': 'Actualiza tu nombre, correo o contraseña.',
    'auth.profile.credits_title': 'Mis créditos',
    'auth.profile.credits_empty': 'No tienes créditos activos.',
    'auth.profile.credits_cta': 'Comprar créditos',
    'auth.profile.credits_expires': 'Vence en %s día(s)',
    'auth.profile.credits_today': 'Vence hoy',
    'auth.profile.credits_count': '%s créditos activos',
    'auth.profile.name_label': 'Nombre',
    'auth.profile.name_placeholder': 'Tu nombre',
    'auth.profile.save': 'Guardar',
    'auth.profile.email_label': 'Correo',
    'auth.profile.email_placeholder': 'tu@email.com',
    'auth.profile.email_note': 'Al cambiar el correo te enviaremos un enlace de confirmación al nuevo email.',
    'auth.profile.pw_label': 'Nueva contraseña',
    'auth.profile.pw_placeholder': 'Mín. 6 caracteres',
    'auth.profile.saving': 'Guardando...',
    'auth.profile.name_updated': 'Nombre actualizado.',
    'auth.profile.err_name': 'Ingresa tu nombre.',
    'auth.profile.err_email': 'Ingresa un correo válido.',
    'auth.profile.email_sent': 'Te enviamos un enlace de confirmación al nuevo correo. El cambio se aplica al confirmarlo.',
    'auth.profile.pw_updated': 'Contraseña actualizada.',

    // ---------- Chat widget ----------
    'chat.greeting': '¡Hola! Soy Janus Bot. ¿En qué puedo ayudarte sobre JANUS?',
    'chat.placeholder': 'Escribe tu pregunta...',
    'chat.thinking': 'Pensando',
    'chat.powered': 'Asistente informativo',
    'chat.err_connect': 'Error de conexión. Verifica que el backend esté corriendo.',
    'chat.err_maintenance': '🛌 La PC está en modo siesta. Estamos recogiendo el carbón...',
    'chat.err_maintenance_back': 'Vuelve en un momento ⛏️🔥',
    'chat.error_prefix': 'Error: %s',
    'chat.open_aria': 'Abrir chat',
    'chat.close_aria': 'Cerrar',
    'chat.send_aria': 'Enviar',

    // ---------- Legal ----------
    'legal.back': '← Volver al inicio',
    'legal.title': 'Términos y Políticas',
    'legal.updated': 'Janus Media Labs · Última actualización: agosto 2026',
    'legal.nav.terminos': 'Términos de Servicio',
    'legal.nav.reembolsos': 'Reembolsos y Disputas',
    'legal.nav.cancelacion': 'Cancelación',
    'legal.nav.promociones': 'Promociones',
    'legal.nav.restricciones': 'Restricciones Legales',
    'legal.nav.contacto': 'Contacto',
    'legal.terminos.title': 'Términos de Servicio',
    'legal.terminos.p1.html': 'JANUS es una plataforma de doblaje y traducción de video operada por <strong>Janus Media Labs</strong>, que combina servicios de procesamiento con IA y herramientas de software (la app de doblaje en 3 pasos y JANUS Studio). Ofrecemos traducción profesional de video entre inglés y español (y, en el plan Global, francés o japonés), con clonación de voz natural, sincronización de audio y preservación de la música y efectos de fondo originales.',
    'legal.terminos.creditos': 'Entrega y uso de Créditos Digitales',
    'legal.terminos.creditos.p': 'Al adquirir cualquier paquete (Esencial, Multi-Voz o Global) a través de nuestro Merchant of Record (Lemon Squeezy), el usuario recibe de forma inmediata e instantánea pases/créditos de procesamiento digital asociados a su cuenta. Cada crédito habilita la traducción, clonación de voz y renderizado de un video según las especificaciones del paquete seleccionado. Todo el procesamiento se realiza de forma directa en JANUS Studio. No se ofrecen servicios de entrega manual ni diferida tras la compra.',
    'legal.terminos.resp': 'Responsabilidades del cliente',
    'legal.terminos.r1': 'Declaras tener los derechos necesarios sobre el contenido que envías para su doblaje y traducción.',
    'legal.terminos.r2': 'No enviarás contenido ilegal, difamatorio, que infrinja derechos de terceros, ni contenido destinado a suplantar la identidad de otra persona sin su consentimiento.',
    'legal.terminos.r3': 'La clonación de voz se realiza únicamente sobre voces presentes en tu propio contenido o con autorización expresa del titular de la voz.',
    'legal.terminos.propiedad': 'Propiedad',
    'legal.terminos.propiedad.p': 'Conservas todos los derechos sobre tu contenido original y sobre el video final. Janus Media Labs no reclama propiedad alguna sobre el material del cliente.',
    'legal.terminos.lim': 'Limitación de responsabilidad',
    'legal.terminos.lim.p': 'El servicio se ofrece "tal cual". Nuestra responsabilidad máxima por cualquier reclamo relacionado con un pedido se limita al importe pagado por ese pedido.',
    'legal.reembolsos.title': 'Política de Reembolsos y Disputas',
    'legal.reembolsos.p1.html': 'JANUS vende <strong>créditos digitales de procesamiento</strong> con entrega instantánea; no comercializamos productos físicos ni servicios diferidos.',
    'legal.reembolsos.cuando': 'Cuándo procede un reembolso',
    'legal.reembolsos.c1.html': '<strong>Crédito inutilizable:</strong> si un defecto técnico impide usar el crédito para procesar tu video, ofrecemos un crédito de reposición o el reembolso completo.',
    'legal.reembolsos.c2.html': '<strong>Resultado defectuoso:</strong> si el video renderizado presenta un defecto técnico imputable a nosotros (audio corrupto o desincronización grave), regeneramos el video sin costo adicional o reembolsamos total o parcialmente.',
    'legal.reembolsos.c3.html': '<strong>Disputas de pago:</strong> al ser Lemon Squeezy nuestro Merchant of Record, las disputas de pago se tramitan conforme a su política de protección al comprador.',
    'legal.reembolsos.no': 'Cuándo no procede',
    'legal.reembolsos.n1': 'Crédito ya utilizado para procesar un video conforme a las especificaciones del paquete.',
    'legal.reembolsos.n2': 'Insatisfacción subjetiva sobre el resultado una vez procesado el video.',
    'legal.reembolsos.n3': 'Problemas derivados de material de origen defectuoso o de baja calidad proporcionado por el cliente.',
    'legal.reembolsos.como': 'Cómo solicitarlo y disputas',
    'legal.reembolsos.como.p.html': 'Antes de abrir una disputa con tu banco o con Lemon Squeezy, contáctanos en <a href="mailto:support@janusdubber.website">support@janusdubber.website</a>. Respondemos en un plazo de 24–48 horas laborables y resolvemos la mayoría de los casos directamente. Las solicitudes de reembolso se evalúan y, si proceden, se procesan al mismo medio de pago en un plazo de 5 a 10 días hábiles.',
    'legal.cancelacion.title': 'Política de Cancelación',
    'legal.cancelacion.p1': 'JANUS entrega créditos digitales de procesamiento de forma instantánea; no hay suscripciones recurrentes que cancelar.',
    'legal.cancelacion.l1.html': '<strong>Sin suscripciones:</strong> las compras son de un solo pago. No existen planes recurrentes ni cargos automáticos.',
    'legal.cancelacion.l2.html': '<strong>Créditos ya entregados:</strong> una vez que el crédito se ha entregado y utilizado, la compra no puede cancelarse. Los reembolsos se gestionan según nuestra Política de Reembolsos y Lemon Squeezy.',
    'legal.cancelacion.p2.html': 'Para cualquier consulta sobre tu compra, escribe a <a href="mailto:support@janusdubber.website">support@janusdubber.website</a> indicando tu email de compra y los detalles del pedido.',
    'legal.promociones.title': 'Términos y Condiciones de las Promociones',
    'legal.promociones.l1.html': 'Las promociones y descuentos aplican únicamente sobre el precio listado en <a href="index.html#pricing">janusdubber.website</a> al momento de la compra.',
    'legal.promociones.l2': 'No son acumulables con otras ofertas, cupones o descuentos, salvo indicación expresa.',
    'legal.promociones.l3': 'No tienen valor canjeable en efectivo.',
    'legal.promociones.l4': 'Cada promoción indica su vigencia; fuera de ese período no es válida.',
    'legal.promociones.l5': 'Janus Media Labs se reserva el derecho de modificar o retirar una promoción en cualquier momento, respetando las compras ya realizadas.',
    'legal.restricciones.title': 'Restricciones Legales y de Uso',
    'legal.restricciones.l1': 'El servicio es digital y se entrega por internet; no implica exportación de bienes físicos.',
    'legal.restricciones.l2': 'No ofrecemos el servicio donde lo prohíba la legislación aplicable ni a personas o entidades sujetas a sanciones internacionales.',
    'legal.restricciones.l3': 'Nos reservamos el derecho de rechazar pedidos cuyo contenido infrinja estos términos, con reembolso completo si el pago ya se hubiera realizado.',
    'legal.contacto.title': 'Contacto de Atención al Cliente',
    'legal.contacto.p1': 'Para cualquier consulta sobre pedidos, reembolsos, cancelaciones o el servicio en general:',
    'legal.contacto.email': 'Email: <a href="mailto:support@janusdubber.website">support@janusdubber.website</a>',
    'legal.contacto.response': 'Tiempo de respuesta: 24–48 horas laborables.'
  },

  en: {
    // ---------- Nav ----------
    'nav.inicio': 'Home',
    'nav.agencia': 'Agency',
    'nav.probar': 'Try now',
    'nav.probar_lg': 'Try JANUS now',
    'nav.ver_creditos': 'View credits',
    'nav.perfil': 'My profile',
    'nav.cerrar': 'Sign out',
    'nav.login': 'Sign in',
    'nav.signup': 'Sign up',
    'nav.guest_aria': 'Account',
    'nav.cuenta_aria': 'My account',
    'nav.open_aria': 'Open chat',
    'nav.close_aria': 'Close',

    // ---------- Meta ----------
    'meta.index.title': 'JANUS — AI Dubbing Platform | AI dubbing and translation',
    'meta.index.desc': 'Automatically dub your videos between English and Spanish. Reach over 1 billion people without editing a single second.',
    'meta.agencia.title': 'JANUS — Managed Service | Agency',
    'meta.agencia.desc': 'Delegate the complete operation of your secondary channel: dubbing, translation, editing, SEO and publishing.',
    'meta.legal.title': 'Terms & Policies — JANUS by Janus Media Labs',
    'meta.legal.desc': 'Terms of service, refund policy, cancellation and promotions of JANUS, a brand of Janus Media Labs.',

    // ---------- Hero (index) ----------
    'hero.eyebrow': 'AI Dubbing · English ↔ Spanish',
    'hero.title.html': 'Duplicate your <em>audience</em>',
    'hero.subtitle.html': 'Automatically dub your videos between <strong>English and Spanish</strong>. Reach over <strong>1 billion</strong> people without editing a single second.',
    'hero.models': 'Models Active',
    'hero.demo_label': 'Original  →  Dubbed with JANUS',
    'hero.demo_original': 'Original',
    'hero.demo_dubbed': 'Dubbed',
    'hero.demo_prev_aria': 'Previous video',
    'hero.demo_next_aria': 'Next video',
    'hero.cta_text': 'Like what you see? Try JANUS with your own video',

    // ---------- Demos (app.js) ----------
    'demo.gameplay.desc': 'Piewdiepie gameplay scene dubbed into Spanish',
    'demo.review.desc': 'Product review with cloned voice',
    'demo.anime.desc': 'Anime dubbed with lip-sync',

    // ---------- How it works ----------
    'how.eyebrow': 'Process',
    'how.title': 'How it works',
    'how.subtitle': '3 simple steps',
    'how.step1.title': 'Paste your URL',
    'how.step1.desc': 'Copy the YouTube link of your video and paste it into JANUS.',
    'how.step2.title': 'Click "Start"',
    'how.step2.desc': 'JANUS processes your video: it separates voices, translates, dubs, and syncs.',
    'how.step3.title': 'Receive your video',
    'how.step3.desc': 'Download your dubbed video, ready to upload to your channel.',

    // ---------- Features ----------
    'feat.eyebrow': 'Capabilities',
    'feat.title': 'What JANUS does',
    'feat.subtitle': 'AI technology that works for you',
    'feat1.title': 'Separates voice from background',
    'feat1.desc': 'Isolates the original voice with surgical precision while preserving music and effects.',
    'feat2.title': 'Natural translation',
    'feat2.desc': 'Translation that sounds like you, not Google Translate. Context, tone, and idioms.',
    'feat3.title': 'Your own voice',
    'feat3.desc': 'Identical voice cloning. Your audience won\'t notice the difference.',
    'feat4.title': 'Perfect synchronization',
    'feat4.desc': 'Every word at the exact right moment. Professional lip-sync.',
    'feat5.title': 'JANUS Studio',
    'feat5.desc': 'Interactive timeline for fine adjustments. Regenerate individual sentences in seconds.',
    'feat6.title': 'Fast and automatic',
    'feat6.desc': 'From URL to dubbed video in minutes. No manual editing, no hassle.',

    // ---------- Pricing ----------
    'pr.eyebrow': 'Pricing',
    'pr.title': 'Processing credits. No surprises.',
    'pr.subtitle': 'Buy digital processing passes and dub your videos instantly in JANUS Studio (videos up to 40 min).',
    'pr.unit': '/ credit',
    'pr.cta': 'Buy',
    'pr.badge': 'Most popular',
    'pr.essential.name': 'Essential',
    'pr.essential.tagline': '1 Essential Credit (valid for 1 video with 1 speaker).',
    'pr.essential.f1': 'English ↔ Spanish translation',
    'pr.essential.f2': 'Main speaker voice cloning',
    'pr.essential.f3': 'Studio-quality audio synchronization',
    'pr.essential.f4': 'Background music and effects preserved',
    'pr.essential.delivery': 'Instant access',
    'pr.essential.revision': 'Rendered in JANUS Studio',
    'pr.multivoice.name': 'Multi-Voice',
    'pr.multivoice.tagline': '1 Multi-Voice Credit (valid for 1 video with up to 3 voices).',
    'pr.multivoice.f1': 'Everything in Essential',
    'pr.multivoice.f2': 'Up to 3 cloned voices (main + secondary)',
    'pr.multivoice.f3': 'Advanced pacing and emotional tone adjustment',
    'pr.multivoice.f4': 'Background music and effects preserved',
    'pr.multivoice.delivery': 'Instant access',
    'pr.multivoice.revision': 'Rendered in JANUS Studio',
    'pr.global.name': 'Global',
    'pr.global.tagline': '1 Global Credit (valid for 1 multi-language video / up to 5 voices).',
    'pr.global.f1': 'Everything in Multi-Voice',
    'pr.global.f2': 'French or Japanese, bidirectional',
    'pr.global.f3': 'Up to 5 cloned voices',
    'pr.global.f4': 'Background music and effects preserved',
    'pr.global.delivery': 'Instant access',
    'pr.global.revision': 'Rendered in JANUS Studio',
    'pr.note.html': 'All credits cover videos up to 40 minutes. By continuing you accept our <a href="legal.html#terminos">Terms of Service</a> and <a href="legal.html#reembolsos">Refund Policy</a>.',

    // ---------- Managed service banner (index) ----------
    'serv.eyebrow': 'Managed service',
    'serv.title': 'Want to fully delegate the operation of your secondary channel?',
    'serv.body': 'Dubbing, translation, editing, SEO, and publishing for creators and businesses. You only worry about collecting the new income.',
    'serv.cta': 'More information here',
    'serv.link': 'Schedule a Call →',

    // ---------- Final CTA ----------
    'cta.title': 'Ready to duplicate your audience?',
    'cta.subtitle': 'Join creators already reaching millions of Spanish speakers',

    // ---------- Footer ----------
    'foot.tagline': 'Duplicate your audience',
    'foot.desc': 'AI video dubbing and translation service: English ↔ Spanish, natural voice cloning and studio-grade synchronization, with your video\'s music and effects intact.',
    'foot.contacto': 'Contact',
    'foot.support': 'Customer support via email',
    'foot.response': 'Response within 24–48 business hours',
    'foot.legal': 'Legal',
    'foot.terminos': 'Terms of Service',
    'foot.reembolsos': 'Refunds and Disputes',
    'foot.cancelacion': 'Cancellation Policy',
    'foot.promociones': 'Promotions Terms',
    'foot.copyright': '© 2026 Janus Media Labs. All rights reserved.',
    'foot.nota': 'JANUS is a brand of Janus Media Labs.',

    // ---------- Agency ----------
    'ag.title': 'Complete management of your secondary channel',
    'ag.subtitle': 'Translation, dubbing, editing, SEO, and publishing by our team. You only worry about collecting the new income.',
    'ag.intro.html': 'We know you don\'t have time to manage a second channel, upload videos, optimize metadata in another language, or set up the platform. <strong>That\'s why we remove all the friction.</strong>',
    'ag.card1.title': 'High-Precision Dubbing',
    'ag.card1.desc': 'JANUS translates your videos between English and Spanish while preserving your original voice tone, your intent, and delivering flawless synchronization.',
    'ag.card2.title': 'Complete Management',
    'ag.card2.desc': 'You don\'t have to lift a finger. Our team and technology handle:',
    'ag.card2.l1': 'Create and set up your secondary channel',
    'ag.card2.l2': 'Optimize SEO (titles, descriptions, and thumbnails)',
    'ag.card2.l3': 'Upload dubbed videos automatically',
    'ag.card2.l4': 'Manage publishing and scheduling',
    'ag.card2.highlight': 'You only worry about collecting the new income.',
    'ag.loss.eyebrow': 'The cost of waiting',
    'ag.loss.title': 'The math of your inaction',
    'ag.loss.subtitle': 'What you\'re losing right now',
    'ag.loss.intro.html': 'If you create content <strong>only in English</strong> or <strong>only in Spanish</strong>, you\'re giving away your reach. By not bridging both languages, you\'re giving up a combined market of more than <strong>1 billion people</strong>. Every day your videos aren\'t localized, you lose money and relevance to competitors who are doing it.',
    'ag.loss.badge_en': 'English Creator',
    'ag.loss.scenario_en.html': 'Your channel generates <strong>$5,000 USD/month</strong>',
    'ag.loss.amount_en': '-$1,500 to -$3,000',
    'ag.loss.period_en': 'additional USD/month in the Spanish market',
    'ag.loss.detail_en': 'You\'re giving up this income for content you already recorded.',
    'ag.loss.badge_es': 'Spanish Creator',
    'ag.loss.scenario_es': 'You don\'t translate to English',
    'ag.loss.amount_es': '-$5,000 to -$10,000',
    'ag.loss.period_es': 'USD/month you stop earning',
    'ag.loss.detail_es': 'The English-speaking market CPM is much higher. The loss is even more painful.',
    'ag.loss.conclusion.html': 'In either scenario: <strong>you\'re throwing thousands of dollars down the drain every year</strong> simply because of the language barrier.',
    'ag.loss.solution.html': 'Traditional dubbing would cost you thousands of dollars per video, eating up all your margin. <strong>JANUS stops that revenue leak in minutes for a fraction of the cost.</strong>',
    'ag.res.eyebrow': 'Verifiable data',
    'ag.res.title': 'Market research',
    'ag.res.subtitle': 'The time to dub your videos is now',
    'ag.res1.title': 'Online education explosion',
    'ag.res1.desc.html': 'The Online Language Learning market is valued at <strong>USD 24.39 billion (2026)</strong> and is projected to reach <strong>USD 50.82 billion by 2031</strong>, driven by sustained annual growth (CAGR) of <strong>15.83%</strong>.',
    'ag.res1.source': 'Source: Mordor Intelligence →',
    'ag.res2.title': 'The localization industry at its historical peak',
    'ag.res2.desc.html': 'Global translation and localization services move a market of <strong>USD 71.7 billion</strong> that is growing strongly to meet the demand for content in local languages.',
    'ag.res2.source': 'Source: Nimdzi Insights / Fortune Business Insights →',
    'ag.res3.title': 'The AI translation revolution',
    'ag.res3.desc.html': 'AI-based translation software (Language AI) is growing at a massive <strong>24.8% CAGR</strong>, becoming the fastest-accelerating tech segment globally.',
    'ag.res3.source': 'Source: The Business Research Company / Slator 2026 →',
    'ag.res4.title': 'The demographic power of Spanish',
    'ag.res4.desc.html': 'Spanish is the <strong>second most spoken native language in the world (~500 million people)</strong>, and Latin America is becoming the fastest-growing region in digital consumption and online learning.',
    'ag.res4.source': 'Source: Grand View Research →',
    'ag.res.highlight.html': '<strong>⚡ Multiplier effect (English ↔ Spanish):</strong> By breaking the language barrier in both directions, content creators <strong>instantly double their target market</strong> without investing a single dollar in new production, gaining direct access to a combined audience of more than <strong>1 billion people</strong>.',
    'ag.roi.eyebrow': 'Calculate your case',
    'ag.roi.title': 'ROI Calculator',
    'ag.roi.subtitle': 'Discover how much you\'re losing by not dubbing your videos',
    'ag.roi.intro.html': 'Adjust the values to match your channel and see in real time the <strong>potential income</strong> you\'re leaving on the table.',
    'ag.roi.lang_label': 'Your channel\'s current language',
    'ag.roi.lang_en': 'English',
    'ag.roi.lang_es': 'Spanish',
    'ag.roi.views_label': 'Monthly views',
    'ag.roi.cpm_label': 'Estimated CPM (USD)',
    'ag.roi.freq_label': 'Upload frequency',
    'ag.roi.freq_1m': '1 video per month',
    'ag.roi.freq_1w': '1 video per week',
    'ag.roi.freq_2w': '2 videos per week',
    'ag.roi.results_title': 'Real-time results',
    'ag.roi.current_label': 'Current monthly income',
    'ag.roi.potential_label': 'Additional potential',
    'ag.roi.loss_label': 'Annual loss',
    'ag.roi.bar_current': 'Current',
    'ag.roi.bar_potential': 'With JANUS',
    'ag.roi.download': 'See my personalized income plan',
    'ag.cta.title': 'Shall we talk about your channel?',
    'ag.cta.subtitle': 'Tell us about your situation and we\'ll propose a managed operation plan with no commitment',
    'ag.cta.btn': 'Schedule a Call',

    // ---------- Calculator (JS report) ----------
    'calc.lang_en_to_es': 'English → Spanish',
    'calc.lang_es_to_en': 'Spanish → English',
    'calc.lang_label_en_to_es': 'English → Spanish',
    'calc.lang_label_es_to_en': 'Spanish → English',
    'calc.projection_month': 'Month',
    'calc.projection_current': 'Current income',
    'calc.projection_janus': 'With JANUS',
    'calc.projection_diff': 'Difference',
    'calc.projection_total_annual': 'Total annual',
    'calc.per_video': 'per video',
    'calc.report_title': 'Your Personalized Income Plan',
    'calc.report_subtitle.html': 'Direction: <strong>%s</strong>',
    'calc.section_projection': '12-month projection',
    'calc.section_projection_desc': 'Growth is not linear. Your audience in the new language builds gradually, creating a compounding effect.',
    'calc.section_costs': 'Cost comparison',
    'calc.cost_traditional': 'Traditional dubbing',
    'calc.cost_janus': 'JANUS',
    'calc.cost_savings': 'Savings',
    'calc.cost_savings_value': 'Up to %s%',
    'calc.section_recommend': 'Recommendations for your profile',
    'calc.recommend_en': 'Your Spanish audience will grow faster but with a lower CPM. <strong>Recommended strategy:</strong> Focus on volume and posting frequency. Publish at least 2 videos per week in Spanish to maximize growth.',
    'calc.recommend_es': 'The English market pays more but takes longer to grow. <strong>Recommended strategy:</strong> Focus on quality and a specific niche. Publish 1 video per week in English with highly specialized content.',
    'calc.roi_estimated.html': '<strong>Estimated ROI:</strong> You recover your JANUS investment within the first 2-3 weeks of publishing.',
    'calc.report_cta': 'Ready to recover that income?',

    // ---------- Auth (modal + profile) ----------
    'auth.modal.title': 'Sign up to try JANUS',
    'auth.modal.sub': 'Create your account and we\'ll send you everything you need to dub your video.',
    'auth.google': 'Continue with Google',
    'auth.or': 'or',
    'auth.email_placeholder': 'your@email.com',
    'auth.pw_placeholder': 'Password (min. 6)',
    'auth.magic_btn': 'Send magic link',
    'auth.toggle_pw': 'Use password instead',
    'auth.toggle_magic': 'Send magic link instead',
    'auth.submit_btn': 'Sign up / Log in',
    'auth.foot': 'By continuing you accept JANUS\'s Terms.',
    'auth.err_credentials': 'Supabase credentials are missing (auth.js).',
    'auth.err_email': 'Enter a valid email.',
    'auth.processing': 'Processing...',
    'auth.err_password': 'Password must be at least 6 characters.',
    'auth.check_email': 'Check your email to confirm your account.',
    'auth.sent': 'Done! Check your email and click the link to continue.',
    'auth.profile.title': 'My profile',
    'auth.profile.sub': 'Update your name, email, or password.',
    'auth.profile.credits_title': 'My credits',
    'auth.profile.credits_empty': 'You have no active credits.',
    'auth.profile.credits_cta': 'Buy credits',
    'auth.profile.credits_expires': 'Expires in %s day(s)',
    'auth.profile.credits_today': 'Expires today',
    'auth.profile.credits_count': '%s active credits',
    'auth.profile.name_label': 'Name',
    'auth.profile.name_placeholder': 'Your name',
    'auth.profile.save': 'Save',
    'auth.profile.email_label': 'Email',
    'auth.profile.email_placeholder': 'your@email.com',
    'auth.profile.email_note': 'When changing your email, we\'ll send a confirmation link to the new address.',
    'auth.profile.pw_label': 'New password',
    'auth.profile.pw_placeholder': 'Min. 6 characters',
    'auth.profile.saving': 'Saving...',
    'auth.profile.name_updated': 'Name updated.',
    'auth.profile.err_name': 'Enter your name.',
    'auth.profile.err_email': 'Enter a valid email.',
    'auth.profile.email_sent': 'We sent a confirmation link to the new email. The change applies once confirmed.',
    'auth.profile.pw_updated': 'Password updated.',

    // ---------- Chat widget ----------
    'chat.greeting': 'Hi! I\'m Janus Bot. How can I help you with JANUS?',
    'chat.placeholder': 'Type your question...',
    'chat.thinking': 'Thinking',
    'chat.powered': 'Informational assistant',
    'chat.err_connect': 'Connection error. Make sure the backend is running.',
    'chat.err_maintenance': '🛌 The PC is in sleep mode. We\'re gathering the coal...',
    'chat.err_maintenance_back': 'Come back in a moment ⛏️🔥',
    'chat.error_prefix': 'Error: %s',
    'chat.open_aria': 'Open chat',
    'chat.close_aria': 'Close',
    'chat.send_aria': 'Send',

    // ---------- Legal ----------
    'legal.back': '← Back to home',
    'legal.title': 'Terms and Policies',
    'legal.updated': 'Janus Media Labs · Last updated: August 2026',
    'legal.nav.terminos': 'Terms of Service',
    'legal.nav.reembolsos': 'Refunds and Disputes',
    'legal.nav.cancelacion': 'Cancellation',
    'legal.nav.promociones': 'Promotions',
    'legal.nav.restricciones': 'Legal Restrictions',
    'legal.nav.contacto': 'Contact',
    'legal.terminos.title': 'Terms of Service',
    'legal.terminos.p1.html': 'JANUS is a video dubbing and translation platform operated by <strong>Janus Media Labs</strong>, combining AI processing services with software tools (the 3-step dubbing app and JANUS Studio). We offer professional video translation between English and Spanish (and, on the Global plan, French or Japanese), with natural voice cloning, audio synchronization, and preservation of the original background music and effects.',
    'legal.terminos.creditos': 'Delivery and Use of Digital Credits',
    'legal.terminos.creditos.p': 'When purchasing any package (Essential, Multi-Voice, or Global) through our Merchant of Record (Lemon Squeezy), the user immediately and instantly receives digital processing passes/credits associated with their account. Each credit enables the translation, voice cloning, and rendering of one video according to the specifications of the selected package. All processing is done directly in JANUS Studio. No manual or deferred delivery services are offered after purchase.',
    'legal.terminos.resp': 'Client responsibilities',
    'legal.terminos.r1': 'You declare that you hold the necessary rights to the content you submit for dubbing and translation.',
    'legal.terminos.r2': 'You will not submit illegal, defamatory content, content that infringes third-party rights, or content intended to impersonate another person without their consent.',
    'legal.terminos.r3': 'Voice cloning is performed only on voices present in your own content or with the explicit authorization of the voice owner.',
    'legal.terminos.propiedad': 'Ownership',
    'legal.terminos.propiedad.p': 'You retain all rights to your original content and to the final video. Janus Media Labs claims no ownership over client material.',
    'legal.terminos.lim': 'Limitation of liability',
    'legal.terminos.lim.p': 'The service is provided "as is". Our maximum liability for any claim related to an order is limited to the amount paid for that order.',
    'legal.reembolsos.title': 'Refund and Dispute Policy',
    'legal.reembolsos.p1.html': 'JANUS sells <strong>digital processing credits</strong> with instant delivery; we do not sell physical products or deferred services.',
    'legal.reembolsos.cuando': 'When a refund applies',
    'legal.reembolsos.c1.html': '<strong>Unusable credit:</strong> if a technical defect prevents using your credit to process a video, we offer a replacement credit or a full refund.',
    'legal.reembolsos.c2.html': '<strong>Defective result:</strong> if the rendered video has a technical defect attributable to us (corrupted audio or severe desynchronization), we regenerate the video at no additional cost or refund you in full or in part.',
    'legal.reembolsos.c3.html': '<strong>Payment disputes:</strong> since Lemon Squeezy is our Merchant of Record, payment disputes are handled under their buyer protection policy.',
    'legal.reembolsos.no': 'When it does not apply',
    'legal.reembolsos.n1': 'Credit already used to process a video according to the package specifications.',
    'legal.reembolsos.n2': 'Subjective dissatisfaction with the result once the video has been processed.',
    'legal.reembolsos.n3': 'Problems arising from defective or low-quality source material provided by the client.',
    'legal.reembolsos.como': 'How to request it and disputes',
    'legal.reembolsos.como.p.html': 'Before opening a dispute with your bank or with Lemon Squeezy, contact us at <a href="mailto:support@janusdubber.website">support@janusdubber.website</a>. We respond within 24–48 business hours and resolve most cases directly. Refund requests are evaluated and, if approved, processed to the same payment method within 5 to 10 business days.',
    'legal.cancelacion.title': 'Cancellation Policy',
    'legal.cancelacion.p1': 'JANUS delivers digital processing credits instantly; there are no recurring subscriptions to cancel.',
    'legal.cancelacion.l1.html': '<strong>No subscriptions:</strong> purchases are one-time. There are no recurring plans or automatic charges.',
    'legal.cancelacion.l2.html': '<strong>Delivered credits:</strong> once a credit has been delivered and used, the purchase cannot be cancelled. Refunds are handled per our Refund Policy and through Lemon Squeezy.',
    'legal.cancelacion.p2.html': 'For any questions about your purchase, write to <a href="mailto:support@janusdubber.website">support@janusdubber.website</a> indicating your purchase email and order details.',
    'legal.promociones.title': 'Promotions Terms and Conditions',
    'legal.promociones.l1.html': 'Promotions and discounts apply only to the price listed on <a href="index.html#pricing">janusdubber.website</a> at the time of purchase.',
    'legal.promociones.l2': 'They are not combinable with other offers, coupons, or discounts unless expressly indicated.',
    'legal.promociones.l3': 'They have no cash redemption value.',
    'legal.promociones.l4': 'Each promotion states its validity; outside that period it is not valid.',
    'legal.promociones.l5': 'Janus Media Labs reserves the right to modify or withdraw a promotion at any time, respecting purchases already made.',
    'legal.restricciones.title': 'Legal and Usage Restrictions',
    'legal.restricciones.l1': 'The service is digital and delivered over the internet; it does not involve the export of physical goods.',
    'legal.restricciones.l2': 'We do not offer the service where prohibited by applicable law, nor to persons or entities subject to international sanctions.',
    'legal.restricciones.l3': 'We reserve the right to reject orders whose content violates these terms, with a full refund if payment was already made.',
    'legal.contacto.title': 'Customer Support Contact',
    'legal.contacto.p1': 'For any questions about orders, refunds, cancellations, or the service in general:',
    'legal.contacto.email': 'Email: <a href="mailto:support@janusdubber.website">support@janusdubber.website</a>',
    'legal.contacto.response': 'Response time: 24–48 business hours.'
  }
};

window.janusT = function (key) {
  if (!window.JANUS_LANG) window.JANUS_LANG = janusDetectLang();
  var dict = window.JANUS_I18N[window.JANUS_LANG] || {};
  if (dict[key] !== undefined) return dict[key];
  var fallback = window.JANUS_I18N.es[key];
  return fallback !== undefined ? fallback : key;
};

window.janusDetectLang = function () {
  try {
    var stored = localStorage.getItem(window.JANUS_LANG_STORAGE);
    if (stored === 'es' || stored === 'en') return stored;
  } catch (e) {}
  var nav = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
  if (nav.indexOf('en') === 0) return 'en';
  return 'es';
};

window.janusSetLang = function (lang) {
  if (lang !== 'es' && lang !== 'en') return;
  window.JANUS_LANG = lang;
  try { localStorage.setItem(window.JANUS_LANG_STORAGE, lang); } catch (e) {}
  janusApplyTranslations();
  window.dispatchEvent(new CustomEvent('janus:langchange', { detail: { lang: lang } }));
  document.dispatchEvent(new CustomEvent('janus:langchange', { detail: { lang: lang } }));
};

function janusApplyTranslations() {
  window.JANUS_LANG = window.JANUS_LANG || janusDetectLang();

  document.documentElement.setAttribute('lang', window.JANUS_LANG);

  // Texto estático
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = window.janusT(el.getAttribute('data-i18n'));
  });

  // HTML estático (elementos con markup: <strong>, <em>, <a>)
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    el.innerHTML = window.janusT(el.getAttribute('data-i18n-html'));
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
    el.setAttribute('placeholder', window.janusT(el.getAttribute('data-i18n-ph')));
  });

  // aria-label
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    el.setAttribute('aria-label', window.janusT(el.getAttribute('data-i18n-aria')));
  });

  // alt (imágenes)
  document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
    el.setAttribute('alt', window.janusT(el.getAttribute('data-i18n-alt')));
  });

  // Title + meta description por página
  var page = document.body && document.body.getAttribute('data-page') || 'index';
  var title = window.janusT('meta.' + page + '.title');
  var desc = window.janusT('meta.' + page + '.desc');
  if (title) document.title = title;
  if (desc) {
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', desc);
  }

  // Toggle activo
  document.querySelectorAll('.janus-lang-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === window.JANUS_LANG);
  });
}

function janusInitLangToggle() {
  var toggles = document.querySelectorAll('.janus-lang-toggle');
  if (!toggles.length) return;

  toggles.forEach(function (toggle) {
    toggle.innerHTML =
      '<button class="janus-lang-btn" data-lang="es" type="button" aria-pressed="false">ES</button>' +
      '<span class="janus-lang-sep">/</span>' +
      '<button class="janus-lang-btn" data-lang="en" type="button" aria-pressed="false">EN</button>';

    toggle.querySelectorAll('.janus-lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        janusSetLang(btn.getAttribute('data-lang'));
      });
    });
  });

  // Inyectar estilos del toggle
  if (!document.getElementById('janus-lang-styles')) {
    var style = document.createElement('style');
    style.id = 'janus-lang-styles';
    style.textContent =
      '.janus-lang-toggle{display:inline-flex;align-items:center;gap:2px;margin-left:14px;' +
      'padding:4px 8px;border:1px solid rgba(0,0,0,.18);border-radius:999px;font-family:var(--font-mono,monospace);}' +
      '.janus-lang-btn{background:none;border:none;color:var(--gray-500,#6b7280);opacity:.6;font-size:12px;font-weight:600;cursor:pointer;letter-spacing:.03em;padding:1px 4px;}' +
      '.janus-lang-btn:hover{opacity:1;}' +
      '.janus-lang-btn.active{opacity:1;color:var(--gold-primary,#d4af37);}' +
      '.janus-lang-sep{color:rgba(0,0,0,.3);font-size:11px;}';
    document.head.appendChild(style);
  }
}

function janusInitI18n() {
  window.JANUS_LANG = janusDetectLang();
  janusInitLangToggle();
  janusApplyTranslations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', janusInitI18n);
} else {
  janusInitI18n();
}
