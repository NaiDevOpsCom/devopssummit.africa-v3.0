"use strict";

// Performance: Load non-critical GTM after main app is ready
globalThis.addEventListener("load", function () {
  if ("requestIdleCallback" in globalThis) {
    globalThis.requestIdleCallback(
      function () {
        var s = globalThis.document.createElement("script");
        s.src = "/scripts/gtm.js";
        s.type = "module";
        s.async = true;
        globalThis.document.body.appendChild(s);
      },
      { timeout: 3000 },
    );
  } else {
    globalThis.setTimeout(function () {
      var s = globalThis.document.createElement("script");
      s.src = "/scripts/gtm.js";
      s.type = "module";
      s.async = true;
      globalThis.document.body.appendChild(s);
    }, 2000);
  }
});
