/* ============================================
   EnglishEdu – Global Script
   ============================================ */

/* ── Dark Mode ── */
(function () {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
})();

function toggleDark() {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  document.querySelectorAll(".dark-toggle").forEach((btn) => {
    btn.textContent = next === "dark" ? "☀️" : "🌙";
  });
}

/* ── Hamburger ── */
function toggleMenu() {
  document.getElementById("mobile-menu").classList.toggle("open");
}

/* ── Scroll Reveal ── */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

/* ── Progress Bars ── */
function animateProgress() {
  document.querySelectorAll(".progress-fill").forEach((bar) => {
    const target = bar.getAttribute("data-width") || "0";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            bar.style.width = target + "%";
            io.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(bar);
  });
}

/* ── Navbar scroll shadow ── */
function initNavbar() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.style.boxShadow =
      window.scrollY > 20 ? "0 4px 30px rgba(5,150,105,0.14)" : "";
  });
}

/* ── Active nav link ── */
function setActiveLink() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === page || (page === "index.html" && href === "index.html")) {
      a.classList.add("active");
    }
  });
}

/* ── Filter Tabs ── */
function initTabs() {
  document.querySelectorAll(".filter-tabs").forEach((wrap) => {
    wrap.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        wrap
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        const target = wrap.getAttribute("data-target");
        document.querySelectorAll(target).forEach((card) => {
          if (filter === "all" || card.getAttribute("data-cat") === filter) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  });
}

/* ── Search ── */
function initSearch() {
  document.querySelectorAll(".search-wrap input").forEach((inp) => {
    inp.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      document
        .querySelectorAll(".lesson-card, .dl-card, .ex-card")
        .forEach((card) => {
          card.style.opacity =
            !q || card.textContent.toLowerCase().includes(q) ? "1" : "0.3";
        });
    });
    inp.addEventListener("blur", function () {
      if (!this.value) {
        document
          .querySelectorAll(".lesson-card, .dl-card, .ex-card")
          .forEach((c) => (c.style.opacity = "1"));
      }
    });
  });
}

function initFilePreview() {
  const input = document.getElementById("file-preview-input");
  const details = document.getElementById("file-preview-details");
  if (!input || !details) return;

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) {
      details.textContent = "No file selected.";
      return;
    }

    const kbytes = file.size / 1024;
    const sizeText =
      kbytes < 1024
        ? `${kbytes.toFixed(1)} KB`
        : `${(kbytes / 1024).toFixed(1)} MB`;
    details.textContent = `File name: ${file.name} · Size: ${sizeText}`;
  });
}

/* ── Quiz ── */
const quizData = [
  {
    q: "She ___ to school every day.",
    opts: ["go", "goes", "going", "gone"],
    ans: 1,
  },
  {
    q: "They ___ playing football when it rained.",
    opts: ["were", "are", "is", "was"],
    ans: 0,
  },
  {
    q: "I ___ never eaten sushi before.",
    opts: ["have", "has", "had", "am"],
    ans: 0,
  },
  {
    q: "He will ___ the report tomorrow.",
    opts: ["finishing", "finished", "finish", "finishes"],
    ans: 2,
  },
  {
    q: "We ___ to Paris last summer.",
    opts: ["go", "goes", "went", "gone"],
    ans: 2,
  },
  {
    q: "The cake ___ by my mother.",
    opts: ["baked", "was baked", "bakes", "is baking"],
    ans: 1,
  },
  {
    q: "If I were rich, I ___ travel the world.",
    opts: ["will", "would", "can", "should"],
    ans: 1,
  },
  {
    q: "She ___ her homework before dinner.",
    opts: ["finish", "finishes", "had finished", "is finishing"],
    ans: 2,
  },
];

let quizIdx = 0,
  score = 0;
function initQuiz() {
  const wrap = document.getElementById("quiz-wrap");
  if (!wrap) return;
  renderQuestion(wrap);
}
function renderQuestion(wrap) {
  if (quizIdx >= quizData.length) {
    wrap.innerHTML = `
      <div class="quiz-card glass" style="text-align:center;padding:48px">
        <div style="font-size:3rem;margin-bottom:16px">🎉</div>
        <h2 style="margin-bottom:8px">Quiz Complete!</h2>
        <p style="color:var(--clr-muted);margin-bottom:24px">You scored <strong style="color:var(--clr-primary)">${score}/${quizData.length}</strong></p>
        <button class="btn btn-primary" onclick="quizIdx=0;score=0;renderQuestion(document.getElementById('quiz-wrap'))">Try Again</button>
      </div>`;
    return;
  }
  const d = quizData[quizIdx];
  wrap.innerHTML = `
    <div class="quiz-progress">Question ${quizIdx + 1} of ${quizData.length} · Score: ${score}</div>
    <div class="quiz-card glass">
      <div class="quiz-q">${d.q}</div>
      <div class="quiz-options">
        ${d.opts.map((o, i) => `<div class="quiz-opt" onclick="checkAns(this,${i},${d.ans})">${o}</div>`).join("")}
      </div>
      <div style="height:6px;border-radius:3px;background:rgba(16,185,129,0.15)">
        <div style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--clr-primary),var(--clr-accent));width:${(quizIdx / quizData.length) * 100}%;transition:width 0.5s ease"></div>
      </div>
    </div>`;
}
function checkAns(el, chosen, correct) {
  const opts = el.parentElement.querySelectorAll(".quiz-opt");
  opts.forEach((o) => (o.style.pointerEvents = "none"));
  if (chosen === correct) {
    el.classList.add("correct");
    score++;
  } else {
    el.classList.add("wrong");
    opts[correct].classList.add("correct");
  }
  setTimeout(() => {
    quizIdx++;
    renderQuestion(document.getElementById("quiz-wrap"));
  }, 900);
}

/* ── Counter Animation ── */
function animateCounters() {
  document.querySelectorAll(".count-up").forEach((el) => {
    const target = parseInt(el.getAttribute("data-target") || "0", 10);
    let cur = 0;
    const step = Math.ceil(target / 60);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const t = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent =
              cur.toLocaleString() + (el.getAttribute("data-suffix") || "");
            if (cur >= target) clearInterval(t);
          }, 28);
          io.unobserve(el);
        }
      });
    });
    io.observe(el);
  });
}

/* ── Init ── */
document.addEventListener("DOMContentLoaded", () => {
  // set dark toggle icon
  const theme = document.documentElement.getAttribute("data-theme");
  document.querySelectorAll(".dark-toggle").forEach((btn) => {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  });
  initReveal();
  animateProgress();
  initNavbar();
  setActiveLink();
  initTabs();
  initSearch();
  initFilePreview();
  initQuiz();
  animateCounters();
});
  // Ensure icons show after page loads
  window.addEventListener('load', function() {
    document.querySelectorAll('.social-btn i').forEach(icon => {
      icon.style.visibility = 'visible';
      icon.style.opacity = '1';
    });
  });

