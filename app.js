"use strict";

// ═══════════════════════════════════════════════════════
// STORAGE — localStorage with fallback
// ═══════════════════════════════════════════════════════
const LS = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem("sp_" + k));
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem("sp_" + k, JSON.stringify(v));
    } catch {
      console.warn("Storage full");
    }
  },
  del(k) {
    try {
      localStorage.removeItem("sp_" + k);
    } catch {}
  },
};
const MAX_HISTORY = 50;

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let level = "complete beginner";
let selTrackV = null;
let quizData = null;
let askData = null;
let projData = null;
let rmData = null;
let askQ = "";
let histFilt = "all";
let isLoading = {};

// ═══════════════════════════════════════════════════════
// OPENAI CALLER (replaces the missing claude() function)
// ═══════════════════════════════════════════════════════
async function claude(prompt) {
  if (!navigator.onLine) throw new Error("offline");

  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
              (typeof window !== "undefined" && window.NEXT_PUBLIC_OPENAI_API_KEY);
  
  if (!key || !key.startsWith("sk-")) {
    throw new Error("API key missing. Check Vercel environment variables.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",        // fast + cheap (perfect for demo)
      messages: [
        { 
          role: "system", 
          content: "You are SkillPilot AI, a friendly and clear tech tutor for 3MTT students. Always be helpful and beginner-friendly." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(err);
    throw new Error("API error. Please try again.");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// ═══════════════════════════════════════════════════════
// OFFLINE DETECTION
// ═══════════════════════════════════════════════════════
// Safe offline detection (your banner is commented out)
function updateOnline() {
  const banner = document.getElementById("offline-banner");
  if (banner) {
    banner.classList.toggle("show", !navigator.onLine);
  }
}
window.addEventListener("online", updateOnline);
window.addEventListener("offline", updateOnline);
updateOnline();

// ═══════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════
function closeModal() {
  document.getElementById("modal-bg").classList.add("off");
  LS.set("onboarded", true);
}
function openModal() {
  document.getElementById("modal-bg").classList.remove("off");
}
if (LS.get("onboarded")) closeModal();

// ═══════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════
let theme = LS.get("theme") || "dark";
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.getElementById("theme-btn").textContent = t === "dark" ? "🌙" : "☀️";
  LS.set("theme", t);
}
function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  toast(theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode", "i");
}
applyTheme(theme);

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
function go(tab, btn, ns) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("panel-" + tab).classList.add("active");

  if (ns === "b") {
    document
      .querySelectorAll(".bnav-item")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".npill").forEach((n) => {
      n.classList.toggle(
        "active",
        n.textContent.toLowerCase().includes(tab === "ask" ? "ask" : tab),
      );
    });
  } else {
    document
      .querySelectorAll(".npill")
      .forEach((n) => n.classList.remove("active"));
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
    }
    document.querySelectorAll(".bnav-item").forEach((b) => {
      const label = b.getAttribute("aria-label")?.toLowerCase() || "";
      const match =
        (tab === "ask" && label.includes("ask")) ||
        (tab === "project" && label.includes("project")) ||
        (tab === "roadmap" && label.includes("roadmap")) ||
        (tab === "history" && label.includes("history")) ||
        (tab === "progress" && label.includes("progress"));
      b.classList.toggle("active", match);
    });
  }
  if (tab === "history") renderHistory();
  if (tab === "progress") renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ═══════════════════════════════════════════════════════
// DIFFICULTY
// ═══════════════════════════════════════════════════════
function setDiff(btn) {
  document
    .querySelectorAll(".diff-pill")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  level = btn.dataset.level;
}

// ═══════════════════════════════════════════════════════
// TRACK SELECT
// ═══════════════════════════════════════════════════════
function selTrack(el) {
  document.querySelectorAll(".track-card").forEach((c) => {
    c.classList.remove("selected");
    c.setAttribute("aria-checked", "false");
  });
  el.classList.add("selected");
  el.setAttribute("aria-checked", "true");
  selTrackV = el.dataset.track;
  document.getElementById("project-btn").disabled = false;
}

// ═══════════════════════════════════════════════════════
// JSON HELPER
// ═══════════════════════════════════════════════════════
function parseJ(raw) {
  return JSON.parse(
    raw
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "")
      .trim(),
  );
}

// ═══════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════
function skel(id, on) {
  document.getElementById(id + "-skel").classList.toggle("on", on);
  const btn = document.getElementById(id === "ask" ? "ask-btn" : id + "-btn");
  if (btn) btn.disabled = on;
}
function showErr(id, msg) {
  const el = document.getElementById(id + "-err");
  if (!el) {
    toast("⚠ " + msg, "e");   // show as toast instead of crashing
    return;
  }
  const txt = document.getElementById(id + "-err-text");
  if (txt) txt.textContent = "⚠ " + msg;
  el.classList.add("on");
}
function hideErr(id) {
  const el = document.getElementById(id + "-err");
  if (el) el.classList.remove("on");
}
function showR(id) {
  document.getElementById(id + "-resp").classList.add("on");
}
function hideR(id) {
  document.getElementById(id + "-resp").classList.remove("on");
}
function val(id, msg, type) {
  const el = document.getElementById(id + "-val");
  if (!el) return;
  el.textContent = msg;
  el.className = `input-validation show ${type}`;
  if (type === "ok") setTimeout(() => el.classList.remove("show"), 2000);
}
function clearVal(id) {
  const el = document.getElementById(id + "-val");
  if (el) el.className = "input-validation";
}

// ═══════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════
function toast(msg, type = "s") {
  const wrap = document.getElementById("toast-stack");
  const t = document.createElement("div");
  const icon = type === "s" ? "✅" : type === "e" ? "❌" : "ℹ️";
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 320);
  }, 2700);
}

