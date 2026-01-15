(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Drawer (shared)
  const drawer = document.getElementById("navDrawer");
  const navToggle = document.getElementById("navToggle");
  const navClose = document.getElementById("navClose");
  const navBackdrop = document.getElementById("navBackdrop");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle) navToggle.addEventListener("click", openDrawer);
  if (navClose) navClose.addEventListener("click", closeDrawer);
  if (navBackdrop) navBackdrop.addEventListener("click", closeDrawer);

  document.querySelectorAll("[data-close-drawer]").forEach((a) => {
    a.addEventListener("click", closeDrawer);
  });

  // Accordion (landing)
  document.querySelectorAll("[data-accordion] .acc").forEach((item) => {
    const q = item.querySelector(".acc__q");
    if (!q) return;
    q.addEventListener("click", () => item.classList.toggle("is-open"));
  });

  // Copy buttons
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy");
      const target = sel ? document.querySelector(sel) : null;
      const text = target ? target.innerText : "";
      const ok = await copyText(text);

      const old = btn.textContent;
      btn.textContent = ok ? "Copied" : "Failed";
      setTimeout(() => (btn.textContent = old), 1200);
    });
  });

  // Docs: build drawer links from sidebar links (mobile)
  const docsNav = document.getElementById("docsNav");
  const docsDrawerLinks = document.getElementById("docsDrawerLinks");
  if (docsNav && docsDrawerLinks) {
    const links = Array.from(docsNav.querySelectorAll("a"));
    docsDrawerLinks.innerHTML = links
      .map((a) => `<a href="${a.getAttribute("href")}" data-close-drawer>${a.textContent}</a>`)
      .join("");

    docsDrawerLinks.querySelectorAll("[data-close-drawer]").forEach((a) => {
      a.addEventListener("click", closeDrawer);
    });
  }

  // Docs: highlight active section + search
  const docSearch = document.getElementById("docSearch");
  const docsContent = document.getElementById("docsContent");
  const docsNavLinks = docsNav ? Array.from(docsNav.querySelectorAll("a")) : [];
  const docSections = docsContent ? Array.from(docsContent.querySelectorAll("section.doc")) : [];

  function setActiveLink(hash) {
    docsNavLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === hash));
  }

  if (docSections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveLink("#" + visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0.1, 0.2, 0.4, 0.6] }
    );
    docSections.forEach((s) => obs.observe(s));
  }

  if (docSearch && docsContent) {
    docSearch.addEventListener("input", () => {
      const q = docSearch.value.trim().toLowerCase();
      docSections.forEach((sec) => {
        const text = sec.innerText.toLowerCase();
        sec.style.display = q && !text.includes(q) ? "none" : "";
      });
    });
  }

  // Close drawer with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
})();
