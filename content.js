(function () {
  var STORAGE_KEY = "tsh-dark";

  function apply(enabled) {
    document.documentElement.classList.toggle("tsh-dark", !!enabled);
    document.documentElement.style.colorScheme = enabled ? "dark" : "";
  }

  function readLocal() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      if (value === "0") return false;
      if (value === "1") return true;
    } catch (error) {
      /* prywatny tryb albo zablokowany storage */
    }
    return true;
  }

  function writeLocal(enabled) {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch (error) {
      /* ignoruj */
    }
  }

  apply(readLocal());

  chrome.storage.local.get({ enabled: true }, function (data) {
    var enabled = data.enabled !== false;
    writeLocal(enabled);
    apply(enabled);
  });

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== "local" || !changes.enabled) return;
    var enabled = changes.enabled.newValue !== false;
    writeLocal(enabled);
    apply(enabled);
  });

  chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
    if (!message || message.type !== "tsh-set") return;
    var enabled = !!message.enabled;
    writeLocal(enabled);
    apply(enabled);
    sendResponse({ ok: true, enabled: enabled });
  });
})();
