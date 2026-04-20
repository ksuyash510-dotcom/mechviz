// db/mfg.js — Manufacturing Engineering (3 concepts, deep content)

MECHVIZ_DB.concepts.push(

  {
    id: "metal-cutting", title: "Metal Cutting Theory",
    category: "mfg", icon: "🔪",
    tags: ["manufacturing", "machining", "cutting", "Taylor", "tool life", "chip"],
    shortDesc: "The science of how cutting tools remove metal — controlling speed, force, heat, and tool life in all machining operations.",
    theory: {
      definition: "Metal cutting is the process of removing unwanted material from a workpiece by shear deformation along a thin shear plane ahead of the cutting tool. A hard wedge-shaped tool is forced into the workpiece surface, causing material to shear off in the form of a chip. Understanding metal cutting mechanics — forces, temperatures, chip geometry, and tool wear — enables engineers to optimise machining processes for productivity, cost, surface finish, and dimensional accuracy.",
      keyConcepts: [
        { term: "Orthogonal Cutting Model", desc: "The simplified 2D model where the cutting edge is perpendicular to the cutting velocity. Despite being an idealisation, it captures the essential mechanics: shear plane angle φ, rake angle γ, chip thickness ratio r_c = t₁/t₂. The Merchant circle of forces relates cutting force, thrust force, friction, and shear force geometrically." },
        { term: "Tool Wear Mechanisms", desc: "Flank wear (rubbing between tool clearance face and machined surface — measured as VB), crater wear (diffusion/chemical attack on rake face), notch wear (at depth-of-cut line), and built-up edge (BUE) at intermediate speeds. Flank wear VB = 0.3 mm is a standard tool life criterion." },
        { term: "Cutting Temperature", desc: "70–80% of cutting energy converts to heat. Temperature in the cutting zone directly drives tool wear (diffusion, oxidation) and affects workpiece surface integrity. Temperature is a strong function of cutting speed (T ∝ V^0.4) — doubling speed increases cutting temperature by ~30%." },
        { term: "Surface Integrity", desc: "Beyond surface finish (Ra), surface integrity includes residual stresses (tensile = bad for fatigue), work hardening depth, microstructural changes, and thermally affected layer. Critical for aerospace components where fatigue is the design criterion." }
      ],
      formulas: [
        { name: "Taylor's Tool Life Equation", eq: "V · T^n = C", variables: { "V": "Cutting speed (m/min)", "T": "Tool life (min) to VB=0.3mm", "n": "Taylor exponent (0.1–0.5)", "C": "Taylor constant (m/min) at T=1 min" } },
        { name: "Material Removal Rate", eq: "MRR = V × f × d", variables: { "V": "Cutting speed (m/min)", "f": "Feed (mm/rev)", "d": "Depth of cut (mm) → MRR in mm³/min" } },
        { name: "Chip Thickness Ratio", eq: "r_c = t₁/t₂ = sin φ / cos(φ − γ)", variables: { "φ": "Shear plane angle (°)", "γ": "Rake angle of tool (°)" } },
        { name: "Merchant's Shear Angle Formula", eq: "φ = 45° + γ/2 − λ/2", variables: { "λ": "Friction angle = arctan(F_friction/F_normal)" } },
        { name: "Cutting Power", eq: "P_c = F_c × V / 60,000", variables: { "F_c": "Cutting force (N)", "V": "Cutting speed (m/min)", "P_c": "Power in kW" } }
      ],
      explanation: "As the tool advances, material in the shear zone undergoes intense plastic deformation along the shear plane — a thin zone of concentrated shear at angle φ to the cutting velocity. The material shears off as a chip which slides up the tool rake face. The cutting force F_c (tangential) does most of the work; the thrust force F_t acts perpendicular to the cut surface. Taylor's equation empirically captures the speed-tool life relationship: doubling speed reduces tool life by a factor 2^(1/n). For HSS tools (n ≈ 0.1–0.15), doubling speed reduces tool life by ~2^7 to 2^10 = 128 to 1024 times! Carbide tools (n ≈ 0.2–0.4) are far less sensitive to speed — enabling higher productivity."
    },
    practicalRules: [
      "Taylor exponent n: HSS = <strong>0.10–0.15</strong>, uncoated carbide = <strong>0.20–0.30</strong>, coated carbide/CBN = <strong>0.30–0.50</strong>.",
      "Recommended tool life T for economic machining: <strong>15–60 minutes</strong> between changes (optimised by Taylor's minimum cost analysis).",
      "Rule of thumb for cutting speed selection: start at <strong>80% of recommended speed</strong> for a new setup.",
      "Feed increase has far less effect on tool life than speed: doubling feed reduces tool life by ~<strong>2–4×</strong> (vs. 10–1000× for doubling speed).",
      "Surface roughness (theoretical): <strong>Ra ≈ f²/(8R)</strong> where f=feed (mm/rev), R=tool nose radius (mm). Smaller nose radius = better finish but weaker tool.",
      "Cutting fluids reduce temperature by <strong>30–50°C</strong> and extend tool life by <strong>2–5×</strong> in most operations."
    ],
    workedExample: {
      problem: "In a turning test on medium carbon steel, the following data were obtained: at V₁ = 100 m/min, tool life T₁ = 80 min; at V₂ = 160 m/min, tool life T₂ = 20 min. Find: (a) Taylor exponent n, (b) Taylor constant C, (c) tool life at V = 120 m/min.",
      given: ["Point 1: V₁ = 100 m/min, T₁ = 80 min", "Point 2: V₂ = 160 m/min, T₂ = 20 min"],
      steps: [
        { text: "Write Taylor's equation for both points:", calc: "100 × (80)^n = C  ...(1)\n160 × (20)^n = C  ...(2)" },
        { text: "Divide equation (1) by equation (2):", calc: "(100/160) × (80/20)^n = 1\n0.625 × (4)^n = 1\n(4)^n = 1/0.625 = 1.6" },
        { text: "Solve for n (take log of both sides):", calc: "n × log(4) = log(1.6)\nn = log(1.6) / log(4) = 0.2041 / 0.6021 = 0.339" },
        { text: "Find C from equation (1):", calc: "C = 100 × (80)^0.339 = 100 × 7.155 = 715.5 m/min" },
        { text: "Find tool life at V = 120 m/min:", calc: "120 × T^0.339 = 715.5\nT^0.339 = 715.5/120 = 5.963\nT = (5.963)^(1/0.339) = (5.963)^2.950 = 47.8 min" }
      ],
      answer: "n = 0.339, C = 715.5 m/min. Tool life at 120 m/min = 47.8 minutes. (Note: increasing speed from 100 to 160 m/min (60% increase) reduced tool life from 80 to 20 minutes — a 75% reduction. This demonstrates the strong sensitivity of tool life to cutting speed.)"
    },
    commonMistakes: [
      { title: "Treating Taylor's equation as exact rather than empirical", desc: "Taylor's VT^n = C is a log-linear empirical fit to experimental data — valid only over the range of test conditions. Extrapolating far outside the test range (e.g. predicting T at V = 5× the test range) gives unreliable results. The exponent n and constant C must be determined experimentally for each tool-workpiece combination." },
      { title: "Confusing cutting speed with spindle speed", desc: "V (m/min) = π×D×N/1000 where D = workpiece diameter (mm) and N = spindle speed (RPM). When the workpiece diameter changes (e.g. in taper turning), the cutting speed changes if N is constant. CNC machines use 'constant surface speed' mode to maintain V automatically." },
      { title: "Ignoring that feed affects surface roughness more than depth", desc: "Ra ≈ f²/(8R) — surface roughness depends on FEED squared and tool nose radius, not depth of cut. Halving feed improves Ra by 4×. Depth of cut barely affects Ra. Students often reduce depth trying to improve finish, when they should reduce feed." }
    ],
    simulation: "metal-cutting",
    realWorldUses: [
      { title: "Aerospace Titanium Machining", icon: "✈️", description: "Ti-6Al-4V (the most common aerospace alloy) has Taylor exponent n ≈ 0.15 — extremely sensitive to speed. Recommended cutting speed is only 40–80 m/min (vs 300–500 m/min for aluminium). Coolant flood is mandatory. Tool life is monitored via force sensors or acoustic emission to detect wear before catastrophic failure." },
      { title: "Automotive Cylinder Bore Honing", icon: "🚗", description: "Cylinder bores are bored then honed to Ra < 0.8 μm with a cross-hatched pattern. The hone abrasive stones use extremely fine feed and multiple passes — the Taylor equation still applies but at very low material removal rates optimised for surface integrity over productivity." },
      { title: "Hard Turning (Replacing Grinding)", icon: "🔩", description: "Hardened steel (HRC 58–65) can now be turned with CBN (cubic boron nitride) inserts at V = 100–200 m/min — replacing cylindrical grinding for some applications. CBN has Taylor exponent n ≈ 0.4–0.5 — much less speed-sensitive. Surface integrity (residual stress profile) is the critical quality criterion." },
      { title: "CNC Adaptive Machining", icon: "🏭", description: "Modern CNC systems use spindle power monitoring and acoustic emission to track tool wear in real time. When wear reaches a threshold, cutting speed is automatically reduced (extending tool life) or the tool is changed before scrapping a part. This is Taylor's equation implemented as closed-loop control." }
    ],
    resources: [
      { label: "Metal Cutting Theory — NPTEL Manufacturing", url: "https://nptel.ac.in/courses/112105148", type: "course" },
      { label: "MIT OCW — Manufacturing Processes II", url: "https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/", type: "course" },
      { label: "Fundamentals of Metal Cutting (YouTube)", url: "https://www.youtube.com/watch?v=SEiJVjA4KQE", type: "video" },
      { label: "Engineering Toolbox — Machining Parameters", url: "https://www.engineeringtoolbox.com/machining-cutting-d_246.html", type: "article" }
    ]
  },

  {
    id: "casting", title: "Metal Casting Fundamentals",
    category: "mfg", icon: "⛏️",
    tags: ["manufacturing", "casting", "solidification", "Chvorinov", "riser", "gating"],
    shortDesc: "Producing complex shapes by pouring molten metal into moulds — the oldest and most shape-flexible manufacturing process.",
    theory: {
      definition: "Metal casting is the process of pouring molten metal into a mould cavity of the desired shape and allowing it to solidify. After solidification, the casting is removed, cleaned, and heat-treated. Casting is uniquely capable of producing complex 3D internal geometry (using cores), very large parts (ship propellers, machine tool beds), and components with embedded inserts — all from a single process step.",
      keyConcepts: [
        { term: "Solidification Shrinkage", desc: "Metals contract in volume during freezing: steel 3–4%, cast iron 1–2.5%, aluminium 6.6%, copper 4.5%. This volumetric contraction must be fed by risers (liquid metal reservoirs) to avoid shrinkage porosity. Pattern makers add 'shrinkage allowance' to pattern dimensions to compensate for linear contraction during cooling." },
        { term: "Chvorinov's Rule", desc: "Solidification time t_s = B × (V/A)², where V = volume, A = surface area, B = mould constant. V/A ratio = 'modulus' of the casting. Risers must have higher modulus than the casting sections they feed, so they remain liquid longer and can feed shrinkage." },
        { term: "Progressive vs Directional Solidification", desc: "Progressive: solidification front moves uniformly from all surfaces inward — creates trapped liquid pockets (porosity). Directional: solidification progresses from the thinnest section toward the riser — each section feeds the next, with the riser solidifying last. Directional solidification is the design goal for sound castings." },
        { term: "Sand Casting Defects", desc: "Shrinkage porosity (volume contraction unfed), gas porosity (dissolved hydrogen/CO in molten metal), misrun (metal solidifies before filling mould), cold shut (two metal streams meet but don't fuse), inclusions (sand or slag particles), hot tears (solidification cracking)." }
      ],
      formulas: [
        { name: "Chvorinov's Rule", eq: "t_s = B × (V/SA)²", variables: { "t_s": "Solidification time (s)", "B": "Mould constant (~0.1–0.5 s/mm² for sand moulds)", "V": "Casting volume (mm³)", "SA": "Casting surface area (mm²)" } },
        { name: "Riser Sizing (Modulus Method)", eq: "M_riser = 1.2 × M_casting", variables: { "M = V/SA": "Modulus (mm). Riser must have 20% higher modulus" } },
        { name: "Pattern Shrinkage Allowance", eq: "L_pattern = L_casting × (1 + S)", variables: { "S": "Linear shrinkage: steel 2%, Al 1.7%, CI 1%, Cu 1.6%" } },
        { name: "Fluidity (approximate)", eq: "Fluidity ∝ (T_pour − T_liquidus) × k / (ρ × L_f)", variables: { "T_pour − T_liquidus": "Superheat (°C)", "L_f": "Latent heat of fusion (J/kg)" } }
      ],
      explanation: "When molten metal enters the mould, it loses heat through the mould walls and solidifies from the surface inward. The solid-liquid interface advances inward as a 'freezing front'. For pure metals and some alloys, this front is sharp. For alloys with wide freezing ranges (e.g. aluminium alloys), a 'mushy zone' of partially solid material exists — making feeding difficult and porosity more likely. The mould design must ensure every portion of the casting is fed by liquid metal throughout solidification. Chvorinov's rule quantifies which part solidifies first (lowest V/SA ratio) — those sections are farthest from the riser and most at risk. Risers must have the highest V/SA ratio in the gating system."
    },
    practicalRules: [
      "Riser modulus rule: <strong>M_riser ≥ 1.2 × M_casting_section_being_fed</strong>.",
      "Riser volume (approximate): <strong>V_riser ≥ shrinkage% × V_section_fed / riser_efficiency</strong>. Riser efficiency ≈ 14–60% (open vs blind, with exothermic sleeves).",
      "Minimum pouring temperature = liquidus + <strong>50–100°C superheat</strong> for adequate fluidity to fill thin sections.",
      "Gate velocity must be <strong>laminar (Re < 2000)</strong> to prevent air entrainment — use multiple small gates rather than one large gate.",
      "Draft angle on vertical pattern surfaces: <strong>1°–3°</strong> for green sand, <strong>0.5°–1°</strong> for shell moulding.",
      "Minimum section thickness castable: sand casting <strong>~3 mm</strong>, die casting <strong>~0.5 mm</strong>, investment casting <strong>~0.5 mm</strong>."
    ],
    workedExample: {
      problem: "A cylindrical steel casting is 120 mm diameter × 200 mm long. A cylindrical riser of diameter D and height H = D is to be placed on top. Using Chvorinov's rule with B = 0.3 s/mm², find: (a) solidification time of the casting, (b) required riser modulus, (c) minimum riser diameter.",
      given: ["Casting: cylinder D_c=120 mm, H_c=200 mm", "Riser: cylinder with H_r = D_r", "B = 0.3 s/mm²", "Riser modulus rule: M_riser = 1.2 × M_casting"],
      steps: [
        { text: "Calculate casting volume and surface area:", calc: "V_c = π/4 × 120² × 200 = π/4 × 14,400 × 200 = 2,261,947 mm³\nSA_c = 2 × π/4 × 120² + π × 120 × 200 = 22,619 + 75,398 = 98,017 mm²\n(Note: top face is open to riser — consider only 5 faces for simple estimate)" },
        { text: "Calculate casting modulus M_c = V/SA (using full surface area for conservative estimate):", calc: "M_c = V_c / SA_c = 2,261,947 / 98,017 = 23.1 mm" },
        { text: "Calculate casting solidification time:", calc: "t_s = B × M_c² = 0.3 × (23.1)² = 0.3 × 533.6 = 160 s ≈ 2.67 min" },
        { text: "Required riser modulus:", calc: "M_riser = 1.2 × M_c = 1.2 × 23.1 = 27.7 mm" },
        { text: "Riser with H_r = D_r: calculate modulus in terms of D_r.\nRiser V = π/4 × D_r² × D_r = πD_r³/4\nRiser SA (bottom resting on casting, sides + top exposed) = π/4 × D_r² + π × D_r × D_r = π/4 × D_r² + πD_r²\nSA_riser = π D_r²(1/4 + 1) = 1.25πD_r²\nM_riser = (πD_r³/4) / (1.25πD_r²) = D_r/(4×1.25) = D_r/5", calc: "Set M_riser = D_r/5 = 27.7 mm\nD_r = 5 × 27.7 = 138.5 mm → use 140 mm" }
      ],
      answer: "Casting solidification time ≈ 160 s (2.67 min). Required riser modulus = 27.7 mm. Minimum riser diameter = 140 mm (height = 140 mm). This is a substantial riser — often 30–50% of casting weight is in the riser system, which is later cut off and recycled."
    },
    commonMistakes: [
      { title: "Confusing shrinkage allowance with machining allowance", desc: "Shrinkage allowance compensates for thermal contraction during cooling (applied uniformly to all dimensions). Machining allowance is extra material added on surfaces to be machined, to ensure enough stock for machining to final dimension. Both are added to the casting dimension — they are separate additions with different purposes." },
      { title: "Assuming the largest section needs the biggest riser", desc: "The riser must feed the LAST section to solidify — which is determined by modulus (V/SA ratio), not absolute size. A thick flange at the end of a thin arm may solidify BEFORE the arm (lower modulus) — placing the riser on the flange does no good. Always map moduli throughout the casting to locate hot spots." },
      { title: "Placing the riser below the casting", desc: "Risers work by gravity — liquid metal must flow downward from riser into solidifying casting. A riser placed below or at the side of a shrinking cavity cannot feed it effectively. Risers must be above the section they feed (or use pressurised gating with exothermic sleeves for complex geometries)." }
    ],
    simulation: "casting",
    realWorldUses: [
      { title: "Automotive Engine Blocks", icon: "🚗", description: "Grey iron engine blocks are sand cast in automated moulding lines producing 300–600 castings per hour. Computer simulation (Magmasoft, ProCAST) predicts shrinkage porosity, hot tears, and cold shuts before making the first casting — saving months of physical tryout." },
      { title: "Single-Crystal Turbine Blades", icon: "✈️", description: "GE and Rolls-Royce cast turbine blades as single crystals using directional solidification in vacuum. A specially shaped mould and grain selector ensure a single crystal grain grows the length of the blade — eliminating grain boundary creep at 1050°C. Yield of usable blades is only 50–60% despite perfect process control." },
      { title: "Cast Iron Machine Tool Beds", icon: "🏭", description: "CNC machine tool beds are sand-cast from grey iron (mass 1,000–50,000 kg). Grey iron's graphite flakes provide excellent vibration damping (10× better than steel) and good wear resistance. The complex internal ribbing for stiffness is only achievable by casting." },
      { title: "Bronze Bell Casting", icon: "🔔", description: "Church bells are sand-cast in bronze (78% Cu, 22% Sn) using traditional loam moulding techniques unchanged for 500 years. The bell's acoustic properties (fundamental frequency and overtone structure) depend precisely on the wall thickness profile — cast to within 1–2 mm over a 1-tonne bell." }
    ],
    resources: [
      { label: "Casting Processes — MIT OCW Manufacturing", url: "https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/", type: "course" },
      { label: "NPTEL — Manufacturing Science I", url: "https://nptel.ac.in/courses/112105148", type: "course" },
      { label: "How Sand Casting Works (YouTube)", url: "https://www.youtube.com/watch?v=C4MOOY4MqgQ", type: "video" },
      { label: "Engineering Toolbox — Casting Design", url: "https://www.engineeringtoolbox.com/metal-casting-d_246.html", type: "article" }
    ]
  },

  {
    id: "welding", title: "Welding Processes & Metallurgy",
    category: "mfg", icon: "⚡",
    tags: ["manufacturing", "welding", "MIG", "TIG", "HAZ", "metallurgy", "carbon equivalent"],
    shortDesc: "Permanently joining metals through heat and fusion — the most critical joining process in structural, pressure vessel, and automotive manufacturing.",
    theory: {
      definition: "Welding is a material joining process that produces coalescence of materials by heating them to welding temperature, with or without application of pressure, and with or without the use of filler material. The weld joint, when properly designed and executed, should be at least as strong as the base material. Over 100 distinct welding processes exist, classified by energy source, shielding method, and whether filler is added.",
      keyConcepts: [
        { term: "Heat Affected Zone (HAZ)", desc: "The region of base metal adjacent to the fusion zone that experiences temperatures high enough to alter microstructure and properties, but does not melt. In low-carbon steels, the HAZ near the fusion line has grain-coarsened structure and potential martensite — harder but more brittle. In aluminium alloys, the HAZ is softer due to over-aging of precipitation-hardened microstructure. HAZ properties are largely controlled by heat input and preheat." },
        { term: "Weld Pool Solidification", desc: "The weld metal solidifies epitaxially — grains nucleate on the partially melted base metal grains and grow competitively toward the heat source (weld centreline). This creates a columnar grain structure with preferred crystallographic orientation. The centreline is the last to solidify and most prone to hot cracking (from low-melting-point segregants)." },
        { term: "Residual Stresses", desc: "Non-uniform heating and cooling creates residual stresses: the weld and HAZ are in tension (constrained contraction during cooling), the adjacent base metal in compression. Residual tensile stresses are additive to service loads — they reduce fatigue life and can cause stress corrosion cracking. Post-weld heat treatment (PWHT) relieves residual stresses." },
        { term: "Hydrogen Cracking (Cold Cracking)", desc: "The most dangerous welding defect in high-strength steels. Hydrogen from moisture in electrodes/flux diffuses into the HAZ martensite at low temperatures (<150°C). The combination of hydrogen + residual stress + susceptible microstructure causes delayed cracking — appearing hours after welding. Prevention: pre-heating, low-hydrogen electrodes, PWHT." }
      ],
      formulas: [
        { name: "Heat Input", eq: "Q = (η × V × I) / (v × 1000)", variables: { "Q": "Net heat input (kJ/mm)", "η": "Process efficiency (MIG=0.8, TIG=0.6, SAW=0.95)", "V": "Arc voltage (V)", "I": "Current (A)", "v": "Travel speed (mm/s)" } },
        { name: "Carbon Equivalent (IIW Formula)", eq: "CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15", variables: { "CE < 0.40": "Good weldability, no preheat", "CE 0.40–0.60": "Preheat 100–200°C needed", "CE > 0.60": "Preheat >200°C, PWHT required" } },
        { name: "Minimum Preheat Temperature (Seferian)", eq: "T_preheat = 350 × √(CE_S − 0.25) °C", variables: { "CE_S": "Carbon equivalent by Seferian formula for given plate thickness" } },
        { name: "Fillet Weld Throat", eq: "a = 0.707 × s (equal-leg fillet)", variables: { "a": "Theoretical throat (mm)", "s": "Leg length (mm)" } }
      ],
      explanation: "In GMAW (MIG welding), an electric arc between the continuously fed wire electrode and workpiece melts both, creating the weld pool. Shielding gas (Ar, CO₂, or mixtures) prevents atmospheric contamination. Heat input Q = ηVI/v determines the depth of fusion and HAZ size. Higher heat input → larger HAZ → more grain growth → lower toughness. Lower heat input → possible lack of fusion. The optimum is a narrow window for each material and joint geometry, defined by welding procedure specification (WPS). Carbon equivalent (CE) quantifies susceptibility to hydrogen cold cracking — the higher CE, the more hardenable the steel, the more susceptible to cracking. Preheat slows the cooling rate after welding, preventing martensite formation and allowing hydrogen to diffuse out before cracking initiates."
    },
    practicalRules: [
      "CE < 0.40: <strong>no preheat</strong> required for most structural steel welding.",
      "CE 0.40–0.60: preheat to <strong>100–200°C</strong> depending on thickness and restraint.",
      "CE > 0.60: preheat <strong>>200°C</strong> and PWHT mandatory — high-strength steels.",
      "Minimum fillet weld size (IS 816): <strong>s_min ≈ √(t_thicker plate)</strong> in mm — ensures adequate fusion and heat input.",
      "Throat stress formula: σ = P / (0.707 × s × L_weld) for fillet welds in shear.",
      "AWS D1.1 structural welding code requires fillet weld leg size ≥ <strong>3 mm</strong> (minimum practical) and ≤ <strong>t − 1.6 mm</strong> for plate edges."
    ],
    workedExample: {
      problem: "A MIG weld is made on 20mm thick S355 structural steel (C=0.18%, Mn=1.5%, Cr=0%, Mo=0%, V=0%, Ni=0%, Cu=0%). Welding parameters: V=28V, I=250A, travel speed=6mm/s, MIG efficiency η=0.8. Find: (a) carbon equivalent, (b) minimum preheat requirement, (c) heat input.",
      given: ["Steel: C=0.18, Mn=1.5, all others=0%", "V=28V, I=250A, v=6mm/s", "η=0.8 (MIG)", "Plate thickness: 20mm"],
      steps: [
        { text: "Calculate Carbon Equivalent (IIW):", calc: "CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15\nCE = 0.18 + 1.5/6 + 0 + 0\nCE = 0.18 + 0.25 = 0.43" },
        { text: "Determine preheat requirement from CE:", calc: "CE = 0.43 → Range 0.40–0.60\nRecommendation: Preheat to 100–150°C (depends on plate thickness)\nFor 20mm plate with CE=0.43: AWS D1.1 Table recommends T_preheat = 65°C minimum" },
        { text: "Calculate net heat input:", calc: "Q = (η × V × I) / (v × 1000)\nQ = (0.8 × 28 × 250) / (6 × 1000)\nQ = 5,600 / 6,000 = 0.933 kJ/mm" },
        { text: "Assess heat input level:", calc: "Q = 0.933 kJ/mm\nTypical range for 20mm structural steel MIG: 0.8–2.5 kJ/mm\nThis is a LOW heat input — good for toughness but watch for lack of fusion on root passes." }
      ],
      answer: "CE = 0.43 (moderate — preheat to 100°C recommended for 20mm plate). Heat input Q = 0.933 kJ/mm (low-medium — suitable for structural steel, adequate HAZ toughness). The weld is feasible with standard MIG procedure and 100°C preheat."
    },
    commonMistakes: [
      { title: "HAZ is NOT always weaker than base metal", desc: "In low-carbon structural steels, the HAZ near the fusion line is HARDER (not weaker) due to martensite formation — but it is more brittle. Only in precipitation-hardened aluminium alloys (6xxx, 7xxx series) and some stainless steels is the HAZ genuinely weaker in yield strength." },
      { title: "Confusing process efficiency η with deposition efficiency", desc: "Process efficiency (η = 0.6–0.95) describes how much electrical arc energy enters the weld. Deposition efficiency (mass of weld metal deposited / mass of electrode consumed) is a separate measure. SMAW (stick) has η ≈ 0.75 AND deposition efficiency ≈ 65% (flux and spatter losses). Both affect weld economics." },
      { title: "Using CE alone without considering plate thickness", desc: "A steel with CE=0.42 might need no preheat in a 10mm tee-fillet joint but require 100°C preheat in a 50mm butt weld (higher restraint, slower hydrogen diffusion, larger HAZ). Always consider CE + thickness + joint restraint together — as tabulated in welding codes (AWS D1.1, EN 1011, IS 9595)." }
    ],
    simulation: "welding",
    realWorldUses: [
      { title: "Structural Steel Buildings (IS 800)", icon: "🏗️", description: "IS 800 governs structural steel welding in India. Weld procedure qualification (WPQ) tests — including Charpy impact tests on HAZ at −20°C — must be passed before any structural weld is made. Fillet weld sizes are calculated from shear flow, not intuition." },
      { title: "Submarine Pressure Hull Welding", icon: "🚢", description: "Nuclear submarine hulls use HY-80/HY-100 high-strength steel (CE > 0.8). Every weld requires 200°C preheat, inter-pass temperature control, and full post-weld stress relief at 580°C. All welds are radiographed AND ultrasonically tested — zero defect tolerance." },
      { title: "Automotive Body-in-White (BIW)", icon: "🚗", description: "A modern car body uses 4000+ resistance spot welds (3–4 ms per weld, automated), MIG seam welds at B-pillars and sill boxes, laser welding (0.3mm precision at roof joints), and adhesive bonding — all within 90-second body assembly cycle time." },
      { title: "Oil & Gas Pipeline Welding (API 1104)", icon: "🛢️", description: "Cross-country pipeline welding uses automated GMAW orbital welding systems (5 passes in 4 minutes per girth weld). API 1104 qualification requires destructive testing of 10 qualification welds before production begins. Every production weld is ultrasonically tested automatically as the welding machine advances." }
    ],
    resources: [
      { label: "Welding Metallurgy Fundamentals — NPTEL", url: "https://nptel.ac.in/courses/112105200", type: "course" },
      { label: "MIT OCW — Manufacturing Processes", url: "https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/", type: "course" },
      { label: "Welding Processes Overview (YouTube)", url: "https://www.youtube.com/watch?v=r4MKaOQ3Pv8", type: "video" },
      { label: "Engineering Toolbox — Welding Design", url: "https://www.engineeringtoolbox.com/welding-d_429.html", type: "article" }
    ]
  },

  {
    id: "injection-moulding", title: "Injection Moulding",
    category: "mfg", icon: "🧴",
    tags: ["manufacturing", "plastics", "injection moulding", "clamping force", "cycle time", "polymer"],
    shortDesc: "The world's most used plastics manufacturing process — producing billions of parts annually from phone cases to car bumpers.",
    theory: {
      definition: "Injection moulding is a manufacturing process for producing plastic parts by injecting molten polymer into a mould cavity, allowing it to cool and solidify, then ejecting the finished part. It is the dominant production method for thermoplastic parts in medium-to-high volumes. A single mould cycle can produce a finished part in 5–60 seconds with consistent quality and dimensional accuracy.",
      keyConcepts: [
        { term: "Process Stages", desc: "Four stages per cycle: (1) Clamping — mould closes under high force. (2) Injection — screw pushes molten plastic into cavity at high pressure. (3) Cooling — plastic solidifies; new shot is being plasticised. (4) Ejection — mould opens, part is ejected. Cycle time is dominated by cooling (60–80% of cycle)." },
        { term: "Clamping Force", desc: "Fc = Pi × Aprojected (injection pressure × projected area of part + runner in the parting plane). Insufficient clamping → flashing (thin plastic film at parting line). Machine tonnage rated in kN or tonnes — from 25 kN (micro machines) to 100,000 kN (large automotive machines)." },
        { term: "Cooling Time", desc: "tc ≈ (s²/π²α) × ln[(4/π) × (Ti−Tm)/(Te−Tm)]. Dominated by wall thickness s squared — doubling wall thickness quadruples cooling time. Cooling channels in the mould carry chilled water (10–15°C) to extract heat rapidly." },
        { term: "Shrinkage & Warpage", desc: "All plastics shrink during cooling: PP 1.5–2.5%, ABS 0.4–0.7%, nylon 1.5–2.5%, HDPE 2–5%. Non-uniform cooling or wall thickness causes warpage (differential shrinkage). Mould dimensions are made larger to compensate. Gate location affects shrinkage anisotropy." }
      ],
      formulas: [
        { name: "Clamping Force", eq: "Fc = Pi × Ap", variables: { "Fc": "Required clamping force (kN or tonnes)", "Pi": "Injection pressure (MPa) — typically 30–140 MPa", "Ap": "Projected area of part + runners in parting plane (m²)" } },
        { name: "Cooling Time (simplified)", eq: "tc = s² / (π²α) × ln[4(Ti−Tm) / π(Te−Tm)]", variables: { "s": "Wall thickness (m)", "α": "Thermal diffusivity of plastic (m²/s)", "Ti": "Melt temperature (°C)", "Tm": "Mould temperature (°C)", "Te": "Ejection temperature (°C)" } },
        { name: "Cycle Time", eq: "t_cycle = t_inject + t_cool + t_open/close + t_eject", variables: { "Typical": "10–60 s depending on part size and material" } },
        { name: "Shot Volume", eq: "V_shot = Ap × avg_thickness × n_cavities", variables: { "n_cavities": "Number of cavities in the mould" } }
      ],
      explanation: "The injection unit reciprocating screw both plasticises (melts) the polymer and injects it. As the screw rotates, material is fed from the hopper, melted by shear heat and barrel heaters, and accumulated ahead of the screw tip (shot building). During injection, the screw advances axially like a plunger, forcing melt into the mould. Pack pressure is maintained after mould fill to compensate for shrinkage as the part cools. Gate freezes off (solidifies) when pack pressure can no longer feed material — gate freeze time is critical: too early → sink marks; too late → residual stress and warpage. After gate freeze, screw retracts to build the next shot while the current part cools."
    },
    practicalRules: [
      "Design rule: <strong>uniform wall thickness</strong> wherever possible — thickness variations cause differential cooling → warpage and sink marks.",
      "Minimum draft angle: <strong>1°–3°</strong> on vertical surfaces for easy ejection. Textured surfaces need 3°–5°.",
      "Typical injection pressure: <strong>70–140 MPa</strong> for most thermoplastics. Thin-wall moulding up to 200 MPa.",
      "Gate location should be at <strong>thickest section</strong> and as central as possible to ensure even fill and pack.",
      "Cooling channels: typically 8–12 mm dia, placed as close to cavity as structurally possible — closer channels mean faster, more uniform cooling.",
      "Rule of thumb for clamping force: <strong>2–5 tonnes per cm² of projected area</strong> for unfilled polymers, up to 8 tonnes/cm² for glass-filled grades."
    ],
    workedExample: {
      problem: "An ABS plastic part has a projected area of 150 cm² (including runners). Injection pressure = 80 MPa. Wall thickness = 3 mm, melt temp Ti = 240°C, mould temp Tm = 50°C, ejection temp Te = 85°C, thermal diffusivity α = 1.0×10⁻⁷ m²/s. Injection time = 3 s, open/close + eject time = 5 s. Find: (a) clamping force, (b) cooling time, (c) cycle time.",
      given: ["Ap = 150 cm² = 0.015 m²", "Pi = 80 MPa = 80×10⁶ Pa", "s = 3 mm = 0.003 m", "Ti=240°C, Tm=50°C, Te=85°C", "α = 1.0×10⁻⁷ m²/s"],
      steps: [
        { text: "Clamping force:", calc: "Fc = Pi × Ap = 80×10⁶ × 0.015 = 1,200,000 N = 1200 kN ≈ 122 tonnes\n→ Select a 150-tonne machine (safety margin)" },
        { text: "Cooling time:", calc: "tc = s²/(π²α) × ln[4(Ti−Tm)/(π(Te−Tm))]\n= (0.003)²/(9.87×1.0×10⁻⁷) × ln[4×190/(π×35)]\n= 9×10⁻⁶/9.87×10⁻⁷ × ln[760/109.9]\n= 9.12 × ln(6.915)\n= 9.12 × 1.934 = 17.6 s" },
        { text: "Cycle time:", calc: "t_cycle = t_inject + t_cool + t_open/eject = 3 + 17.6 + 5 = 25.6 s ≈ 26 s" },
        { text: "Production rate:", calc: "Parts/hour = 3600/26 = 138 parts/hour (single-cavity mould)\n4-cavity mould: 138 × 4 = 552 parts/hour" }
      ],
      answer: "Clamping force = 1200 kN (122 tonnes — use 150-tonne machine). Cooling time = 17.6 s (69% of cycle time — confirming cooling dominates). Cycle time ≈ 26 s. Production: 138 parts/hour single-cavity, 552/hour with 4-cavity mould."
    },
    commonMistakes: [
      { title: "Designing thick walls to make parts stronger", desc: "In injection moulding, thick walls increase cooling time (∝ s²), create sink marks, void formation, and warpage — NOT more strength. Design for uniform thickness using ribs instead. A 3mm-thick part with ribs is stiffer and faster to mould than a solid 6mm wall." },
      { title: "Ignoring shrinkage in mould dimensions", desc: "A part designed to final dimension 100 mm in PP (shrinkage 2%) requires the mould cavity to be 102 mm. Ignoring shrinkage leads to parts that are systematically undersized. Shrinkage varies with gate location, fill direction, packing pressure, and mould temperature." },
      { title: "Placing the gate at the thinnest section", desc: "Melt flows from the gate and solidifies progressively. If the gate is at the thinnest section, the melt solidifies at the gate before filling the rest of the cavity. Gate must be at the thickest section, with flow toward progressively thinner sections." }
    ],
    simulation: "injection-moulding",
    realWorldUses: [
      { title: "Consumer Electronics Housings", icon: "📱", description: "Smartphone back covers, laptop shells, and keyboard keys are all injection moulded. ABS or PC/ABS blend with Class A surface finish direct from the mould — no painting required. Tolerances of ±0.1 mm achievable on 150 mm parts with proper mould control." },
      { title: "Automotive Interior Trim", icon: "🚗", description: "A modern car has 200+ injection moulded interior parts: dashboard, door panels, centre console, bumper fascias. Polypropylene with talc or glass fibre fill. Large automotive moulds (bumper fascia): clamping force 5000–10,000 tonnes, mould weight up to 30 tonnes." },
      { title: "Medical Disposables", icon: "🏥", description: "Syringes, blood collection tubes, IV connectors, and surgical instrument handles are injection moulded in medical-grade polypropylene or polyethylene. ISO 13485 quality system required; production in class 100,000 cleanrooms to prevent particulate contamination." },
      { title: "LEGO Bricks", icon: "🧱", description: "LEGO produces ~400 million bricks per day using injection moulding in ABS. Dimensional tolerance: ±0.002 mm (tighter than most machined parts). Stud-to-tube coupling force is controlled to within 0.5 N — precisely engineered through mould temperature, pack pressure, and wall thickness." }
    ],
    resources: [
      { label: "Injection Moulding Process (YouTube)", url: "https://www.youtube.com/watch?v=RMjtmsr3CqA", type: "video" },
      { label: "MIT OCW — Manufacturing Processes", url: "https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/", type: "course" },
      { label: "NPTEL — Polymer Processing", url: "https://nptel.ac.in/courses/112104005", type: "course" },
      { label: "Engineering Toolbox — Plastics Moulding", url: "https://www.engineeringtoolbox.com/injection-moulding-d_1372.html", type: "article" }
    ]
  },

  {
    id: "sheet-metal", title: "Sheet Metal Forming",
    category: "mfg", icon: "⬜",
    tags: ["manufacturing", "sheet metal", "blanking", "bending", "deep drawing", "springback", "forming"],
    shortDesc: "Shaping flat metal sheets into complex 3D parts — the process behind car bodies, aircraft skins, and enclosures.",
    theory: {
      definition: "Sheet metal forming encompasses a family of processes — blanking, bending, deep drawing, stretching, and roll forming — that shape flat sheet stock into structural and functional parts without removing material. Sheet metal is the dominant manufacturing form for enclosures, structural panels, and hollow bodies, where high strength-to-weight ratio and low cost per part are critical. Material: typically 0.5–6 mm thickness mild steel, aluminium, or stainless steel.",
      keyConcepts: [
        { term: "Blanking & Punching", desc: "A punch forces through sheet material into a die, shearing out a shape. Blanking: the punched-out piece is the product. Punching: the punched-out piece is scrap (hole created). Clearance between punch and die (5–15% of thickness per side) controls shear zone quality. Too little clearance → burrs. Too much → excessive rollover and distortion." },
        { term: "Bending & Springback", desc: "Material is bent over a punch radius. The outer fibres are in tension, inner fibres in compression. On removal of bending force, elastic recovery causes springback — the bend angle opens slightly. Springback depends on material yield strength and bend radius. Overbending by the springback angle (typically 1°–10°) compensates for this." },
        { term: "Deep Drawing", desc: "A flat blank is drawn into a cup shape by a punch forcing it through a die, while a blank holder maintains controlled pressure to prevent wrinkling. Draw ratio DR = D_blank/D_punch. Limiting Draw Ratio (LDR) is the maximum DR before tearing: ~2.0–2.3 for steel, ~1.8–2.1 for aluminium." },
        { term: "Forming Limit Diagram (FLD)", desc: "A plot of major strain vs minor strain showing the boundary between safe forming and failure (necking/tearing). Material above the FLD tears; below is safe. Different failure modes (biaxial stretch, plane strain, drawing) appear in different regions. FLDs are material-specific and must be determined experimentally." }
      ],
      formulas: [
        { name: "Blanking Force", eq: "Fb = t × L × UTS", variables: { "Fb": "Blanking force (N)", "t": "Sheet thickness (mm or m)", "L": "Perimeter of blank (mm or m)", "UTS": "Ultimate tensile strength (MPa)" } },
        { name: "Bending Force (V-die)", eq: "Fb = (k × t² × L × UTS) / W", variables: { "k": "Die opening factor (1.2–1.33)", "L": "Length of bend (mm)", "W": "Die opening width (mm)" } },
        { name: "Bend Allowance", eq: "BA = (R + K_t × t) × θ", variables: { "R": "Inside bend radius (mm)", "K_t": "K-factor (0.3–0.5, depends on material and process)", "θ": "Bend angle (radians)", "t": "Sheet thickness (mm)" } },
        { name: "Springback Ratio", eq: "Ri/Rf = 3(Ri/t)(Yf/E) − 4(Ri/t)(Yf/E)³ + 1", variables: { "Ri": "Initial bend radius", "Rf": "Final (springback) radius", "Yf": "Yield strength (MPa)", "E": "Young's modulus (GPa)" } }
      ],
      explanation: "In bending, the neutral axis (no strain) shifts inward from the centreline as plastic deformation occurs — hence the K-factor (0.5 = centred neutral axis, 0.3–0.4 for tighter bends). Bend allowance gives the flat length of material that becomes the bend — critical for accurate blank development. In deep drawing, the blank holder force must be carefully controlled: too low → wrinkling in the flange; too high → tearing at the punch nose. Multiple drawing passes (with intermediate annealing to restore ductility) are needed for deep cups. Stamping presses in the automotive industry operate at 20–60 strokes per minute, producing one body panel per stroke."
    },
    practicalRules: [
      "Minimum bend radius: <strong>1× to 4× material thickness</strong> depending on material and direction (across or with grain). Below minimum → cracking on outer surface.",
      "Blanking clearance: <strong>5–10% of thickness per side</strong> for clean shear zone. Too tight → punch wear. Too loose → excessive burrs and rollover.",
      "Springback: high-strength steel (DP980): springback angle <strong>10°–25°</strong>. Mild steel: <strong>2°–5°</strong>. Aluminium: <strong>3°–8°</strong>. Must be measured and overbend-compensated.",
      "Deep draw minimum thickness: maintain <strong>t_min ≥ 0.75 × t_initial</strong> in the wall to avoid thinning failure.",
      "K-factor for press brake bending of 2mm mild steel: <strong>K ≈ 0.42</strong>. Aluminium: <strong>K ≈ 0.38</strong>.",
      "Press force for automotive body panels: <strong>2,000–10,000 tonnes</strong>. Blanking force is higher than drawing force — transfer dies combine both in one press stroke."
    ],
    workedExample: {
      problem: "A 2 mm thick mild steel sheet (UTS = 400 MPa) is to be blanked to produce a circular disc of diameter 100 mm. Then this disc is bent to 90° using a V-die (W = 30 mm, L = 60 mm, k = 1.25). Inside bend radius R = 4 mm, K-factor = 0.42. Find: (a) blanking force, (b) bending force, (c) bend allowance.",
      given: ["t = 2 mm", "UTS = 400 MPa", "D_blank = 100 mm", "R = 4 mm, K = 0.42, θ = 90° = π/2 rad", "W = 30 mm, L = 60 mm, k = 1.25"],
      steps: [
        { text: "Blanking force:", calc: "L_perimeter = π × D = π × 100 = 314.2 mm\nFb = t × L × UTS = 2 × 314.2 × 400 = 251,327 N = 251 kN ≈ 25.6 tonnes" },
        { text: "Bending force (V-die):", calc: "Fb_bend = k × t² × L × UTS / W\n= 1.25 × 4 × 60 × 400 / 30\n= 1.25 × 96,000 / 30 = 4,000 N = 4 kN" },
        { text: "Bend allowance:", calc: "BA = (R + K × t) × θ\n= (4 + 0.42 × 2) × π/2\n= (4 + 0.84) × 1.5708\n= 4.84 × 1.5708 = 7.60 mm" },
        { text: "Flat blank length for the bend:", calc: "Total flat length = Leg₁ + BA + Leg₂\nIf each formed leg = 50 mm from bend centre:\nFlat length = 50 + 7.60 + 50 = 107.6 mm\n(Without BA, blank would be 100 mm — 7.6 mm too short)" }
      ],
      answer: "Blanking force = 251 kN (25.6 tonnes) — requires a 30+ tonne press. Bending force = 4 kN (small — bending is much lower force than blanking). Bend allowance = 7.60 mm — the flat blank must be 107.6 mm long to produce two 50 mm legs after bending to 90°."
    },
    commonMistakes: [
      { title: "Ignoring springback in bend angle specification", desc: "Specify the FINAL angle required on the drawing — not the tooling angle. Tooling angle = final angle minus springback. A 90° bend in high-strength steel may require a 75°–80° die. If you do not measure springback and compensate, all parts will be out of tolerance." },
      { title: "Forgetting to calculate flat blank length using bend allowance", desc: "If bend allowance is ignored, the blank is cut to finished dimensions — resulting in parts that are too short after bending. Bend allowance (the extra flat length that becomes the curved bend) must always be added. BA varies with bend radius, K-factor, and bend angle." },
      { title: "Applying the same blanking force formula to punching clearance", desc: "Blanking force Fb = t×L×UTS calculates the force to shear through the material. The punch-die clearance (5–10% of t per side) affects shear quality and tool life — but not the maximum force required. Clearance must be selected separately from force calculation." }
    ],
    simulation: "sheet-metal",
    realWorldUses: [
      { title: "Automotive Body Panels", icon: "🚗", description: "A modern car body has ~400 stamped sheet metal parts: roof, bonnet, doors, wings, floor pan. High-strength and ultra-high-strength steels (DP980, TRIP, press-hardened 22MnB5 at 1500 MPa) are stamped in large progressive dies or transfer presses running at 15–20 strokes/minute." },
      { title: "Aircraft Skin Panels", icon: "✈️", description: "Aluminium 2024-T3 and 7075-T6 aircraft skin panels are stretch-formed over contoured dies (not stamped — too brittle). Large CNC stretch-forming machines pull sheet over shaped mandrels while applying tension — eliminating springback for complex compound curvatures." },
      { title: "Consumer Electronics Enclosures", icon: "💻", description: "MacBook unibody enclosures are CNC machined from extruded aluminium billet (not stamped), but iPhone frames use deep-drawn aluminium. Most electronics enclosures use progressive die stamping of 0.5–1.5 mm aluminium or zinc-coated steel at rates of 200–400 parts/minute." },
      { title: "HVAC Ductwork", icon: "🌬️", description: "Rectangular and circular sheet metal ducts are produced by roll forming flat coil stock into spiral-wound or lock-seam tubes. Gauge: 0.5–1.5 mm galvanised steel. Seam locking requires bend radii <0.5× thickness — only achievable in cold-rolled soft steel with sharp tooling." }
    ],
    resources: [
      { label: "Sheet Metal Forming — MIT OCW Manufacturing", url: "https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/", type: "course" },
      { label: "NPTEL — Manufacturing Science (Forming)", url: "https://nptel.ac.in/courses/112105148", type: "course" },
      { label: "Sheet Metal Basics (YouTube)", url: "https://www.youtube.com/watch?v=mQyWMxqJ72Y", type: "video" },
      { label: "Engineering Toolbox — Sheet Metal Bending", url: "https://www.engineeringtoolbox.com/bending-sheet-metal-d_1723.html", type: "article" }
    ]
  },

  {
    id: "cnc-machining", title: "CNC Machining & G-Code",
    category: "mfg", icon: "🤖",
    tags: ["manufacturing", "cnc", "machining", "g-code", "automation", "milling"],
    shortDesc: "Computer Numerical Control (CNC) translates digital CAD models into precise physical parts using automated machine tools.",
    theory: {
      definition: "CNC (Computer Numerical Control) machining is a subtractive manufacturing process where pre-programmed computer software dictates the movement of factory tools and machinery. The process can control complex machinery, from grinders and lathes to mills and routers, performing three-dimensional cutting tasks in a single set of prompts. The universal language of CNC is G-code, which tells the machine exactly where to move, how fast to move, and what path to follow.",
      keyConcepts: [
        { term: "G-Code & M-Code", desc: "G-codes (Geometry codes) command the motion of the tool (e.g., G00 for rapid positioning, G01 for linear interpolation/cutting). M-codes (Machine codes) control hardware functions like turning the spindle on/off (M03/M05) or turning coolant on/off (M08/M09)." },
        { term: "Coordinate Systems", desc: "Machines operate on a Cartesian coordinate system (X, Y, Z). The Machine Coordinate System (MCS) is fixed to the machine. The Work Coordinate System (WCS, usually G54) is set by the operator relative to the raw stock material, so the program knows where the part is." },
        { term: "Axes of Motion", desc: "A basic mill has 3 axes (X, Y, Z). A 5-axis mill adds two rotational axes (A, B, or C) allowing the tool to approach the part from any angle, enabling complex aerospace and medical geometries in a single setup." },
        { term: "CAM Software", desc: "Computer-Aided Manufacturing (CAM) software takes a 3D CAD model and generates the complex G-code toolpaths automatically, optimizing for tool wear, cutting time, and surface finish." }
      ],
      formulas: [
        { name: "Spindle Speed (RPM)", eq: "N = (V_c × 1000) / (π × D)", variables: { "V_c": "Cutting speed (m/min) - material property", "D": "Tool diameter (mm)" } },
        { name: "Feed Rate", eq: "F = N × f_z × z", variables: { "F": "Table feed rate (mm/min)", "f_z": "Feed per tooth (mm/tooth)", "z": "Number of flutes/teeth on the cutter" } },
        { name: "Machining Time", eq: "T_m = L / F", variables: { "L": "Length of cut (mm)", "F": "Feed rate (mm/min)" } },
        { name: "Material Removal Rate (MRR)", eq: "MRR = a_p × a_e × F", variables: { "a_p": "Axial depth of cut (mm)", "a_e": "Radial depth of cut / stepover (mm)" } }
      ],
      explanation: "A typical CNC workflow: 1. Design the part in CAD. 2. Import into CAM and define the stock material, tools, and machining strategies (e.g., roughing, finishing). 3. Post-process the CAM operations into G-code specific to the machine's controller (e.g., Haas, Fanuc). 4. Load the raw stock into the machine, probe the edges to set the G54 Work Zero, measure tool lengths, and run the program. The machine will faithfully execute the G-code to micron-level precision."
    },
    practicalRules: [
      "Always verify the program with a dry run or CAM simulation before cutting metal to avoid catastrophic machine crashes.",
      "Climb milling (cutting down into the material) is preferred in CNC for better surface finish and tool life, whereas conventional milling is used on manual machines to avoid backlash.",
      "Rigidity is everything. If the workpiece, fixture, or tool vibrates (chatter), the surface finish will be ruined and the tool will chip. Use the shortest, thickest tool possible.",
      "Clearance planes (G98/G99) must be set safely above all clamps and fixtures before the machine makes rapid (G00) traverses between cutting operations."
    ],
    workedExample: {
      problem: "You are milling a slot in an aluminum block using a 10 mm diameter, 4-flute end mill. The recommended cutting speed (Vc) for aluminum is 150 m/min, and the feed per tooth (fz) is 0.05 mm/tooth. Determine the Spindle Speed (N) and the Table Feed Rate (F).",
      given: ["D = 10 mm", "z = 4 flutes", "V_c = 150 m/min", "f_z = 0.05 mm/tooth"],
      steps: [
        { text: "Calculate Spindle Speed (N):", calc: "N = (V_c × 1000) / (π × D)\n= (150 × 1000) / (3.1416 × 10)\n= 150000 / 31.416\n= 4774.6 RPM" },
        { text: "Select practical RPM:", calc: "Usually rounded to the nearest standard value, e.g., N = 4800 RPM." },
        { text: "Calculate Table Feed Rate (F):", calc: "F = N × f_z × z\n= 4800 × 0.05 × 4\n= 4800 × 0.20\n= 960 mm/min" },
        { text: "Write G-code snippet:", calc: "S4800 M03 (Spindle On CW at 4800 RPM)\nG01 X100.0 F960.0 (Linear feed to X100 at 960 mm/min)" }
      ],
      answer: "The machine should be programmed to run at 4800 RPM with a feed rate of 960 mm/min."
    },
    commonMistakes: [
      { title: "G00 vs G01 Crash", desc: "G00 tells the machine to move as fast as possible to a point, completely ignoring feed rates. If G00 is used while the tool is inside the material, it will snap the tool and severely damage the spindle. Always use G01 (Feed) when cutting." },
      { title: "Incorrect Tool Length Offsets", desc: "The machine only knows where the spindle face is. You must measure and input the length of every tool (Tool Length Offset, G43 H-code). If a tool is measured incorrectly, the machine will plunge it into the table." }
    ],
    simulation: "cnc-machining",
    realWorldUses: [
      { title: "Aerospace Components", icon: "🚀", description: "Aircraft jet engine impellers (blisks) are milled from solid titanium or Inconel forgings on massive 5-axis CNC machines to achieve the complex 3D aerodynamic blade shapes without welding." },
      { title: "Medical Implants", icon: "🦴", description: "Titanium knee and hip joint replacements are CNC machined to match patient-specific MRI data, requiring tight tolerances and mirror-like surface finishes." },
      { title: "Mold Making", icon: "🔧", description: "The steel molds used for injection molding plastics (like Lego bricks or car bumpers) are entirely cut using precision CNC milling and Electrical Discharge Machining (EDM)." }
    ],
    resources: [
      { label: "Basics of CNC Machining — Haas Automation", url: "https://www.youtube.com/watch?v=1rI2Y82vjJ8", type: "video" },
      { label: "G-Code Tutorial", url: "https://www.cnccookbook.com/g-code-tutorial/", type: "article" }
    ]
  }

);
