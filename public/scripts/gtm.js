(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  // If a global integrity hash is provided (e.g. window.GTM_SCRIPT_INTEGRITY), attach it.
  // This allows pinning the remote script when you have a verified SRI hash;
  // otherwise we at least set crossOrigin for safer loading behavior.
  try {
    var integrityHash = (globalThis && globalThis.GTM_SCRIPT_INTEGRITY) || null;
    if (integrityHash) {
      j.integrity = integrityHash;
    }
  } catch {
    // ignore if globals are locked down in some environments
  }

  // Prefer explicitly setting crossOrigin to 'anonymous' in all cases.
  j.crossOrigin = "anonymous";

  f.parentNode.insertBefore(j, f);
})(globalThis, globalThis.document, "script", "dataLayer", "GTM-P6L9KZDZ");
