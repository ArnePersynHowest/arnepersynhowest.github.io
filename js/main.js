// Small enhancements only — the site works fine without JavaScript.
// (The light/dark theme lives in theme.js.)

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

// Hide tags that no post uses yet, so a filter never shows an empty list
filterButtons.forEach((button) => {
  const tag = button.dataset.filter;
  button.hidden = tag !== "all" && ![...posts].some((post) => post.dataset.tags.split(" ").includes(tag));
});

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

// ---------- Gentle fade-in while scrolling ----------
// Elements are only hidden once JS has marked them, so nothing disappears without JS.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".section > .shell, .project, .cta .shell").forEach((el) => {
    el.dataset.reveal = "";
    revealObserver.observe(el);
  });
}
