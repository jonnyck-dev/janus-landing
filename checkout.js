// JANUS — Redirección de compra a Lemon Squeezy (Merchant of Record).
// Actualiza estas URLs con el checkout de cada producto cuando estén creados.
var JANUS_CHECKOUT = {
  essential: 'https://janus.lemonsqueezy.com/checkout/buy/PENDIENTE-ESENCIAL',
  multivoice: 'https://janus.lemonsqueezy.com/checkout/buy/PENDIENTE-MULTIVOZ',
  global: 'https://janus.lemonsqueezy.com/checkout/buy/PENDIENTE-GLOBAL'
};

(function () {
  document.querySelectorAll('.price-cta[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var url = JANUS_CHECKOUT[btn.getAttribute('data-plan')];
      if (url) window.open(url, '_blank', 'noopener');
    });
  });
})();