// ═══════════════════════════════════════════════════════
// COPY / DOWNLOAD
// ═══════════════════════════════════════════════════════
function copyEl(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard
    .writeText(el.innerText || el.textContent)
    .then(() => {
      btn.textContent = "✅ Copied";
      btn.classList.add("ok");
      setTimeout(() => {
        btn.textContent = "📋 Copy";
        btn.classList.remove("ok");
      }, 2000);
      toast("Copied!");
    })
    .catch(() => toast("Copy failed", "e"));
}
function copyCode(btn) {
  navigator.clipboard
    .writeText(document.getElementById("code-block").textContent)
    .then(() => {
      btn.textContent = "✅ Copied";
      btn.classList.add("ok");
      setTimeout(() => {
        btn.textContent = "📋 Copy Code";
        btn.classList.remove("ok");
      }, 2000);
      toast("Code copied!");
    });
}
function dl(content, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Downloaded!");
}

// ═══════════════════════════════════════════════════════
// HISTORY BADGE
// ═══════════════════════════════════════════════════════
function refreshBadge() {
  const show = (LS.get("history") || []).length > 0;
  const dot = document.getElementById("hist-dot");
  const bdot = document.getElementById("b-hdot");
  if (dot) dot.style.display = show ? "" : "none";
  if (bdot) bdot.style.display = show ? "" : "none";
}
refreshBadge();

