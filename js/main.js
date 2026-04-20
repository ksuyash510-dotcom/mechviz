// main.js — homepage v6

const CAT_COLORS = {
  som:    '#ff6b6b',
  thermo: '#ff9f43',
  tom:    '#a29bfe',
  fluid:  '#48dbfb',
  mfg:    '#55efc4',
};

let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('concept-count').textContent = MECHVIZ_DB.concepts.length;
  renderCards(MECHVIZ_DB.concepts);
  buildFilters();
  document.getElementById('search-input').addEventListener('input', filterConcepts);

  // Animate stat counters
  animateCounter('concept-count', MECHVIZ_DB.concepts.length, 600);
});

function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}

function renderCards(concepts) {
  const grid = document.getElementById('concepts-grid');
  grid.innerHTML = '';

  if (!concepts.length) {
    grid.innerHTML = '<div class="no-results">No concepts matched. Try different keywords.</div>';
    return;
  }

  concepts.forEach((c, i) => {
    const cat      = MECHVIZ_DB.categories.find(cat => cat.id === c.category);
    const color    = CAT_COLORS[c.category] || '#4ecdc4';
    const card     = document.createElement('div');
    card.className = 'concept-card';
    card.style.cssText = `--cat-color:${color}; animation-delay:${i * 40}ms`;

    card.innerHTML = `
      <div class="card-color-bar"></div>
      <div class="card-body">
        <div class="card-header">
          <div>
            <div class="card-cat">${cat.name}</div>
          </div>
          <div class="card-icon">${c.icon}</div>
        </div>
        <div class="card-title">${c.title}</div>
        <div class="card-desc">${c.shortDesc}</div>
        <div class="card-tags">
          ${(c.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="card-footer">
        <div class="card-cta">Explore <span>→</span></div>
        <div class="card-indicators">
          ${c.workedExample ? '<span class="card-indicator">Example</span>' : ''}
          <span class="card-indicator">Quiz</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => window.location.href = `concept.html?id=${c.id}`);
    grid.appendChild(card);
  });
}

function buildFilters() {
  const row = document.getElementById('category-filters');
  const allBtn = makeFilterBtn('All Subjects', 'all');
  allBtn.classList.add('active');
  row.appendChild(allBtn);

  MECHVIZ_DB.categories.forEach(cat => {
    if (MECHVIZ_DB.concepts.some(c => c.category === cat.id))
      row.appendChild(makeFilterBtn(cat.name.split(' ').slice(0, 2).join(' '), cat.id));
  });
}

function makeFilterBtn(label, catId) {
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.textContent = label;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = catId;
    filterConcepts();
  });
  return btn;
}

function filterConcepts() {
  const q = document.getElementById('search-input').value.toLowerCase().trim();
  const filtered = MECHVIZ_DB.concepts.filter(c => {
    const matchesCat  = activeFilter === 'all' || c.category === activeFilter;
    const matchesText = !q ||
      c.title.toLowerCase().includes(q) ||
      c.shortDesc.toLowerCase().includes(q) ||
      (c.tags || []).some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesText;
  });
  renderCards(filtered);
}
