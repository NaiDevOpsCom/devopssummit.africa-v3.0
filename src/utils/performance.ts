const scriptLoadPromises = new Map<string, Promise<void>>();

const getScriptKey = (src: string, id?: string) => id ?? src;

/**
 * Loads a script asynchronously and returns a promise.
 * Can be used to delay loading of non-critical third-party scripts.
 */
export function loadScript(src: string, id?: string): Promise<void> {
  const key = getScriptKey(src, id);
  // If we've already started loading this script, return the stored promise.
  // Use Map.has to avoid using a Promise directly in a boolean conditional.
  if (scriptLoadPromises.has(key)) {
    return scriptLoadPromises.get(key)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existingScript = id ? document.getElementById(id) : null;

    if (existingScript instanceof HTMLScriptElement) {
      if (existingScript.dataset.loadState === "loaded") {
        resolve();
        return;
      }
      if (existingScript.dataset.loadState === "error") {
        reject(new Error(`Failed to load script: ${src}`));
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          existingScript.dataset.loadState = "loaded";
          resolve();
        },
        { once: true },
      );
      existingScript.addEventListener(
        "error",
        () => {
          existingScript.dataset.loadState = "error";
          scriptLoadPromises.delete(key);
          reject(new Error(`Failed to load script: ${src}`));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    if (id) script.id = id;

    script.onload = () => {
      script.dataset.loadState = "loaded";
      resolve();
    };
    script.onerror = () => {
      script.dataset.loadState = "error";
      scriptLoadPromises.delete(key);
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.body.appendChild(script);
  });

  scriptLoadPromises.set(key, promise);
  return promise;
}

/**
 * Executes a callback when the browser is idle or after a short delay.
 */
export function onIdle(callback: () => void, timeout = 2000): void {
  if ("requestIdleCallback" in globalThis) {
    globalThis.requestIdleCallback(() => callback(), { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}
