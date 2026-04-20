# ⚙️ MechViz v5 — Deep Engineering Learning Platform

> Technical blueprint UI · 15 concepts · Worked examples · Common mistakes · Involute gear simulation · AI quiz · Free forever

---

## 🚀 What's New in v5

- **Complete UI redesign** — IBM Plex Mono/Sans fonts, dot-grid blueprint aesthetic, two-column concept layout
- **Sticky formula sidebar** on every concept page
- **Worked numerical examples** — full step-by-step solutions for all 15 concepts
- **Common Mistakes tab** — the 3 most frequent errors students make, with corrections
- **Practical Rules of Thumb** — engineer-grade quick reference per concept
- **Involute gear tooth profile** — mathematically correct 20° pressure angle teeth
- **Modular database** — add new concepts by creating one JS file in js/db/

---

## 📁 File Structure

```
mechviz/
├── index.html              ← Homepage
├── concept.html            ← Concept detail page (all 15 concepts)
├── css/style.css           ← Full blueprint design system
└── js/
    ├── db/
    │   ├── core.js         ← Database shell (add new subject files here)
    │   ├── som.js          ← Strength of Materials (5 concepts)
    │   ├── thermo.js       ← Thermodynamics (3 concepts)
    │   ├── fluid.js        ← Fluid Mechanics (2 concepts)
    │   ├── tom.js          ← Theory of Machines (2 concepts)
    │   └── mfg.js          ← Manufacturing (3 concepts)
    ├── simulations.js      ← 15 Canvas simulations (involute gears, IAPWS steam tables)
    ├── main.js             ← Homepage logic
    ├── concept.js          ← Concept page rendering
    ├── quiz.js             ← AI-powered quiz system
    └── ai.js               ← Groq API integration
```

---

## 📚 15 Concepts Covered

| # | Concept | Subject | Worked Example | Simulation |
|---|---------|---------|---------------|------------|
| 1 | Beam Deflection | SOM | ✅ | ✅ Live deflection + UDL arrows |
| 2 | Stress & Strain | SOM | ✅ | ✅ Interactive σ-ε curve |
| 3 | Torsion of Shafts | SOM | ✅ | ✅ Hollow/solid shaft twist |
| 4 | Euler Buckling | SOM | ✅ | ✅ Animated buckling |
| 5 | Thin-Walled Vessels | SOM | ✅ | (σ-ε sim) |
| 6 | Rankine Cycle | Thermo | ✅ | ✅ IAPWS steam tables T-s diagram |
| 7 | Otto Cycle | Thermo | ✅ | ✅ P-V diagram |
| 8 | Heat Conduction | Thermo | ✅ | ✅ Composite wall + temp profile |
| 9 | Fluid Flow & Re | Fluid | ✅ | ✅ Laminar/turbulent particles |
| 10 | Bernoulli's Principle | Fluid | ✅ | ✅ Venturi flow animation |
| 11 | Gear Trains | TOM | ✅ | ✅ Involute gear teeth (correct) |
| 12 | Cam & Follower | TOM | ✅ | ✅ Animated cam + displacement chart |
| 13 | Metal Cutting | Mfg | ✅ | ✅ Taylor tool life curve |
| 14 | Metal Casting | Mfg | ✅ | ✅ Chvorinov solidification |
| 15 | Welding Metallurgy | Mfg | ✅ | ✅ HAZ + CE animation |

---

## 🛠️ Setup (3 steps)

1. **Push to GitHub** — create repo, upload all files keeping folder structure
2. **GitHub Pages** → Settings → Pages → Deploy from main branch
3. **Groq API key** → [console.groq.com](https://console.groq.com) → free, no credit card

---

## ➕ Adding a New Subject (e.g. Civil Engineering)

1. Create `js/db/civil.js`
2. Follow the pattern in `som.js` — push concepts to `MECHVIZ_DB.concepts`
3. Add `<script src="js/db/civil.js"></script>` to both `index.html` and `concept.html`
4. Add category to `core.js` if needed

---

## 💰 Total Cost

₹0 / month. GitHub Pages (free) + Groq API free tier (14,400 req/day).
