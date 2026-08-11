// JANUS — Redirección de compra a Lemon Squeezy (Merchant of Record).
var JANUS_CHECKOUT = {
  essential: 'https://janus-checkout.lemonsqueezy.com/checkout/buy/bdb8d130-5b62-4afa-b88a-9cb16556ce4a',
  multivoice: 'https://janus-checkout.lemonsqueezy.com/checkout/buy/3c247cee-39e7-4a0c-a977-c62d609356b9',
  global: 'https://janus-checkout.lemonsqueezy.com/checkout/buy/86c1c185-2061-4eb7-b188-c85493094270'
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
