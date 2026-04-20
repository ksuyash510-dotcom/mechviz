// db/fluid.js — Fluid Mechanics (2 concepts, deep content)

MECHVIZ_DB.concepts.push(

  {
    id: "fluid-flow", title: "Fluid Flow & Reynolds Number",
    category: "fluid", icon: "💧",
    tags: ["fluid", "Reynolds", "laminar", "turbulent", "pipe flow"],
    shortDesc: "Predicting whether flow is smooth or chaotic — the single most important parameter in fluid system design.",
    theory: {
      definition: "The Reynolds Number (Re) is a dimensionless ratio of inertial forces to viscous forces in a fluid flow. It determines the flow regime: laminar (smooth, ordered) or turbulent (chaotic, mixing). Proposed by Osborne Reynolds in 1883, it is arguably the most important dimensionless number in all of fluid mechanics and heat transfer — virtually every fluid engineering calculation begins with evaluating Re.",
      keyConcepts: [
        { term: "Laminar Flow (Re < 2300 for pipe flow)", desc: "Fluid moves in parallel streamlines. No cross-stream mixing. Velocity profile is parabolic (Hagen-Poiseuille): maximum at centreline, zero at wall. Pressure drop ∝ velocity (linear). Low friction losses. Poor heat transfer between wall and fluid core." },
        { term: "Turbulent Flow (Re > 4000 for pipe flow)", desc: "Chaotic, fluctuating velocity field with eddies at all scales. Velocity profile is flatter (logarithmic law). Pressure drop ∝ velocity^1.75 to 2 (much higher than laminar). Excellent mixing and heat/mass transfer. Friction factor given by Colebrook or Moody chart." },
        { term: "Hydraulic Diameter (D_H)", desc: "For non-circular ducts: D_H = 4A/P (4 × flow area / wetted perimeter). Circular pipe: D_H = D. Square duct: D_H = a (side). Annulus: D_H = D_outer − D_inner. Always use D_H in Re formula for non-circular geometries." },
        { term: "Darcy Friction Factor (f)", desc: "Laminar: f = 64/Re (exact, analytical). Turbulent smooth pipe: Blasius f = 0.316/Re^0.25 (Re < 10⁵). Turbulent rough pipe: Colebrook equation (implicit, requires iteration). Moody chart is the graphical solution encompassing all regimes." }
      ],
      formulas: [
        { name: "Reynolds Number", eq: "Re = ρVD/μ = VD/ν", variables: { "ρ": "Fluid density (kg/m³)", "V": "Mean velocity (m/s)", "D": "Hydraulic diameter (m)", "μ": "Dynamic viscosity (Pa·s)", "ν": "Kinematic viscosity = μ/ρ (m²/s)" } },
        { name: "Darcy-Weisbach (Head Loss)", eq: "h_f = f·(L/D)·V²/(2g)", variables: { "f": "Darcy-Weisbach friction factor", "L": "Pipe length (m)", "h_f": "Head loss (m of fluid)" } },
        { name: "Friction Factor — Laminar (exact)", eq: "f = 64/Re", variables: { "Valid for": "Re < 2300" } },
        { name: "Friction Factor — Turbulent Smooth (Blasius)", eq: "f = 0.316 / Re^0.25", variables: { "Valid for": "4000 < Re < 100,000" } },
        { name: "Hagen-Poiseuille (Laminar Pipe Flow)", eq: "Q = (π·D⁴·Δp) / (128·μ·L)", variables: { "Q": "Volumetric flow rate (m³/s)", "Δp": "Pressure drop (Pa)" } }
      ],
      explanation: "At low Re, viscous forces dominate — they dampen any perturbation in the flow, maintaining ordered laminar motion. The Hagen-Poiseuille solution (parabolic velocity profile) is exact for fully developed laminar flow. As Re increases past ~2300, perturbations are no longer damped and the flow transitions — initially intermittently (puffs of turbulence) then fully turbulent above Re ≈ 4000. In turbulent flow, the velocity fluctuations (u', v') create apparent 'Reynolds stresses' (−ρ<u'v'>) that dominate viscous shear stresses — completely changing the velocity profile, friction factor, and heat transfer characteristics. The flat turbulent profile means the bulk flow velocity is closer to the peak velocity, improving mixing but at the cost of much higher wall shear stress and pressure drop."
    },
    practicalRules: [
      "Pipe flow regimes: Re < 2300 = laminar; 2300–4000 = transitional; > 4000 = turbulent.",
      "For external flow over flat plates: transition at Re_x ≈ <strong>5 × 10⁵</strong>.",
      "Turbulent flow has <strong>4–6× higher friction</strong> than laminar at the same Re (if comparing near the transition).",
      "Heat transfer coefficient in turbulent flow can be <strong>10–100× higher</strong> than laminar — why turbulent flow is preferred in heat exchangers.",
      "For flow in non-circular ducts, always compute <strong>hydraulic diameter D_H = 4A/P</strong> first.",
      "Always check whether flow is fully developed. Entry length (laminar): <strong>L/D ≈ 0.06·Re</strong>. Turbulent: <strong>L/D ≈ 10–60</strong>."
    ],
    workedExample: {
      problem: "Water at 20°C flows through a 50 mm diameter pipe at 2.5 m/s. Properties: ρ = 998 kg/m³, μ = 1.002 × 10⁻³ Pa·s, ν = 1.004 × 10⁻⁶ m²/s. (a) Determine flow regime. (b) For a 30 m pipe, find head loss. (c) Find pressure drop.",
      given: ["D = 0.05 m", "V = 2.5 m/s", "L = 30 m", "ρ = 998 kg/m³", "μ = 1.002×10⁻³ Pa·s", "ν = 1.004×10⁻⁶ m²/s"],
      steps: [
        { text: "Calculate Reynolds Number:", calc: "Re = VD/ν = 2.5 × 0.05 / 1.004×10⁻⁶ = 0.125 / 1.004×10⁻⁶ = 124,502" },
        { text: "Determine flow regime: Re = 124,502 >> 4000 → TURBULENT FLOW. Use Blasius friction factor formula (valid for Re < 10⁵... but Re=124,502 slightly exceeds Blasius range, so use Colebrook/smooth pipe):", calc: "f_Blasius = 0.316 / Re^0.25 = 0.316 / (124,502)^0.25 = 0.316 / 18.81 = 0.0168\n(For Re=124,502, Swamee-Jain gives f ≈ 0.0168 for smooth pipe — agrees)" },
        { text: "Calculate head loss using Darcy-Weisbach:", calc: "h_f = f × (L/D) × V²/(2g) = 0.0168 × (30/0.05) × (2.5)²/(2×9.81)\nh_f = 0.0168 × 600 × 6.25/19.62 = 0.0168 × 600 × 0.3186 = 3.21 m" },
        { text: "Calculate pressure drop:", calc: "Δp = ρ × g × h_f = 998 × 9.81 × 3.21 = 31,417 Pa = 31.4 kPa" }
      ],
      answer: "Re = 124,502 → Turbulent flow. Head loss h_f = 3.21 m. Pressure drop Δp = 31.4 kPa. (Compare: if it were laminar flow at same velocity: h_f = (128μLQ)/(πgρD⁴) — but laminar at Re=124,502 is physically impossible.)"
    },
    commonMistakes: [
      { title: "Using diameter when hydraulic diameter is needed", desc: "For non-circular ducts, you must compute D_H = 4A/P and use that in the Re formula and Darcy-Weisbach. For a 100mm × 50mm rectangular duct: D_H = 4×(0.1×0.05)/(2×0.1+2×0.05) = 0.02/0.3 = 0.0667 m. Using either 100 mm or 50 mm directly gives wrong answers." },
      { title: "Confusing dynamic viscosity (μ) with kinematic viscosity (ν)", desc: "Re = VD/ν uses kinematic viscosity ν = μ/ρ (m²/s). Re = ρVD/μ uses dynamic viscosity μ (Pa·s). Both are correct but use the right form for the given data. At 20°C, water: μ = 1.002×10⁻³ Pa·s, ν = 1.004×10⁻⁶ m²/s. Air: μ = 1.81×10⁻⁵ Pa·s, ν = 1.51×10⁻⁵ m²/s." },
      { title: "Applying Hagen-Poiseuille to turbulent flow", desc: "Q = πD⁴Δp/(128μL) is ONLY valid for laminar flow (Re < 2300). Applying it to turbulent flow gives flow rates 3–10× too high. Always check Re first to determine which equations apply." }
    ],
    simulation: "fluid",
    realWorldUses: [
      { title: "HVAC Duct Design", icon: "🏢", description: "Air duct systems are designed for turbulent flow (better heat transfer) but limited velocity (noise and pressure drop). Typical design: Re = 20,000–100,000 in main ducts. Friction factor from Moody chart determines fan sizing and energy consumption." },
      { title: "Blood Flow Diagnostics", icon: "❤️", description: "Coronary artery diameter ~4mm, peak systolic velocity ~0.3 m/s → Re ≈ 1200 (laminar). At arterial stenoses (narrowings), local velocity can exceed 4 m/s → Re > 10,000 → turbulence, detectable by Doppler ultrasound or stethoscope." },
      { title: "Microfluidics & Lab-on-Chip", icon: "🔬", description: "Microchannels 10–500 μm wide operate at Re < 1 — deeply laminar regime (no turbulence). This means mixing is only by diffusion (very slow). Chaotic mixing is artificially induced using herringbone structures that create secondary flows despite low Re." },
      { title: "Pipeline Network Design", icon: "🛢️", description: "Natural gas transmission pipelines use Re = 10⁷–10⁸ (fully rough turbulent). The Colebrook friction factor depends on relative roughness ε/D, not Re in this regime. Pipeline engineers use the AGA fully turbulent flow equation directly." }
    ],
    resources: [
      { label: "Reynolds Number — The Efficient Engineer", url: "https://www.youtube.com/watch?v=M0bFMY8FalE", type: "video" },
      { label: "NPTEL — Fluid Mechanics (IIT Madras)", url: "https://nptel.ac.in/courses/112104118", type: "course" },
      { label: "MIT OCW — Fluid Mechanics", url: "https://ocw.mit.edu/courses/2-006-thermal-fluids-engineering-ii-spring-2008/", type: "course" },
      { label: "Engineering Toolbox — Reynolds Number", url: "https://www.engineeringtoolbox.com/reynolds-number-d_237.html", type: "article" }
    ]
  },

  {
    id: "bernoulli", title: "Bernoulli's Principle",
    category: "fluid", icon: "🌬️",
    tags: ["fluid", "Bernoulli", "pressure", "velocity", "aerodynamics", "venturi"],
    shortDesc: "Why fast fluid has lower pressure — the equation behind aircraft lift, carburettors, and flow measurement.",
    theory: {
      definition: "Bernoulli's equation states that for steady, inviscid, incompressible flow along a streamline, the sum of static pressure, dynamic pressure (kinetic energy per unit volume), and hydrostatic pressure is constant. It is an expression of the conservation of mechanical energy along a streamline, first stated by Daniel Bernoulli in 1738. Despite its idealisations, it provides remarkably accurate predictions for many practical flows.",
      keyConcepts: [
        { term: "Static Pressure (P)", desc: "The thermodynamic pressure of the fluid — what a pressure gauge flush with the flow boundary measures. Decreases as velocity increases (for constant elevation). This counter-intuitive relationship is the essence of Bernoulli." },
        { term: "Dynamic Pressure (½ρV²)", desc: "The kinetic energy of the fluid per unit volume. Increases with velocity squared. Stagnation pressure = static + dynamic = the maximum pressure at a point where flow is brought to rest (e.g. at a Pitot tube inlet)." },
        { term: "Limitations of Bernoulli", desc: "Bernoulli is INVALID where: viscous losses are significant (long pipes, boundary layers), flow is unsteady, fluid is compressible (M > 0.3), or streamlines cross (cannot apply across streamlines). Applying Bernoulli across a pump or turbine is wrong — those are not frictionless." },
        { term: "Continuity Equation", desc: "For incompressible flow: A₁V₁ = A₂V₂ = Q (constant). Combined with Bernoulli, this gives the Venturi effect: smaller area → higher velocity → lower pressure. The two equations together solve most inviscid pipe flow problems." }
      ],
      formulas: [
        { name: "Bernoulli's Equation (full)", eq: "P + ½ρV² + ρgz = constant (along streamline)", variables: { "P": "Static pressure (Pa)", "½ρV²": "Dynamic pressure (Pa)", "ρgz": "Hydrostatic pressure (Pa)", "z": "Elevation (m)" } },
        { name: "Bernoulli Between Two Points", eq: "P₁ + ½ρV₁² + ρgz₁ = P₂ + ½ρV₂² + ρgz₂", variables: {} },
        { name: "Continuity (Incompressible)", eq: "Q = A₁V₁ = A₂V₂", variables: { "A": "Cross-sectional area (m²)", "V": "Velocity (m/s)", "Q": "Volumetric flow rate (m³/s)" } },
        { name: "Venturi Meter Flow Rate", eq: "Q = A₂ √[2Δp / ρ(1 − (A₂/A₁)²)]", variables: { "Δp": "Pressure drop P₁ − P₂ (Pa)", "A₂": "Throat area (m²)" } },
        { name: "Lift Force (Thin Aerofoil)", eq: "L = ½ρV²C_L A", variables: { "C_L": "Lift coefficient (dimensionless, 0.1–1.5 for wings)", "A": "Wing planform area (m²)" } }
      ],
      explanation: "Bernoulli follows from integrating Euler's equation (Newton's law for inviscid fluid) along a streamline. The physics: as fluid accelerates into a constriction, each fluid parcel does so by using its pressure energy — static pressure converts to kinetic energy. The total mechanical energy (per unit volume) is conserved. This is why a venturi meter works: measure the pressure drop across a constriction, and you can infer the velocity (and hence flow rate) from Bernoulli + continuity. For aerofoils, the cambered upper surface deflects the streamlines closer together (higher velocity, lower pressure) than the lower surface — creating a net upward pressure force (lift). The actual calculation requires aerodynamic theory beyond simple Bernoulli."
    },
    practicalRules: [
      "Always check: is the flow approximately <strong>steady, incompressible, and inviscid</strong>? If not, Bernoulli needs correction terms.",
      "For gases: Bernoulli (incompressible form) is valid for <strong>Mach number M < 0.3</strong> (velocity < ~100 m/s in air at 20°C).",
      "Dynamic pressure ½ρV²: for air at sea level, ½ρ = <strong>0.612 kg/m³</strong> → at 10 m/s: q = 61.2 Pa; at 100 m/s: q = 6,120 Pa.",
      "Pitot-static tube measures <strong>stagnation pressure − static pressure = ½ρV²</strong> → velocity directly.",
      "Venturi, orifice, and nozzle flow meters all use Bernoulli + continuity — they are among the most accurate flow measurement devices (±0.5–1%).",
      "Never apply Bernoulli across a <strong>pump, fan, or turbine</strong> — these add or extract energy, violating the conservation assumption."
    ],
    workedExample: {
      problem: "A Venturi meter in a 100 mm diameter water pipe has a throat diameter of 50 mm. The upstream pressure gauge reads 180 kPa and the throat pressure gauge reads 120 kPa. Find the volumetric flow rate. ρ_water = 1000 kg/m³.",
      given: ["D₁ = 0.1 m → A₁ = π(0.1)²/4 = 7.854×10⁻³ m²", "D₂ = 0.05 m → A₂ = π(0.05)²/4 = 1.963×10⁻³ m²", "P₁ = 180,000 Pa, P₂ = 120,000 Pa → Δp = 60,000 Pa", "ρ = 1000 kg/m³, same elevation z₁ = z₂"],
      steps: [
        { text: "Area ratio A₂/A₁:", calc: "A₂/A₁ = 1.963×10⁻³ / 7.854×10⁻³ = 0.25\n(A₂/A₁)² = 0.0625" },
        { text: "Apply Venturi flow rate formula:", calc: "Q = A₂ × √[2Δp / ρ(1 − (A₂/A₁)²)]\nQ = 1.963×10⁻³ × √[2×60,000 / (1000 × (1 − 0.0625))]\nQ = 1.963×10⁻³ × √[120,000 / 937.5]" },
        { text: "Calculate under the square root:", calc: "120,000 / 937.5 = 128\n√128 = 11.31 m/s (this is the throat velocity V₂)" },
        { text: "Calculate flow rate:", calc: "Q = 1.963×10⁻³ × 11.31 = 0.02220 m³/s = 22.2 L/s" },
        { text: "Verify using continuity — find pipe velocity:", calc: "V₁ = Q/A₁ = 0.02220/7.854×10⁻³ = 2.83 m/s\nCheck Bernoulli: P₁ + ½ρV₁² = 180,000 + ½×1000×2.83² = 180,000 + 4,005 = 184,005 Pa\nP₂ + ½ρV₂² = 120,000 + ½×1000×11.31² = 120,000 + 63,958 = 183,958 Pa ✓ (agrees to rounding)" }
      ],
      answer: "Q = 22.2 L/s (0.0222 m³/s). Pipe velocity V₁ = 2.83 m/s, throat velocity V₂ = 11.31 m/s. Bernoulli equation verified: total pressure is constant at ≈184 kPa at both points."
    },
    commonMistakes: [
      { title: "Applying Bernoulli between points on different streamlines", desc: "Bernoulli's equation is valid ONLY along a single streamline (or in irrotational flow throughout). You cannot apply it between two points in different streams — e.g. comparing static pressure at the top and bottom of a stagnant fluid requires the hydrostatic equation, not Bernoulli." },
      { title: "Ignoring the elevation term for gas flows", desc: "For gas flows (low density), the ρgz term is negligible and can be dropped. But for liquid flows over any significant elevation change, omitting ρgz causes large errors. A 10m elevation difference in water is equivalent to a pressure of 98,100 Pa — comparable to pump pressures." },
      { title: "Claiming Bernoulli fully explains lift", desc: "The simple Bernoulli argument ('top surface is longer, so faster, so lower pressure') is incomplete and sometimes wrong. A symmetric aerofoil at zero angle of attack generates zero lift despite equal upper and lower path lengths. Lift requires circulation and angle of attack — full aerodynamic theory (Kutta condition) is needed." }
    ],
    simulation: "bernoulli",
    realWorldUses: [
      { title: "Aircraft Lift (Aerofoils)", icon: "✈️", description: "At cruise, a Boeing 747 wing generates ~3 MN of lift. The upper surface has lower static pressure due to higher velocity (curved path + circulation). The pressure difference across the wing (~10 kPa) times the wing area (~541 m²) equals the aircraft weight." },
      { title: "Pitot-Static Airspeed Measurement", icon: "🛩️", description: "Every commercial aircraft has Pitot tubes measuring stagnation pressure P_stag and static ports measuring P_static. Bernoulli gives V = √[2(P_stag − P_static)/ρ]. The Air France AF447 crash (2009) was partly caused by Pitot icing giving false airspeed readings." },
      { title: "Venturi Flow Meters in Industry", icon: "🏭", description: "Chemical and water treatment plants use Venturi meters in large pipes (DN200–DN1200) for highly accurate (±0.5–1%) continuous flow measurement with no moving parts. The differential pressure signal is converted to flow rate using Bernoulli + continuity." },
      { title: "Cardiologists & Echo-Doppler", icon: "❤️", description: "Modified Bernoulli equation (ΔP = 4V²) is used in echocardiography to estimate pressure gradients across stenotic heart valves from Doppler velocity measurements — a direct clinical application of fluid mechanics for cardiac diagnosis." }
    ],
    resources: [
      { label: "Bernoulli's Equation — The Efficient Engineer", url: "https://www.youtube.com/watch?v=DW4rItB20h4", type: "video" },
      { label: "NPTEL — Fluid Mechanics", url: "https://nptel.ac.in/courses/112104118", type: "course" },
      { label: "MIT OCW — Fluid Dynamics", url: "https://ocw.mit.edu/courses/2-006-thermal-fluids-engineering-ii-spring-2008/", type: "course" },
      { label: "Engineering Toolbox — Bernoulli", url: "https://www.engineeringtoolbox.com/bernoulli-equation-d_183.html", type: "article" }
    ]
  },

  {
    id: "centrifugal-pumps", title: "Centrifugal Pumps & Cavitation",
    category: "fluid", icon: "🔄",
    tags: ["fluid", "pump", "NPSH", "cavitation", "affinity laws", "centrifugal"],
    shortDesc: "Moving fluids with rotating impellers — the most common turbomachine, and why cavitation is its worst enemy.",
    theory: {
      definition: "A centrifugal pump converts mechanical energy from a rotating impeller into pressure and kinetic energy in a fluid. It is the most widely used pump type — from domestic water supply to oil pipelines, cooling towers to chemical plants. Understanding the H-Q characteristic curve, system curve intersection, NPSH (cavitation), and affinity laws is essential for pump selection, operation, and troubleshooting.",
      keyConcepts: [
        { term: "H-Q Characteristic Curve", desc: "The head-flow curve: head H (m) vs flow rate Q (m³/s). At zero flow (shut-off), H is maximum (shut-off head). As Q increases, H decreases. The operating point is the intersection of the pump curve with the system curve. Fixed-speed pumps have one curve; variable-speed pumps have a family of curves." },
        { term: "NPSH — Cavitation", desc: "NPSHA (Available) = (p_atm + p_static)/ρg + hs − hf − hv. NPSHR (Required) is given by the pump manufacturer. Cavitation occurs when NPSHA < NPSHR: local pressure drops below vapour pressure, forming vapour bubbles that collapse violently on high-pressure zones — eroding impeller blades, causing noise, vibration, and head loss." },
        { term: "Affinity Laws (Similarity Laws)", desc: "For geometrically similar pumps or the same pump at different speeds: Q ∝ N (speed), H ∝ N² (head), P ∝ N³ (power). Reducing speed by 20% cuts power by 51% (0.8³ = 0.512). Variable speed drives (VFDs) exploit the cubic power law for dramatic energy savings in variable-flow systems." },
        { term: "Specific Speed (Ns)", desc: "Ns = NQ^0.5/H^0.75 (dimensionless form). Classifies impeller geometry: low Ns → radial flow (centrifugal, high head, low flow). Medium Ns → mixed flow. High Ns → axial flow (propeller, low head, high flow). A pump runs most efficiently when operating at its design specific speed." }
      ],
      formulas: [
        { name: "Euler's Head (theoretical max)", eq: "H_th = (u₂Vw₂ − u₁Vw₁) / g", variables: { "u₂": "Impeller tip velocity = πD₂N/60 (m/s)", "Vw₂": "Whirl velocity at outlet (m/s)", "g": "9.81 m/s²" } },
        { name: "NPSH Available", eq: "NPSHA = (patm − pv)/(ρg) + hs − hf", variables: { "patm": "Atmospheric pressure (Pa)", "pv": "Vapour pressure of fluid (Pa)", "hs": "Static suction head (m, negative if pump is above reservoir)", "hf": "Friction loss in suction pipe (m)" } },
        { name: "Affinity Law — Flow", eq: "Q₂/Q₁ = N₂/N₁", variables: { "N": "Rotational speed (RPM)" } },
        { name: "Affinity Law — Head", eq: "H₂/H₁ = (N₂/N₁)²", variables: {} },
        { name: "Affinity Law — Power", eq: "P₂/P₁ = (N₂/N₁)³", variables: {} }
      ],
      explanation: "As the impeller rotates, fluid enters axially at the eye and is thrown radially outward by centrifugal force, gaining velocity. The volute casing then converts velocity (dynamic pressure) to static pressure. The H-Q curve slopes downward because at higher flow, more energy is lost to friction and velocity heads. The system curve (H_system = static head + K×Q²) intersects the pump curve at the duty point. Cavitation is a flow instability at the impeller inlet — the only cure is increasing suction pressure (NPSHA) or selecting a pump with lower NPSHR."
    },
    practicalRules: [
      "Always ensure <strong>NPSHA ≥ NPSHR + 0.5 m</strong> safety margin to prevent cavitation.",
      "Operating far from the BEP (best efficiency point) reduces efficiency and increases cavitation risk and bearing loads.",
      "Variable frequency drives (VFDs) saving: reducing speed to 80% cuts power to <strong>51%</strong> — VFDs pay back in 1–3 years for large pumps.",
      "Priming is required for centrifugal pumps — they cannot self-prime unless specially designed. Never run dry.",
      "Pump in <strong>series</strong>: heads add, flow rate same. Pump in <strong>parallel</strong>: flows add, head same — used for systems with variable demand.",
      "Impeller wear (erosion) from abrasive slurries increases NPSHR and shifts the H-Q curve downward — monitor performance regularly."
    ],
    workedExample: {
      problem: "A centrifugal pump draws water from a reservoir 3 m below pump centreline. Suction pipe: 80 mm dia, 5 m long, f=0.02. Atmospheric pressure: 101.3 kPa. Vapour pressure at 20°C: 2.34 kPa. ρ = 998 kg/m³. Pump NPSHR = 3.5 m. Flow rate = 0.025 m³/s. Is cavitation occurring?",
      given: ["hs = −3 m (pump above reservoir)", "D_s = 0.08 m, L_s = 5 m, f = 0.02", "patm = 101,300 Pa, pv = 2,340 Pa", "Q = 0.025 m³/s, NPSHR = 3.5 m"],
      steps: [
        { text: "Suction pipe velocity:", calc: "V = Q/A = 0.025/(π×0.08²/4) = 0.025/0.00503 = 4.97 m/s" },
        { text: "Friction head loss in suction pipe:", calc: "hf = f(L/D)(V²/2g) = 0.02×(5/0.08)×(4.97²/19.62) = 0.02×62.5×1.259 = 1.574 m" },
        { text: "NPSHA calculation:", calc: "NPSHA = (patm − pv)/(ρg) + hs − hf\n= (101300−2340)/(998×9.81) + (−3) − 1.574\n= 98960/9791 + (−3) − 1.574\n= 10.11 − 3 − 1.574 = 5.54 m" },
        { text: "Cavitation check:", calc: "NPSHA = 5.54 m, NPSHR = 3.5 m\nNPSHA (5.54) > NPSHR (3.5) ✓ — margin = 2.04 m\nNo cavitation. Margin is adequate (>0.5 m rule)." }
      ],
      answer: "NPSHA = 5.54 m > NPSHR = 3.5 m — no cavitation. Safety margin = 2.04 m (adequate). If the flow rate increased or suction lift increased, NPSHA would decrease and cavitation could occur."
    },
    commonMistakes: [
      { title: "Running a centrifugal pump dry", desc: "Centrifugal pumps require fluid for lubrication and cooling of mechanical seals and bearings. Running dry for even 30 seconds can destroy seals. Always prime before starting and install low-flow protection." },
      { title: "Ignoring the affinity law for power when using VFDs", desc: "Students assume power scales linearly with speed. Power ∝ N³ — at 60% speed, power = 0.6³ = 21.6% of full speed. This cubic relationship is why VFDs are the most energy-efficient flow control method." },
      { title: "Selecting pump at the wrong duty point", desc: "A pump must be selected to operate at or near its best efficiency point (BEP). Operating far left on the H-Q curve (low flow) causes recirculation and vibration. Operating far right (high flow) causes cavitation and motor overloading." }
    ],
    simulation: "pump",
    realWorldUses: [
      { title: "Municipal Water Supply", icon: "🏙️", description: "City water networks use multiple centrifugal pumps in parallel (identical) or in series (booster stations) to maintain pressure across varying demand. Variable speed drives save millions of kWh annually in large cities." },
      { title: "Oil Pipeline Pumping", icon: "🛢️", description: "Crude oil pipeline pump stations (every 50–100 km) use large centrifugal pumps driven by gas turbines. A 500 km pipeline may have 8–10 pump stations, each with 5–10 MW capacity." },
      { title: "Chemical Process Industry", icon: "⚗️", description: "Magnetic drive (sealless) centrifugal pumps handle aggressive acids and toxic chemicals without shaft seals — eliminating leak paths. Fluoropolymer-lined for H₂SO₄, HF, and other corrosive fluids." },
      { title: "Boiler Feed Pumps", icon: "♨️", description: "Boiler feed pumps (multi-stage centrifugal) pump water from 7 kPa (condenser) to 15 MPa (boiler) — a head of ~1500 m. These are among the most critical and expensive pumps in a power plant, operating continuously for years." }
    ],
    resources: [
      { label: "Centrifugal Pumps — The Efficient Engineer", url: "https://www.youtube.com/watch?v=4Z20lZ-RFsA", type: "video" },
      { label: "NPTEL — Fluid Mechanics & Hydraulic Machines", url: "https://nptel.ac.in/courses/112104118", type: "course" },
      { label: "Engineering Toolbox — Pump Laws", url: "https://www.engineeringtoolbox.com/affinity-laws-d_408.html", type: "article" }
    ]
  },

  {
    id: "pipe-networks", title: "Pipe Networks & Minor Losses",
    category: "fluid", icon: "🔧",
    tags: ["fluid", "pipe network", "head loss", "minor losses", "Moody", "Hardy Cross"],
    shortDesc: "Calculating pressure drops through complete pipe systems — fittings, bends, valves, and branching networks.",
    theory: {
      definition: "Real pipe systems consist of straight pipes, fittings (bends, tees, reducers), valves, and junctions forming series, parallel, and branching networks. Total head loss = major losses (pipe friction) + minor losses (fittings and valves). For complex networks, Hardy Cross iteration or matrix methods solve for flow distribution satisfying continuity and energy conservation simultaneously.",
      keyConcepts: [
        { term: "Major Losses (Darcy-Weisbach)", desc: "hf = fLV²/(2gD). The friction factor f from the Moody chart depends on Re and relative roughness ε/D. For fully turbulent rough flow, f is independent of Re (flat region of Moody chart). Colebrook equation: 1/√f = −2log(ε/(3.7D) + 2.51/(Re√f)) — implicit, requires iteration (or use Swamee-Jain explicit approximation)." },
        { term: "Minor Losses (K-factor Method)", desc: "hm = K × V²/(2g). K = loss coefficient, specific to each fitting type. Gate valve (fully open): K=0.2. Globe valve: K=10. 90° elbow: K=0.9. Tee (branch): K=1.0. Pipe exit: K=1.0. Pipe entry (sharp): K=0.5. At high velocities and short pipes, minor losses can exceed major losses." },
        { term: "Pipes in Series", desc: "Flow rate Q is the same through all pipes. Total head loss = sum of individual losses: H_total = hf1 + hf2 + ... + hm. Pipes in series add head losses — used when multiple pipe sizes or materials are joined end-to-end." },
        { term: "Pipes in Parallel", desc: "Head loss across each parallel branch is equal: hf_A = hf_B = ... = H_parallel. Total flow = sum of branch flows: Q_total = Q_A + Q_B + ... . Used in water distribution networks, heating systems, and industrial manifolds." }
      ],
      formulas: [
        { name: "Darcy-Weisbach (Major Loss)", eq: "hf = f × (L/D) × V²/(2g)", variables: { "f": "Darcy friction factor (from Moody chart)", "L": "Pipe length (m)", "D": "Pipe diameter (m)", "V": "Mean velocity (m/s)" } },
        { name: "Minor Loss", eq: "hm = K × V² / (2g)", variables: { "K": "Loss coefficient (fitting-specific)", "V²/2g": "Velocity head (m)" } },
        { name: "Equivalent Length Method", eq: "L_eq = K × D / f", variables: { "L_eq": "Equivalent pipe length that gives same loss as the fitting" } },
        { name: "Swamee-Jain (Explicit f)", eq: "f = 0.25 / [log(ε/(3.7D) + 5.74/Re^0.9)]²", variables: { "ε": "Pipe roughness (m): steel=0.046mm, concrete=0.3–3mm, smooth=0.0015mm" } }
      ],
      explanation: "Total system head loss is the sum of ALL losses from source to destination. At design flow, the pump must provide exactly this total head (pump H = system H). For networks, two laws must be satisfied: (1) Continuity: flow into each junction = flow out. (2) Energy: the sum of head losses around any closed loop = 0. Hardy Cross iteration starts with an assumed flow distribution satisfying continuity, then corrects each loop using ΔQ = −(ΣhL)/(nΣhL/Q) until convergence. Modern software (EPANET, WaterGEMS) solves these simultaneously in milliseconds."
    },
    practicalRules: [
      "Always calculate Re first — determines whether to use f=64/Re (laminar) or Moody chart (turbulent).",
      "For quick estimates of minor losses: use <strong>equivalent lengths</strong> (L_eq = KD/f) and add to pipe length before applying Darcy-Weisbach.",
      "Common mistake: forgetting the <strong>pipe exit loss (K=1.0)</strong> — equal to one full velocity head, significant at high velocities.",
      "Steel pipe roughness ε = 0.046 mm. Fully turbulent flow (rough pipe) starts at Re × (ε/D) > 200 approximately.",
      "For parallel pipes: express flow in terms of head using Q = C×√h for each branch, then sum: Q_total = ΣC_i×√H.",
      "Water hammer: sudden valve closure creates pressure wave = ρaV (a = wave speed ~1200 m/s) — can be thousands of times operating pressure. Always specify slow-closing valves."
    ],
    workedExample: {
      problem: "A steel pipe system: pipe 1 (D=100mm, L=50m) in series with a 90° elbow (K=0.9) and then pipe 2 (D=80mm, L=30m). Flow rate Q=0.015 m³/s, f=0.02 (both pipes). Find total head loss.",
      given: ["D₁=0.1m, L₁=50m", "D₂=0.08m, L₂=30m", "f=0.02 (both)", "K_elbow=0.9 (based on D₁ velocity)", "Q=0.015 m³/s"],
      steps: [
        { text: "Velocities in each pipe:", calc: "V₁ = Q/A₁ = 0.015/(π×0.1²/4) = 0.015/0.007854 = 1.91 m/s\nV₂ = Q/A₂ = 0.015/(π×0.08²/4) = 0.015/0.005027 = 2.98 m/s" },
        { text: "Major loss in Pipe 1:", calc: "hf1 = f(L₁/D₁)(V₁²/2g) = 0.02×(50/0.1)×(1.91²/19.62) = 0.02×500×0.186 = 1.86 m" },
        { text: "Minor loss at elbow (using V₁):", calc: "hm = K×V₁²/(2g) = 0.9×1.91²/19.62 = 0.9×0.186 = 0.167 m" },
        { text: "Major loss in Pipe 2:", calc: "hf2 = f(L₂/D₂)(V₂²/2g) = 0.02×(30/0.08)×(2.98²/19.62) = 0.02×375×0.452 = 3.39 m" },
        { text: "Total head loss:", calc: "H_total = hf1 + hm + hf2 = 1.86 + 0.167 + 3.39 = 5.42 m" }
      ],
      answer: "Total head loss = 5.42 m. The smaller pipe (D₂) contributes 3.39 m (63% of total) despite being shorter — because velocity scales as 1/D² and head loss as V²/D. This demonstrates why pipe diameter is the critical design variable."
    },
    commonMistakes: [
      { title: "Using velocity head of wrong pipe for minor losses", desc: "At a pipe reducer, use the velocity of the downstream (smaller) pipe for the minor loss calculation. Using the upstream velocity underestimates the loss — and at a pipe expansion, use upstream velocity. Always identify which side the velocity head refers to." },
      { title: "Ignoring minor losses in short pipe systems", desc: "In a 2 m pipe with a globe valve (K=10) and exit (K=1), minor losses = 11 velocity heads. For a 2 m pipe with f=0.02 and D=50mm, major loss = f(L/D) = 0.8 velocity heads. Minor losses dominate by 14×. Never ignore minor losses in short, valve-rich systems." },
      { title: "Assuming f is constant when pipe conditions change", desc: "f depends on Re (velocity-dependent) and ε/D. If you change pipe diameter, roughness, or flow rate, f changes. Re-calculate f from the Moody chart or Colebrook equation for every new condition. Using f from a different pipe or flow rate is a common error in network analysis." }
    ],
    simulation: "bernoulli",
    realWorldUses: [
      { title: "Building Water Distribution", icon: "🏢", description: "High-rise buildings use a ring main with pumped circulation. Each floor branch draws from the ring, maintaining pressure. EPANET simulation ensures adequate pressure at all outlets under peak demand conditions." },
      { title: "Natural Gas Distribution", icon: "🔥", description: "City gas networks operate at low pressure (21 mbar distribution) — at these pressures, compressibility is negligible and pipe flow equations apply directly. Hardy Cross or EPANET gives flows in all branches of the branched-and-looped network." },
      { title: "Fire Sprinkler Systems", icon: "🚒", description: "Fire sprinkler design (NFPA 13) requires hydraulic calculation of all pipes to verify each sprinkler delivers the required flow rate at the required pressure — a classic pipe network problem under worst-case scenarios." },
      { title: "Process Plant Cooling Water Networks", icon: "🏭", description: "Refineries and chemical plants have complex cooling water networks serving hundreds of heat exchangers. Pipe network analysis determines flow rates, pressures, and pump selections — and identifies which heat exchangers will be starved of cooling under partial pump outage." }
    ],
    resources: [
      { label: "Pipe Flow & Losses — The Efficient Engineer", url: "https://www.youtube.com/watch?v=wFcuMFJnZBM", type: "video" },
      { label: "NPTEL — Fluid Mechanics (Pipe Flow)", url: "https://nptel.ac.in/courses/112104118", type: "course" },
      { label: "Engineering Toolbox — Pipe Pressure Drop", url: "https://www.engineeringtoolbox.com/darcy-weisbach-equation-d_646.html", type: "article" }
    ]
  },

  {
    id: "boundary-layer", title: "Boundary Layer Theory",
    category: "fluid", icon: "🌬️",
    tags: ["fluid", "aerodynamics", "drag", "boundary layer", "viscosity", "shear"],
    shortDesc: "The thin layer of fluid near a solid surface where viscous forces dominate and drag is born.",
    theory: {
      definition: "When a viscous fluid flows over a solid surface, the fluid particles directly in contact with the surface stick to it due to the 'no-slip condition' (velocity = 0). This causes a velocity gradient to develop: velocity increases from zero at the wall to the free-stream velocity over a small distance normal to the surface. This thin region is called the boundary layer. Understanding it is critical for predicting skin friction drag and flow separation.",
      keyConcepts: [
        { term: "Laminar vs Turbulent BL", desc: "The boundary layer starts as smooth, laminar flow. As it grows downstream, instabilities trigger a transition to chaotic, turbulent flow. A turbulent boundary layer is thicker, mixes faster, and creates much higher skin friction drag, but it is less prone to separation." },
        { term: "Boundary Layer Thickness (δ)", desc: "Defined conventionally as the distance from the wall where the fluid velocity reaches 99% of the free-stream velocity (u = 0.99U). It grows continuously with distance (x) downstream." },
        { term: "Skin Friction Drag", desc: "The force exerted by the fluid on the surface due to viscous shear stress at the wall (τ_w = μ * du/dy at y=0). Integrating this shear stress over the entire surface gives the total skin friction drag force." },
        { term: "Flow Separation", desc: "If the fluid is flowing into an adverse pressure gradient (pressure increasing in the direction of flow, like over the rear of a car or airfoil), the slow-moving fluid in the boundary layer can stop and reverse direction, causing the flow to detach from the surface. This creates a massive low-pressure wake and high pressure drag." }
      ],
      formulas: [
        { name: "Local Reynolds Number", eq: "Re_x = (ρ·U·x) / μ = (U·x) / ν", variables: { "U": "Free-stream velocity", "x": "Distance from leading edge" } },
        { name: "Laminar BL Thickness (Blasius)", eq: "δ_lam = 5.0·x / √(Re_x)", variables: { "Re_x < 5×10⁵": "Laminar regime" } },
        { name: "Turbulent BL Thickness", eq: "δ_turb = 0.38·x / (Re_x)^(1/5)", variables: { "Re_x > 5×10⁵": "Turbulent regime" } },
        { name: "Wall Shear Stress (Laminar)", eq: "τ_w = 0.332·(ρ·U²) / √(Re_x)", variables: { "τ_w": "Local shear stress at the wall" } },
        { name: "Skin Friction Coefficient", eq: "C_f = τ_w / (½·ρ·U²)", variables: {} }
      ],
      explanation: "Ludwig Prandtl introduced the boundary layer concept in 1904, revolutionizing fluid mechanics. By dividing the flow into two regions—a thin viscous boundary layer near the surface and an inviscid (frictionless) flow everywhere else—engineers could mathematically solve otherwise impossible aerodynamic problems. Drag on a streamlined body (like a wing) is mostly skin friction (viscous drag), while drag on a bluff body (like a truck) is mostly pressure drag caused by boundary layer separation."
    },
    practicalRules: [
      "Transition from laminar to turbulent flow over a flat plate typically occurs at a critical Reynolds number of <strong>Re_x ≈ 5 × 10⁵</strong>.",
      "Golf balls have dimples to intentionally force the boundary layer to become <strong>turbulent</strong>. A turbulent boundary layer has more kinetic energy and resists separation longer, shrinking the wake and drastically reducing pressure drag.",
      "To prevent flow separation on aircraft wings at high angles of attack, vortex generators (small fins) are used to energize the boundary layer.",
      "Skin friction drag is much higher in turbulent flow than in laminar flow. Sailplane (glider) wings are meticulously designed to maintain laminar flow for as long as possible."
    ],
    workedExample: {
      problem: "Air (ν = 1.5×10⁻⁵ m²/s, ρ = 1.2 kg/m³) flows at U = 10 m/s over a smooth flat plate. Determine the boundary layer thickness and local skin friction coefficient at x = 0.5 m from the leading edge.",
      given: ["U = 10 m/s", "x = 0.5 m", "ν = 1.5×10⁻⁵ m²/s", "ρ = 1.2 kg/m³"],
      steps: [
        { text: "Calculate local Reynolds number:", calc: "Re_x = (U·x) / ν\n= (10 × 0.5) / 1.5×10⁻⁵\n= 5 / 0.000015 = 333,333\nSince Re_x < 5×10⁵, the boundary layer is still laminar." },
        { text: "Calculate Boundary Layer Thickness (Blasius):", calc: "δ = 5.0·x / √(Re_x)\n= 5.0 × 0.5 / √(333,333)\n= 2.5 / 577.35 = 0.00433 m = 4.33 mm" },
        { text: "Calculate local skin friction coefficient:", calc: "C_fx = 0.664 / √(Re_x)\n= 0.664 / 577.35 = 0.00115" },
        { text: "Calculate wall shear stress:", calc: "τ_w = C_fx × ½ρU²\n= 0.00115 × 0.5 × 1.2 × (10)²\n= 0.00115 × 60 = 0.069 Pa" }
      ],
      answer: "At x = 0.5m, the flow is laminar. The boundary layer is 4.33 mm thick. The skin friction coefficient is 0.00115, resulting in a tiny local wall shear stress of 0.069 Pa."
    },
    commonMistakes: [
      { title: "Assuming boundary layer stops growing", desc: "The boundary layer thickness δ grows continuously as √x (laminar) or x^0.8 (turbulent) down the entire length of the surface. It never reaches a constant thickness on a flat plate." },
      { title: "Confusing skin friction with total drag", desc: "Total drag = Skin Friction Drag + Pressure (Form) Drag. For a flat plate parallel to the flow, drag is 100% skin friction. For a flat plate perpendicular to the flow, drag is 100% pressure drag." }
    ],
    simulation: "boundary-layer",
    realWorldUses: [
      { title: "Aerodynamics of Cars", icon: "🏎️", description: "Car designs aim to keep the boundary layer attached as it moves over the rear window and trunk. Separation creates a large wake (vacuum) pulling the car backward (pressure drag)." },
      { title: "Shark Skin / Swimsuits", icon: "🦈", description: "Shark skin has microscopic riblets that manage the turbulent boundary layer, reducing shear stress. High-tech swimsuits mimic this to reduce drag for Olympic swimmers." },
      { title: "Wind Turbine Blades", icon: "🌬️", description: "Blade profiles are optimized to delay boundary layer separation (stall) to maintain high lift and generate maximum torque at low wind speeds." }
    ],
    resources: [
      { label: "Boundary Layers — The Efficient Engineer", url: "https://www.youtube.com/watch?v=1zeW8e0EwT4", type: "video" },
      { label: "MIT OCW — Viscous Flows", url: "https://ocw.mit.edu/courses/2-06-fluid-dynamics-spring-2013/", type: "course" }
    ]
  }

);