// ═══════════════════════════════════════════════════════
// ASK AI — KB-first, API fallback  ← ONE definition only
// ═══════════════════════════════════════════════════════
async function askQuestion() {
  if (isLoading.ask) return;
  const q = document.getElementById("ask-input").value.trim();
  if (!q) {
    val("ask", "Please enter a question first.", "error");
    return;
  }
  if (q.length < 3) {
    val("ask", "Question too short.", "error");
    return;
  }

  clearVal("ask");
  askQ = q;
  hideErr("ask");
  hideR("ask");
  document.getElementById("deeper-content").classList.remove("on");
  document.getElementById("deeper-content").innerHTML = "";
  document.getElementById("deeper-btn").style.display = "";
  isLoading.ask = true;
  skel("ask", true);

  try {
    // 1. Try KNOWLEDGE_BASE first — instant and works offline
    let d = KNOWLEDGE_BASE.find(
      (i) => i.question.toLowerCase() === q.toLowerCase(),
    );
    if (!d) {
      d = KNOWLEDGE_BASE.find(
        (i) =>
          q.toLowerCase().includes(i.question.toLowerCase()) ||
          i.question.toLowerCase().includes(q.toLowerCase()),
      );
    }

    // 2. Not in KB — call the Claude API
    if (!d) {
      const raw = await claude(
        `You are SkillPilot AI, a friendly tech tutor for a ${level}. Student asked: "${q}"
Return ONLY valid JSON, no fences:
{"explanation":"Clear 2-3 sentence explanation using plain language and analogy","example":"Vivid real-world example of this in actual products","hasCode":true or false,"code":"Short clean code snippet if hasCode true, else empty string","language":"language name e.g. javascript","quiz":{"question":"Multiple-choice question","options":["A)...","B)...","C)...","D)..."],"correct":0}}`,
      );
      d = parseJ(raw);
    }

    askData = { ...d, q };

    document.getElementById("resp-explain").textContent = d.explanation;
    document.getElementById("resp-example").textContent = d.example;

    // Code block
    const cs = document.getElementById("code-sec");
    if (d.hasCode && d.code?.trim()) {
      cs.style.display = "";
      const cb = document.getElementById("code-block");
      cb.textContent = d.code;
      cb.className = d.language || "";
      document.getElementById("code-lang-label").textContent =
        d.language || "code";
      if (window.hljs) {
        try {
          hljs.highlightElement(cb);
        } catch {}
      }
    } else {
      cs.style.display = "none";
    }

    // Quiz
    quizData = d.quiz;
    document.getElementById("quiz-q").textContent = d.quiz.question;
    const optsEl = document.getElementById("quiz-opts");
    optsEl.innerHTML = "";
    d.quiz.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "quiz-opt";
      b.textContent = opt;
      b.setAttribute("role", "listitem");
      b.onclick = () => {
        optsEl
          .querySelectorAll(".quiz-opt")
          .forEach((o) => (o.disabled = true));
        b.classList.add(i === quizData.correct ? "correct" : "wrong");
        if (i !== quizData.correct)
          optsEl.children[quizData.correct].classList.add("correct");
        toast(
          i === quizData.correct ? "🎉 Correct!" : "📖 Check the green answer",
          i === quizData.correct ? "s" : "i",
        );
      };
      optsEl.appendChild(b);
    });

    showR("ask");
  } catch (e) {
    showErr(
      "ask",
      e.message === "offline"
        ? "You are offline. Connect to use AI features."
        : "API error. Please try again.",
    );
  } finally {
    isLoading.ask = false;
    skel("ask", false);
  }
}

document.getElementById("ask-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) askQuestion();
});

