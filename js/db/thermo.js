// db/thermo.js — Thermodynamics (3 concepts, deep content)

MECHVIZ_DB.concepts.push(

  {
    id: "rankine-cycle", title: "Rankine Cycle",
    category: "thermo", icon: "♨️",
    tags: ["thermo", "power plant", "steam", "turbine", "Rankine"],
    shortDesc: "The thermodynamic cycle generating most of the world's electricity — steam power plants, nuclear, and solar thermal.",
    theory: {
      definition: "The Rankine cycle is the ideal thermodynamic cycle for steam power plants. It uses water/steam as the working fluid, cycling it through four steady-flow processes: (1) isentropic compression in a pump, (2) constant-pressure heat addition in a boiler/steam generator, (3) isentropic expansion in a turbine producing work, and (4) constant-pressure heat rejection in a condenser. It is the basis for all coal, gas, nuclear, and concentrated solar power plants.",
      keyConcepts: [
        { term: "Isentropic Process", desc: "An ideal reversible adiabatic process — no heat transfer, no entropy generation. Turbines and pumps are modelled as isentropic in the ideal Rankine cycle. Real devices have isentropic efficiency η_s (turbine: 85–92%, pump: 75–85%)." },
        { term: "Boiler/Steam Generator", desc: "Heat is added at constant pressure (isobaric). Water is preheated, boiled at saturation temperature, then superheated above the saturation point. Superheat raises efficiency and eliminates wet steam in the turbine, which would erode blade surfaces." },
        { term: "Condenser", desc: "Heat is rejected at constant pressure (and temperature, for two-phase flow). The degree of subcooling is controlled. Condenser pressure (typically 4–10 kPa absolute) determines the bottom temperature — lower is better for efficiency but requires larger, more expensive condensers." },
        { term: "Rankine Cycle Improvements", desc: "Regeneration (extracting steam from turbine stages to preheat feedwater) and reheating (reheating steam between turbine stages) both improve efficiency significantly. Modern supercritical plants (p > 22.1 MPa) avoid the two-phase region entirely." }
      ],
      formulas: [
        { name: "Cycle Thermal Efficiency", eq: "η = (W_T − W_P) / Q_boiler = 1 − Q_cond/Q_boiler", variables: { "W_T": "Turbine work = h₁ − h₂ (kJ/kg)", "W_P": "Pump work = h₄ − h₃ = v_f(P_H − P_L) (kJ/kg)", "Q_boiler": "h₁ − h₄ (kJ/kg)" } },
        { name: "Pump Work (simplified)", eq: "W_P = v_f · (P_boiler − P_cond)", variables: { "v_f": "Specific volume of sat. liquid ≈ 0.001 m³/kg" } },
        { name: "Dryness Fraction at Turbine Exit", eq: "x₂ = (s₁ − s_f) / s_fg", variables: { "s₁": "Turbine inlet entropy (kJ/kg·K)", "s_f, s_fg": "Saturation entropy values at condenser pressure" } },
        { name: "Isentropic Turbine Efficiency", eq: "η_T = (h₁ − h₂_actual) / (h₁ − h₂_isentropic)", variables: { "Typical η_T": "85–92% for modern steam turbines" } }
      ],
      explanation: "The cycle operates between a high-pressure, high-temperature boiler (state 1, typically 5–30 MPa, 400–600°C) and a low-pressure condenser (state 3, typically 4–10 kPa, 30–40°C). The large temperature ratio between source and sink drives efficiency. Carnot sets the theoretical maximum: η_Carnot = 1 − T_L/T_H. The Rankine cycle falls below Carnot efficiency because heat addition is not isothermal (water heats from pump exit temperature to saturation, then boils at constant T — but the preheat portion adds heat at temperatures below T_H). Modern ultra-supercritical coal plants achieve 45–47% efficiency; combined-cycle plants (gas turbine + Rankine) reach 60%."
    },
    practicalRules: [
      "Turbine isentropic efficiency: <strong>85–92%</strong> for modern large steam turbines.",
      "Lowering condenser pressure by 1 kPa increases cycle efficiency by roughly <strong>0.1–0.3%</strong> — why cooling tower performance matters.",
      "Steam quality at turbine exit should be <strong>x ≥ 0.88</strong> to prevent blade erosion. Superheating pushes x toward 1.0.",
      "Pump work is <strong>typically < 1% of turbine output</strong> — which is why the pump is usually neglected in quick estimates.",
      "Regenerative feedwater heating in a modern plant raises efficiency by <strong>4–8 percentage points</strong> over the basic cycle.",
      "Supercritical pressure (>22.1 MPa): no distinct boiling — fluid transitions smoothly from liquid to vapour, eliminating two-phase heat addition losses."
    ],
    workedExample: {
      problem: "Steam enters the turbine of a Rankine cycle at 3 MPa, 300°C (saturated vapour state: h₁ = 2804 kJ/kg, s₁ = 6.186 kJ/kg·K). Condenser pressure = 10 kPa. Steam tables at 10 kPa: T_sat = 45.8°C, h_f = 191.8, h_fg = 2392.8, s_f = 0.649, s_fg = 7.501 kJ/kg·K. Find cycle efficiency (ideal, pump work neglected).",
      given: ["h₁ = 2804 kJ/kg (turbine inlet — sat. vapour at 3 MPa)", "s₁ = 6.186 kJ/kg·K", "Condenser at 10 kPa: h_f=191.8, h_fg=2392.8, s_f=0.649, s_fg=7.501 kJ/kg·K", "h₄ ≈ h₃ = h_f(10 kPa) = 191.8 kJ/kg (pump work neglected)"],
      steps: [
        { text: "Find turbine exit state (isentropic: s₂ = s₁ = 6.186 kJ/kg·K). Is state 2 wet steam? Check: s_f = 0.649 < s₂ = 6.186 < s_g = 8.15 → YES, wet steam. Find dryness fraction:", calc: "x₂ = (s₂ − s_f) / s_fg = (6.186 − 0.649) / 7.501 = 5.537 / 7.501 = 0.738" },
        { text: "Find turbine exit enthalpy (wet steam: h₂ = h_f + x₂ · h_fg):", calc: "h₂ = 191.8 + 0.738 × 2392.8 = 191.8 + 1765.9 = 1957.7 kJ/kg" },
        { text: "Calculate turbine work output per kg:", calc: "W_T = h₁ − h₂ = 2804 − 1957.7 = 846.3 kJ/kg" },
        { text: "Calculate heat input in boiler (pump work neglected: h₄ ≈ h₃):", calc: "Q_boiler = h₁ − h₄ = 2804 − 191.8 = 2612.2 kJ/kg" },
        { text: "Calculate cycle thermal efficiency:", calc: "η = W_T / Q_boiler = 846.3 / 2612.2 = 0.324 = 32.4%" },
        { text: "Note: x₂ = 0.738 is below the recommended minimum of 0.88 — superheating the steam at the turbine inlet would be needed in practice to protect turbine blades.", calc: "x₂ = 0.738 < 0.88 → Superheating required in real plant" }
      ],
      answer: "Cycle efficiency η = 32.4%. Turbine exit quality x₂ = 0.738 — too wet for real turbine operation; superheating would raise efficiency and protect blades."
    },
    commonMistakes: [
      { title: "Forgetting to check turbine exit quality", desc: "If x₂ < 0.88, the turbine blades are severely eroded by water droplets — a real operational constraint. Students often calculate efficiency without checking whether the cycle is even physically feasible for the turbine." },
      { title: "Confusing isentropic with isothermal", desc: "The turbine and pump are isentropic (constant entropy, no heat transfer) — NOT isothermal. The boiler (constant pressure boiling) and condenser (condensation) are approximately isothermal. Mixing up these processes leads to completely wrong state-point calculations." },
      { title: "Using condenser temperature not pressure as the design variable", desc: "The condenser operates at the saturation pressure corresponding to its cooling water temperature. Specifying 'condenser temperature = 40°C' means condenser pressure = 7.38 kPa (saturation pressure at 40°C) — you must look this up in steam tables, not assume atmospheric pressure." }
    ],
    simulation: "rankine",
    realWorldUses: [
      { title: "Supercritical Coal Power Plants", icon: "🏭", description: "Modern supercritical coal plants operate at 25 MPa, 600°C/620°C (reheat), achieving 44–47% efficiency — up from 33% for 1960s subcritical plants. The fuel saving is enormous: a 1% efficiency gain in a 1000 MW plant saves ~₹50 crore/year in coal costs." },
      { title: "Nuclear Power Plants (PWR/BWR)", icon: "⚛️", description: "Pressurised water reactors heat water to ~315°C in the primary loop, generating steam at ~7 MPa in the secondary loop for Rankine cycle turbines. Nuclear Rankine plants run at 33% efficiency — lower than coal because reactor safety limits peak temperature." },
      { title: "Waste Heat Organic Rankine Cycles", icon: "♻️", description: "Industrial exhaust at 150–300°C can drive Organic Rankine Cycle (ORC) systems using refrigerant-like working fluids (pentane, R245fa) that boil at low temperatures. ORC units generating 50–5000 kW from waste heat are increasingly common in cement, steel, and glass plants." },
      { title: "Concentrated Solar Power Plants", icon: "☀️", description: "Parabolic trough and power tower CSP plants focus sunlight to generate steam at 390–550°C, driving standard Rankine steam turbines. The Ivanpah Solar Plant (California, 392 MW) and Noor projects (Morocco) use this technology." }
    ],
    resources: [
      { label: "Rankine Cycle — The Efficient Engineer", url: "https://www.youtube.com/watch?v=0cUVfQwKbDQ", type: "video" },
      { label: "MIT OCW — Thermodynamics & Propulsion", url: "https://ocw.mit.edu/courses/2-006-thermal-fluids-engineering-ii-spring-2008/", type: "course" },
      { label: "NPTEL — Engineering Thermodynamics", url: "https://nptel.ac.in/courses/112104113", type: "course" },
      { label: "Engineering Toolbox — Rankine Cycle", url: "https://www.engineeringtoolbox.com/rankine-cycle-d_157.html", type: "article" }
    ]
  },

  {
    id: "otto-cycle", title: "Otto Cycle (Petrol Engine)",
    category: "thermo", icon: "🔥",
    tags: ["thermo", "IC engine", "otto", "petrol", "compression ratio"],
    shortDesc: "The thermodynamic cycle behind every petrol engine — from motorcycles to Formula 1.",
    theory: {
      definition: "The Otto cycle is the ideal thermodynamic cycle approximating the operation of spark-ignition (SI) internal combustion engines. It consists of four processes: two isentropic (frictionless adiabatic) and two isochoric (constant-volume) heat transfer processes. Proposed by Nikolaus Otto in 1876, the cycle replaced the earlier constant-pressure cycle and dramatically improved engine efficiency.",
      keyConcepts: [
        { term: "Compression Ratio (r)", desc: "r = V_BDC / V_TDC (maximum cylinder volume / minimum volume). The single most important parameter for Otto cycle efficiency. Higher r → higher η. Petrol engines: r = 8–13. Direct-injection engines: r = 12–14. Limited by knock (autoignition). Racing engines: r = 14–15 with premium fuel." },
        { term: "Knock (Autoignition)", desc: "When unburned fuel-air mixture ignites spontaneously ahead of the flame front before the spark reaches it, causing rapid pressure rise and characteristic 'pinking'. Limits the compression ratio. High-octane fuel resists knock — hence premium petrol allows higher compression ratios and more power." },
        { term: "Air-Standard Analysis", desc: "Otto cycle analysis assumes the working fluid is air (ideal gas) throughout, with fixed specific heat ratios (γ = 1.4, c_v = 0.718 kJ/kg·K). Real engines have γ varying with temperature and different gas composition. Air-standard efficiency is always higher than real engine efficiency." },
        { term: "Mean Effective Pressure (MEP)", desc: "MEP = Net work output / Displacement volume. The hypothetical constant pressure over a full stroke that produces the same work. Units: kPa or bar. Higher MEP = more power per unit displacement. Used to compare engines of different sizes." }
      ],
      formulas: [
        { name: "Thermal Efficiency", eq: "η_Otto = 1 − (1 / r^(γ−1))", variables: { "r": "Compression ratio", "γ": "Specific heat ratio = c_p/c_v ≈ 1.4 for air" } },
        { name: "Temperature After Compression (State 2)", eq: "T₂ = T₁ · r^(γ−1)", variables: { "T₁": "Intake temperature (K)" } },
        { name: "Temperature After Combustion (State 3)", eq: "T₃ = T₂ + Q_in / c_v", variables: { "Q_in": "Heat added per kg (kJ/kg)", "c_v": "0.718 kJ/kg·K for air" } },
        { name: "Net Work Output", eq: "W_net = Q_in × η_Otto = c_v[(T₃−T₂)−(T₄−T₁)]", variables: { "T₄": "Temperature at end of expansion (state 4)" } },
        { name: "MEP", eq: "MEP = W_net / (V₁ − V₂) = W_net / (V₁ × (1 − 1/r))", variables: { "V₁": "BDC volume (m³/kg specific volume)" } }
      ],
      explanation: "Process 1→2: Air-fuel mixture is compressed isentropically from BDC to TDC. Temperature rises from T₁ (≈300K) to T₂ (600–800K for r=8–12). Process 2→3: Spark ignition at TDC — fuel burns at constant volume, raising temperature to T₃ (2000–2800K) and pressure to p₃. Process 3→4: Expansion isentropically back to BDC, doing work on the piston — this is the power stroke. Process 4→1: Exhaust valve opens at BDC — heat is rejected at constant volume as gases blow down to atmospheric pressure. The key insight: the efficiency depends only on compression ratio and γ — NOT on the heat input or peak temperature (unlike the Carnot cycle). This means you can increase power (more fuel) without changing efficiency, as long as r is fixed."
    },
    practicalRules: [
      "Otto cycle efficiency at r=10: <strong>η = 1 − 1/10^0.4 = 60.2%</strong>. Real engine brake thermal efficiency: <strong>30–38%</strong> — losses from heat transfer, friction, valve timing, and real-gas effects.",
      "Each unit increase in compression ratio improves efficiency by roughly <strong>2–3 percentage points</strong> (diminishing returns at high r).",
      "Octane number of fuel sets the knock limit: 95 RON petrol allows <strong>r ≈ 11</strong>; 98 RON allows <strong>r ≈ 12–13</strong>.",
      "Actual indicated thermal efficiency (including all gas-exchange losses but not friction): typically <strong>35–45%</strong>.",
      "Mechanical efficiency (accounting for friction): <strong>85–92%</strong> of indicated power — remainder is friction in bearings, piston rings, valve train.",
      "F1 engines (heavily optimised): <strong>~50% thermal efficiency</strong> — highest achieved for reciprocating petrol engines."
    ],
    workedExample: {
      problem: "An Otto cycle engine has compression ratio r = 9.5. Initial conditions: T₁ = 300 K, p₁ = 100 kPa. Heat input Q_in = 950 kJ/kg. Find: (a) thermal efficiency, (b) temperatures at all states, (c) MEP. Use γ = 1.4, c_v = 0.718 kJ/kg·K.",
      given: ["r = 9.5", "T₁ = 300 K, p₁ = 100 kPa", "Q_in = 950 kJ/kg", "γ = 1.4, c_v = 0.718 kJ/kg·K"],
      steps: [
        { text: "Calculate thermal efficiency:", calc: "η = 1 − 1/r^(γ−1) = 1 − 1/9.5^0.4 = 1 − 1/2.457 = 1 − 0.407 = 0.593 = 59.3%" },
        { text: "Find T₂ (after isentropic compression):", calc: "T₂ = T₁ × r^(γ−1) = 300 × 9.5^0.4 = 300 × 2.457 = 737 K" },
        { text: "Find T₃ (after constant-volume heat addition):", calc: "T₃ = T₂ + Q_in/c_v = 737 + 950/0.718 = 737 + 1323 = 2060 K" },
        { text: "Find T₄ (after isentropic expansion):", calc: "T₄ = T₃ / r^(γ−1) = 2060 / 2.457 = 839 K" },
        { text: "Calculate net work and MEP:", calc: "W_net = η × Q_in = 0.593 × 950 = 563 kJ/kg\nSpecific volume at BDC: v₁ = RT₁/p₁ = (0.287×300)/100 = 0.861 m³/kg\nv₂ = v₁/r = 0.861/9.5 = 0.0906 m³/kg\nMEP = W_net/(v₁−v₂) = 563/(0.861−0.0906) = 563/0.770 = 731 kPa = 7.31 bar" }
      ],
      answer: "η = 59.3%, T₂ = 737 K, T₃ = 2060 K, T₄ = 839 K, MEP = 731 kPa (7.31 bar). Note: 59.3% is the air-standard efficiency — real petrol engine at this compression ratio would achieve ~32–38% brake thermal efficiency."
    },
    commonMistakes: [
      { title: "Confusing air-standard with real engine efficiency", desc: "The Otto cycle formula gives the air-standard efficiency — always higher than real engines. At r=10, η_Otto = 60.2%, but real engines achieve 30–38%. The gap comes from heat losses, friction, non-ideal gas behaviour, valve timing, and incomplete combustion." },
      { title: "Confusing Otto and Diesel cycles", desc: "Otto: constant-VOLUME heat addition (isochoric) — spark ignition, all fuel burns at TDC. Diesel: constant-PRESSURE heat addition (isobaric) — compression ignition, fuel burns as it's injected. At the same compression ratio, Diesel is more efficient than Otto — but Diesels run at higher r (>14) so they are more efficient in practice." },
      { title: "Using Celsius instead of Kelvin in state equations", desc: "T₂ = T₁ × r^(γ−1) requires absolute temperature (Kelvin). If you use T₁ = 27°C = 27 (instead of 300 K), the result is physically meaningless. Always convert to Kelvin: K = °C + 273.15." }
    ],
    simulation: "otto",
    realWorldUses: [
      { title: "Petrol Car Engines", icon: "🚗", description: "All petrol (gasoline) cars use the four-stroke Otto cycle. Modern direct-injection engines (GDI) achieve r = 12–14 with lean stratified combustion, improving efficiency to 38–40% — significantly above the 30–33% of older port-injection engines." },
      { title: "Formula 1 Power Units", icon: "🏎️", description: "F1 1.6L hybrid turbocharged units operate at ~10,500 RPM with ~50% thermal efficiency — the highest ever achieved by a production-style petrol engine. This uses Miller cycle (variable effective compression ratio), MGU-H heat recovery, and ultra-lean combustion." },
      { title: "Motorcycle Engines", icon: "🏍️", description: "High-performance motorcycle engines (Kawasaki Ninja H2, BMW S1000RR) use Otto cycle with r = 13.6 and titanium valves, producing 100–200 kW from 600–1000 cc. Specific power output exceeds most car engines per unit displacement." },
      { title: "Stationary Gas Engines (Power Generation)", icon: "⚡", description: "Large stationary natural gas Otto cycle engines (MAN, Caterpillar, Wärtsilä) generate 1–10 MW in combined heat and power (CHP) plants. They achieve 42–45% electrical efficiency with waste heat recovery for building heating — total primary energy efficiency >80%." }
    ],
    resources: [
      { label: "Otto Cycle — The Efficient Engineer", url: "https://www.youtube.com/watch?v=A4DPPvqNsUc", type: "video" },
      { label: "NPTEL — Internal Combustion Engines", url: "https://nptel.ac.in/courses/112104012", type: "course" },
      { label: "MIT OCW — Thermodynamics", url: "https://ocw.mit.edu/courses/2-006-thermal-fluids-engineering-ii-spring-2008/", type: "course" },
      { label: "Engineering Toolbox — Otto Cycle", url: "https://www.engineeringtoolbox.com/otto-cycle-d_983.html", type: "article" }
    ]
  },

  {
    id: "heat-conduction", title: "Heat Conduction & Fourier's Law",
    category: "thermo", icon: "🌡️",
    tags: ["thermo", "heat transfer", "conduction", "Fourier", "thermal resistance"],
    shortDesc: "How heat flows through solid materials — the physics behind insulation, heat sinks, and furnace walls.",
    theory: {
      definition: "Heat conduction is the transfer of thermal energy through a material due to temperature differences, without bulk movement of the material. Fourier's Law states that the rate of heat transfer is proportional to the temperature gradient and the thermal conductivity of the material. Conduction is the dominant heat transfer mechanism in solids and forms the basis for thermal design of buildings, electronics, engines, and industrial furnaces.",
      keyConcepts: [
        { term: "Thermal Conductivity (k)", desc: "Material property quantifying ability to conduct heat (W/m·K). Diamond: 2000. Copper: 400. Aluminium: 237. Steel: 50. Glass: 1.0. Water: 0.6. Brick: 0.7. Insulation wool: 0.04. Air: 0.026. Low k = good thermal insulator. k varies with temperature." },
        { term: "Thermal Resistance (R_th)", desc: "Analogous to electrical resistance for heat flow. For plane wall: R_th = L/(kA) (K/W). Heat flow Q = ΔT/R_th (analogous to I = V/R). For composite walls, series resistances add: R_total = R₁ + R₂ + R₃. This thermal circuit analogy greatly simplifies composite wall analysis." },
        { term: "Contact Resistance", desc: "When two surfaces are in contact, microscopic surface roughness creates air gaps — air has very low k. Contact resistance can dominate the thermal circuit and is often the reason CPU cooling fails. Thermal paste fills these gaps, reducing contact resistance by 100–1000×." },
        { term: "Biot Number (Bi)", desc: "Bi = h·L_c / k_solid, where h = convective coefficient at surface. Bi << 0.1: temperature gradient within solid is negligible (lumped system analysis valid). Bi >> 1: surface is nearly at ambient temperature, conduction through solid governs. Critical for transient heat transfer analysis." }
      ],
      formulas: [
        { name: "Fourier's Law (1D)", eq: "q = −k · dT/dx = k · (T_H − T_C) / L", variables: { "q": "Heat flux (W/m²)", "k": "Thermal conductivity (W/m·K)", "dT/dx": "Temperature gradient (K/m)", "L": "Thickness (m)" } },
        { name: "Heat Flow Rate (Plane Wall)", eq: "Q = k · A · (T₁ − T₂) / L = ΔT / R_th", variables: { "Q": "Heat flow rate (W)", "A": "Cross-sectional area (m²)", "R_th": "Thermal resistance = L/(kA) (K/W)" } },
        { name: "Composite Wall (Series)", eq: "Q = (T_hot − T_cold) / (R₁ + R₂ + ... + Rₙ)", variables: { "Rᵢ": "Lᵢ/(kᵢ·A) for each layer (K/W)" } },
        { name: "Radial Conduction (Cylinder)", eq: "Q = 2πkL(T₁ − T₂) / ln(r₂/r₁)", variables: { "r₁, r₂": "Inner and outer radii (m)", "L": "Cylinder length (m)" } }
      ],
      explanation: "Fourier's Law is an empirical observation (not derived from first principles) stating that heat flux in a conductor is proportional to the negative temperature gradient. The minus sign means heat flows from hot to cold. In steady state (no heat storage), the heat flux is the same at every cross-section of a plane wall — the temperature distribution is linear. For a composite wall, the thermal resistance analogy (Q = ΔT/R_total) mirrors Ohm's law exactly. The layer with the highest R (usually the insulation layer) has the largest temperature drop across it — just as the resistor with highest R has the largest voltage drop in a series circuit."
    },
    practicalRules: [
      "Thermal resistance analogy: <strong>Q = ΔT / R_total</strong> exactly mirrors Ohm's Law (I = V/R).",
      "Dominant resistance controls heat flow — <strong>always identify the largest R</strong> in the thermal circuit.",
      "Doubling insulation thickness halves heat loss — but the relationship is linear, not exponential (unlike electrical resistance in RC circuits).",
      "Contact resistance typical values: metal-metal (without paste): <strong>0.0001–0.001 m²·K/W</strong>. With thermal paste: <strong>10× lower</strong>.",
      "For cylindrical insulation (pipes), there is a <strong>critical radius r_c = k_insulation / h</strong> below which adding insulation INCREASES heat loss.",
      "Heat sink design rule: maximise <strong>surface area × h</strong>, minimise <strong>base-to-tip thermal resistance</strong>. Fins are effective only when Bi_fin < 1."
    ],
    workedExample: {
      problem: "A composite wall consists of: Layer 1 — brick (k₁=0.9 W/m·K, L₁=230 mm), Layer 2 — glass wool insulation (k₂=0.04 W/m·K, L₂=80 mm), Layer 3 — plasterboard (k₃=0.16 W/m·K, L₃=12 mm). Inside temperature T_inside = 22°C, outside T_outside = −3°C. Wall area A = 1 m². Find heat loss rate and intermediate temperatures.",
      given: ["T_inside = 22°C, T_outside = −3°C → ΔT = 25°C = 25 K", "Brick: k=0.9, L=0.23 m", "Wool: k=0.04, L=0.08 m", "Plaster: k=0.16, L=0.012 m", "A = 1 m²"],
      steps: [
        { text: "Calculate individual thermal resistances R = L/(k·A):", calc: "R_brick   = 0.23 / (0.9 × 1) = 0.256 K/W\nR_wool    = 0.08 / (0.04 × 1) = 2.000 K/W\nR_plaster = 0.012 / (0.16 × 1) = 0.075 K/W" },
        { text: "Total resistance (series — same area throughout):", calc: "R_total = 0.256 + 2.000 + 0.075 = 2.331 K/W" },
        { text: "Heat loss rate:", calc: "Q = ΔT / R_total = 25 / 2.331 = 10.72 W/m²" },
        { text: "Temperature at brick-wool interface (T₁₂):", calc: "T₁₂ = T_inside − Q × R_brick = 22 − 10.72 × 0.256 = 22 − 2.74 = 19.3°C" },
        { text: "Temperature at wool-plaster interface (T₂₃):", calc: "T₂₃ = T₁₂ − Q × R_wool = 19.3 − 10.72 × 2.000 = 19.3 − 21.44 = −2.14°C" }
      ],
      answer: "Heat loss Q = 10.72 W per m² of wall. The insulation (R=2.0 K/W) accounts for 86% of total resistance and carries 21.4°C of the 25°C total temperature drop — confirming it is the controlling layer. The brick contributes only 11% of resistance despite being 230 mm thick."
    },
    commonMistakes: [
      { title: "Adding conductances (k/L) instead of resistances (L/k)", desc: "Thermal resistances in series ADD (like electrical resistors in series): R_total = R₁ + R₂. A common error is adding thermal conductances (k/L values) — this would apply if the layers were in parallel, not series. A composite building wall is always in series." },
      { title: "Ignoring surface (convective) resistance", desc: "Full thermal circuit from indoor air to outdoor air includes convective resistances at both surfaces: R_surface_inside = 1/(h_i·A), R_surface_outside = 1/(h_o·A). For typical buildings, these add ~0.12 m²K/W inside and ~0.07 m²K/W outside — significant compared to poorly insulated walls." },
      { title: "Applying plane-wall formula to pipe insulation", desc: "Cylindrical geometry requires Q = 2πkL(T₁−T₂)/ln(r₂/r₁), not Q = kA(T₁−T₂)/L. For thick pipe insulation (r₂/r₁ > 2), using the plane-wall formula significantly underestimates heat loss. The critical radius effect also only exists in cylindrical geometry." }
    ],
    simulation: "heat",
    realWorldUses: [
      { title: "Building Energy Efficiency (U-Values)", icon: "🏠", description: "Building thermal regulations specify maximum U-values (W/m²K = 1/R_total) for walls, roofs, and floors. The Energy Conservation Building Code (ECBC) in India mandates U ≤ 0.44 W/m²K for walls — achievable only with 100+ mm of insulation." },
      { title: "CPU/GPU Thermal Management", icon: "💻", description: "A 250W CPU generates heat in a 1cm² die. Without heat spreading, that's 250 W/cm² — enough to melt the chip in seconds. Copper heat spreaders, thermal paste (filling micro-gaps), aluminium heat sinks, and fans create a thermal path with R_total < 0.2 K/W." },
      { title: "Refractory Furnace Lining Design", icon: "🏭", description: "Steel-making arc furnaces operate at 1600°C internally. A carefully designed composite refractory lining (high-k castable near the heat, low-k insulating brick outside) limits shell temperature to <100°C and heat loss to acceptable levels." },
      { title: "Jet Engine Turbine Blade Cooling", icon: "✈️", description: "GE9X turbine blades operate in gas at 1500°C — above the melting point of the nickel superalloy. Internal cooling channels (fed by compressor bleed air at 600°C) create a thermal resistance that limits metal temperature to 1050°C. Without this, blades would melt in milliseconds." }
    ],
    resources: [
      { label: "Fourier's Law & Heat Conduction — The Efficient Engineer", url: "https://www.youtube.com/watch?v=WXB0JvNEDkA", type: "video" },
      { label: "NPTEL — Heat Transfer (IIT Bombay)", url: "https://nptel.ac.in/courses/112101097", type: "course" },
      { label: "MIT OCW — Heat Transfer", url: "https://ocw.mit.edu/courses/2-51-intermediate-heat-and-mass-transfer-fall-2008/", type: "course" },
      { label: "Engineering Toolbox — Thermal Conductivity Values", url: "https://www.engineeringtoolbox.com/thermal-conductivity-d_429.html", type: "article" }
    ]
  },

  {
    id: "diesel-cycle", title: "Diesel Cycle (Compression Ignition)",
    category: "thermo", icon: "⛽",
    tags: ["thermo", "diesel", "IC engine", "compression ignition", "cut-off ratio"],
    shortDesc: "The thermodynamic cycle behind every diesel engine — from trucks to ships to power generators.",
    theory: {
      definition: "The Diesel cycle is the ideal thermodynamic cycle for compression-ignition (CI) engines. Unlike the Otto cycle (constant-volume heat addition), the Diesel cycle adds heat at constant pressure during fuel injection. This allows higher compression ratios (16–24 vs 8–13 for petrol) without knock — since there is no pre-mixed fuel-air charge. Higher compression ratio means higher efficiency. Rudolf Diesel patented this cycle in 1892.",
      keyConcepts: [
        { term: "Compression Ratio (r)", desc: "r = V₁/V₂ (BDC volume / TDC volume). Diesel engines use r = 14–24, far higher than petrol (8–13), because they compress air only — no risk of autoignition. Higher r → higher compression temperature → easier self-ignition of injected fuel and higher efficiency." },
        { term: "Cut-off Ratio (rc)", desc: "rc = V₃/V₂ — the ratio of volume at end of constant-pressure heat addition to volume at start (TDC). Represents how much of the stroke is used for combustion. rc = 1 gives Otto cycle efficiency. Higher rc lowers efficiency (compared to same r Otto) because late heat addition at expanding volume is thermodynamically less effective." },
        { term: "Diesel vs Otto Efficiency", desc: "At the same compression ratio, η_Otto > η_Diesel. But Diesel engines operate at much higher r — so in practice, diesel engines are MORE efficient (40–45% vs 30–38% for petrol). The comparison is only valid at the same r, which diesel engines never use." },
        { term: "Injection Timing", desc: "Fuel injection starts near TDC and continues for a crank angle equal to the cut-off angle. Injection timing controls rc. Retarded injection (late): lower peak pressure, lower NOx, but lower efficiency. Advanced injection: higher efficiency, higher NOx and combustion noise." }
      ],
      formulas: [
        { name: "Diesel Cycle Efficiency", eq: "η_D = 1 − (1/r^(γ−1)) × (rc^γ−1) / (γ(rc−1))", variables: { "r": "Compression ratio", "rc": "Cut-off ratio = V₃/V₂", "γ": "Specific heat ratio ≈ 1.4" } },
        { name: "Temperature After Compression", eq: "T₂ = T₁ × r^(γ−1)", variables: { "T₁": "Intake temperature (K)" } },
        { name: "Temperature After Combustion (const-P)", eq: "T₃ = T₂ × rc", variables: { "Constant pressure": "Heat added isobarically, T ∝ V" } },
        { name: "Cut-off Ratio from Heat Input", eq: "rc = 1 + Q_in/(cp × T₂)", variables: { "cp": "Specific heat at constant pressure = 1.005 kJ/kg·K for air" } }
      ],
      explanation: "Process 1→2: Isentropic compression — air reaches ~700–900 K at TDC (enough to ignite diesel fuel spontaneously). Process 2→3: Fuel injection and combustion at constant pressure — the piston moves out as burning occurs, maintaining pressure. Process 3→4: Isentropic expansion back to BDC. Process 4→1: Constant-volume heat rejection (exhaust blowdown). The efficiency penalty of constant-pressure (vs constant-volume) heat addition is offset by the much higher achievable compression ratio. Modern direct-injection diesels with turbocharging and intercooling achieve 42–47% brake thermal efficiency."
    },
    practicalRules: [
      "Diesel efficiency at r=18, rc=2, γ=1.4: <strong>η = 1 − (1/18^0.4) × (2^1.4−1)/(1.4×1) = 62.4%</strong> (air-standard). Real diesel: 40–46%.",
      "Higher compression ratio improves efficiency but increases mechanical stress and engine weight.",
      "Cut-off ratio rc → 1 makes diesel efficiency approach Otto efficiency at the same r.",
      "Turbocharging + intercooling effectively increases air density entering the cylinder — more fuel burned per cycle, more power without increasing r.",
      "NOx forms at high temperature — diesel NOx is a major emissions challenge (Euro 6 requires SCR/AdBlue treatment).",
      "Common-rail direct injection (CRDI) operates at injection pressures of <strong>1500–2500 bar</strong> — critical for fine fuel atomisation and low emissions."
    ],
    workedExample: {
      problem: "A Diesel cycle engine has: r = 18, T₁ = 300 K, p₁ = 101 kPa, Q_in = 900 kJ/kg. γ = 1.4, cv = 0.718 kJ/kg·K, cp = 1.005 kJ/kg·K. Find: efficiency, cut-off ratio, and all state temperatures.",
      given: ["r = 18", "T₁ = 300 K", "Q_in = 900 kJ/kg", "γ = 1.4, cp = 1.005 kJ/kg·K"],
      steps: [
        { text: "T₂ after isentropic compression:", calc: "T₂ = T₁ × r^(γ−1) = 300 × 18^0.4 = 300 × 3.179 = 953 K" },
        { text: "Cut-off ratio rc from constant-pressure heat addition:", calc: "Q_in = cp(T₃ − T₂) → T₃ = T₂ + Q_in/cp = 953 + 900/1.005 = 953 + 895 = 1848 K\nrc = T₃/T₂ = 1848/953 = 1.939" },
        { text: "T₄ after isentropic expansion:", calc: "T₄ = T₃ / (r/rc)^(γ−1) = 1848 / (18/1.939)^0.4 = 1848 / 9.283^0.4 = 1848 / 2.441 = 757 K" },
        { text: "Diesel efficiency formula:", calc: "η_D = 1 − (1/18^0.4) × (1.939^1.4−1)/(1.4×0.939)\n= 1 − (1/3.179) × (2.603−1)/1.315\n= 1 − 0.3146 × 1.219 = 1 − 0.384 = 61.6%" },
        { text: "Verify via heat rejection:", calc: "Q_out = cv(T₄−T₁) = 0.718×(757−300) = 328 kJ/kg\nη = 1 − Q_out/Q_in = 1 − 328/900 = 63.6% (slight discrepancy due to rounding)" }
      ],
      answer: "T₂ = 953 K, T₃ = 1848 K, T₄ = 757 K. rc = 1.94. η_Diesel ≈ 61.6% (air-standard). Real engine at these conditions: ~42–45% brake thermal efficiency after friction, heat loss, and gas exchange losses."
    },
    commonMistakes: [
      { title: "Using cv instead of cp for heat addition", desc: "Diesel cycle heat addition is at constant PRESSURE → Q_in = cp × ΔT. Otto cycle heat addition is at constant VOLUME → Q_in = cv × ΔT. Using cv for the diesel constant-pressure process gives Q_in 40% too low (cp/cv = γ = 1.4)." },
      { title: "Comparing Diesel and Otto efficiency at different r", desc: "At the same r, η_Otto > η_Diesel (when rc > 1). This seems to favour petrol engines. But real diesel engines run at r=18 vs petrol at r=10 — and at r=18 with rc=2, η_Diesel >> η_Otto at r=10. Always specify r when comparing cycle efficiencies." },
      { title: "Forgetting that rc reduces efficiency in the formula", desc: "Higher rc means more fuel burned at expanding volume — less efficient heat addition. Students expect higher fuel input = higher efficiency. In fact, η_Diesel decreases as rc increases (at fixed r). Efficiency is improved by maximising r, not rc." }
    ],
    simulation: "diesel",
    realWorldUses: [
      { title: "Heavy Truck & Commercial Vehicle Engines", icon: "🚛", description: "A Cummins X15 diesel (15L, 600 hp) achieves 46% peak brake thermal efficiency with EGR, SCR, and DPF emissions control. Fuel economy of 6–8 km/L for a 40-tonne truck. Diesel is chosen for its torque at low RPM and operational range." },
      { title: "Marine Two-Stroke Diesels", icon: "🚢", description: "Wärtsilä RT-flex96C (2-stroke diesel, 110,000 hp) powering container ships achieves 50%+ thermal efficiency — the highest of any heat engine in production. Operating at only 100 RPM, it drives the propeller directly without a gearbox." },
      { title: "Locomotive Traction", icon: "🚂", description: "Diesel-electric locomotives use a diesel engine driving alternators, with electric motors at each axle. EMD SD70 diesel (4300 hp) achieves ~40% thermal efficiency. The diesel-electric drivetrain provides excellent torque characteristics for starting heavy trains." },
      { title: "Diesel Generator Sets", icon: "⚡", description: "Emergency backup generators in hospitals, data centres, and high-rises use diesel engines for reliable power. Caterpillar and Cummins gensets from 10 kVA to 10 MVA — diesel chosen for energy density (12 hours fuel storage), cold-start reliability, and efficiency at partial load." }
    ],
    resources: [
      { label: "Diesel Cycle — The Efficient Engineer", url: "https://www.youtube.com/watch?v=A4DPPvqNsUc", type: "video" },
      { label: "NPTEL — Internal Combustion Engines", url: "https://nptel.ac.in/courses/112104012", type: "course" },
      { label: "Engineering Toolbox — Diesel Cycle", url: "https://www.engineeringtoolbox.com/diesel-cycle-d_984.html", type: "article" }
    ]
  },

  {
    id: "vapour-compression", title: "Vapour Compression Refrigeration",
    category: "thermo", icon: "❄️",
    tags: ["thermo", "refrigeration", "COP", "heat pump", "HVAC", "vapour compression"],
    shortDesc: "The cycle behind every air conditioner and refrigerator — the reversed Rankine cycle that moves heat uphill.",
    theory: {
      definition: "The vapour compression refrigeration cycle (VCRC) is the standard refrigeration cycle used in almost all air conditioners, refrigerators, heat pumps, and industrial chillers. It uses a refrigerant as the working fluid, cycling through four processes: (1) isentropic compression, (2) constant-pressure condensation, (3) throttling expansion, and (4) constant-pressure evaporation. The cycle 'pumps' heat from a low-temperature space to a high-temperature environment using mechanical work.",
      keyConcepts: [
        { term: "Coefficient of Performance (COP)", desc: "COP_R = QL/W_net — heat removed from cold space per unit work input. For refrigerators: COP = 2–6 (removing 2–6 kJ of heat per kJ of electricity). COP_HP = QH/W_net = COP_R + 1 for a heat pump. Carnot COP sets the theoretical maximum: COP_max = TL/(TH−TL)." },
        { term: "Refrigerant Selection", desc: "Modern refrigerants: R134a (HFC, GWP=1430, being phased out), R32 (lower GWP=675), R290 (propane, GWP=3, flammable), R410A (blend, high pressure), R744 (CO₂, natural, high pressure). ODP (ozone depletion potential) must be zero (no CFCs/HCFCs). GWP regulations under F-Gas and Kigali Amendment." },
        { term: "Throttling (Expansion Valve)", desc: "Isenthalpic (constant enthalpy) process — no work done, no heat transfer. High-pressure liquid drops to low-pressure wet vapour. h₃ = h₄. Entropy increases (irreversible). The expansion valve (or capillary tube in domestic fridges) controls refrigerant flow rate." },
        { term: "Superheating & Subcooling", desc: "Superheating the refrigerant before the compressor (state 1) ensures no liquid enters the compressor (prevents slug flow damage). Subcooling the liquid before the expansion valve (state 3) increases refrigerating effect and efficiency. Both are standard practice in real systems." }
      ],
      formulas: [
        { name: "COP of Refrigerator", eq: "COP_R = QL / W_net = (h₁−h₄) / (h₂−h₁)", variables: { "h₁": "Compressor inlet enthalpy (kJ/kg)", "h₂": "Condenser inlet enthalpy (kJ/kg)", "h₄": "Evaporator inlet enthalpy = h₃ (throttling)" } },
        { name: "COP of Heat Pump", eq: "COP_HP = QH / W_net = COP_R + 1", variables: { "QH": "Heat rejected to hot space (kJ/kg)" } },
        { name: "Carnot COP (Maximum Possible)", eq: "COP_Carnot = TL / (TH − TL)", variables: { "TL": "Cold space temperature (K)", "TH": "Hot environment temperature (K)" } },
        { name: "Refrigerating Effect", eq: "RE = h₁ − h₄ = h₁ − h₃ (kJ/kg)", variables: { "h₃ = h₄": "Throttling is isenthalpic" } }
      ],
      explanation: "The refrigerant enters the compressor as low-pressure vapour (state 1), is compressed to high-pressure superheated vapour (state 2). In the condenser, it rejects heat to the surroundings and condenses to high-pressure liquid (state 3). The expansion valve drops pressure irreversibly (constant enthalpy), giving wet vapour at state 4. In the evaporator, it absorbs heat from the cold space and evaporates back to vapour (state 1). The work input is only the compressor — the expansion valve does no work. A heat pump is the same cycle used to heat a space by rejecting QH (rather than focusing on QL)."
    },
    practicalRules: [
      "Typical COP for air conditioner: <strong>3–5</strong> (EER or SEER rating). Every 1°C lower evaporator temperature reduces COP by ~3–4%.",
      "Carnot COP for AC at TL = 295 K (22°C room), TH = 315 K (42°C outside): COP_max = 295/(315−295) = 14.75. Real systems achieve ~30–40% of Carnot.",
      "1 ton of refrigeration = <strong>3.517 kW</strong> of cooling capacity (historical: melting 1 ton of ice per day).",
      "Heat pump: COP_HP = COP_R + 1 — always more efficient than direct electric resistance heating (COP = 1).",
      "Subcooling the liquid by 5°C increases refrigerating effect by ~3–5% at no extra compressor work.",
      "Hermetic compressors (domestic fridges): <strong>motor + compressor in sealed shell</strong> — motor is cooled by refrigerant suction, eliminating shaft seal leaks."
    ],
    workedExample: {
      problem: "A refrigerator uses R134a. State points from refrigerant tables: h₁=387 kJ/kg (sat. vapour, −10°C), h₂=427 kJ/kg (superheated, 40°C), h₃=256 kJ/kg (sat. liquid, 40°C), h₄=h₃=256 kJ/kg (after throttle). Find: COP, refrigerating effect, compressor work, and compare with Carnot COP.",
      given: ["h₁ = 387 kJ/kg", "h₂ = 427 kJ/kg", "h₃ = h₄ = 256 kJ/kg", "TL = −10°C = 263 K", "TH = 40°C = 313 K"],
      steps: [
        { text: "Refrigerating effect (heat absorbed from cold space):", calc: "RE = h₁ − h₄ = 387 − 256 = 131 kJ/kg" },
        { text: "Compressor work:", calc: "W_comp = h₂ − h₁ = 427 − 387 = 40 kJ/kg" },
        { text: "Heat rejected in condenser:", calc: "QH = h₂ − h₃ = 427 − 256 = 171 kJ/kg (= RE + W = 131+40 ✓)" },
        { text: "COP of refrigerator:", calc: "COP_R = RE / W = 131 / 40 = 3.275" },
        { text: "Carnot COP (theoretical maximum):", calc: "COP_Carnot = TL/(TH−TL) = 263/(313−263) = 263/50 = 5.26\nActual/Carnot = 3.275/5.26 = 62.3% — good efficiency for a real cycle" }
      ],
      answer: "RE = 131 kJ/kg, W_comp = 40 kJ/kg, COP_R = 3.275 (actual). Carnot COP = 5.26. The actual cycle achieves 62% of the theoretical Carnot maximum — typical for a well-designed refrigeration system."
    },
    commonMistakes: [
      { title: "Confusing COP_R with COP_HP", desc: "COP_R = QL/W (useful effect = cooling). COP_HP = QH/W (useful effect = heating). COP_HP = COP_R + 1 always. A COP_R = 3 heat pump has COP_HP = 4 — it delivers 4 kJ of heat for every 1 kJ of electricity consumed." },
      { title: "Treating throttling as isentropic", desc: "The expansion valve is isenTHALPIC (constant h, h₃ = h₄), NOT isentropic. Entropy increases (irreversible). If you treat throttling as isentropic, you get the wrong state 4 and incorrect COP. The Carnot cycle uses an isentropic expander — that's why it's theoretically more efficient." },
      { title: "Using Celsius instead of Kelvin in Carnot COP", desc: "COP_Carnot = TL/(TH−TL) requires absolute temperatures. Using °C gives nonsensical or negative answers. Always convert: 20°C = 293 K, −10°C = 263 K." }
    ],
    simulation: "refrigeration",
    realWorldUses: [
      { title: "Residential Air Conditioning", icon: "🏠", description: "A 1.5-ton split AC (5.3 kW cooling) draws ~1.3 kW power → COP ≈ 4. Inverter ACs modulate compressor speed for COP up to 6 at part load. 5-star BEE-rated units save 25–30% energy vs 3-star." },
      { title: "Industrial Chillers", icon: "🏭", description: "Centrifugal chillers (York, Carrier, Trane) cool water from 12°C to 7°C for building HVAC or industrial process cooling. Capacities from 100 kW to 10 MW. COP 5–7. Variable speed drives on compressor improve part-load efficiency by 30–40%." },
      { title: "Supermarket Refrigeration", icon: "🛒", description: "A supermarket uses 150–300 kW of refrigeration — one of the largest energy consumers in retail. CO₂ (R744) transcritical systems are replacing HFC systems in Europe due to zero ODP and GWP = 1. Operating at 90–130 bar on high side." },
      { title: "Heat Pumps for Heating", icon: "🏡", description: "Air-source heat pumps (Mitsubishi, Daikin Altherma) heat homes using the VCRC in reverse. At 0°C outside, COP_HP ≈ 3 — 3× more efficient than gas boiler equivalent. Ground-source heat pumps achieve COP_HP = 4–5 using stable ground temperature." }
    ],
    resources: [
      { label: "Refrigeration Cycle — The Efficient Engineer", url: "https://www.youtube.com/watch?v=MiKJhgC6bIg", type: "video" },
      { label: "NPTEL — Refrigeration & Air Conditioning", url: "https://nptel.ac.in/courses/112105183", type: "course" },
      { label: "MIT OCW — Thermodynamics", url: "https://ocw.mit.edu/courses/2-006-thermal-fluids-engineering-ii-spring-2008/", type: "course" },
      { label: "Engineering Toolbox — Refrigeration Cycle", url: "https://www.engineeringtoolbox.com/vapour-compression-refrigeration-d_703.html", type: "article" }
    ]
  },

  {
    id: "brayton-cycle", title: "Gas Turbines & Brayton Cycle",
    category: "thermo", icon: "✈️",
    tags: ["thermodynamics", "brayton", "jet engine", "gas turbine", "power"],
    shortDesc: "The thermodynamic cycle behind jet engines and modern natural gas power plants.",
    theory: {
      definition: "The Brayton Cycle is the ideal cycle for gas turbine engines. It consists of four open-flow processes: isentropic compression of air in a compressor, constant-pressure heat addition in a combustion chamber, isentropic expansion in a turbine, and constant-pressure heat rejection (exhausting to atmosphere). It operates on a steady-flow basis, unlike the piston-cylinder Otto and Diesel cycles.",
      keyConcepts: [
        { term: "Pressure Ratio (rp)", desc: "The ratio of the maximum pressure to the minimum pressure (rp = P₂ / P₁). In a Brayton cycle, thermal efficiency is primarily a function of this pressure ratio. Higher rp yields higher efficiency, up to material temperature limits." },
        { term: "Back Work Ratio (BWR)", desc: "The ratio of compressor work to turbine work (W_comp / W_turb). Gas turbines have a high BWR (typically 40-80%), meaning a large portion of the turbine's output is consumed just to run the compressor. (Compared to Rankine cycle pumps where BWR < 2%)." },
        { term: "Regeneration", desc: "Using the hot exhaust gas leaving the turbine to preheat the compressed air before it enters the combustor. This significantly improves efficiency at lower pressure ratios by reducing the required heat input." },
        { term: "Combined Cycle", desc: "A Brayton topping cycle (gas turbine) combined with a Rankine bottoming cycle (steam turbine) utilizing the hot exhaust. This achieves the highest thermal efficiencies of any power plant (over 60%)." }
      ],
      formulas: [
        { name: "Pressure Ratio", eq: "r_p = P_2 / P_1 = P_3 / P_4", variables: { "P_1, P_4": "Atmospheric/inlet pressure", "P_2, P_3": "Combustor pressure" } },
        { name: "Thermal Efficiency", eq: "η_Brayton = 1 − (1 / r_p^((γ−1)/γ))", variables: { "r_p": "Pressure ratio", "γ": "Heat capacity ratio (1.4 for air)" } },
        { name: "Compressor Work", eq: "W_c = c_p (T_2 − T_1)", variables: { "c_p": "Specific heat at constant pressure", "T_1": "Inlet temp", "T_2": "Compressor exit temp" } },
        { name: "Turbine Work", eq: "W_t = c_p (T_3 − T_4)", variables: { "T_3": "Turbine inlet temp (max temp)", "T_4": "Turbine exit temp" } },
        { name: "Net Work", eq: "W_net = W_t − W_c", variables: {} }
      ],
      explanation: "Air enters the compressor at T₁ and is compressed to T₂ (doing work W_c). Fuel is burned at constant pressure raising the temperature to T₃ (the maximum cycle temperature, limited by turbine blade metallurgy). The hot gas expands through the turbine dropping to T₄ (producing work W_t). The net work W_net = W_t - W_c is available to drive a generator or fan. Because air is a gas, compressing it requires huge amounts of work, hence the high Back Work Ratio. However, gas turbines are extremely compact and have massive power-to-weight ratios."
    },
    practicalRules: [
      "Maximum turbine inlet temperature (T₃) is typically <strong>1400°C - 1600°C</strong> for modern turbines, requiring thermal barrier coatings and internal blade cooling.",
      "Pressure ratios (r_p) range from <strong>15:1 to over 40:1</strong> in modern aircraft and industrial gas turbines.",
      "A combined cycle power plant (CCGT) can achieve <strong>60-64%</strong> efficiency, whereas a simple cycle gas turbine is only <strong>35-40%</strong> efficient.",
      "High ambient temperatures decrease air density, which reduces the mass flow rate and power output of a gas turbine significantly."
    ],
    workedExample: {
      problem: "An ideal Brayton cycle operates with air entering the compressor at 300 K and 100 kPa. The pressure ratio is 12. The maximum cycle temperature (turbine inlet) is 1300 K. Determine: (a) Compressor exit temp T₂, (b) Turbine exit temp T₄, (c) Thermal efficiency, and (d) Back work ratio. (Assume γ = 1.4, cp = 1.005 kJ/kg·K).",
      given: ["T₁ = 300 K, P₁ = 100 kPa", "r_p = 12", "T₃ = 1300 K", "γ = 1.4, cp = 1.005"],
      steps: [
        { text: "Compressor exit (Isentropic):", calc: "T₂ = T₁ × (r_p)^((γ-1)/γ)\n= 300 × (12)^(0.4/1.4)\n= 300 × 12^0.2857 = 300 × 2.034 = 610.2 K" },
        { text: "Turbine exit (Isentropic):", calc: "T₄ = T₃ / (r_p)^((γ-1)/γ)\n= 1300 / 2.034 = 639.1 K" },
        { text: "Work terms:", calc: "W_c = cp(T₂ - T₁) = 1.005(610.2 - 300) = 311.8 kJ/kg\nW_t = cp(T₃ - T₄) = 1.005(1300 - 639.1) = 664.2 kJ/kg\nW_net = 664.2 - 311.8 = 352.4 kJ/kg" },
        { text: "Heat input:", calc: "Q_in = cp(T₃ - T₂) = 1.005(1300 - 610.2) = 693.2 kJ/kg" },
        { text: "Efficiency & BWR:", calc: "η = W_net / Q_in = 352.4 / 693.2 = 0.508 (50.8%)\nOr using formula: 1 - 1/(12^0.2857) = 1 - 1/2.034 = 50.8%\nBWR = W_c / W_t = 311.8 / 664.2 = 0.469 (46.9%)" }
      ],
      answer: "T₂ = 610 K, T₄ = 639 K. Efficiency = 50.8%. Back Work Ratio = 46.9% (nearly half the turbine output goes to the compressor!)."
    },
    commonMistakes: [
      { title: "Using Otto cycle efficiency formula", desc: "The Brayton efficiency formula uses pressure ratio (r_p), while the Otto cycle uses volumetric compression ratio (r). They look similar but mean different things. In a gas turbine, the volume is not fixed." },
      { title: "Assuming W_net = W_turb", desc: "Unlike a steam cycle where the pump work is negligible, the compressor in a gas turbine consumes a massive amount of power. You must subtract W_comp from W_turb to get the net work." }
    ],
    simulation: "brayton-cycle",
    realWorldUses: [
      { title: "Aircraft Jet Engines", icon: "✈️", description: "Turbofans, turbojets, and turboprops all operate on the open Brayton cycle. The net work is either used to drive a large fan (turbofan) or ejected as a high-speed exhaust jet for thrust." },
      { title: "Natural Gas Power Plants", icon: "🏭", description: "Stationary gas turbines burn natural gas to drive electrical generators. Often used for 'peaking power' because they can spin up from cold to full power in minutes, unlike steam or nuclear plants." },
      { title: "Marine Propulsion", icon: "🚢", description: "Naval destroyers and fast ferries use gas turbines (like the LM2500, a derivative of the CF6 aircraft engine) because of their immense power-to-weight ratio compared to marine diesel engines." }
    ],
    resources: [
      { label: "Gas Turbines — Real Engineering", url: "https://www.youtube.com/watch?v=qsE3RndbX_s", type: "video" },
      { label: "MIT OCW — Brayton Cycle", url: "https://ocw.mit.edu/courses/16-050-thermal-energy-fall-2002/", type: "course" }
    ]
  }

);
