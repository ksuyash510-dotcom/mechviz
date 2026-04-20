// concept.js — v6 (KaTeX formula rendering + deep content)

let currentConcept = null;

// ── KaTeX helper ─────────────────────────────────────────────────────────────
function renderMath(latex, displayMode = false) {
  if (!latex || typeof katex === 'undefined') return latex || '';
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      output: 'html',
      strict: false
    });
  } catch(e) {
    return `<span style="font-family:var(--f-mono);color:var(--amber)">${latex}</span>`;
  }
}

// ── Page init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  const concept = id && MECHVIZ_DB.concepts.find(c => c.id === id);
  if (!concept) { window.location.href = 'index.html'; return; }

  currentConcept = concept;
  renderPage(concept);
  setupTabs();
  setupChat(concept);
  setupQuiz(concept);

  document.querySelector('[data-tab="tab-simulation"]').addEventListener('click', () => {
    initSimulation(concept.simulation, concept);
  }, { once: true });
});

// ── Render entire concept page ────────────────────────────────────────────────
function renderPage(c) {
  const cat = MECHVIZ_DB.categories.find(cat => cat.id === c.category);
  document.title = `${c.title} — MechViz`;

  // Header
  document.getElementById('concept-icon').textContent       = c.icon;
  document.getElementById('concept-title').textContent      = c.title;
  document.getElementById('concept-title-bc').textContent   = c.title;
  document.getElementById('concept-desc').textContent       = c.shortDesc;
  document.getElementById('concept-category-bc').textContent= cat.name;
  document.getElementById('ai-concept-name').textContent    = c.title;

  const badge = document.getElementById('concept-category');
  badge.textContent = cat.name;
  badge.style.cssText = `background:${cat.color}16;color:${cat.color};border:1px solid ${cat.color}35`;

  // ── Theory ────────────────────────────────────────────────
  document.getElementById('concept-definition').textContent  = c.theory.definition;
  document.getElementById('concept-explanation').textContent = c.theory.explanation;

  document.getElementById('key-concepts-list').innerHTML = c.theory.keyConcepts.map(kc => `
    <div class="kc-card">
      <div class="kc-term">${kc.term}</div>
      <div class="kc-desc">${kc.desc}</div>
    </div>
  `).join('');

  // ── Formulas (KaTeX) ──────────────────────────────────────
  document.getElementById('sidebar-formulas').innerHTML = c.theory.formulas.map(f => `
    <div class="sf-item">
      <div class="sf-name">${f.name}</div>
      <div class="sf-eq">${renderMath(f.latex || f.eq, false)}</div>
    </div>
  `).join('');

  document.getElementById('formulas-list').innerHTML = c.theory.formulas.map(f => `
    <div class="formula-item">
      <div class="formula-name-bar">${f.name}</div>
      <div class="formula-eq-block">${renderMath(f.latex || f.eq, true)}</div>
      <div class="formula-vars">
        ${Object.entries(f.variables || {}).map(([k, v]) =>
          `<span class="var-item"><b>${k}</b> — ${v}</span>`
        ).join('')}
      </div>
    </div>
  `).join('');

  // ── Practical Rules ───────────────────────────────────────
  const rulesEl = document.getElementById('practical-rules');
  if (c.practicalRules && c.practicalRules.length) {
    rulesEl.innerHTML = c.practicalRules.map(r => `
      <div class="rule-item">
        <div class="rule-bullet">▸</div>
        <div>${r}</div>
      </div>
    `).join('');
  } else {
    rulesEl.closest('.sc').style.display = 'none';
  }

  // ── Worked Example ─────────────────────────────────────────
  const we = c.workedExample;
  if (we) {
    document.getElementById('worked-example').innerHTML = `
      <div class="we-problem">
        <div class="we-problem-label">Problem Statement</div>
        <p>${we.problem}</p>
      </div>
      <div class="we-given">
        <div class="we-given-label">Given</div>
        <ul class="we-given-list">
          ${we.given.map(g => `<li>${g}</li>`).join('')}
        </ul>
      </div>
      <div class="we-steps">
        ${we.steps.map((s, i) => `
          <div class="we-step">
            <div class="we-step-num">${i + 1}</div>
            <div class="we-step-content">
              <div class="we-step-text">${s.text}</div>
              ${s.calc ? `<div class="we-step-calc">${s.calc}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="we-answer">✅ Answer: ${we.answer}</div>
    `;
  } else {
    document.getElementById('tab-worked').innerHTML =
      `<div class="sc"><div class="sc-title">🧮 Worked Example</div>
       <p style="color:var(--muted);font-size:0.88rem;">Coming soon for this concept.</p></div>`;
  }

  // ── Common Mistakes ────────────────────────────────────────
  const mistakesEl = document.getElementById('common-mistakes');
  if (c.commonMistakes && c.commonMistakes.length) {
    mistakesEl.innerHTML = c.commonMistakes.map(m => `
      <div class="mistake-item">
        <div class="mistake-icon">⚠️</div>
        <div>
          <div class="mistake-title">${m.title}</div>
          <div class="mistake-desc">${m.desc}</div>
        </div>
      </div>
    `).join('');
  }

  // ── Real World ─────────────────────────────────────────────
  document.getElementById('real-world-uses').innerHTML = c.realWorldUses.map(u => `
    <div class="rw-card">
      <div class="rw-icon-wrap">${u.icon}</div>
      <div>
        <div class="rw-title">${u.title}</div>
        <div class="rw-desc">${u.description}</div>
      </div>
    </div>
  `).join('');

  // ── Resources ──────────────────────────────────────────────
  document.getElementById('resources-list').innerHTML = c.resources.map(r => {
    const icon = r.type === 'video' ? '▶️' : r.type === 'course' ? '🎓' : '📄';
    return `
      <a href="${r.url}" target="_blank" rel="noopener" class="resource-link resource-${r.type}">
        <span class="res-type-icon">${icon}</span>
        <span class="res-label">${r.label}</span>
        <span class="res-arrow">↗</span>
      </a>
    `;
  }).join('');
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function setupTabs() {
  const tabs   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// ── API Key (kept for backward compat — not needed with Worker) ──────────────
function saveApiKey() {
  // No longer needed — Worker handles auth
  const el = document.getElementById('api-key-status');
  if (el) el.textContent = '✅ No key needed — AI runs via server.';
}

// ── AI Chat ───────────────────────────────────────────────────────────────────
function setupChat(concept) {
  document.getElementById('send-btn').addEventListener('click', doSend);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });
}
async function doSend() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  appendMsg('user', msg);
  input.value = '';
  const thinkEl = appendMsg('ai', '⏳ Thinking...', 'thinking');
  try {
    const reply = await callGroq(msg, currentConcept);
    thinkEl.remove();
    appendMsg('ai', reply);
  } catch (err) {
    thinkEl.remove();
    appendMsg('ai', `❌ ${err.message}`);
  }
}
function appendMsg(role, text, extra = '') {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role} ${extra}`;
  div.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
