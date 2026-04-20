// db/som.js — Strength of Materials (5 concepts, deep content)

MECHVIZ_DB.concepts.push(

  {
    id: "beam-deflection", title: "Beam Deflection",
    category: "som", icon: "🔩",
    tags: ["bending", "SOM", "structures", "deflection"],
    shortDesc: "How beams bend under applied loads — the foundation of structural engineering.",
    theory: {
      definition: "Beam deflection is the transverse displacement of a point on a beam's neutral axis from its original unloaded position under applied loading. It arises from internal bending moments that create a curvature of the beam. Deflection is a serviceability limit — structures rarely fail by excess deflection alone, but deflection beyond permitted limits causes cracking of finishes, misalignment of machinery, occupant discomfort, and loss of structural integrity in connected elements.",
      keyConcepts: [
        { term: "Second Moment of Area (I)", desc: "Geometric measure of a cross-section's resistance to bending. I = ∫y² dA. Larger I = stiffer beam. This is why I-beams concentrate material far from the neutral axis — maximising I while minimising area (weight)." },
        { term: "Flexural Rigidity (EI)", desc: "The product of Young's modulus and second moment of area. It is the combined material-geometry stiffness parameter that appears in all deflection formulae. Higher EI = less deflection for the same loading." },
        { term: "Neutral Axis", desc: "The longitudinal axis within a cross-section where bending stress is identically zero. Above it: compression. Below it: tension (for downward loads on a simply supported beam). Its location depends on cross-section shape, not material." },
        { term: "Elastic Curve (Deflection Line)", desc: "The deflected shape of the beam's neutral axis. Governed by the differential equation EI·d²v/dx² = M(x). Integrating twice (with boundary conditions) gives the deflection equation v(x)." }
      ],
      formulas: [
        { name: "Simply Supported — Central Point Load", eq: "δ_max = WL³ / 48EI", variables: { "W": "Load (N)", "L": "Span (m)", "E": "Young's modulus (Pa)", "I": "Second moment of area (m⁴)" } },
        { name: "Simply Supported — UDL", eq: "δ_max = 5wL⁴ / 384EI", variables: { "w": "UDL intensity (N/m)" } },
        { name: "Cantilever — Free End Point Load", eq: "δ_max = WL³ / 3EI", variables: { "L": "Cantilever length from fixed support (m)" } },
        { name: "Bending Stress at Any Fibre", eq: "σ = M·y / I", variables: { "M": "Bending moment at section (N·m)", "y": "Distance from neutral axis (m)" } }
      ],
      explanation: "The differential equation of the elastic curve (EI·d²v/dx²= M) shows that curvature at any point equals the local bending moment divided by the flexural rigidity. Integrating once gives slope, integrating again gives deflection — with boundary conditions (zero deflection at supports, zero slope at fixed ends) fixing the integration constants. Doubling the load doubles the deflection (linear). Doubling the length multiplies deflection by 8 (cubic relationship — span is the most powerful lever). Doubling E or I halves deflection. This is why slender, long beams deflect dramatically and are the critical cases in design."
    },
    practicalRules: [
      "Deflection limit for building floors: <strong>L/360</strong> of span (prevents cracking of brittle finishes).",
      "Deflection limit for roof beams: <strong>L/200</strong> of span.",
      "Deflection limit for bridge girders: <strong>L/800</strong> to <strong>L/1000</strong> under live load.",
      "For equal loads, doubling span increases deflection by <strong>8×</strong> — always prioritise span reduction.",
      "An I-section has roughly <strong>6–7× higher I</strong> than a solid rectangle of the same cross-sectional area.",
      "Standard steel E = 200 GPa; aluminium E = 70 GPa — steel is <strong>2.86× stiffer</strong> for same geometry."
    ],
    workedExample: {
      problem: "A simply supported steel I-beam of span 6 m carries a central point load of 50 kN. The cross-section has I = 2.87 × 10⁻⁵ m⁴ (e.g. 254×102 UB 28 kg/m). Find the maximum deflection and maximum bending stress (y = 127 mm to outer fibre). E_steel = 200 GPa.",
      given: ["W = 50,000 N", "L = 6 m", "E = 200 × 10⁹ Pa", "I = 2.87 × 10⁻⁵ m⁴", "y = 0.127 m"],
      steps: [
        { text: "Apply the simply supported central load deflection formula:", calc: "δ_max = WL³ / 48EI = (50000 × 6³) / (48 × 200×10⁹ × 2.87×10⁻⁵)" },
        { text: "Calculate numerator and denominator separately:", calc: "Numerator: 50000 × 216 = 10,800,000 N·m³\nDenominator: 48 × 200×10⁹ × 2.87×10⁻⁵ = 275,520,000 N·m²" },
        { text: "Compute maximum deflection:", calc: "δ_max = 10,800,000 / 275,520,000 = 0.0392 m = 39.2 mm" },
        { text: "Check against limit (L/360 = 6000/360 = 16.7 mm). The beam exceeds the limit — a deeper section is needed. Now find bending stress at midspan (M_max = WL/4):", calc: "M_max = 50000 × 6 / 4 = 75,000 N·m" },
        { text: "Apply bending stress formula σ = My/I:", calc: "σ = 75000 × 0.127 / 2.87×10⁻⁵ = 9525 / 0.0000287 = 331.8 MPa" },
        { text: "Compare with yield strength. For S275 steel σ_y = 275 MPa. The beam also YIELDS — both deflection and strength are exceeded. A heavier section must be selected.", calc: "σ_actual (331.8 MPa) > σ_yield (275 MPa) → Section FAILS in bending" }
      ],
      answer: "δ_max = 39.2 mm (exceeds L/360 = 16.7 mm limit) and σ_max = 331.8 MPa (exceeds S275 yield strength of 275 MPa). A heavier I-section or reduced span is required."
    },
    commonMistakes: [
      { title: "Using total load W vs UDL intensity w", desc: "The UDL formula uses w (N/m intensity), NOT the total load. If total load W = 60 kN over 6 m, then w = 10 kN/m. Using W=60000 in the UDL formula gives a result 6× too large." },
      { title: "Forgetting span is cubed (not squared)", desc: "Students often write L² instead of L³. The cubic dependency on span is what makes long beams so deflection-critical. A 6 m span deflects 8× more than a 3 m span under the same load — not 4×." },
      { title: "Confusing I (second moment of area) with J (polar moment)", desc: "I is used for bending (deflection, bending stress). J = 2I (for circular sections) is used for torsion. Using J in beam deflection formulae gives a result exactly 2× wrong for circular cross-sections." },
      { title: "Applying simply supported formula to a cantilever", desc: "δ = WL³/48EI is ONLY for simply supported beams with central load. A cantilever with the same load and length has δ = WL³/3EI — which is 16× larger. The boundary conditions completely change the answer." }
    ],
    simulation: "beam",
    realWorldUses: [
      { title: "Bridge Girders", icon: "🌉", description: "Steel plate girders in highway bridges are designed so live-load deflection stays within L/800 of span. A 40 m girder must not deflect more than 50 mm under full traffic loading." },
      { title: "Aircraft Wing Spars", icon: "✈️", description: "A Boeing 787 wing tip deflects about 7 metres upward in flight under aerodynamic lift. This is intentional — the spars are designed for controlled flex, storing elastic strain energy that reduces structural fatigue." },
      { title: "Floor Beam Design", icon: "🏢", description: "Office floor beams are routinely checked for L/360 deflection and perceptible vibration (natural frequency > 8 Hz for occupant comfort). A beam that 'bounces' when you walk fails the vibration criterion even if it's structurally safe." },
      { title: "Precision Machine Tool Beds", icon: "🏭", description: "CNC machine bed deflections of even 0.05 mm can cause machined part tolerances to be violated. Machine tools use heavy grey iron or polymer-concrete beds with extremely high EI — stiffness, not strength, governs design." }
    ],
    resources: [
      { label: "Beam Deflection — The Efficient Engineer", url: "https://www.youtube.com/watch?v=OmCKx0HhSzM", type: "video" },
      { label: "MIT OCW — Mechanics of Materials I", url: "https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/", type: "course" },
      { label: "NPTEL — Strength of Materials (IIT Kharagpur)", url: "https://nptel.ac.in/courses/105101085", type: "course" },
      { label: "Engineering Toolbox — Beam Deflection Reference", url: "https://www.engineeringtoolbox.com/beam-stress-deflection-d_1312.html", type: "article" }
    ]
  },

  {
    id: "stress-strain", title: "Stress & Strain",
    category: "som", icon: "📊",
    tags: ["SOM", "stress", "strain", "yield", "elasticity"],
    shortDesc: "The fundamental relationship between internal force and deformation — the language every material speaks.",
    theory: {
      definition: "Stress (σ) is the internal resisting force per unit area developed within a material in response to external loading. Strain (ε) is the resulting deformation per unit original dimension. Together, the stress-strain diagram is the single most important experimental result in materials engineering — it fully characterises a material's elastic stiffness, yield point, ductility, strain hardening behaviour, ultimate strength, and fracture toughness.",
      keyConcepts: [
        { term: "Young's Modulus (E)", desc: "The slope of the linear elastic region. A fundamental material constant. Steel: 200 GPa. Ti-6Al-4V: 114 GPa. Aluminium 6061: 69 GPa. CFRP (axial): ~70–170 GPa. Bone: ~20 GPa. Rubber: ~0.001 GPa. E does not change with heat treatment — only microstructure changes strength." },
        { term: "Yield Strength (σ_y)", desc: "Stress at which permanent plastic deformation begins. For most steels, a definite upper/lower yield point exists. For aluminium and high-strength steels, the 0.2% proof stress is used (stress at 0.2% permanent strain offset)." },
        { term: "Strain Hardening", desc: "After yielding, continued plastic deformation causes dislocations to entangle and impede each other — the material strengthens with increasing strain. This is why cold-working increases strength: you're deliberately straining into this regime." },
        { term: "Necking & True vs Engineering Stress", desc: "Engineering stress = F/A₀ (original area). After UTS, the specimen necks — actual area reduces rapidly. True stress = F/A_actual rises to fracture. Engineering stress appears to fall, creating the characteristic drop after UTS on the engineering curve." }
      ],
      formulas: [
        { name: "Normal Stress", eq: "σ = F / A₀", variables: { "F": "Axial force (N)", "A₀": "Original cross-sectional area (m²)" } },
        { name: "Engineering Strain", eq: "ε = ΔL / L₀ = (L − L₀) / L₀", variables: { "ΔL": "Extension (m)", "L₀": "Original gauge length (m)" } },
        { name: "Hooke's Law (Elastic Region)", eq: "σ = E × ε", variables: { "E": "Young's modulus (Pa)" } },
        { name: "Poisson's Ratio", eq: "ν = −ε_transverse / ε_axial", variables: { "ν": "0.28–0.33 for metals, 0.5 for rubber (incompressible)" } },
        { name: "Shear Modulus", eq: "G = E / [2(1 + ν)]", variables: { "G": "Shear modulus (Pa), steel ≈ 80 GPa" } }
      ],
      explanation: "Loading a specimen in the elastic region produces stress-strain linearity (Hooke's Law) — the atomic bond springs stretch uniformly. Remove the load: full recovery. At yield, the shear stress on slip planes reaches the critical resolved shear stress — dislocations begin to move through the crystal lattice, producing permanent deformation without fracture. Continued loading causes dislocation pile-ups (strain hardening) until the local geometry becomes unstable (necking initiation) at UTS. From UTS to fracture, the load falls but local true stress at the neck rises to final fracture stress. Toughness (area under curve) distinguishes brittle materials (high σ_y, low ε_f) from tough materials (moderate σ_y, high ε_f)."
    },
    practicalRules: [
      "Design allowable stress is typically <strong>σ_y / 1.5</strong> (static, ductile metals) to <strong>σ_y / 2.5</strong> (fluctuating loads).",
      "The <strong>0.2% offset proof stress</strong> is used as yield strength for aluminium and stainless steels (no defined yield point).",
      "Poisson's ratio ν ≈ <strong>0.5 for rubber</strong> (nearly incompressible) and ≈ <strong>0.3 for most metals</strong>.",
      "Cold working increases <strong>yield strength</strong> but reduces <strong>ductility</strong> — always trade-offs.",
      "Strain energy per unit volume = <strong>σ²/2E</strong> in the elastic range.",
      "A material with large area under its stress-strain curve is <strong>tough</strong> — the metric that governs impact and crash performance."
    ],
    workedExample: {
      problem: "A steel tie rod of diameter 25 mm and length 2.5 m carries a tensile load of 80 kN. E = 200 GPa, σ_y = 250 MPa. Find: (a) stress, (b) strain, (c) elongation, and (d) factor of safety against yielding.",
      given: ["d = 0.025 m → A = π(0.025)²/4 = 4.909 × 10⁻⁴ m²", "L₀ = 2.5 m", "F = 80,000 N", "E = 200 × 10⁹ Pa", "σ_y = 250 × 10⁶ Pa"],
      steps: [
        { text: "Calculate cross-sectional area:", calc: "A = π × (0.025)² / 4 = π × 6.25×10⁻⁴ / 4 = 4.909 × 10⁻⁴ m²" },
        { text: "Calculate normal stress:", calc: "σ = F/A = 80,000 / 4.909×10⁻⁴ = 162.9 × 10⁶ Pa = 162.9 MPa" },
        { text: "Since σ = 162.9 MPa < σ_y = 250 MPa, the rod is in the elastic range. Calculate strain via Hooke's Law:", calc: "ε = σ/E = 162.9×10⁶ / 200×10⁹ = 8.145 × 10⁻⁴ (dimensionless)" },
        { text: "Calculate elongation:", calc: "ΔL = ε × L₀ = 8.145×10⁻⁴ × 2.5 = 2.036 × 10⁻³ m = 2.04 mm" },
        { text: "Calculate factor of safety against yielding:", calc: "FoS = σ_y / σ_actual = 250 / 162.9 = 1.53" }
      ],
      answer: "σ = 162.9 MPa, ε = 8.145 × 10⁻⁴, ΔL = 2.04 mm, Factor of Safety = 1.53 (adequate for static loading — minimum typically 1.5)."
    },
    commonMistakes: [
      { title: "Confusing strength with stiffness", desc: "Stiffness (E) and strength (σ_y or UTS) are completely independent properties. Heat treatment changes strength dramatically without affecting E. High-strength steel (E=200 GPa, σ_y=1500 MPa) and mild steel (E=200 GPa, σ_y=250 MPa) have identical stiffness — they deflect the same amount under the same load." },
      { title: "Using original area after necking begins", desc: "Engineering stress uses the original area throughout. After necking, this gives a falling curve — which is why engineering UTS appears to be the peak. True stress (using actual area) continues to rise to fracture. Never use engineering stress to describe failure mechanisms at the microscale." },
      { title: "Strain has no units — but context matters", desc: "Strain is dimensionless (m/m), but always specify: linear strain (axial), shear strain (angular, in radians), volumetric strain, or true strain (ln(L/L₀)). Confusing shear strain γ with axial strain ε is a common error in combined loading problems." }
    ],
    simulation: "stress-strain",
    realWorldUses: [
      { title: "Structural Steel Grade Selection", icon: "🏗️", description: "IS 2062 specifies Fe250, Fe410, Fe540 by yield strength. A column sized for Fe250 would need to be completely resized (smaller area) if upgraded to Fe540 — stress is independent of material if area is constant." },
      { title: "Automotive Crumple Zones", icon: "🚗", description: "Front and rear crumple zones use high-toughness steel (large area under σ-ε curve) to absorb crash kinetic energy through controlled plastic deformation, protecting the passenger cabin which uses ultra-high-strength boron steel." },
      { title: "Bone Implant Design", icon: "🦴", description: "Titanium implants are chosen because their E ≈ 110 GPa is closer to cortical bone (E ≈ 17–20 GPa) than steel (200 GPa). Closer E match reduces stress shielding — if the implant is far stiffer, it carries load the bone should carry, causing bone resorption." },
      { title: "Cold-Drawn Wire Manufacture", icon: "🔧", description: "Piano wire and prestressing tendons are cold-drawn through progressively smaller dies. Each pass strains the material into the hardening region — UTS rises from ~500 MPa (rod) to ~1800 MPa (wire) through accumulated plastic deformation with no heat treatment." }
    ],
    resources: [
      { label: "Stress & Strain — The Efficient Engineer", url: "https://www.youtube.com/watch?v=aQf6Q8t1FQE", type: "video" },
      { label: "MIT OCW — Mechanics of Materials I", url: "https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/", type: "course" },
      { label: "NPTEL — Engineering Mechanics", url: "https://nptel.ac.in/courses/112105268", type: "course" },
      { label: "Engineering Toolbox — Material Stresses", url: "https://www.engineeringtoolbox.com/stress-d_1237.html", type: "article" }
    ]
  },

  {
    id: "torsion", title: "Torsion of Circular Shafts",
    category: "som", icon: "🌀",
    tags: ["SOM", "torsion", "shear", "shaft", "twist"],
    shortDesc: "Twisting of shafts under torque — the governing failure mode of every rotating power transmission component.",
    theory: {
      definition: "Torsion is the loading condition that arises when a torque (twisting moment) is applied about a member's longitudinal axis. It generates shear stresses across every cross-section, distributed in a specific pattern, and causes angular deformation (angle of twist). All rotating power transmission components — shafts, axles, drill strings, propeller shafts — are designed primarily against torsional failure.",
      keyConcepts: [
        { term: "Polar Second Moment of Area (J)", desc: "The torsional equivalent of I for bending. J = πd⁴/32 (solid circle); J = π(D⁴−d⁴)/32 (hollow). Higher J = less twist and lower shear stress for same torque. Hollow shafts are efficient: eliminating the near-zero-stress core saves weight." },
        { term: "Shear Stress Distribution", desc: "Torsional shear stress is zero at the shaft axis and maximum at the outer surface, varying linearly with radius. This is the exact analogy of bending stress distribution — zero at neutral axis, maximum at outermost fibre." },
        { term: "Angle of Twist (φ)", desc: "The relative angular rotation between two cross-sections separated by length L. φ = TL/GJ. For shafts in series (same torque): φ_total = Σ(T·L/GJ) for each segment. For parallel shafts: complex compatibility equations apply." },
        { term: "Shear Yield Criterion", desc: "By the von Mises criterion, shear yield occurs at τ_y = σ_y / √3 ≈ 0.577 σ_y. By Tresca criterion, τ_y = σ_y / 2. Design against torsional yielding uses whichever is more conservative (Tresca for ductile metals)." }
      ],
      formulas: [
        { name: "Torsion Formula (Unified)", eq: "τ/r = T/J = G·φ/L", variables: { "τ": "Shear stress at radius r (Pa)", "T": "Applied torque (N·m)", "J": "Polar second moment of area (m⁴)", "G": "Shear modulus (Pa)", "φ": "Angle of twist (rad)", "L": "Length (m)" } },
        { name: "Max Shear Stress (at surface)", eq: "τ_max = T·R / J", variables: { "R": "Outer radius (m)" } },
        { name: "Angle of Twist", eq: "φ = T·L / (G·J)", variables: { "G_steel": "80 GPa", "G_aluminium": "26 GPa" } },
        { name: "Polar Moment — Solid Shaft", eq: "J = π·d⁴ / 32", variables: { "d": "Shaft diameter (m)" } },
        { name: "Polar Moment — Hollow Shaft", eq: "J = π(D⁴ − d⁴) / 32", variables: { "D": "Outer diameter (m)", "d": "Inner diameter (m)" } }
      ],
      explanation: "When torque is applied, every cross-section of the shaft experiences shear stresses that form couples resisting the applied torque. For a linearly elastic material with a circular cross-section, the shear stress distribution is linear in radius — zero at the centre, τ_max at the surface. Integrating this stress distribution over the area gives the internal torque = T. The twist angle φ accumulates over the shaft length: longer, thinner, or softer shafts twist more. For hollow shafts, removing core material (which contributes little torque resistance due to its small radius) saves weight while keeping torsional stiffness nearly unchanged."
    },
    practicalRules: [
      "For machine shafts: typically design to <strong>τ_allow = 40–60 MPa</strong> for carbon steel in steady torsion.",
      "Angle of twist limit for precision machinery: <strong>φ ≤ 0.25° per metre</strong> of shaft length.",
      "A hollow shaft with D/d = 1.25 has the same torsional strength as a solid shaft of same outer D but is <strong>~36% lighter</strong>.",
      "Power-torque-speed relationship: <strong>P = T × ω = T × 2πN/60</strong> — always use this to find T from transmitted power.",
      "Stress concentration factors (K_t) at keyways, holes, and fillets multiply the nominal torsional stress — typical K_t = 1.5 to 3 at keyways.",
      "Shear yield strength (von Mises): <strong>τ_y ≈ 0.577 × σ_y</strong>. For Fe415 steel: τ_y ≈ 0.577 × 415 = 239 MPa."
    ],
    workedExample: {
      problem: "A solid steel shaft transmits 75 kW at 500 RPM. The allowable shear stress is 55 MPa and the allowable angle of twist is 1° over 1.5 m. G = 80 GPa. Find the minimum shaft diameter satisfying both criteria.",
      given: ["P = 75,000 W", "N = 500 RPM → ω = 2π×500/60 = 52.36 rad/s", "τ_allow = 55 MPa = 55×10⁶ Pa", "φ_allow = 1° = π/180 = 0.01745 rad", "L = 1.5 m", "G = 80×10⁹ Pa"],
      steps: [
        { text: "Find transmitted torque from power and speed:", calc: "T = P / ω = 75,000 / 52.36 = 1432 N·m" },
        { text: "Find minimum diameter from shear stress criterion (τ_max = TR/J = 16T/πd³):", calc: "d³ = 16T / (π × τ_allow) = 16 × 1432 / (π × 55×10⁶)\nd³ = 22,912 / 172,787,596 = 1.326 × 10⁻⁴ m³\nd = (1.326×10⁻⁴)^(1/3) = 0.0510 m = 51.0 mm" },
        { text: "Find minimum diameter from angle of twist criterion (φ = TL/GJ = 32TL/Gπd⁴):", calc: "d⁴ = 32TL / (G × π × φ_allow) = 32 × 1432 × 1.5 / (80×10⁹ × π × 0.01745)\nd⁴ = 68,736 / 4,386,499,424 = 1.567 × 10⁻⁵ m⁴\nd = (1.567×10⁻⁵)^(1/4) = 0.0630 m = 63.0 mm" },
        { text: "Select the LARGER diameter (most critical criterion):", calc: "d_stress = 51.0 mm\nd_twist  = 63.0 mm ← GOVERNS\nSelect next standard size: d = 65 mm" }
      ],
      answer: "Minimum shaft diameter = 65 mm (governed by angle of twist limit, not shear stress). The angle of twist criterion gives a 24% larger diameter than the stress criterion alone."
    },
    commonMistakes: [
      { title: "Using I instead of J in torsion formula", desc: "I (second moment of area) is for bending. J (polar second moment of area) is for torsion. For a solid circle, J = 2I. Using I instead of J in τ = TR/J gives shear stresses exactly 2× too high. The torsion formula is τ/r = T/J, not T/I." },
      { title: "Forgetting to convert power to torque before calculating", desc: "Never apply the torsion formula directly to power. Always find torque first: T = P/ω = P×60/(2πN). A shaft transmitting 10 kW at 1000 RPM carries T = 95.5 N·m — a very different number from the raw power figure." },
      { title: "Ignoring stress concentrations at keyways and shoulders", desc: "Theoretical torsion analysis gives nominal stress. In reality, a keyway on a shaft has a stress concentration factor K_t of 1.5–3.0 — the actual peak stress at the keyway root is 1.5–3× higher. Shaft failures almost always initiate at these features, not in the plain shaft." }
    ],
    simulation: "torsion",
    realWorldUses: [
      { title: "Automotive Driveshafts", icon: "🚗", description: "A car driveshaft transmits engine torque (typically 150–400 N·m) to the wheels. It uses a tubular (hollow) steel section — same torsional stiffness as a solid shaft at a fraction of the weight. Cardan joints at each end accommodate angular misalignment." },
      { title: "Power Station Turbine Shafts", icon: "⚡", description: "A 660 MW steam turbine shaft transmits over 2 million N·m of torque at 3000 RPM. These are massive solid alloy-steel forgings, carefully designed to limit twist and avoid resonance with torsional vibration modes." },
      { title: "Oil Well Drill Strings", icon: "🛢️", description: "Drill strings in oil wells can be 5,000 m long — transmitting torque from the surface rig to the drill bit deep underground. The string twists elastically by many full rotations during drilling. Sudden release of this stored energy causes 'torsional vibration' that can damage drill bits." },
      { title: "Orthodontic Archwires", icon: "🦷", description: "Dental archwires are designed to apply controlled torques to teeth to rotate them about their long axis. The torque is generated by twisting the wire from its natural shape — an elegant application of elastic torsion at the millimetre scale." }
    ],
    resources: [
      { label: "Torsion of Shafts — The Efficient Engineer", url: "https://www.youtube.com/watch?v=1YTKedLQOa0", type: "video" },
      { label: "MIT OCW — Mechanics of Materials", url: "https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/", type: "course" },
      { label: "NPTEL — Strength of Materials", url: "https://nptel.ac.in/courses/105101085", type: "course" },
      { label: "Engineering Toolbox — Torsion", url: "https://www.engineeringtoolbox.com/torsion-d_1090.html", type: "article" }
    ]
  },

  {
    id: "columns-buckling", title: "Columns & Euler Buckling",
    category: "som", icon: "🏛️",
    tags: ["SOM", "buckling", "Euler", "columns", "stability"],
    shortDesc: "Why slender columns suddenly snap sideways at a critical load — long before the material yields.",
    theory: {
      definition: "Euler buckling (column instability) is the sudden lateral deflection of a slender compression member at a critical axial load, without any material yielding — it is a purely geometric instability. The member does not crush or yield; it loses equilibrium in its straight configuration and snaps to a bent shape. Buckling is the dominant failure mode of all slender compression members and thin-walled structures.",
      keyConcepts: [
        { term: "Effective Length (L_e)", desc: "The equivalent pin-pin length for buckling analysis. Depends on end conditions: Pin-Pin: L_e = L (factor K=1.0). Fixed-Free (flagpole): L_e = 2L (K=2.0). Fixed-Fixed: L_e = 0.5L (K=0.5). Fixed-Pin: L_e = 0.7L (K=0.7). Engineers memorise these — they dominate the result." },
        { term: "Slenderness Ratio (λ)", desc: "λ = L_e / r_min where r_min = √(I_min/A) is the minimum radius of gyration. λ determines which failure mode governs: λ > 120: Euler buckling dominates. 40 < λ < 120: Inelastic buckling (use empirical curves). λ < 40: Squashing/yielding governs." },
        { term: "Radius of Gyration (r)", desc: "r = √(I/A). A measure of how spread out the cross-section is from its centroid. Wide flanges have high r; narrow rectangles have low r. I-sections buckle preferentially about the weak axis (minimum I, minimum r) — always check both axes." },
        { term: "Mode Shape", desc: "The buckled shape at the critical load — a half-sine wave for pin-pin. Higher-order modes (full sine waves) require much higher loads. In practice, imperfections cause buckling in the fundamental (lowest) mode." }
      ],
      formulas: [
        { name: "Euler Critical Load", eq: "P_cr = π²EI / L_e²", variables: { "E": "Young's modulus (Pa)", "I": "Min. second moment of area (m⁴)", "L_e": "Effective length (m)" } },
        { name: "Critical Stress (Euler)", eq: "σ_cr = π²E / λ²", variables: { "λ": "Slenderness ratio = L_e / r_min" } },
        { name: "Radius of Gyration", eq: "r = √(I / A)", variables: { "I": "Min. second moment of area (m⁴)", "A": "Cross-sectional area (m²)" } },
        { name: "Rankine-Gordon (Empirical — Short to Long Columns)", eq: "P_R = (σ_c · A) / (1 + a·λ²)", variables: { "σ_c": "Compressive yield strength (Pa)", "a": "Rankine constant (for steel: 1/7500)" } }
      ],
      explanation: "Consider a perfectly straight column under axial load P. In theory, it can carry load up to P_cr in perfect equilibrium. At P_cr, any infinitesimal lateral disturbance is not restored — the column is in neutral equilibrium and deflects sideways without limit. In practice, all columns have imperfections (initial curvature, load eccentricity) — these mean deflection begins below P_cr and grows rapidly near P_cr. Euler's formula is valid only in the elastic range (σ_cr must be < σ_y). For stockier columns, inelastic buckling curves (Perry-Robertson in UK, AISC curves in US, IS 800 curves in India) must be used. The Rankine-Gordon formula provides a single empirical formula spanning both regimes."
    },
    practicalRules: [
      "Always check buckling about the <strong>weak axis</strong> (minimum I). This is the axis that governs failure.",
      "Factor of safety for columns: typically <strong>3.0 to 6.0</strong> — higher than for yielding because buckling is sudden and catastrophic.",
      "Euler's formula is only valid if <strong>σ_cr ≤ σ_y</strong>. For steel (E=200 GPa, σ_y=250 MPa): λ must be > <strong>88</strong>.",
      "Adding lateral restraints halves the effective length → increases P_cr by <strong>4×</strong>. This is the most cost-effective way to improve column capacity.",
      "Use <strong>hollow sections (CHS, RHS)</strong> for compression members — they have high r (hence high P_cr) for given cross-sectional area.",
      "In IS 800 (Indian steel code), buckling curves a, b, c, d are used based on section type and buckling axis."
    ],
    workedExample: {
      problem: "A fixed-free (flagpole) steel column of 60 mm × 60 mm square solid cross-section has a height of 3.5 m. Find the Euler critical load and check if Euler's formula is valid. E = 200 GPa, σ_y = 250 MPa.",
      given: ["Section: 60mm × 60mm solid square", "H = 3.5 m", "End conditions: Fixed-Free → K = 2.0", "E = 200 × 10⁹ Pa", "σ_y = 250 × 10⁶ Pa"],
      steps: [
        { text: "Calculate section properties (square: I = b⁴/12, A = b²):", calc: "I = (0.06)⁴ / 12 = 1.08 × 10⁻⁶ m⁴\nA = (0.06)² = 3.6 × 10⁻³ m²\nr = √(I/A) = √(1.08×10⁻⁶ / 3.6×10⁻³) = √(3×10⁻⁴) = 0.01732 m = 17.32 mm" },
        { text: "Find effective length (Fixed-Free → L_e = 2H = K·L):", calc: "L_e = 2.0 × 3.5 = 7.0 m" },
        { text: "Calculate slenderness ratio:", calc: "λ = L_e / r = 7.0 / 0.01732 = 404" },
        { text: "Apply Euler critical load formula:", calc: "P_cr = π²EI / L_e² = (9.87 × 200×10⁹ × 1.08×10⁻⁶) / (7.0)²\nP_cr = 2,131,560 / 49 = 43,501 N ≈ 43.5 kN" },
        { text: "Check validity: Calculate critical stress and compare with σ_y:", calc: "σ_cr = P_cr / A = 43,501 / 3.6×10⁻³ = 12,083 Pa = 12.1 MPa\nSince σ_cr (12.1 MPa) << σ_y (250 MPa), Euler's formula IS valid.\nAlso: λ = 404 >> 88 (threshold for Euler validity) ✓" }
      ],
      answer: "P_cr = 43.5 kN (Euler's formula valid since σ_cr = 12.1 MPa << σ_y = 250 MPa). The very high slenderness ratio (λ=404) makes this an extremely slender column — it would buckle at only 12 MPa, far below yield."
    },
    commonMistakes: [
      { title: "Using actual length instead of effective length", desc: "P_cr = π²EI/L² uses L_e (effective length), not actual height. A fixed-free column of height 3 m has L_e = 6 m — using L=3 m gives P_cr that is 4× too high (catastrophically unsafe)." },
      { title: "Using maximum I instead of minimum I", desc: "A non-square section (e.g. I-beam, rectangle) has two different I values. Euler buckling always occurs about the axis with minimum I. Using I_max gives P_cr that is too high — the column will buckle about the weak axis first." },
      { title: "Applying Euler formula to short/stocky columns", desc: "Euler's formula is only valid for elastic buckling (σ_cr < σ_y). For a mild steel column with λ < 88, Euler gives σ_cr > σ_y — which is physically impossible. Use inelastic buckling curves (Rankine-Gordon or code curves) for short columns." }
    ],
    simulation: "buckling",
    realWorldUses: [
      { title: "Multi-Storey Building Columns", icon: "🏢", description: "Steel building columns are designed using IS 800 buckling curves that account for initial imperfections. Lateral restraint from floor beams is critical — columns are typically restrained at each floor to prevent buckling about the weak axis over the full building height." },
      { title: "Offshore Platform Bracing Members", icon: "🌊", description: "Offshore rigs use tubular steel bracing members in compression under combined wave, current, and deck loads. Euler buckling of these members governs the jacket structural design — hollow circular sections are used for their high r value." },
      { title: "Aircraft Fuselage & Wing Stringers", icon: "✈️", description: "Aircraft skins are thin sheet metal in compression — they buckle well below material yield. Stringers and frames are added to increase the buckling stress. The aircraft structure is designed to work in 'postbuckling' regime where skin still carries load after initial buckling." },
      { title: "Concrete Column Slenderness Check", icon: "🏗️", description: "IS 456 (Indian Concrete Code) requires slenderness checks for reinforced concrete columns. If L_e/D (for rectangular) or L_e/d (for circular) exceeds limits, second-order (P-delta) effects must be considered — the column is deemed 'slender'." }
    ],
    resources: [
      { label: "Column Buckling — The Efficient Engineer", url: "https://www.youtube.com/watch?v=EFmDTESpO3c", type: "video" },
      { label: "MIT OCW — Mechanics of Materials II", url: "https://ocw.mit.edu/courses/2-002-mechanics-and-materials-ii-spring-2004/", type: "course" },
      { label: "NPTEL — Design of Steel Structures", url: "https://nptel.ac.in/courses/105105162", type: "course" },
      { label: "Engineering Toolbox — Euler Buckling", url: "https://www.engineeringtoolbox.com/euler-column-formula-d_1813.html", type: "article" }
    ]
  },

  {
    id: "thin-walled-vessels", title: "Thin-Walled Pressure Vessels",
    category: "som", icon: "⚗️",
    tags: ["SOM", "pressure vessel", "hoop stress", "cylindrical", "spherical"],
    shortDesc: "Hoop and longitudinal stresses in pressurised cylinders and spheres — from gas cylinders to boiler drums.",
    theory: {
      definition: "Thin-walled pressure vessel theory applies when the wall thickness t is much smaller than the internal radius r (t ≤ r/10). Under internal pressure p, the vessel wall develops biaxial membrane stresses — hoop (circumferential) stress σ_θ and longitudinal (axial) stress σ_L — but negligible through-thickness stress. This is one of the most important analyses in mechanical engineering, covering gas cylinders, boilers, aircraft fuselages, submarine hulls, and pipelines.",
      keyConcepts: [
        { term: "Hoop Stress (σ_θ)", desc: "The circumferential stress that acts to burst the cylinder open along its length. σ_θ = pr/t for a cylinder. This is the larger of the two principal stresses in a cylinder — it governs cylinder design. Resisted by longitudinal seams (hence 'seam burst' failure mode)." },
        { term: "Longitudinal (Axial) Stress (σ_L)", desc: "The axial stress that acts to push the end caps off. σ_L = pr/(2t) = σ_θ/2 for a cylinder. This is exactly half the hoop stress — cylinders are twice as strong longitudinally as circumferentially. Girth seams (welded circumferential joints) resist this." },
        { term: "Thin-Wall Validity (t/r ≤ 0.1)", desc: "When t/r > 0.1, the stress distribution through the wall becomes non-uniform (higher at inner surface, lower at outer) and thick-wall (Lamé) equations are needed. Using thin-wall theory for thick vessels gives non-conservative (unsafe) answers." },
        { term: "Spherical Vessels", desc: "In a sphere, stresses are equal and equal to σ = pr/(2t) in all directions — the same as the longitudinal stress in a cylinder, but half the hoop stress. This is why spherical vessels are more efficient for storing high-pressure gas." }
      ],
      formulas: [
        { name: "Hoop Stress — Cylinder", eq: "σ_θ = p·r / t", variables: { "p": "Internal pressure (Pa)", "r": "Internal radius (m)", "t": "Wall thickness (m)" } },
        { name: "Longitudinal Stress — Cylinder", eq: "σ_L = p·r / (2t) = σ_θ / 2", variables: {} },
        { name: "Stress — Sphere (all directions equal)", eq: "σ = p·r / (2t)", variables: {} },
        { name: "Required Wall Thickness", eq: "t = p·r / (σ_allow · η)", variables: { "σ_allow": "Allowable stress = σ_y / FoS (Pa)", "η": "Weld joint efficiency (0.7–1.0)" } },
        { name: "Volumetric Strain (Cylinder)", eq: "ΔV/V = (pr/Et) × [5/2 − 2ν]", variables: { "ν": "Poisson's ratio" } }
      ],
      explanation: "The hoop stress derivation uses a free-body diagram: cut the cylinder along its length and equate pressure force on a half-cylinder to the wall stress forces on the two cut edges. Pressure force = p × (2r × L); Wall resistance = 2 × (σ_θ × t × L). Equating: σ_θ = pr/t. The factor of 2 difference between hoop and longitudinal stress means cylinders always fail first by bursting along their length (longitudinal crack) rather than pulling apart at their girth welds — assuming equal weld quality."
    },
    practicalRules: [
      "Thin-wall theory valid when <strong>t ≤ r/10</strong> (or t/r ≤ 0.1). For t/r > 0.1, use Lamé thick-wall equations.",
      "Cylinder design: <strong>hoop stress governs</strong> (σ_θ = pr/t — twice the longitudinal stress).",
      "Sphere is more efficient: same pressure and volume requires wall thickness = <strong>half that of a cylinder</strong>.",
      "Weld efficiency η must be included in design: typical butt weld η = 1.0, double-V = 0.85, lap weld = 0.70.",
      "ASME Boiler and Pressure Vessel Code (Section VIII) governs design in industry — minimum FoS = <strong>3.5 on UTS</strong> or <strong>1.5 on yield</strong> (whichever governs).",
      "Pressure test at <strong>1.5× design pressure</strong> (hydrostatic) before service — proof test standard."
    ],
    workedExample: {
      problem: "A cylindrical pressure vessel has internal diameter 600 mm, internal pressure 2.5 MPa, and is made of steel with σ_y = 300 MPa. Weld joint efficiency η = 0.85. Using a factor of safety of 2.5, find the required wall thickness.",
      given: ["D = 600 mm → r = 300 mm = 0.3 m", "p = 2.5 MPa = 2.5 × 10⁶ Pa", "σ_y = 300 MPa", "η = 0.85 (weld efficiency)", "FoS = 2.5"],
      steps: [
        { text: "Calculate allowable hoop stress:", calc: "σ_allow = σ_y / FoS = 300 / 2.5 = 120 MPa = 120 × 10⁶ Pa" },
        { text: "Apply hoop stress formula including weld efficiency (governing condition):", calc: "t = p × r / (σ_allow × η) = (2.5×10⁶ × 0.3) / (120×10⁶ × 0.85)" },
        { text: "Calculate:", calc: "t = 750,000 / 102,000,000 = 0.00735 m = 7.35 mm" },
        { text: "Select next standard plate thickness (round up for safety):", calc: "t_selected = 8 mm" },
        { text: "Verify thin-wall assumption: t/r = 8/300 = 0.0267 < 0.1 ✓ (thin-wall theory valid)", calc: "t/r = 0.0267 << 0.1 → Thin-wall valid ✓" }
      ],
      answer: "Required wall thickness = 8 mm (rounded up from 7.35 mm). Thin-wall assumption is valid (t/r = 0.027). At this thickness, the actual hoop stress = 2.5×0.3/(0.008×0.85) = 110.3 MPa, giving an actual FoS of 300/110.3 = 2.72."
    },
    commonMistakes: [
      { title: "Using diameter instead of radius in the formula", desc: "σ_θ = pr/t uses the internal RADIUS r, not diameter D. A common error is substituting D directly, giving a result exactly 2× too high. Always halve the given diameter: r = D/2." },
      { title: "Ignoring weld joint efficiency in design", desc: "The formula σ_θ = pr/t gives the stress in the base metal. Welds are weaker — the allowable stress must be multiplied by the weld efficiency η (≤1.0). Omitting η gives a wall thickness that is too thin (unconservative)." },
      { title: "Applying cylinder formula to end caps", desc: "The cylinder hoop stress formula does NOT apply to the flat end caps. Flat caps are in bending and require a much thicker plate than the cylinder wall. This is why pressure vessels use hemispherical or ellipsoidal heads — they can be analysed as partial spheres." }
    ],
    simulation: "stress-strain",
    realWorldUses: [
      { title: "LPG/CNG Cylinders", icon: "🔵", description: "Domestic LPG cylinders (14.2 kg) are designed for 1.56 MPa test pressure. The thin-wall cylinder design determines the steel thickness (typically 2.5–3.5 mm). The hoop stress formula is directly applied with appropriate FoS and weld efficiency." },
      { title: "Steam Boiler Drums", icon: "♨️", description: "Power plant boiler drums (large horizontal cylinders) operate at 15–20 MPa and 350°C. Wall thicknesses are 80–120 mm. At these pressures, t/r approaches 0.1 — thick-wall corrections become significant." },
      { title: "Aircraft Fuselage", icon: "✈️", description: "Aircraft fuselages are pressurised to ~75 kPa above ambient. The thin aluminium skin (typically 1.5–2.5 mm) is a cylindrical pressure vessel. Hoop stress governs — fuselage skin failures (like the Aloha Airlines 1988 accident) are classic hoop-stress fatigue failures." },
      { title: "Submarine Pressure Hulls", icon: "🚢", description: "Submarine hulls experience external pressure (up to 10 MPa at 1000 m depth) rather than internal pressure. External pressure causes compressive hoop stress — the failure mode is compressive buckling of the cylindrical shell (implosion), not tensile burst." }
    ],
    resources: [
      { label: "Pressure Vessels — The Efficient Engineer", url: "https://www.youtube.com/watch?v=yiCLiJjgzA4", type: "video" },
      { label: "MIT OCW — Mechanics of Materials", url: "https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/", type: "course" },
      { label: "NPTEL — Machine Design I", url: "https://nptel.ac.in/courses/112105125", type: "course" },
      { label: "Engineering Toolbox — Hoop Stress", url: "https://www.engineeringtoolbox.com/stress-thin-walled-tubes-d_948.html", type: "article" }
    ]
  },

  {
    id: "springs", title: "Springs & Helical Spring Design",
    category: "som", icon: "🌀",
    tags: ["SOM", "spring", "stiffness", "Wahl", "fatigue", "helical"],
    shortDesc: "Storing and releasing elastic energy — the design science behind every spring from watch hairsprings to suspension coils.",
    theory: {
      definition: "A helical compression spring stores elastic strain energy when compressed and releases it on unloading. The spring rate k defines force per unit deflection. Design involves selecting wire diameter d, mean coil diameter D, number of active coils Nc, and material to meet stiffness, stress, fatigue life, and space requirements simultaneously.",
      keyConcepts: [
        { term: "Spring Index (C)", desc: "C = D/d — ratio of mean coil diameter to wire diameter. Typical: C = 4–12. Low C: high curvature stress. High C: prone to buckling. C = 6–9 is the practical optimum." },
        { term: "Wahl Correction Factor (Kw)", desc: "Accounts for stress concentration due to wire curvature and direct shear. Kw = (4C−1)/(4C−4) + 0.615/C. Always > 1. For C=6: Kw ≈ 1.25. Critical for fatigue design — omitting it causes premature failure." },
        { term: "Solid Length & Free Length", desc: "Solid length Ls = nt × d (all coils touching). Maximum deflection = Lf − Ls. Never load to solid length in service — clashing destroys coil surfaces." },
        { term: "Buckling Criterion", desc: "Spring buckles if Lf/D > 2.6 (fixed-free) or Lf/D > 3.7 (fixed-fixed). Prevent by guiding on a rod or tube." }
      ],
      formulas: [
        { name: "Spring Rate (Stiffness)", eq: "k = Gd⁴ / (8D³Nc)", variables: { "G": "Shear modulus (Pa) — steel: 80 GPa", "d": "Wire diameter (m)", "D": "Mean coil diameter (m)", "Nc": "Number of active coils" } },
        { name: "Deflection Under Load", eq: "δ = 8WD³Nc / (Gd⁴)", variables: { "W": "Applied load (N)", "δ": "Deflection (m)" } },
        { name: "Max Shear Stress (Wahl corrected)", eq: "τ = Kw × 8WD / (πd³)", variables: { "Kw": "Wahl factor", "τ_allow": "~500–700 MPa for spring steel" } },
        { name: "Wahl Factor", eq: "Kw = (4C−1)/(4C−4) + 0.615/C", variables: { "C": "Spring index = D/d" } }
      ],
      explanation: "Torsion is the primary stress mode — as the coil is compressed, the wire twists. The Wahl correction accounts for the higher stress on the inside of the coil due to curvature and direct shear. Wire diameter is the most powerful control on spring rate: δ ∝ 1/d⁴ — halving wire diameter gives 16× more deflection. Large-diameter coils (D) are flexible; small are stiff."
    },
    practicalRules: [
      "Design for <strong>τ ≤ 0.45 × UTS</strong> (static) or <strong>τ ≤ 0.35 × UTS</strong> (fatigue).",
      "Spring index <strong>C = 6–9</strong> is optimal for stress and manufacturability.",
      "Always specify <strong>free length, solid length, spring rate, and max load</strong> on drawings.",
      "Shot-peened springs extend fatigue life by <strong>25–50%</strong> through compressive residual stresses.",
      "Stainless steel (302/304): G ≈ 70 GPa — needs more coils than carbon steel for same rate.",
      "Buckling check: Lf/D must be <strong>≤ 2.6 (free end) or ≤ 3.7 (guided)</strong>."
    ],
    workedExample: {
      problem: "Design a helical compression spring: load W = 500 N, deflection δ = 40 mm, mean coil diameter D = 50 mm. Oil-tempered steel: G = 80 GPa, τ_allow = 500 MPa. Find wire diameter and number of active coils.",
      given: ["W = 500 N", "δ = 40 mm", "D = 50 mm", "G = 80 GPa", "τ_allow = 500 MPa"],
      steps: [
        { text: "Required spring rate:", calc: "k = W/δ = 500/0.04 = 12,500 N/m" },
        { text: "Estimate wire diameter from stress (ignore Kw first):", calc: "d³ = 8WD/(π × τ_allow) = 8×500×0.05/(π×500×10⁶) = 1.273×10⁻⁷ m³ → d ≈ 5 mm" },
        { text: "Spring index C = 50/5 = 10. Wahl factor:", calc: "Kw = (4×10−1)/(4×10−4) + 0.615/10 = 1.083 + 0.0615 = 1.145\nτ = 1.145 × 8×500×0.05/(π×0.005³) = 583 MPa > 500 MPa ✗ — increase d" },
        { text: "Try d = 6 mm, C = 50/6 = 8.33, Kw = 1.162:", calc: "τ = 1.162 × 8×500×0.05/(π×0.006³) = 342 MPa ✓" },
        { text: "Find Nc:", calc: "Nc = Gd⁴/(8D³k) = 80×10⁹×(0.006)⁴/(8×(0.05)³×12500) = 8.3 → use 8.5 coils" }
      ],
      answer: "d = 6 mm, Nc = 8.5 active coils (~10.5 total with closed ends). τ = 342 MPa (FoS = 1.46). Spring rate ≈ 12.2 kN/m."
    },
    commonMistakes: [
      { title: "Omitting the Wahl correction factor", desc: "τ = 8WD/(πd³) ignores wire curvature — gives stresses 10–30% too low (unsafe for fatigue). Always apply Kw, especially for C < 8." },
      { title: "Confusing active coils with total coils", desc: "Active coils Nc carry load and deflect. Total coils = Nc + 1.5–2 (closed ends). Using total coils gives a spring 15–25% more flexible than designed." },
      { title: "Ignoring buckling for long springs", desc: "If Lf/D > 4, the spring buckles before reaching design load. Always check free length to diameter ratio." }
    ],
    simulation: "spring",
    realWorldUses: [
      { title: "Automotive Valve Springs", icon: "🚗", description: "IC engine valve springs operate at 50–200 Hz for 100+ million fatigue cycles. Chrome-silicon wire, shot-peened, designed on Goodman diagram." },
      { title: "Railway Buffer Springs", icon: "🚂", description: "Absorb collision energy (up to 500 kJ). Designed for max energy storage U = ½kδ² with τ at solid length well below yield." },
      { title: "Precision Instrument Springs", icon: "⌚", description: "Watch hairsprings: wire 0.1 × 0.02 mm, Nivarox alloy maintaining constant rate within ±0.1% over temperature range." },
      { title: "Medical Device Springs", icon: "💉", description: "Auto-injector and surgical stapler springs — stainless 316, tested to 3× cycle life. Failure is unacceptable." }
    ],
    resources: [
      { label: "Spring Design Basics (YouTube)", url: "https://www.youtube.com/watch?v=YzFrGG2AVKY", type: "video" },
      { label: "NPTEL — Machine Design I (Springs)", url: "https://nptel.ac.in/courses/112105125", type: "course" },
      { label: "Engineering Toolbox — Compression Springs", url: "https://www.engineeringtoolbox.com/compression-springs-d_1905.html", type: "article" }
    ]
  },

  {
    id: "sfd-bmd", title: "Shear Force & Bending Moment Diagrams",
    category: "som", icon: "📈",
    tags: ["SOM", "SFD", "BMD", "shear", "bending moment", "beam analysis"],
    shortDesc: "Plotting internal forces along a beam — the essential first step in every structural design.",
    theory: {
      definition: "Shear Force (V) at any cross-section is the algebraic sum of all transverse forces on one side. Bending Moment (M) is the algebraic sum of all moments about that section. The SFD and BMD show how these internal forces vary along the beam, locating critical sections of maximum stress and identifying points of contraflexure. Every structural beam design begins with these diagrams.",
      keyConcepts: [
        { term: "Load-Shear-Moment Relationships", desc: "dV/dx = −w(x): slope of SFD equals negative distributed load. dM/dx = V(x): slope of BMD equals shear force. Where V = 0, M is maximum or minimum — locating the critical bending section." },
        { term: "Sign Convention", desc: "Positive shear: left face up, right face down. Positive moment: sagging (concave up). Hogging (concave down) is negative moment — typical over interior supports in continuous beams." },
        { term: "Point of Contraflexure", desc: "Location where M = 0 (not at a support). Marks the transition from sagging to hogging. Minimum reinforcement is placed here in concrete beams." },
        { term: "Area Theorem", desc: "Area under SFD between two points equals change in BM: M₂ − M₁ = ∫V dx. Powerful check on calculations and used for rapid BMD construction." }
      ],
      formulas: [
        { name: "Load-Shear Relation", eq: "dV/dx = −w(x)", variables: { "V": "Shear force (N)", "w(x)": "Distributed load (N/m), positive downward" } },
        { name: "Shear-Moment Relation", eq: "dM/dx = V(x)", variables: { "M": "Bending moment (N·m)" } },
        { name: "Simply Supported UDL — Reactions", eq: "RA = RB = wL/2", variables: { "w": "UDL (N/m)", "L": "Span (m)" } },
        { name: "Max BM — SS Beam UDL", eq: "M_max = wL²/8 at midspan", variables: {} },
        { name: "Cantilever Point Load", eq: "M_max = −WL at fixed end", variables: { "Hogging": "negative moment (concave down)" } }
      ],
      explanation: "To construct SFD/BMD: (1) Find all reactions using ΣFy=0 and ΣM=0. (2) Track V from left: point loads cause jumps; UDLs cause linear slopes; ΣFy=0 is your closing check. (3) M is the integral of V: where SFD is positive, BMD increases; where SFD crosses zero, BMD peaks. Area under SFD between two points = change in BM — use this to verify your BMD without integration."
    },
    practicalRules: [
      "Always find reactions first — errors propagate through the entire diagram.",
      "Where V = 0 → M is maximum: the critical section for bending stress σ = My/I.",
      "<strong>UDL</strong>: SFD is linear, BMD is parabolic. <strong>Point load</strong>: SFD is constant (steps), BMD is triangular.",
      "At a free end: V = 0 (no point load) and M = 0 always.",
      "Area under SFD = change in BM: M₂ − M₁ = ∫V dx — the fastest way to construct BMD.",
      "For continuous beams, use moment distribution or three-moment theorem — reactions are statically indeterminate."
    ],
    workedExample: {
      problem: "Simply supported beam 6 m span: UDL 15 kN/m full span + point load 30 kN at 2 m from left. Find reactions, draw SFD/BMD, find maximum BM.",
      given: ["L = 6 m", "UDL w = 15 kN/m", "Point load P = 30 kN at x = 2 m"],
      steps: [
        { text: "Find reactions (ΣM_B = 0):", calc: "RA × 6 = 15×6×3 + 30×4 = 270 + 120 = 390\nRA = 65 kN, RB = 90+30−65 = 55 kN ✓ (ΣFy: 65+55=120=15×6+30)" },
        { text: "SFD values:", calc: "V(0⁺) = +65 kN\nV(2⁻) = 65 − 15×2 = +35 kN\nV(2⁺) = 35 − 30 = +5 kN\nV(6⁻) = 5 − 15×4 = −55 kN ✓" },
        { text: "V = 0 location (between x=2 and x=6):", calc: "5 − 15(x−2) = 0 → x = 2.33 m from A" },
        { text: "M_max at x = 2.33 m:", calc: "M = 65×2.33 − 15×2.33²/2 − 30×0.33 = 151.5 − 40.7 − 9.9 = 100.9 kN·m" }
      ],
      answer: "RA = 65 kN, RB = 55 kN. M_max = 100.9 kN·m at x = 2.33 m from A (where V = 0). BMD is parabolic in UDL regions, triangular at point load. All moments are sagging (positive) — no contraflexure for this loading."
    },
    commonMistakes: [
      { title: "Not finding reactions first", desc: "SFD cannot start without correct reactions. Errors here propagate everywhere — always verify ΣFy=0 and ΣM=0 before drawing." },
      { title: "Wrong sign for cantilever moments", desc: "Cantilever beams hog (negative moment). M = −WL at the fixed end. Students familiar with sagging simply-supported beams often make this sign error." },
      { title: "Missing the jump at a concentrated couple", desc: "A couple causes an immediate jump in BMD equal to the couple magnitude — but no jump in SFD. Students often skip this jump, giving wrong BM values beyond the couple." }
    ],
    simulation: "sfd-bmd",
    realWorldUses: [
      { title: "Bridge Girder Design", icon: "🌉", description: "Influence line BMDs for moving loads determine the envelope of maximum moments. Every cross-section is checked for bending and shear at those peaks." },
      { title: "Reinforced Concrete Beams", icon: "🏗️", description: "BMD shows where sagging steel (bottom) and hogging steel (top, at supports) are needed. Points of contraflexure govern bar cutoff lengths." },
      { title: "Machine Spindle Analysis", icon: "🏭", description: "Lathe spindle is a beam on bearings with cutting force at the free end. SFD/BMD gives bending stress at each bearing to verify fatigue life." },
      { title: "Aircraft Wing Root Bending", icon: "✈️", description: "Wing root BMD under aerodynamic lift determines the maximum bending moment — the governing load case for the main spar and attachment structure." }
    ],
    resources: [
      { label: "SFD & BMD — The Efficient Engineer", url: "https://www.youtube.com/watch?v=C-FEVzI8oe8", type: "video" },
      { label: "MIT OCW — Mechanics of Materials", url: "https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/", type: "course" },
      { label: "NPTEL — Strength of Materials (Beams)", url: "https://nptel.ac.in/courses/105101085", type: "course" }
    ]
  },

  {
    id: "mohrs-circle", title: "Principal Stresses & Mohr's Circle",
    category: "som", icon: "⭕",
    tags: ["stress", "mohr", "principal stress", "shear", "transformation", "2D"],
    shortDesc: "A graphical method for finding normal and shear stresses on any plane, essential for failure theories.",
    theory: {
      definition: "Mohr's Circle is a graphical representation of the 2D stress state at a point. It plots the normal stress (σ) on the x-axis and the shear stress (τ) on the y-axis for any rotated coordinate system. The principal stresses (maximum and minimum normal stresses where shear is zero) and maximum shear stress can be easily identified from the geometry of the circle. It simplifies complex stress transformation equations into basic geometry.",
      keyConcepts: [
        { term: "Principal Planes & Stresses", desc: "Planes on which the shear stress is exactly zero. The normal stresses acting on these planes are the Principal Stresses (σ₁ and σ₂). σ₁ is the maximum tensile stress, and σ₂ is the minimum (or maximum compressive) stress at the point." },
        { term: "Maximum Shear Stress (τ_max)", desc: "The peak value of shear stress, represented by the radius of Mohr's Circle. It occurs on planes oriented at 45° to the principal planes. Many ductile materials (like steel) fail based on maximum shear (Tresca criterion)." },
        { term: "Circle Centre and Radius", desc: "The centre of the circle lies on the σ-axis at the average normal stress: C = (σ_x + σ_y)/2. The radius R represents τ_max and is calculated as R = √[((σ_x - σ_y)/2)² + τ_xy²]." },
        { term: "Angle Convention (2θ)", desc: "A rotation of angle θ in the physical material corresponds to a rotation of 2θ on Mohr's Circle. This is because normal/shear stresses repeat every 180° physically, but a full circle is 360°." }
      ],
      formulas: [
        { name: "Centre (Average Stress)", eq: "σ_avg = (σ_x + σ_y) / 2", variables: { "σ_x, σ_y": "Normal stresses in x and y directions" } },
        { name: "Radius (Max Shear)", eq: "R = τ_max = √[((σ_x − σ_y)/2)² + τ_xy²]", variables: { "τ_xy": "Applied shear stress on x-y planes" } },
        { name: "Principal Stresses", eq: "σ_1,2 = σ_avg ± R", variables: { "σ_1": "Major principal stress", "σ_2": "Minor principal stress" } },
        { name: "Principal Angle", eq: "tan(2θ_p) = (2·τ_xy) / (σ_x − σ_y)", variables: { "θ_p": "Angle to principal planes relative to x-axis" } }
      ],
      explanation: "Imagine a tiny square element cut from a loaded beam. The element experiences horizontal stress (σ_x), vertical stress (σ_y), and shear stress across its faces (τ_xy). If we rotate this square, the stresses change. The transformation equations dictate these changes, and plotting them forms a perfect circle. By plotting points A(σ_x, -τ_xy) and B(σ_y, τ_xy) and drawing a circle through them centered on the horizontal axis, you map every possible stress state for that point."
    },
    practicalRules: [
      "For <strong>ductile materials</strong> (e.g., steel, aluminum), design against the radius of Mohr's Circle (τ_max), as they yield in shear (Tresca or von Mises criteria).",
      "For <strong>brittle materials</strong> (e.g., cast iron, concrete), design against the rightmost point of the circle (σ₁), as they fail due to maximum principal tensile stress.",
      "If the stress state is <strong>pure shear</strong> (e.g., a twisted shaft), the centre of the circle is at the origin (0,0), and σ₁ = τ, σ₂ = -τ.",
      "If the stress state is <strong>uniaxial tension</strong>, the circle passes through the origin and touches σ_x, with radius R = σ_x / 2."
    ],
    workedExample: {
      problem: "A stress element on a pressure vessel is subjected to σ_x = 80 MPa, σ_y = 20 MPa, and a shear stress τ_xy = 40 MPa. Determine: (a) Principal stresses σ₁ and σ₂, (b) Maximum shear stress τ_max, and (c) The orientation of the principal planes θ_p.",
      given: ["σ_x = 80 MPa", "σ_y = 20 MPa", "τ_xy = 40 MPa"],
      steps: [
        { text: "Calculate Center (Average Stress):", calc: "C = (σ_x + σ_y) / 2 = (80 + 20) / 2 = 50 MPa" },
        { text: "Calculate Radius (Max Shear Stress):", calc: "R = √[((σ_x - σ_y)/2)² + τ_xy²]\n= √[((80 - 20)/2)² + 40²]\n= √[30² + 40²] = √[900 + 1600] = √2500 = 50 MPa\n∴ τ_max = 50 MPa" },
        { text: "Calculate Principal Stresses:", calc: "σ₁ = C + R = 50 + 50 = 100 MPa\nσ₂ = C - R = 50 - 50 = 0 MPa" },
        { text: "Calculate Principal Angle:", calc: "tan(2θ_p) = (2·τ_xy) / (σ_x - σ_y)\n= (2 × 40) / (80 - 20) = 80 / 60 = 1.333\n2θ_p = 53.13°  →  θ_p = 26.56°" }
      ],
      answer: "Principal Stresses: σ₁ = 100 MPa, σ₂ = 0 MPa. Maximum Shear Stress: τ_max = 50 MPa. Principal Angle: 26.56°."
    },
    commonMistakes: [
      { title: "Confusing 2θ on the circle with θ on the element", desc: "Angles on Mohr's circle are exactly double the physical angles. A 90° rotation in reality (e.g., from the x-face to the y-face) is a 180° rotation on the circle (opposite sides of the diameter)." },
      { title: "Getting the sign of shear stress wrong", desc: "Standard convention: Plot (σ_x, -τ_xy) and (σ_y, τ_xy) to draw the diameter. Clockwise shear on the element face plots below the axis; counter-clockwise plots above. Inverting this flips the circle upside down, ruining angle calculations." },
      { title: "Forgetting 3D Mohr's Circle", desc: "Even in 2D plane stress, the third principal stress is σ₃ = 0. The true absolute maximum shear stress must consider the 3D circles drawn between σ₁, σ₂, and 0. In our example, absolute τ_max = (100 - 0)/2 = 50 MPa." }
    ],
    simulation: "mohrs-circle",
    realWorldUses: [
      { title: "Shaft Design under Combined Loading", icon: "⚙️", description: "A power transmission shaft experiences torsion (shear) and bending (normal stress). Mohr's Circle combines these to find the peak principal stress to prevent fatigue failure." },
      { title: "Geotechnical Soil Mechanics", icon: "🌍", description: "Soil fails in shear. Mohr's circle is used with the Mohr-Coulomb failure envelope to determine if a soil slope or foundation will collapse under pressure." },
      { title: "Strain Gauge Rosettes", icon: "📐", description: "Experimental stress analysis uses 3 strain gauges glued in a rosette to measure strains. Mohr's circle of strain converts these into principal strains, and via Hooke's Law, into principal stresses." }
    ],
    resources: [
      { label: "Mohr's Circle Explained — The Efficient Engineer", url: "https://www.youtube.com/watch?v=xJEroE8iVig", type: "video" },
      { label: "MIT OCW — Stress Transformation", url: "https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/", type: "course" },
      { label: "Engineering Toolbox — Mohr's Circle Calculator", url: "https://www.engineeringtoolbox.com/mohrs-circle-d_1996.html", type: "article" }
    ]
  }

);