// ═══════════════════════════════════════════════════════
// GO DEEPER — KB deeper field first, then API  ← ONE definition only
// ═══════════════════════════════════════════════════════
async function goDeeper() {
  if (!askQ || isLoading.deeper) return;
  isLoading.deeper = true;
  document.getElementById("deeper-btn").style.display = "none";
  const dc = document.getElementById("deeper-content");
  dc.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:.83rem">
        <div style="width:14px;height:14px;border:2px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite"></div>
        Loading deeper explanation…</div>`;
  dc.classList.add("on");

  try {
    // Optional: hand-write a `deeper` field on any KB entry for instant offline use
    const kbMatch = KNOWLEDGE_BASE.find(
      (i) => i.question.toLowerCase() === askQ.toLowerCase(),
    );
    if (kbMatch?.deeper) {
      dc.innerHTML = `<div style="font-size:.88rem;line-height:1.75;color:var(--text2)">${kbMatch.deeper}</div>`;
      toast("Deeper explanation loaded!", "i");
      return;
    }

    // Otherwise fall back to the API
    const raw = await claude(
      `You are SkillPilot AI. Give a deeper explanation of "${askQ}" for a ${level}. ` +
        `Cover: how it works internally, common mistakes, and one advanced insight. ` +
        `Plain text only, no JSON, no markdown headers.`,
    );
    dc.innerHTML = `<div style="font-size:.88rem;line-height:1.75;color:var(--text2)">${raw
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, " ")}</div>`;
    toast("Deeper explanation loaded!", "i");
  } catch {
    dc.innerHTML =
      '<span style="color:var(--accentC);font-size:.83rem">⚠ Could not load. Try again.</span>';
    document.getElementById("deeper-btn").style.display = "";
  } finally {
    isLoading.deeper = false;
  }
}

// ═══════════════════════════════════════════════════════
// ASK — save / export / share
// ═══════════════════════════════════════════════════════
function saveAsk() {
  if (!askData) {
    toast("Generate a response first", "i");
    return;
  }
  pushHistory({
    type: "ask",
    title: askQ,
    preview: askData.explanation,
    data: askData,
  });
  toast("Saved to History! 💾");
}
function exportAsk() {
  if (!askData) {
    toast("Nothing to export", "i");
    return;
  }
  const d = askData;
  dl(
    `SkillPilot AI — Ask AI\n${"─".repeat(40)}\nQuestion: ${d.q}\n\n` +
      `Explanation:\n${d.explanation}\n\nReal-World Example:\n${d.example}` +
      `${d.hasCode && d.code ? "\n\nCode Snippet (" + d.language + "):\n" + d.code : ""}` +
      `\n\nQuiz: ${d.quiz.question}\nAnswer: ${d.quiz.options[d.quiz.correct]}\n\n— SkillPilot AI`,
    "skillpilot-ask.txt",
  );
}
function shareAsk() {
  if (!askData) {
    toast("Generate a response first", "i");
    return;
  }
  navigator.clipboard
    .writeText(
      `📚 Just learned about "${askQ}" with SkillPilot AI!\n\n💡 ${askData.explanation}\n\nTry SkillPilot AI for free!`,
    )
    .then(() => toast("Share text copied! 🔗"));
}

// ═══════════════════════════════════════════════════════
// PROJECT GENERATOR
// ═══════════════════════════════════════════════════════
async function genProject() {
  if (!selTrackV || isLoading.proj) return;
  hideErr("proj");
  hideR("proj");
  isLoading.proj = true;
  skel("proj", true);

  let projectData;

  switch (selTrackV) {
    case "Software Development":
      projectData = {
        title: "Personal Task Manager",
        description: "Full-featured todo app with add, edit, delete, and local storage. Perfect for practicing CRUD operations.",
        difficulty: "Beginner",
        estimatedTime: "1-2 weeks",
        features: ["Add/Edit/Delete tasks", "Mark as complete", "Search & filter", "Dark mode toggle"],
        technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"]
      };
      break;

    case "Data Analysis":
      projectData = {
        title: "Sales Dashboard Analyzer",
        description: "Interactive dashboard that visualizes sales data with charts and insights.",
        difficulty: "Beginner",
        estimatedTime: "2 weeks",
        features: ["Upload CSV file", "Bar & pie charts", "Calculate totals & averages", "Date filter"],
        technologies: ["HTML", "CSS", "JavaScript", "Chart.js"]
      };
      break;

    case "Product Design":
      projectData = {
        title: "Mobile Banking App UI Kit",
        description: "Modern mobile banking interface with multiple screens and smooth navigation.",
        difficulty: "Beginner",
        estimatedTime: "1 week",
        features: ["Login & onboarding", "Dashboard", "Transaction history", "Money transfer flow"],
        technologies: ["Figma", "Prototyping", "Adobe XD"]
      };
      break;

    case "Cybersecurity":
      projectData = {
        title: "Password Strength Checker & Analyzer",
        description: "Tool that checks password strength in real-time, detects common weak passwords, and gives improvement tips.",
        difficulty: "Beginner",
        estimatedTime: "1-2 weeks",
        features: ["Live strength meter", "Common password detection", "Improvement suggestions", "Security tips"],
        technologies: ["HTML", "CSS", "JavaScript", "Regex"]
      };
      break;

    default:
      projectData = {
        title: "Beginner Project",
        description: "A great starter project for your track.",
        difficulty: "Beginner",
        estimatedTime: "1-2 weeks",
        features: ["User Interface", "Core functionality", "Responsive design"],
        technologies: ["HTML", "CSS", "JavaScript"]
      };
  }

  projData = { ...projectData, track: selTrackV };

  // Display it
  document.getElementById("proj-idea").innerHTML = `<strong>${projectData.title}</strong><br><br>${projectData.description}`;
  
  const ds = document.getElementById("proj-diff");
  ds.textContent = "⭐ " + projectData.difficulty;
  ds.style.cssText = "font-size:.76rem;padding:3px 10px;border-radius:5px;background:var(--glow);color:var(--accent)";

  document.getElementById("proj-time").textContent = "⏱ " + projectData.estimatedTime;
  document.getElementById("proj-feats").innerHTML = projectData.features
    .map(f => `<div class="feat-item"><span class="farrow">→</span>${f}</div>`).join("");
  document.getElementById("proj-tech").innerHTML = projectData.technologies
    .map(t => `<span class="tech-tag">${t}</span>`).join("");

  showR("proj");
  toast(`Demo project for ${selTrackV} ready!`, "i");
}

// ═══════════════════════════════════════════════════════
// ROADMAP
// ═══════════════════════════════════════════════════════
async function genRoadmap() {
  if (isLoading.rm) return;
  const goal = document.getElementById("rm-input").value.trim() || selTrackV || "Cybersecurity Analyst";
  clearVal("rm");
  hideErr("rm");
  hideR("rm");
  isLoading.rm = true;
  skel("rm", true);

  let roadmapData;

  const lower = goal.toLowerCase();

  if (lower.includes("cyber") || lower.includes("security")) {
    roadmapData = {
      goal: "Cybersecurity Analyst",
      totalSkills: 18,
      hoursPerWeek: 12,
      projects: ["Password Strength Tool", "Network Scanner Simulator", "Phishing Awareness Site", "Basic Encryption Demo"],
      months: [
        { month: "Month 1", theme: "Fundamentals", focus: "Security basics", skills: ["Networking", "Linux Basics", "Command Line", "Cryptography"] },
        { month: "Month 2", theme: "Core Skills", focus: "Threat detection", skills: ["Ethical Hacking", "Vulnerability Scanning", "Firewalls", "Malware Analysis"] },
        { month: "Month 3", theme: "Projects", focus: "Hands-on practice", skills: ["Penetration Testing", "Incident Response"] },
        { month: "Month 4", theme: "Job Ready", focus: "Certifications & portfolio", skills: ["CTF Challenges", "Security Tools", "Report Writing"] }
      ]
    };
  } else if (lower.includes("data") || lower.includes("analysis")) {
    roadmapData = {
      goal: "Data Analyst",
      totalSkills: 16,
      hoursPerWeek: 12,
      projects: ["Sales Dashboard", "Customer Insights Tool", "Excel Automation Script", "Predictive Analysis Demo"],
      months: [
        { month: "Month 1", theme: "Fundamentals", focus: "Data basics", skills: ["Excel", "SQL", "Statistics", "Python Basics"] },
        { month: "Month 2", theme: "Core Skills", focus: "Data visualization", skills: ["Power BI", "Tableau", "Chart.js"] },
        { month: "Month 3", theme: "Projects", focus: "Real analysis", skills: ["Data cleaning", "Dashboard building"] },
        { month: "Month 4", theme: "Job Ready", focus: "Portfolio & interviews", skills: ["Python", "R", "Storytelling"] }
      ]
    };
  } else if (lower.includes("product") || lower.includes("design")) {
    roadmapData = {
      goal: "Product Designer",
      totalSkills: 15,
      hoursPerWeek: 10,
      projects: ["Mobile Banking UI Kit", "E-commerce App Redesign", "SaaS Dashboard", "User Research Report"],
      months: [
        { month: "Month 1", theme: "Fundamentals", focus: "Design basics", skills: ["Figma", "UI Principles", "User Research"] },
        { month: "Month 2", theme: "Core Skills", focus: "Prototyping", skills: ["Wireframing", "User Flows", "Design Systems"] },
        { month: "Month 3", theme: "Projects", focus: "Real designs", skills: ["Mobile & Web UI"] },
        { month: "Month 4", theme: "Job Ready", focus: "Portfolio", skills: ["Case Studies", "Presentation"] }
      ]
    };
  } else {
    // Default for Software Development or anything else
    roadmapData = {
      goal: goal || "Software Developer",
      totalSkills: 16,
      hoursPerWeek: 12,
      projects: ["Personal Portfolio", "Todo App with API", "E-commerce Landing Page", "Blog Platform"],
      months: [
        { month: "Month 1", theme: "Fundamentals", focus: "Build strong basics", skills: ["HTML", "CSS", "JavaScript", "Git"] },
        { month: "Month 2", theme: "Core Skills", focus: "Learn frameworks", skills: ["React", "Tailwind CSS", "API Integration"] },
        { month: "Month 3", theme: "Projects", focus: "Build real apps", skills: ["State Management", "Deployment"] },
        { month: "Month 4", theme: "Job Ready", focus: "Portfolio & interview prep", skills: ["TypeScript", "Testing", "Soft skills"] }
      ]
    };
  }

  rmData = roadmapData;

  // Display everything
  document.getElementById("rm-stats").innerHTML = `
    <div class="stat"><div class="stat-v">4</div><div class="stat-l">Months</div></div>
    <div class="stat"><div class="stat-v">${roadmapData.totalSkills}+</div><div class="stat-l">Skills</div></div>
    <div class="stat"><div class="stat-v">${roadmapData.hoursPerWeek}h</div><div class="stat-l">Per Week</div></div>
    <div class="stat"><div class="stat-v">${roadmapData.projects.length}</div><div class="stat-l">Projects</div></div>`;

  document.getElementById("rm-months").innerHTML = roadmapData.months
    .map(m => `
      <div class="mc">
        <div class="mc-num">${m.month}</div>
        <div class="mc-theme">${m.theme}</div>
        <div class="mc-focus">${m.focus}</div>
        <div class="chips">${m.skills.map(s => `<span class="chip">${s}</span>`).join("")}</div>
      </div>`).join("");

  document.getElementById("rm-projs").innerHTML = roadmapData.projects
    .map(p => `<div class="feat-item"><span class="farrow">→</span>${p}</div>`).join("");

  showR("rm");
  toast(`Demo roadmap for ${roadmapData.goal} loaded`, "i");
}

// ═══════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════
function pushHistory(item) {
  const h = LS.get("history") || [];
  h.unshift({ id: Date.now(), time: new Date().toLocaleString(), ...item });
  if (h.length > MAX_HISTORY) h.splice(MAX_HISTORY);
  LS.set("history", h);
  refreshBadge();
}
function setHistFilt(btn) {
  document
    .querySelectorAll(".hfilt")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  histFilt = btn.dataset.f;
  renderHistory();
}
function renderHistory() {
  let h = LS.get("history") || [];
  const q = (document.getElementById("hist-search")?.value || "")
    .toLowerCase()
    .trim();
  if (histFilt !== "all") h = h.filter((i) => i.type === histFilt);
  if (q)
    h = h.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.preview.toLowerCase().includes(q),
    );

  const c = document.getElementById("hist-container");
  if (!h.length) {
    c.innerHTML = `<div class="hist-empty"><div class="emo">📭</div><p>${
      q || histFilt !== "all"
        ? "No results found."
        : "Nothing saved yet.<br>Generate something and hit <strong>Save</strong>."
    }</p></div>`;
    return;
  }
  c.innerHTML = `<div class="hist-list">${h
    .map(
      (item) => `
        <div class="hist-item">
            <div class="hi-top">
                <span class="htype ${item.type}">${
                  item.type === "ask"
                    ? "💬 Ask"
                    : item.type === "project"
                      ? "💡 Project"
                      : "🗺️ Roadmap"
                }</span>
                <div class="hi-title">${escH(item.title)}</div>
                <div class="hi-time">${item.time}</div>
            </div>
            <div class="hi-prev">${escH(item.preview)}</div>
            <div class="hi-acts">
                <button class="btn btn-ghost btn-sm"  onclick="copyHist(${item.id})">📋 Copy</button>
                <button class="btn btn-danger btn-sm" onclick="delHist(${item.id})">🗑️ Delete</button>
            </div>
        </div>`,
    )
    .join("")}</div>`;
}
function escH(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function copyHist(id) {
  const item = (LS.get("history") || []).find((x) => x.id === id);
  if (!item) return;
  let txt = "";
  if (item.type === "ask")
    txt = `Q: ${item.data.q}\n\nExplanation: ${item.data.explanation}\n\nExample: ${item.data.example}`;
  else if (item.type === "project")
    txt = `Project: ${item.data.title}\n\n${item.data.description}\n\nFeatures: ${item.data.features.join(", ")}\nTech: ${item.data.technologies.join(", ")}`;
  else
    txt = `Roadmap: ${item.data.goal}\n${item.data.months.map((m) => `${m.month}: ${m.theme} — ${m.skills.join(", ")}`).join("\n")}`;
  navigator.clipboard.writeText(txt).then(() => toast("Copied!"));
}
function delHist(id) {
  LS.set(
    "history",
    (LS.get("history") || []).filter((x) => x.id !== id),
  );
  refreshBadge();
  renderHistory();
  toast("Deleted", "i");
}
function clearHistory() {
  if (!confirm("Clear all history? This cannot be undone.")) return;
  LS.del("history");
  refreshBadge();
  renderHistory();
  toast("History cleared", "i");
}

// ═══════════════════════════════════════════════════════
// PROGRESS TRACKER
// ═══════════════════════════════════════════════════════
function addSkills(skills, cat) {
  const existing = LS.get("skills") || [];
  const names = new Set(existing.map((s) => s.name.toLowerCase()));
  const newOnes = skills
    .filter((s) => !names.has(s.toLowerCase()))
    .map((s) => ({
      id: Date.now() + Math.random(),
      name: s,
      cat: cat || "General",
      done: false,
    }));
  LS.set("skills", [...existing, ...newOnes]);
}

let skillFiltCat = "all";

function renderProgress() {
  const skills = LS.get("skills") || [];
  const done = skills.filter((s) => s.done).length;
  const total = skills.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById("prog-bar").style.width = pct + "%";
  document.getElementById("prog-pct").textContent = pct + "% complete";
  document.getElementById("prog-count").textContent = done;

  const cats = ["all", ...new Set(skills.map((s) => s.cat))];
  document.getElementById("skill-filter").innerHTML = cats
    .map(
      (c) =>
        `<button class="sf${c === skillFiltCat ? " active" : ""}" onclick="setSkillCat('${escH(c)}')">${c === "all" ? "All" : escH(c)}</button>`,
    )
    .join("");

  const filtered =
    skillFiltCat === "all"
      ? skills
      : skills.filter((s) => s.cat === skillFiltCat);
  const list = document.getElementById("skill-list");

  if (!filtered.length) {
    list.innerHTML =
      total === 0
        ? '<div class="no-skills">No skills tracked yet.<br>Generate a roadmap or project idea, then click <strong>Track Skills</strong>.</div>'
        : '<div class="no-skills">No skills in this category.</div>';
    return;
  }
  list.innerHTML = filtered
    .map(
      (s) => `
        <div class="skill-item${s.done ? " done" : ""}" id="sk-${s.id}">
            <div class="skill-check" onclick="toggleSkill('${s.id}')" role="checkbox" aria-checked="${s.done}" tabindex="0"
                 onkeydown="if(event.key===' ')toggleSkill('${s.id}')">${s.done ? "✓" : ""}</div>
            <div class="skill-name">${escH(s.name)}</div>
            <span class="skill-cat">${escH(s.cat)}</span>
            <button class="skill-del" onclick="deleteSkill('${s.id}')" aria-label="Remove skill" title="Remove">✕</button>
        </div>`,
    )
    .join("");
}

function setSkillCat(cat) {
  skillFiltCat = cat;
  renderProgress();
}

function toggleSkill(id) {
  const skills = LS.get("skills") || [];
  const s = skills.find((x) => String(x.id) === String(id));
  if (s) {
    s.done = !s.done;
    LS.set("skills", skills);
    renderProgress();
  }
}
function deleteSkill(id) {
  LS.set(
    "skills",
    (LS.get("skills") || []).filter((x) => String(x.id) !== String(id)),
  );
  renderProgress();
  toast("Skill removed", "i");
}
function clearSkills() {
  if (!confirm("Reset all skills?")) return;
  LS.del("skills");
  skillFiltCat = "all";
  renderProgress();
  toast("Progress reset", "i");
}
function exportSkills() {
  const skills = LS.get("skills") || [];
  if (!skills.length) {
    toast("No skills to export", "i");
    return;
  }
  const done = skills.filter((s) => s.done);
  const todo = skills.filter((s) => !s.done);
  dl(
    `SkillPilot AI — Skill Progress\n${"─".repeat(40)}\n${done.length}/${skills.length} complete\n\n` +
      `✅ Learned:\n${done.map((s) => `• ${s.name} (${s.cat})`).join("\n") || "None yet"}\n\n` +
      `⏳ In Progress:\n${todo.map((s) => `• ${s.name} (${s.cat})`).join("\n") || "All done!"}\n\n— SkillPilot AI`,
    "skillpilot-skills.txt",
  );
}

// ═══════════════════════════════════════════════════════
// SAFE FALLBACK FUNCTIONS FOR PROJECTS & ROADMAP
// ═══════════════════════════════════════════════════════

function addProjSkills() {
  if (!projData) {
    toast("Generate a project idea first", "e");
    return;
  }
  const techs = projData.technologies || ["HTML", "CSS", "JavaScript"];
  addSkills(techs, projData.track || "Software Dev");
  toast(`${techs.length} skills added to tracker! 📈`);
}

function addRmSkills() {
  if (!rmData) {
    toast("Generate a roadmap first", "e");
    return;
  }
  const all = (rmData.months || []).flatMap((m) => m.skills || []);
  addSkills(all, rmData.goal || "General");
  toast(`${all.length} skills added to tracker! 📈`);
}

// Make sure these functions are globally available for the HTML buttons
window.addProjSkills = addProjSkills;
window.addRmSkills = addRmSkills;

function saveProj() {
  if (!projData) {
    toast("Generate a project idea first", "e");
    return;
  }
  pushHistory({
    type: "project",
    title: projData.title || "Demo Project",
    preview: projData.description || "Beginner project for practice",
    data: projData
  });
  toast("Project saved to History! 💾");
}

function exportProj() {
  if (!projData) {
    toast("Generate a project idea first", "e");
    return;
  }
  const d = projData;
  dl(
    `SkillPilot AI — Project Idea\n${"─".repeat(40)}\nTrack: ${d.track || "General"}\nProject: ${d.title || "Demo Project"}\n` +
      `Difficulty: ${d.difficulty || "Beginner"} | Time: ${d.estimatedTime || "1-2 weeks"}\n\n` +
      `${d.description || "A great starter project for 3MTT students."}\n\n` +
      `Key Features:\n${(d.features || ["UI", "Basic logic", "Responsive"]).map(f => "• " + f).join("\n")}\n\n` +
      `Technologies: ${(d.technologies || ["HTML", "CSS", "JavaScript"]).join(", ")}\n\n— SkillPilot AI`,
    "skillpilot-project.txt"
  );
}

function saveRm() {
  if (!rmData) {
    toast("Generate a roadmap first", "e");
    return;
  }
  pushHistory({
    type: "roadmap",
    title: "Roadmap: " + (rmData.goal || "Career Goal"),
    preview: `4-month plan · ${(rmData.totalSkills || 14)}+ skills`,
    data: rmData
  });
  toast("Roadmap saved to History! 💾");
}

function exportRm() {
  if (!rmData) {
    toast("Generate a roadmap first", "e");
    return;
  }
  const d = rmData;
  let txt = `SkillPilot AI — Learning Roadmap\n${"─".repeat(40)}\nGoal: ${d.goal || "Career Goal"}\n${(d.hoursPerWeek || 10)}h/week · ${(d.totalSkills || 14)}+ skills\n\n`;
  (d.months || []).forEach((m) => {
    txt += `${m.month}: ${m.theme} — ${m.focus}\nSkills: ${(m.skills || []).join(", ")}\n\n`;
  });
  txt += `Practice Projects:\n${(d.projects || []).map(p => "• " + p).join("\n")}\n\n— SkillPilot AI`;
  dl(txt, "skillpilot-roadmap.txt");
}