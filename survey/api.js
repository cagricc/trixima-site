// Small helper for the application and review pages.
window.TRX = (function () {
  "use strict";
  var MESSAGES = {
    invalid_link: "Bu bağlantı geçersiz ya da artık kullanılmıyor.",
    required_consent_missing: "Devam etmek için aydınlatma metnini okuduğunuzu onaylamanız gerekiyor.",
    missing_field: "Zorunlu alanlardan biri boş kaldı.",
    bad_tax_number: "Vergi numarası 10 haneli (şahıs işletmelerinde 11 haneli) olmalı.",
    bad_location: "İl ve ilçe seçimini kontrol edin.",
    too_many_applications: "Bu bağlantıdan bugün çok sayıda başvuru yapıldı. Lütfen yarın tekrar deneyin veya survey@trixima.com adresine yazın.",
    network: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
    not_configured: "Sistem henüz yayında değil."
  };
  function rpc(name, body) {
    var c = window.TRX_CONFIG;
    if (c.key.indexOf("__") === 0) return Promise.reject(new Error("not_configured"));
    return fetch(c.url + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: c.key, Authorization: "Bearer " + c.key },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error((j && j.message) || ("http_" + r.status));
        return j;
      });
    }, function () { throw new Error("network"); });
  }
  function msg(e) {
    var k = (e && e.message) || "";
    if (/check constraint/.test(k)) return "Bazı bilgiler geçersiz görünüyor (örneğin e-posta adresi). Lütfen kontrol edin.";
    return MESSAGES[k.split(" ")[0]] || ("Beklenmeyen bir hata oluştu (" + k + ").");
  }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  return { rpc: rpc, msg: msg, el: el };
})();
