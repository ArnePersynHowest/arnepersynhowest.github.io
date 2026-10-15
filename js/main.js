// Small enhancements only — the site works fine without JavaScript.

// ---------- Light / dark theme toggle (text link in the footer) ----------
const themeToggle = document.querySelector(".theme-toggle");

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark" ||
    (!document.documentElement.hasAttribute("data-theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (themeToggle) {
    themeToggle.textContent = isDark ? "lights on" : "lights off";
  }
  return isDark;
}

let isDark = applyTheme(getStoredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = isDark ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode): theme just won't be remembered
    }
    isDark = applyTheme(next);
  });
}

// ---------- Highlight current page in the nav ----------
const currentPage = document.body.dataset.page;

document.querySelectorAll(".nav a[data-page]").forEach((link) => {
  if (link.dataset.page === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// ---------- Footer year ----------
document.querySelectorAll(".year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ---------- Blog filter ----------
const filterButtons = document.querySelectorAll(".filter button");
const posts = document.querySelectorAll("[data-tags]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tag = button.dataset.filter;

    filterButtons.forEach((b) => b.classList.toggle("active", b === button));

    posts.forEach((post) => {
      const tags = post.dataset.tags.split(" ");
      post.hidden = tag !== "all" && !tags.includes(tag);
    });
  });
});
