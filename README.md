# ⚙️ MechViz — Interactive Engineering Learning Platform

**Live site → [ksuyash510-dotcom.github.io/mechviz](https://ksuyash510-dotcom.github.io/mechviz/)**

> 30 engineering concepts · Interactive simulations · Worked examples · AI Tutor · AI Quiz · Zero cost

---

## What is MechViz?

MechViz is a free, browser-based platform for learning Mechanical Engineering concepts through visualization rather than passive reading. Every concept on the platform includes:

- **Interactive simulation** — drag sliders and see the physics update in real time
- **Deep theory** — precise definitions, key concepts, and full formula reference
- **KaTeX formula rendering** — proper mathematical notation, not plain text strings
- **Worked numerical example** — complete step-by-step solution with a real problem
- **Common mistakes** — the 3 most frequent errors students make, with corrections
- **Practical rules of thumb** — the quick references engineers actually use on the job
- **Real-world applications** — where the concept is used in industry, with specifics
- **AI Tutor** — context-aware Q&A powered by Llama 3 (ask for derivations, examples, comparisons)
- **AI-generated Quiz** — 5 MCQs generated fresh from the concept's content, with explanations

No login. No paywall. No API key required from the user.

---

## 📚 30 Concepts Across 5 Subjects

### 🔩 Strength of Materials
| Concept | Simulation |
|---|---|
| Beam Deflection | Live elastic curve — UDL arrows, support types, material selector |
| Stress & Strain | Interactive σ-ε curve — 4 materials, yield/UTS markers |
| Torsion of Circular Shafts | Solid/hollow shaft twist visualizer |
| Columns & Euler Buckling | Animated buckling — end condition selector |
| Thin-Walled Pressure Vessels | Hoop vs longitudinal stress calculator |

### ♨️ Thermodynamics
| Concept | Simulation |
|---|---|
| Rankine Cycle | T-s diagram with real IAPWS steam table values |
| Otto Cycle (Petrol Engine) | Live P-V diagram — compression ratio & heat input sliders |
| Heat Conduction (Fourier's Law) | Composite wall temperature profile with R-th breakdown |

### ⚙️ Theory of Machines
| Concept | Simulation |
|---|---|
| Gear Trains | Animated involute gear teeth (mathematically correct 20° pressure angle) |
| Cam & Follower | Animated cam rotation + real-time displacement diagram |

### 💧 Fluid Mechanics
| Concept | Simulation |
|---|---|
| Fluid Flow & Reynolds Number | Particle animation — laminar → transitional → turbulent |
| Bernoulli's Principle | Venturi flow animation with live pressure column indicators |

### 🏭 Manufacturing Engineering
| Concept | Simulation |
|---|---|
| Metal Cutting Theory | Taylor tool life curve — log-log plot with operating point |
| Metal Casting Fundamentals | Chvorinov solidification animation with riser sizing |
| Welding Processes & Metallurgy | HAZ animation with live carbon equivalent and preheat guidance |

*The remaining 15 concepts follow the same structure with simulations, worked examples, and full content.*

---

## 🏗️ Architecture

```
mechviz/
├── index.html              ← Homepage (search, filter, concept grid)
├── concept.html            ← Concept detail page (all concepts share this)
├── css/
│   └── style.css           ← Design system (Syne + DM Sans + Fira Code fonts)
└── js/
    ├── db/
    │   ├── core.js         ← Database shell — categories and empty concepts array
    │   ├── som.js          ← Strength of Materials concepts
    │   ├── thermo.js       ← Thermodynamics concepts
    │   ├── fluid.js        ← Fluid Mechanics concepts
    │   ├── tom.js          ← Theory of Machines concepts
    │   └── mfg.js          ← Manufacturing concepts
    ├── simulations.js      ← All Canvas simulations
    ├── main.js             ← Homepage logic (search, filter, cards)
    ├── concept.js          ← Concept page rendering + tabs + chat
    ├── quiz.js             ← AI-powered quiz system
    └── ai.js               ← Cloudflare Worker proxy calls
```

**No build step. No framework. No dependencies.** Pure HTML, CSS, and vanilla JavaScript. Open `index.html` directly in a browser to run locally.

---

## 🚀 Deployment

The live site runs on **GitHub Pages** (free static hosting) with a **Cloudflare Workers** proxy that keeps the Groq API key hidden server-side. Users never need to supply their own key.

```
User Browser
    ↓
GitHub Pages  (HTML / CSS / JS — public)
    ↓  AI & Quiz requests
Cloudflare Worker  (API key lives here — never exposed)
    ↓
Groq API  (Llama 3 — free tier, 14,400 requests/day)
```

### To deploy your own instance

**1. Get a free Groq API key**
- Sign up at [console.groq.com](https://console.groq.com) (Google login, no credit card)
- Create an API key starting with `gsk_`

**2. Set up Cloudflare Worker**
- Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free)
- Create a Worker named `mechviz-proxy`
- Paste the Worker proxy code (see `DEPLOYMENT.md`)
- Add `GROQ_API_KEY` as an encrypted environment variable
- Update `ALLOWED_ORIGIN` in the Worker to your GitHub Pages domain

**3. Update the Worker URL in your files**
- In `js/ai.js` — set `WORKER_URL` to your Worker URL
- In `js/quiz.js` — set `QUIZ_WORKER_URL` to your Worker URL

**4. Push to GitHub and enable Pages**
- Create a public GitHub repository
- Upload all files preserving the folder structure
- Go to Settings → Pages → Deploy from main branch → root

**Total cost: ₹0/month**

---

## ➕ Adding New Concepts

The database is modular. Each subject is a separate JS file that pushes concept objects into `MECHVIZ_DB.concepts`.

**To add a new concept to an existing subject:**

Open the relevant file (e.g. `js/db/som.js`) and add a new object following this structure:

```javascript
MECHVIZ_DB.concepts.push({
  id:        "your-concept-id",
  title:     "Concept Title",
  category:  "som",          // som | thermo | tom | fluid | mfg
  icon:      "🔧",
  tags:      ["tag1", "tag2"],
  shortDesc: "One sentence description shown on the homepage card.",

  theory: {
    definition:  "Full definition paragraph...",
    keyConcepts: [{ term: "Term Name", desc: "Explanation..." }],
    formulas: [{
      name:      "Formula Name",
      eq:        "σ = F/A",          // plain text fallback
      latex:     "\\sigma = F/A",    // KaTeX LaTeX string
      variables: { "σ": "Stress (Pa)", "F": "Force (N)", "A": "Area (m²)" }
    }],
    explanation: "How it works paragraph..."
  },

  practicalRules: [
    "Rule 1 with <strong>highlighted value</strong>.",
    "Rule 2..."
  ],

  workedExample: {
    problem: "Problem statement...",
    given:   ["Value 1 = ...", "Value 2 = ..."],
    steps:   [{ text: "Step description", calc: "Calculation shown here" }],
    answer:  "Final answer with units."
  },

  commonMistakes: [
    { title: "Mistake title", desc: "What goes wrong and why." }
  ],

  simulation: "beam",    // maps to a builder function in simulations.js

  realWorldUses: [
    { title: "Application", icon: "🏗️", description: "Detailed description..." }
  ],

  resources: [
    { label: "Resource name", url: "https://...", type: "video" }  // video | course | article
  ]
});
```

**To add a completely new subject (e.g. Civil Engineering):**

1. Create `js/db/civil.js` following the pattern above
2. Add the category to `js/db/core.js`:
   ```javascript
   { id: "civil", name: "Civil Engineering", color: "#f59e0b", icon: "🏛️" }
   ```
3. Add `<script src="js/db/civil.js?v=2"></script>` to both `index.html` and `concept.html`

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | HTML + CSS + Vanilla JS | Free |
| Math rendering | KaTeX (LaTeX in browser) | Free |
| Simulations | Canvas API | Free |
| Hosting | GitHub Pages | Free |
| AI proxy | Cloudflare Workers | Free (100k req/day) |
| AI model | Groq — Llama 3 8B | Free (14,400 req/day) |
| Fonts | Syne + DM Sans + Fira Code (Google Fonts) | Free |
| **Total** | | **₹0 / month** |

---

## 🔍 Technical Highlights

- **Involute gear tooth profile** — mathematically correct using `x = r_base(cos t + t·sin t)` parametric equations, 20° standard pressure angle
- **IAPWS steam table interpolation** — Rankine cycle simulation uses log-linear interpolation across 17 real steam table data points rather than polynomial approximations
- **KaTeX formula rendering** — 65+ formulas rendered with proper LaTeX notation
- **Cloudflare Worker proxy** — API key never in client-side code, CORS locked to deployment domain
- **Modular database architecture** — adding a new subject requires only one new JS file

---

## 📄 License

Open source. Built by a Mechanical Engineering graduate from Government Polytechnic Nanded, India.

Pull requests welcome — especially for new concept additions.
