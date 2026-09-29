const typedName = document.querySelector(".typed-name");
const typingCursor = document.querySelector(".typing-cursor");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeStorageKey = "aaron-portfolio-theme";

let savedTheme;

try {
  savedTheme = window.localStorage.getItem(themeStorageKey);
} catch {
  savedTheme = null;
}

const initialTheme =
  savedTheme ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

const applyTheme = (theme, persist = false) => {
  document.documentElement.dataset.theme = theme;

  if (themeToggle && themeIcon) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${isDark ? "light" : "dark"} theme`,
    );
    themeToggle.title = `Switch to ${isDark ? "light" : "dark"} theme`;
    themeIcon.textContent = isDark ? "☼" : "☾";
  }

  if (persist) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      return;
    }
  }
};

applyTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});

if (typedName && typingCursor && !reducedMotion.matches) {
  const fullName = typedName.textContent;
  typedName.textContent = "";

  let characterIndex = 0;

  const typeNextCharacter = () => {
    typedName.textContent = fullName.slice(0, characterIndex + 1);
    characterIndex += 1;

    if (characterIndex < fullName.length) {
      window.setTimeout(typeNextCharacter, 105);
    } else {
      typingCursor.classList.add("is-done");
    }
  };

  window.setTimeout(typeNextCharacter, 380);
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const progressBar = document.querySelector(".scroll-progress span");
const navigationLinks = [
  ...document.querySelectorAll('.site-nav a[href^="#"]'),
];
let scrollUpdatePending = false;

const updateScrollProgress = () => {
  if (progressBar) {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  }

  scrollUpdatePending = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollUpdatePending) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollUpdatePending = true;
    }
  },
  { passive: true },
);

updateScrollProgress();

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigationLinks.forEach((link) => {
            if (link.hash === `#${entry.target.id}`) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );

  navigationLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) {
      sectionObserver.observe(section);
    }
  });
}

const pixelCursor = document.querySelector(".pixel-cursor");
const supportsCustomCursor = window.matchMedia(
  "(pointer: fine) and (hover: hover)",
);

if (pixelCursor && supportsCustomCursor.matches) {
  const hidePixelCursor = () => {
    pixelCursor.classList.remove("is-visible", "is-hovering", "is-pressed");
    document.body.classList.remove("has-custom-cursor");
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
      hidePixelCursor();
      return;
    }

    document.body.classList.add("has-custom-cursor");
    pixelCursor.classList.add("is-visible");
    pixelCursor.style.transform = `translate3d(${event.clientX + 8}px, ${event.clientY + 8}px, 0)`;
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target instanceof Element) {
      pixelCursor.classList.toggle(
        "is-hovering",
        Boolean(event.target.closest("a, button")),
      );
    }
  });

  window.addEventListener("pointerdown", () =>
    pixelCursor.classList.add("is-pressed"),
  );
  window.addEventListener("pointerup", () =>
    pixelCursor.classList.remove("is-pressed"),
  );
  window.addEventListener("blur", hidePixelCursor);
  document.addEventListener("mouseleave", hidePixelCursor);
}
