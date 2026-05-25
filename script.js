const projectCards = Array.from(document.querySelectorAll(".project-card"));
const domainFilter = document.querySelector("#domainFilter");
const toolFilter = document.querySelector("#toolFilter");
const methodFilter = document.querySelector("#methodFilter");
const resetFilters = document.querySelector("#resetFilters");
const resultsNote = document.querySelector("#resultsNote");

function projectMatches(card) {
  const domain = domainFilter.value;
  const tool = toolFilter.value;
  const method = methodFilter.value;
  const tools = card.dataset.tools.split(" ");
  const methods = card.dataset.methods.split(" ");

  return (
    (domain === "all" || card.dataset.domain === domain) &&
    (tool === "all" || tools.includes(tool)) &&
    (method === "all" || methods.includes(method))
  );
}

function updateProjects() {
  let visible = 0;

  projectCards.forEach((card) => {
    const matches = projectMatches(card);
    card.classList.toggle("hidden", !matches);
    if (matches) visible += 1;
  });

  resultsNote.textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}`;
}

[domainFilter, toolFilter, methodFilter].forEach((filter) => {
  filter.addEventListener("change", updateProjects);
});

resetFilters.addEventListener("click", () => {
  domainFilter.value = "all";
  toolFilter.value = "all";
  methodFilter.value = "all";
  updateProjects();
});

const countTargets = document.querySelectorAll("[data-count]");

function animateCount(entry) {
  const element = entry.target;
  const target = Number(element.dataset.count);
  const suffix = target === 100 ? "%" : "";
  const duration = 900;
  const startedAt = performance.now();

  function tick(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const value = Math.round(target * progress);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

countTargets.forEach((target) => countObserver.observe(target));

const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

updateProjects();
