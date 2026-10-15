// Site-wide light/dark theme.
// Loaded in <head> WITHOUT defer so the theme is set before the page is drawn (no flash).
//
// Where the choice is remembered:
// 1. localStorage — works across all pages when the site is hosted (http/https).
// 2. ?theme=… on internal links — only when opening the files directly (file://),
//    because browsers often give every local file its own separate storage.
(function () {
  var KEY = "theme";
  var root = document.documentElement;
  var isLocalFile = location.protocol === "file:";

  function readStored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function store(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      // Storage blocked (e.g. private mode): the URL fallback still works for file://
    }
  }

  function readFromUrl() {
    var match = location.search.match(/[?&]theme=(light|dark)\b/);
    return match ? match[1] : null;
  }

  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  var chosen = readFromUrl() || readStored(); // null = follow the system
  if (chosen) store(chosen);

  function current() {
    return chosen || (systemDark.matches ? "dark" : "light");
  }

  function apply() {
    var theme = current();
    root.setAttribute("data-theme", theme);
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      var label = buttons[i].querySelector(".theme-label");
      if (label) label.textContent = theme;
      buttons[i].setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    }
  }

  apply();

  // Follow system changes as long as the visitor hasn't picked a theme
  systemDark.addEventListener("change", function () {
    if (!chosen) apply();
  });

  // Keep other open tabs in sync
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && (e.newValue === "light" || e.newValue === "dark")) {
      chosen = e.newValue;
      apply();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    apply();

    document.addEventListener("click", function (e) {
      // Toggle button
      var toggle = e.target.closest(".theme-toggle");
      if (toggle) {
        chosen = current() === "dark" ? "light" : "dark";
        store(chosen);
        apply();
        return;
      }

      // file:// only: carry the chosen theme along to the next page
      if (!isLocalFile || !chosen) return;
      var link = e.target.closest("a[href]");
      if (!link) return;
      var url = new URL(link.getAttribute("href"), location.href);
      if (url.protocol !== "file:" || !/\.html$/.test(url.pathname)) return;
      url.searchParams.set("theme", chosen);
      link.href = url.href;
    });
  });
})();
