(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  document.getElementById("year").textContent = new Date().getFullYear();

  // Lightweight star field; gracefully respects reduced-motion preferences.
  const canvas = document.getElementById("stars");
  const ctx = canvas?.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && ctx) {
    let width = 0, height = 0, stars = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = width + "px"; canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(110, Math.floor(width * height / 10500)) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.25 + .25, a: Math.random() * .55 + .15,
        speed: Math.random() * .12 + .025, phase: Math.random() * Math.PI * 2
      }));
    };
    const draw = time => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        const twinkle = reduceMotion ? 1 : .65 + Math.sin(time * .0007 + star.phase) * .35;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(206,199,255," + (star.a * twinkle) + ")";
        ctx.fill();
        if (!reduceMotion) { star.y -= star.speed; if (star.y < -3) star.y = height + 3; }
      });
      if (!reduceMotion) requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize, { passive: true });
    if (reduceMotion) draw(0); else requestAnimationFrame(draw);
  }
})();