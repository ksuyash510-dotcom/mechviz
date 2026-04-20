// quiz.js — AI-powered quiz system
// Calls Cloudflare Worker proxy (key hidden server-side)

// ⚠️  REPLACE THIS with your actual Cloudflare Worker URL
const QUIZ_WORKER_URL = 'https://mechviz-proxy.ksuyash510.workers.dev';

let quizState = {
  questions: [],
  current:   0,
  score:     0,
  answered:  false
};

// ── Build the quiz UI ─────────────────────────────────────────────
function setupQuiz(concept) {
  const panel = document.getElementById('tab-quiz');
  if (!panel) return;

  panel.innerHTML = `
    <div class="sc" id="quiz-card">
      <div class="sc-title"><span class="sc-icon">🧠</span>Quick Quiz — ${concept.title}</div>

      <div id="quiz-start-zone">
        <div class="quiz-info-row">
          <div class="quiz-info-item"><span>5</span><label>Questions</label></div>
          <div class="quiz-info-item"><span>MCQ</span><label>Format</label></div>
          <div class="quiz-info-item"><span>AI</span><label>Generated</label></div>
        </div>
        <p style="color:var(--text2);font-size:0.87rem;text-align:center;margin-bottom:20px;line-height:1.6;">
          5 questions generated specifically from this concept's formulas, definitions,
          and key ideas. Tests understanding — not memorisation.
        </p>
        <button class="quiz-start-btn" onclick="startQuiz()">
          Generate Quiz ⚡
        </button>
      </div>

      <div id="quiz-loading" style="display:none;text-align:center;padding:48px 20px;">
        <div class="quiz-spinner"></div>
        <p style="color:var(--muted);margin-top:18px;font-family:var(--f-mono);font-size:0.78rem;">
          Generating questions...
        </p>
      </div>

      <div id="quiz-zone" style="display:none;">
        <div id="quiz-progress-bar-wrap">
          <div id="quiz-progress-bar"></div>
        </div>
        <div id="quiz-question-count" class="quiz-q-count"></div>
        <div id="quiz-question-text"  class="quiz-q-text"></div>
        <div id="quiz-options"        class="quiz-options"></div>
        <div id="quiz-feedback"       class="quiz-feedback" style="display:none;"></div>
        <button id="quiz-next-btn"    class="quiz-next-btn"  style="display:none;"
                onclick="nextQuestion()">Next Question →</button>
      </div>

      <div id="quiz-result" style="display:none;">
        <div class="quiz-result-card">
          <div id="quiz-score-circle" class="quiz-score-circle"></div>
          <h3 id="quiz-result-title"  style="font-family:var(--f-display);font-size:1.2rem;margin-bottom:6px;"></h3>
          <p  id="quiz-result-msg"    style="color:var(--text2);font-size:0.88rem;margin-bottom:24px;line-height:1.6;"></p>
          <div id="quiz-review"       class="quiz-review"></div>
          <button class="quiz-retry-btn" onclick="retryQuiz()">Try Again 🔄</button>
        </div>
      </div>
    </div>
  `;
}

// ── Start quiz — no key check needed ─────────────────────────────
async function startQuiz() {
  document.getElementById('quiz-start-zone').style.display = 'none';
  document.getElementById('quiz-loading').style.display    = 'block';

  try {
    const questions = await generateQuizQuestions(currentConcept);
    quizState = { questions, current: 0, score: 0, answered: false };
    document.getElementById('quiz-loading').style.display = 'none';
    document.getElementById('quiz-zone').style.display    = 'block';
    renderQuestion();
  } catch (err) {
    document.getElementById('quiz-loading').innerHTML = `
      <p style="color:var(--rose);font-family:var(--f-mono);font-size:0.85rem;margin-bottom:16px;">
        ❌ ${err.message}
      </p>
      <button class="quiz-start-btn" onclick="retryQuiz()">Try Again</button>
    `;
  }
}

// ── Generate questions via Cloudflare Worker ──────────────────────
async function generateQuizQuestions(concept) {
  const prompt = `You are an engineering exam question writer. Generate exactly 5 multiple-choice questions about "${concept.title}" for a mechanical engineering student.

Context:
- Definition: ${concept.theory.definition.slice(0, 300)}
- Key formulas: ${concept.theory.formulas.map(f => f.name + ': ' + f.eq).join(' | ')}
- Key concepts: ${concept.theory.keyConcepts.map(k => k.term).join(', ')}

Rules:
1. Mix conceptual understanding, formula application, and real-world reasoning
2. Each question has exactly 4 options (A, B, C, D)
3. Exactly one correct answer
4. Include a brief explanation for why the correct answer is right
5. Make wrong options plausible — not obviously incorrect

Respond ONLY with valid JSON, no markdown fences, no preamble:
{
  "questions": [
    {
      "q": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why the correct answer is right."
    }
  ]
}`;

  let resp;
  try {
    resp = await fetch(QUIZ_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:       'llama3-8b-8192',
        messages:    [{ role: 'user', content: prompt }],
        max_tokens:  1200,
        temperature: 0.5
      })
    });
  } catch {
    throw new Error('Could not reach the AI service. Check your internet connection.');
  }

  if (!resp.ok) {
    let msg = 'AI service error — please try again.';
    try {
      const err = await resp.json();
      msg = err.error?.message || msg;
      if (resp.status === 429) msg = 'Too many requests — please wait a moment and try again.';
    } catch (_) {}
    throw new Error(msg);
  }

  const data = await resp.json();
  const raw  = data.choices?.[0]?.message?.content || '';

  // Strip possible markdown fences
  const clean = raw.replace(/```json|```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
    else throw new Error('Could not parse quiz response. Please try again.');
  }

  if (!parsed?.questions?.length) {
    throw new Error('Received incomplete quiz data. Please try again.');
  }

  return parsed.questions.slice(0, 5);
}

