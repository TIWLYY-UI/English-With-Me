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
      if (!q) return;
      // Highlight matching cards on same page
      document
        .querySelectorAll(".lesson-card, .dl-card, .ex-card")
        .forEach((card) => {
          const text = card.textContent.toLowerCase();
          card.style.opacity = text.includes(q) ? "1" : "0.3";
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
function switchPanel(id) {
  document
    .querySelectorAll(".ex-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".ex-nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("panel-" + id).classList.add("active");
  event?.target?.classList.add("active");
}

// ── Score system ──
let totalScore = 0,
  correctCount = 0,
  streak = 0;
function addScore(pts, isCorrect) {
  if (isCorrect) {
    correctCount++;
    streak++;
    totalScore += pts;
  } else {
    streak = 0;
  }
  document.getElementById("total-score").textContent = totalScore;
  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("streak-count").textContent = streak;
}

// ── Fill in the Blank ──
function checkBlanks() {
  const inputs = document.querySelectorAll(".blank-input");
  let correct = 0;
  inputs.forEach((inp) => {
    const ans = inp.getAttribute("data-answer").toLowerCase().trim();
    const val = inp.value.toLowerCase().trim();
    inp.classList.remove("correct", "wrong");
    const ansEl = inp.closest(".blank-card").querySelector(".blank-answer");
    if (val === ans) {
      inp.classList.add("correct");
      correct++;
      ansEl.style.display = "none";
    } else {
      inp.classList.add("wrong");
      ansEl.style.display = "block";
    }
  });
  const res = document.getElementById("blank-result");
  res.classList.add("show");
  const pct = Math.round((correct / inputs.length) * 100);
  document.getElementById("blank-score-text").textContent =
    `You got ${correct}/${inputs.length} correct (${pct}%). ${pct >= 80 ? "🌟 Excellent!" : pct >= 50 ? "👍 Good job!" : "📚 Keep practising!"}`;
  addScore(correct * 10, correct > 0);
}

// ── Matching ──
const matchPairs = [
  { l: "Simple Present", r: "S + V(s/es)" },
  { l: "Past Continuous", r: "S + was/were + V-ing" },
  { l: "Present Perfect", r: "S + have/has + V3" },
  { l: "Simple Future", r: "S + will + V1" },
  { l: "Past Perfect", r: "S + had + V3" },
  { l: "Future Perfect", r: "S + will have + V3" },
];
let matchSelected = null,
  matchedCount = 0;

function buildMatch() {
  const left = [...matchPairs].sort(() => Math.random() - 0.5);
  const right = [...matchPairs].sort(() => Math.random() - 0.5);
  const lEl = document.getElementById("match-left");
  const rEl = document.getElementById("match-right");
  lEl.innerHTML = "";
  rEl.innerHTML = "";
  left.forEach((p) => {
    const d = document.createElement("div");
    d.className = "match-item";
    d.textContent = p.l;
    d.dataset.key = p.l;
    d.dataset.side = "left";
    d.onclick = () => selectMatch(d);
    lEl.appendChild(d);
  });
  right.forEach((p) => {
    const d = document.createElement("div");
    d.className = "match-item";
    d.textContent = p.r;
    d.dataset.key = p.l;
    d.dataset.side = "right";
    d.onclick = () => selectMatch(d);
    rEl.appendChild(d);
  });
  document.getElementById("match-result").classList.remove("show");
  matchSelected = null;
  matchedCount = 0;
}

function selectMatch(el) {
  if (el.classList.contains("matched")) return;
  if (!matchSelected) {
    document
      .querySelectorAll(".match-item")
      .forEach((i) => i.classList.remove("selected"));
    matchSelected = el;
    el.classList.add("selected");
  } else {
    if (matchSelected === el) {
      el.classList.remove("selected");
      matchSelected = null;
      return;
    }
    const sameKey = matchSelected.dataset.key === el.dataset.key;
    const diffSides = matchSelected.dataset.side !== el.dataset.side;
    if (sameKey && diffSides) {
      [matchSelected, el].forEach((i) => {
        i.classList.remove("selected");
        i.classList.add("matched");
        i.style.pointerEvents = "none";
      });
      matchedCount++;
      addScore(15, true);
      if (matchedCount === matchPairs.length)
        document.getElementById("match-result").classList.add("show");
    } else {
      [matchSelected, el].forEach((i) => {
        i.classList.add("wrong");
        setTimeout(() => i.classList.remove("wrong", "selected"), 600);
      });
      addScore(0, false);
    }
    matchSelected = null;
  }
}

function resetMatch() {
  buildMatch();
}

// ── True / False ──
const tfData = [
  { stmt: '"She go to school" is grammatically correct.', ans: false },
  {
    stmt: 'The Present Perfect uses "have/has + past participle".',
    ans: true,
  },
  { stmt: '"She was eating" is an example of Past Simple.', ans: false },
  { stmt: "Adjectives modify nouns.", ans: true },
  {
    stmt: "The passive voice structure is: Object + be + Past Participle.",
    ans: true,
  },
  {
    stmt: 'In the Second Conditional, we use Present Simple in the "if" clause.',
    ans: false,
  },
  {
    stmt: "Adverbs can modify verbs, adjectives, and other adverbs.",
    ans: true,
  },
  {
    stmt: '"Had + past participle" is used for the Past Perfect tense.',
    ans: true,
  },
];
let tfScore = 0,
  tfAnswered = 0;

function buildTF() {
  tfScore = 0;
  tfAnswered = 0;
  const container = document.getElementById("tf-container");
  container.innerHTML = "";
  document.getElementById("tf-result").classList.remove("show");
  tfData.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "tf-card glass";
    card.innerHTML = `
      <div class="tf-stmt">${i + 1}. ${item.stmt}</div>
      <div class="tf-btns">
        <button class="tf-btn" onclick="checkTF(this, true, ${item.ans}, ${i})">✅ True</button>
        <button class="tf-btn" onclick="checkTF(this, false, ${item.ans}, ${i})">❌ False</button>
      </div>`;
    container.appendChild(card);
  });
}

function checkTF(btn, chosen, correct, idx) {
  const btns = btn.closest(".tf-btns").querySelectorAll(".tf-btn");
  btns.forEach((b) => (b.disabled = true));
  if (chosen === correct) {
    btn.classList.add("correct");
    tfScore++;
    addScore(10, true);
  } else {
    btn.classList.add("wrong");
    btns[chosen ? 1 : 0].classList.add("correct");
    addScore(0, false);
  }
  tfAnswered++;
  if (tfAnswered === tfData.length) {
    const res = document.getElementById("tf-result");
    res.classList.add("show");
    document.getElementById("tf-score-text").textContent =
      `You scored ${tfScore}/${tfData.length}. ${tfScore >= 7 ? "🌟 Excellent!" : tfScore >= 5 ? "👍 Good job!" : "📚 Review the grammar rules and try again!"}`;
  }
}

function resetTF() {
  buildTF();
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  buildMatch();
  buildTF();
});

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
