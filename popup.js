var toggle = document.getElementById("toggle");
var state = document.getElementById("state");

function paint(enabled) {
  toggle.setAttribute("aria-checked", enabled ? "true" : "false");
  state.textContent = enabled ? "Włączony" : "Wyłączony";
}

function currentTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    callback(tabs && tabs[0]);
  });
}

chrome.storage.local.get({ enabled: true }, function (data) {
  paint(data.enabled !== false);
});

toggle.addEventListener("click", function () {
  var enabled = toggle.getAttribute("aria-checked") !== "true";
  paint(enabled);
  chrome.storage.local.set({ enabled: enabled });
  currentTab(function (tab) {
    if (!tab || !tab.id || !/^https:\/\/b2b\.topeshop\.pl\//.test(tab.url || "")) return;
    chrome.tabs.sendMessage(tab.id, { type: "tsh-set", enabled: enabled }, function () {
      void chrome.runtime.lastError;
    });
  });
});