// ── Render current question ───────────────────────────────────────
function renderQuestion() {
  const { questions, current } = quizState;
  const q = questions[current];

  document.getElementById('quiz-progress-bar').style.width =
    ((current / questions.length) * 100) + '%';

  document.getElementById('quiz-question-count').textContent =
    `Question ${current + 1} of ${questions.length}`;

  document.getElementById('quiz-question-text').textContent = q.q;

  const labels = ['A', 'B', 'C', 'D'];
  document.getElementById('quiz-options').innerHTML =
    q.options.map((opt, i) => `
      <button class="quiz-option-btn" onclick="answerQuestion(${i}, this)">
        <span class="opt-label">${labels[i]}</span>
        <span>${opt}</span>
      </button>
    `).join('');

  const fb = document.getElementById('quiz-feedback');
  fb.style.display = 'none';
  fb.className     = 'quiz-feedback';

  document.getElementById('quiz-next-btn').style.display = 'none';
  quizState.answered = false;
}

// ── Handle answer ─────────────────────────────────────────────────
function answerQuestion(chosen, btn) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q      = quizState.questions[quizState.current];
  const labels = ['A', 'B', 'C', 'D'];
  q.userAnswer = chosen;

  document.querySelectorAll('.quiz-option-btn').forEach((b, i) => {
    b.disabled = true;
    if (i === q.correct)                       b.classList.add('correct');
    else if (i === chosen && chosen !== q.correct) b.classList.add('wrong');
    else b.style.opacity = '0.38';
  });

  const isRight = chosen === q.correct;
  if (isRight) quizState.score++;

  const fb = document.getElementById('quiz-feedback');
  fb.style.display = 'flex';
  fb.className     = `quiz-feedback ${isRight ? 'correct' : 'wrong'}`;
  fb.innerHTML     = `
    <span class="fb-icon">${isRight ? '✅' : '❌'}</span>
    <div>
      <strong>${isRight
        ? 'Correct!'
        : `Incorrect — Answer: ${labels[q.correct]}: ${q.options[q.correct]}`
      }</strong>
      <p>${q.explanation}</p>
    </div>
  `;

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.style.display = 'block';
  nextBtn.textContent   = quizState.current < quizState.questions.length - 1
    ? 'Next Question →'
    : 'See Results 🎯';
}

// ── Next question / show results ──────────────────────────────────
function nextQuestion() {
  quizState.current++;
  if (quizState.current < quizState.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById('quiz-zone').style.display   = 'none';
  document.getElementById('quiz-result').style.display = 'block';

  const { score, questions } = quizState;
  const pct = Math.round((score / questions.length) * 100);

  const circle = document.getElementById('quiz-score-circle');
  circle.textContent  = `${score}/${questions.length}`;
  circle.style.background =
    pct >= 80 ? 'linear-gradient(135deg, #10d9a0, #059669)' :
    pct >= 60 ? 'linear-gradient(135deg, #f5a623, #d97706)' :
                'linear-gradient(135deg, #f06070, #dc2626)';

  document.getElementById('quiz-result-title').textContent =
    pct >= 80 ? '🏆 Excellent!' :
    pct >= 60 ? '👍 Good work!' :
    pct >= 40 ? '📖 Keep studying' : '💪 Review needed';

  document.getElementById('quiz-result-msg').textContent =
    pct >= 80
      ? `You scored ${pct}% — solid understanding of ${currentConcept.title}.`
      : pct >= 50
      ? `You scored ${pct}% — revisit the Theory and Simulation tabs to fill the gaps.`
      : `You scored ${pct}% — go back through the Theory tab, then try again.`;

  const labels = ['A', 'B', 'C', 'D'];
  document.getElementById('quiz-review').innerHTML =
    '<div class="review-title">Review</div>' +
    questions.map((q, i) => {
      const ok = q.userAnswer === q.correct;
      return `
        <div class="review-item ${ok ? 'ok' : 'bad'}">
          <div class="review-q">${i + 1}. ${q.q}</div>
          <div class="review-ans">${ok
            ? `✅ ${labels[q.correct]}: ${q.options[q.correct]}`
            : `❌ You chose ${labels[q.userAnswer] ?? '?'} &nbsp;|&nbsp; ✅ Correct: ${labels[q.correct]}: ${q.options[q.correct]}`
          }</div>
          <div class="review-exp">${q.explanation}</div>
        </div>
      `;
    }).join('');
}

function retryQuiz() {
  document.getElementById('quiz-result')?.remove && null;
  document.getElementById('quiz-result').style.display     = 'none';
  document.getElementById('quiz-zone').style.display       = 'none';
  document.getElementById('quiz-start-zone').style.display = 'block';
}
