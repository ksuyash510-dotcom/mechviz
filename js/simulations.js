// simulations.js — Interactive Canvas Simulations
// 1. Beam Deflection    2. Rankine Cycle
// 3. Gear Trains        4. Stress-Strain Curve
// 5. Fluid Flow (Reynolds Number)

function initSimulation(type, concept) {
  const container = document.getElementById('simulation-container');
  container.innerHTML = '';
  const builders = {
    'beam':         buildBeamSim,
    'rankine':      buildRankineSim,
    'gears':        buildGearSim,
    'stress-strain':buildStressStrainSim,
    'fluid':        buildFluidSim
  };
  if (builders[type]) builders[type](container);
}

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════
function makeCanvas(container, w, h) {
  const wrap = document.createElement('div');
  wrap.className = 'sim-canvas-wrapper';
  const c = document.createElement('canvas');
  c.width  = w; c.height = h;
  c.style.width  = '100%';
  c.style.maxWidth = w + 'px';
  wrap.appendChild(c);
  container.appendChild(wrap);
  return c;
}

function makeControls(container) {
  const d = document.createElement('div');
  d.className = 'sim-controls';
  container.appendChild(d);
  return d;
}

function makeOutput(container) {
  const d = document.createElement('div');
  d.className = 'sim-output';
  container.appendChild(d);
  return d;
}

function addSlider(parent, label, min, max, val, step, unit, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'sim-control';
  const lbl = document.createElement('label');
  lbl.innerHTML = `${label}: <span id="lbl_${label.replace(/\s/g,'_')}">${val}${unit}</span>`;
  const slider = document.createElement('input');
  slider.type = 'range'; slider.min = min; slider.max = max;
  slider.value = val; slider.step = step;
  slider.addEventListener('input', () => {
    lbl.querySelector('span').textContent = slider.value + unit;
    onChange(Number(slider.value));
  });
  wrap.appendChild(lbl); wrap.appendChild(slider);
  parent.appendChild(wrap);
  return slider;
}

function addSelect(parent, label, options, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'sim-control';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  const sel = document.createElement('select');
  options.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.value; opt.textContent = o.label;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => onChange(sel.value));
  wrap.appendChild(lbl); wrap.appendChild(sel);
  parent.appendChild(wrap);
  return sel;
}

function addOutputItem(parent, id, label) {
  const d = document.createElement('div');
  d.className = 'sim-output-item';
  d.innerHTML = `<div class="val" id="${id}">—</div><div class="lbl">${label}</div>`;
  parent.appendChild(d);
}

// ════════════════════════════════════════════════
//  1. BEAM DEFLECTION
// ════════════════════════════════════════════════
function buildBeamSim(container) {
  const W = 560, H = 280;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');

  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'beam_defl', 'Max Deflection (mm)');
  addOutputItem(output, 'beam_stress', 'Max Bending Stress (MPa)');

  const state = { load: 5000, length: 4, E: 200e9, beamType: 'ss' };

  // Materials
  const mats = {
    steel:    { E: 200e9, label: 'Steel (200 GPa)' },
    aluminum: { E: 70e9,  label: 'Aluminium (70 GPa)' },
    timber:   { E: 12e9,  label: 'Timber (12 GPa)' }
  };

  // I-beam cross-section 100×50mm → I = 50×100³/12 = 4.17e-6 m⁴
  const I = (0.05 * Math.pow(0.1, 3)) / 12; // 4.17e-6 m⁴
  const c = 0.05; // distance from NA to outer fibre

  addSlider(controls, 'Load (W)', 500, 20000, state.load, 100, ' N', v => { state.load = v; draw(); });
  addSlider(controls, 'Span (L)', 1, 10, state.length, 0.5, ' m', v => { state.length = v; draw(); });
  addSelect(controls, 'Material', Object.entries(mats).map(([k,v]) => ({ value: k, label: v.label })), v => { state.E = mats[v].E; draw(); });
  addSelect(controls, 'Support Type', [
    { value: 'ss', label: 'Simply Supported (Point Load)' },
    { value: 'udl', label: 'Simply Supported (UDL)' },
    { value: 'cant', label: 'Cantilever (Free End Load)' }
  ], v => { state.beamType = v; draw(); });

  function calcDeflection(x) {
    const { load: W, length: L, E, beamType } = state;
    const EI = E * I;
    if (beamType === 'ss') {
      // Simply supported, point load at centre
      if (x <= L / 2)
        return (W * x * (3 * L * L - 4 * x * x)) / (48 * EI);
      else
        return (W * (L - x) * (3 * L * L - 4 * (L - x) * (L - x))) / (48 * EI);
    } else if (beamType === 'udl') {
      // Simply supported, UDL  w = W/L
      const w = W / L;
      return (w * x * (L * L * L - 2 * L * x * x + x * x * x)) / (24 * EI);
    } else {
      // Cantilever, free-end point load
      return (W * x * x * (3 * L - x)) / (6 * EI);
    }
  }

  function maxDeflection() {
    const { load: W, length: L, E, beamType } = state;
    const EI = E * I;
    if (beamType === 'ss')   return (W * L * L * L) / (48 * EI);
    if (beamType === 'udl')  return (5 * (W / L) * Math.pow(L, 4)) / (384 * EI);
    return (W * L * L * L) / (3 * EI);
  }

  function maxBendingMoment() {
    const { load: W, length: L, beamType } = state;
    if (beamType === 'ss')  return W * L / 4;
    if (beamType === 'udl') return (W / L) * L * L / 8;
    return W * L;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { length: L, beamType } = state;

    const margin = 60;
    const beamY  = 120;
    const beamW  = W - 2 * margin;

    // Background
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#1e2d45';
    ctx.lineWidth = 1;
    for (let y = 40; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ─ Deflection Scale ─
    const dMax = maxDeflection();
    const scale = dMax > 0 ? Math.min((H - beamY - 30) / dMax, 50000) : 1000;

    // ─ Undeflected beam (ghost) ─
    ctx.strokeStyle = '#2a3a55';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(margin, beamY);
    ctx.lineTo(W - margin, beamY);
    ctx.stroke();
    ctx.setLineDash([]);

    // ─ Deflected beam curve ─
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#6366f180';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x    = (i / steps) * L;
      const defl = calcDeflection(x);
      const px   = margin + (x / L) * beamW;
      const py   = beamY + defl * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ─ Supports ─
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;

    if (beamType === 'cant') {
      // Fixed support at left
      ctx.fillStyle = '#1a2236';
      ctx.fillRect(margin - 24, beamY - 20, 24, 40);
      ctx.strokeStyle = '#10b981';
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(margin - 24, beamY + i * 8);
        ctx.lineTo(margin - 36, beamY + i * 8 + 10);
        ctx.stroke();
      }
    } else {
      // Triangle supports at both ends
      [margin, W - margin].forEach(px => {
        ctx.beginPath();
        ctx.moveTo(px, beamY);
        ctx.lineTo(px - 12, beamY + 22);
        ctx.lineTo(px + 12, beamY + 22);
        ctx.closePath();
        ctx.fillStyle = '#10b98155';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.stroke();
        // Rollers
        ctx.beginPath();
        ctx.arc(px - 6, beamY + 28, 4, 0, Math.PI * 2);
        ctx.arc(px + 6, beamY + 28, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
      });
    }

    // ─ Load arrow(s) ─
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle   = '#f59e0b';
    ctx.lineWidth   = 2.5;

    if (state.beamType === 'udl') {
      // Draw distributed load arrows across the full span
      const numArrows = 9;
      for (let i = 0; i <= numArrows; i++) {
        const ax = margin + (i / numArrows) * beamW;
        ctx.beginPath(); ctx.moveTo(ax, beamY - 36); ctx.lineTo(ax, beamY - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax, beamY - 4); ctx.lineTo(ax - 5, beamY - 16); ctx.lineTo(ax + 5, beamY - 16); ctx.closePath(); ctx.fill();
      }
      // Horizontal bar connecting arrow tops
      ctx.beginPath(); ctx.moveTo(margin, beamY - 36); ctx.lineTo(W - margin, beamY - 36); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`w = ${(state.load / state.length).toFixed(0)} N/m  (Total W = ${state.load} N)`, W / 2, beamY - 46);
    } else {
      // Point load arrow (centre for SS, free end for cantilever)
      const loadX = state.beamType === 'cant' ? W - margin : W / 2;
      ctx.beginPath(); ctx.moveTo(loadX, beamY - 50); ctx.lineTo(loadX, beamY - 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(loadX, beamY - 5); ctx.lineTo(loadX - 7, beamY - 20); ctx.lineTo(loadX + 7, beamY - 20); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`W = ${state.load} N`, loadX, beamY - 56);
    }

    // Span label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`L = ${state.length} m`, W / 2, H - 12);

    // Max deflection marker
    const midDefl = maxDeflection();
    const midX    = beamType === 'cant' ? W - margin : W / 2;
    const midY    = beamY + midDefl * scale;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(midX, midY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Output values
    document.getElementById('beam_defl').textContent   = (dMax * 1000).toFixed(3) + ' mm';
    document.getElementById('beam_stress').textContent  =
      ((maxBendingMoment() * c) / I / 1e6).toFixed(2) + ' MPa';
  }

  draw();
}

// ════════════════════════════════════════════════
//  2. RANKINE CYCLE (T-s Diagram)
// ════════════════════════════════════════════════
function buildRankineSim(container) {
  const W = 560, H = 340;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');

  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'rank_eff', 'Thermal Efficiency');
  addOutputItem(output, 'rank_wnet', 'Net Work (kJ/kg)');
  addOutputItem(output, 'rank_tboi', 'Boiler Temp (°C)');

  // Steam saturation properties — from IAPWS steam tables (accurate values)
  // Columns: P(MPa), T_sat(°C), hf(kJ/kg), hg(kJ/kg), sf(kJ/kg·K), sg(kJ/kg·K)
  const STEAM_TABLE = [
    [0.005, 32.9,  137.8, 2561.5, 0.476, 8.394],
    [0.010, 45.8,  191.8, 2584.7, 0.649, 8.150],
    [0.020, 60.1,  251.4, 2609.7, 0.832, 7.909],
    [0.050, 81.3,  340.5, 2646.0, 1.091, 7.594],
    [0.100, 99.6,  417.4, 2675.5, 1.303, 7.359],
    [0.200, 120.2, 504.7, 2706.7, 1.530, 7.127],
    [0.300, 133.5, 561.4, 2725.3, 1.672, 6.992],
    [0.500, 151.8, 640.2, 2748.7, 1.861, 6.821],
    [0.700, 165.0, 697.1, 2763.5, 1.992, 6.708],
    [1.000, 179.9, 762.8, 2778.1, 2.139, 6.586],
    [1.500, 198.3, 844.9, 2791.0, 2.315, 6.444],
    [2.000, 212.4, 908.8, 2799.5, 2.447, 6.340],
    [3.000, 233.9,1008.4, 2804.2, 2.645, 6.185],
    [4.000, 250.4,1087.4, 2800.3, 2.797, 6.069],
    [5.000, 263.9,1154.2, 2794.3, 2.921, 5.973],
    [7.000, 285.8,1267.5, 2772.1, 3.122, 5.813],
    [10.00, 311.0,1407.6, 2724.5, 3.360, 5.614],
  ];

  function steamSat(P_MPa) {
    // Clamp to table range
    const Pc = Math.max(0.005, Math.min(10.0, P_MPa));
    // Find surrounding rows
    let lo = STEAM_TABLE[0], hi = STEAM_TABLE[STEAM_TABLE.length - 1];
    for (let i = 0; i < STEAM_TABLE.length - 1; i++) {
      if (STEAM_TABLE[i][0] <= Pc && STEAM_TABLE[i + 1][0] >= Pc) {
        lo = STEAM_TABLE[i]; hi = STEAM_TABLE[i + 1]; break;
      }
    }
    // Log-linear interpolation on pressure (better for steam tables)
    const t = (Math.log(Pc) - Math.log(lo[0])) / (Math.log(hi[0]) - Math.log(lo[0]));
    const interp = (a, b) => a + t * (b - a);
    const Tsat = interp(lo[1], hi[1]);
    const hf   = interp(lo[2], hi[2]);
    const hg   = interp(lo[3], hi[3]);
    const sf   = interp(lo[4], hi[4]);
    const sg   = interp(lo[5], hi[5]);
    return { Tsat, hf, hg, sf, sg, hfg: hg - hf, sfg: sg - sf };
  }

  const state = { P_boil: 3.0, P_cond: 0.01 };

  addSlider(controls, 'Boiler Pressure', 1, 10, state.P_boil, 0.5, ' MPa', v => { state.P_boil = v; draw(); });
  addSlider(controls, 'Condenser Pressure', 5, 50, Math.round(state.P_cond * 1000), 5, ' kPa', v => { state.P_cond = v / 1000; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const { P_boil, P_cond } = state;
    const boil = steamSat(P_boil);
    const cond = steamSat(P_cond);

    // Cycle states (approximate):
    // 1 = turbine inlet (saturated vapour at boiler P)
    // 2 = turbine exit (wet steam at condenser P, isentropic)
    // 3 = condenser exit (sat liquid at cond P)
    // 4 = pump exit (pressurised liquid ≈ sat liquid at boiler P, approx)

    const h1 = boil.hg;
    const s1 = boil.sg;
    const T1 = boil.Tsat;

    const s2 = s1;  // isentropic
    const x2 = (s2 - cond.sf) / cond.sfg;  // quality
    const h2 = cond.hf + x2 * cond.hfg;
    const T2 = cond.Tsat;

    const h3 = cond.hf;
    const s3 = cond.sf;
    const T3 = cond.Tsat;

    const vf = 0.001; // m³/kg (approx)
    const Wp = vf * (P_boil - P_cond) * 1000; // kJ/kg
    const h4 = h3 + Wp;
    const s4 = s3;
    const T4 = T3;

    const Wt   = h1 - h2;
    const Wnet = Wt - Wp;
    const Qin  = h1 - h4;
    const eta  = Wnet / Qin;

    // ── Canvas coordinate helpers ──
    const pad = { left: 60, right: 30, top: 30, bottom: 50 };
    const cW  = W - pad.left - pad.right;
    const cH  = H - pad.top  - pad.bottom;

    const sMin = 0.5, sMax = 8.2;
    const TMin = 0,   TMax = T1 + 60;

    const sx = s => pad.left + ((s - sMin) / (sMax - sMin)) * cW;
    const ty = T => pad.top  + (1 - (T - TMin) / (TMax - TMin)) * cH;

    // Grid
    ctx.strokeStyle = '#1e2d45';
    ctx.lineWidth   = 1;
    for (let t = 0; t <= TMax; t += 100) {
      ctx.beginPath(); ctx.moveTo(pad.left, ty(t)); ctx.lineTo(W - pad.right, ty(t)); ctx.stroke();
    }
    for (let s = 1; s <= 8; s++) {
      ctx.beginPath(); ctx.moveTo(sx(s), pad.top); ctx.lineTo(sx(s), H - pad.bottom); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, H - pad.bottom);
    ctx.lineTo(W - pad.right, H - pad.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Entropy s (kJ/kg·K)', W / 2, H - 10);
    ctx.save();
    ctx.translate(14, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Temperature T (°C)', 0, 0);
    ctx.restore();

    // Saturation dome (simplified)
    ctx.beginPath();
    ctx.strokeStyle = '#2a4a6a';
    ctx.lineWidth = 1.5;
    // Left side (liquid line): from 0°C to critical point (374°C, ~3.1 kJ/kg·K)
    for (let T = 10; T <= 374; T += 5) {
      const frac = T / 374;
      const sf   = 0.3 + frac * 2.8;  // approx
      if (T === 10) ctx.moveTo(sx(sf), ty(T));
      else ctx.lineTo(sx(sf), ty(T));
    }
    // Right side (vapour line): from critical point back
    for (let T = 370; T >= 10; T -= 5) {
      const frac = T / 374;
      const sg   = 9.15 - frac * 1.85;
      ctx.lineTo(sx(sg), ty(T));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 24, 40, 0.5)';
    ctx.fill();
    ctx.stroke();

    // ── Cycle path ──
    // State points
    const pts = {
      '1': [sx(s1), ty(T1)],
      '2': [sx(s2), ty(T2)],
      '3': [sx(s3), ty(T3)],
      '4': [sx(s4), ty(T4)]
    };

    // Filled cycle area
    ctx.beginPath();
    ctx.moveTo(...pts['1']);
    ctx.lineTo(...pts['2']);  // turbine (1→2) isentropic (vertical)
    ctx.lineTo(...pts['3']);  // condenser (2→3)
    ctx.lineTo(...pts['4']);  // pump (3→4) isentropic (vertical)
    ctx.lineTo(...pts['1']);  // boiler (4→1)
    ctx.closePath();
    ctx.fillStyle = 'rgba(99,102,241,0.15)';
    ctx.fill();

    // Draw cycle lines
    const segments = [
      { from: '4', to: '1', color: '#f59e0b', label: 'Boiler\n(heat in)' },
      { from: '1', to: '2', color: '#6366f1', label: 'Turbine\n(work out)' },
      { from: '2', to: '3', color: '#06b6d4', label: 'Condenser\n(heat out)' },
      { from: '3', to: '4', color: '#10b981', label: 'Pump\n(work in)' }
    ];

    segments.forEach(seg => {
      ctx.beginPath();
      ctx.strokeStyle = seg.color;
      ctx.lineWidth   = 3;
      ctx.moveTo(...pts[seg.from]);
      ctx.lineTo(...pts[seg.to]);
      ctx.stroke();
    });

    // State point dots + labels
    Object.entries(pts).forEach(([label, [x, y]]) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth   = 2;
      ctx.stroke();

      ctx.fillStyle   = '#f1f5f9';
      ctx.font        = 'bold 12px sans-serif';
      ctx.textAlign   = 'center';
      const offsets = { '1': [0, -14], '2': [16, 6], '3': [-14, 14], '4': [-14, -10] };
      const [ox, oy] = offsets[label] || [10, -10];
      ctx.fillText(label, x + ox, y + oy);
    });

    // Outputs
    document.getElementById('rank_eff').textContent  = (eta * 100).toFixed(1) + '%';
    document.getElementById('rank_wnet').textContent = Wnet.toFixed(0) + ' kJ/kg';
    document.getElementById('rank_tboi').textContent = T1.toFixed(0) + '°C';

    // Source note
    ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Values from IAPWS steam tables (log-linear interpolation)', pad.left, H - 4);
  }

  draw();
}

// ════════════════════════════════════════════════
//  3. GEAR TRAINS (Animated)
// ════════════════════════════════════════════════
function buildGearSim(container) {
  const W = 560, H = 300;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');

  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'gear_ratio', 'Gear Ratio');
  addOutputItem(output, 'gear_out_rpm', 'Output RPM');
  addOutputItem(output, 'gear_out_torque', 'Output Torque');

  const state = { T1: 20, T2: 40, inputRPM: 1500, inputTorque: 10, angle: 0 };
  let animId = null;

  addSlider(controls, 'Driver Teeth', 10, 60, state.T1, 2, '', v => { state.T1 = v; updateOutput(); });
  addSlider(controls, 'Driven Teeth', 10, 60, state.T2, 2, '', v => { state.T2 = v; updateOutput(); });
  addSlider(controls, 'Input RPM', 100, 3000, state.inputRPM, 50, ' RPM', v => { state.inputRPM = v; updateOutput(); });
  addSlider(controls, 'Input Torque', 5, 100, state.inputTorque, 5, ' Nm', v => { state.inputTorque = v; updateOutput(); });

  function updateOutput() {
    const GR = state.T2 / state.T1;
    document.getElementById('gear_ratio').textContent     = GR.toFixed(2) + ':1';
    document.getElementById('gear_out_rpm').textContent   = (state.inputRPM / GR).toFixed(0) + ' RPM';
    document.getElementById('gear_out_torque').textContent= (state.inputTorque * GR * 0.95).toFixed(1) + ' Nm';
  }

  // ── Involute gear tooth profile generator ──────────────────────────────────
  // Standard 20° pressure angle, full-depth teeth (addendum = m, dedendum = 1.25m)
  // where module m = pitch_radius / (T/2) = 2r/T
  function involute(r_base, t) {
    // Involute of circle: parametric form
    const x = r_base * (Math.cos(t) + t * Math.sin(t));
    const y = r_base * (Math.sin(t) - t * Math.cos(t));
    return { x, y };
  }

  function drawGear(cx, cy, r_pitch, teeth, angle, color) {
    const phi      = 20 * Math.PI / 180;   // 20° standard pressure angle
    const m        = (2 * r_pitch) / teeth; // module
    const r_base   = r_pitch * Math.cos(phi);  // base circle radius
    const r_add    = r_pitch + m;              // addendum circle (tip)
    const r_ded    = r_pitch - 1.25 * m;       // dedendum circle (root)
    const r_root   = Math.max(r_ded, r_base * 0.85);

    // Involute parameter range: from base circle to addendum circle
    const t_start = 0;
    const t_end   = Math.sqrt((r_add / r_base) * (r_add / r_base) - 1);

    // Angular half-thickness of tooth at pitch circle (standard: π/2T radians)
    const pitch_angle      = (2 * Math.PI) / teeth;
    const tooth_half_angle = Math.PI / (2 * teeth); // half tooth width at pitch circle
    // Involute angle at pitch circle (angle of involute point at r_pitch)
    const t_pitch  = Math.sqrt((r_pitch / r_base) * (r_pitch / r_base) - 1);
    const inv_phi  = Math.atan(t_pitch) - t_pitch; // involute function at pitch circle

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // ── Gear body gradient
    const grad = ctx.createRadialGradient(0, 0, r_root * 0.3, 0, 0, r_add);
    const baseCol = color.replace('cc', '');
    grad.addColorStop(0, baseCol + 'dd');
    grad.addColorStop(0.6, baseCol + 'aa');
    grad.addColorStop(1,   baseCol + '88');

    // ── Build full tooth-profile path
    ctx.beginPath();

    for (let i = 0; i < teeth; i++) {
      const tooth_angle = i * pitch_angle;

      // Right flank of tooth (involute rotated to position)
      const flank_offset_R = tooth_angle + tooth_half_angle - inv_phi;
      // Left flank (mirrored)
      const flank_offset_L = tooth_angle - tooth_half_angle + inv_phi;

      const steps = 8;
      // Root → right flank start (on base circle)
      const t0_pt = involute(r_base, t_start);
      const ang0  = Math.atan2(t0_pt.y, t0_pt.x);

      // Right flank (from base to addendum)
      const rightPts = [];
      for (let s = 0; s <= steps; s++) {
        const t  = t_start + (s / steps) * t_end;
        const pt = involute(r_base, t);
        // Rotate by flank_offset_R
        const ra = Math.atan2(pt.y, pt.x) + flank_offset_R;
        const rr = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
        rightPts.push({ x: rr * Math.cos(ra), y: rr * Math.sin(ra) });
      }

      // Left flank (involute mirrored — y negated, then rotated)
      const leftPts = [];
      for (let s = steps; s >= 0; s--) {
        const t  = t_start + (s / steps) * t_end;
        const pt = involute(r_base, t);
        const ra = -Math.atan2(pt.y, pt.x) + flank_offset_L;
        const rr = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
        leftPts.push({ x: rr * Math.cos(ra), y: rr * Math.sin(ra) });
      }

      // Root arc (from previous tooth left flank to this tooth right flank)
      const prevLeftEnd = leftPts[leftPts.length - 1];
      const thisRightStart = rightPts[0];

      if (i === 0) {
        ctx.moveTo(thisRightStart.x, thisRightStart.y);
      } else {
        // Root fillet arc
        const rootAngle1 = Math.atan2(prevLeftEnd.y, prevLeftEnd.x);
        const rootAngle2 = Math.atan2(thisRightStart.y, thisRightStart.x);
        ctx.arc(0, 0, r_root, rootAngle1, rootAngle2);
        ctx.lineTo(thisRightStart.x, thisRightStart.y);
      }

      // Right flank up
      rightPts.forEach(p => ctx.lineTo(p.x, p.y));

      // Tip arc (addendum)
      const tipAngle1 = Math.atan2(rightPts[rightPts.length - 1].y, rightPts[rightPts.length - 1].x);
      const tipAngle2 = Math.atan2(leftPts[0].y, leftPts[0].x);
      ctx.arc(0, 0, r_add, tipAngle1, tipAngle2);

      // Left flank down
      leftPts.forEach(p => ctx.lineTo(p.x, p.y));
    }

    // Close with root arc back to start
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#0e162890';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // ── Dedendum / root circle fill (solid body inside root)
    ctx.beginPath();
    ctx.arc(0, 0, r_root, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // ── Web / inner ring
    ctx.beginPath();
    ctx.arc(0, 0, r_pitch * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#1a2236';
    ctx.fill();
    ctx.strokeStyle = '#2a3a5580';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Spokes (number scales with gear size)
    const numSpokes = teeth <= 16 ? 4 : teeth <= 30 ? 5 : 6;
    ctx.strokeStyle = '#2a3a55cc';
    ctx.lineWidth = Math.max(1, r_pitch * 0.06);
    ctx.lineCap = 'round';
    for (let i = 0; i < numSpokes; i++) {
      const a = (i / numSpokes) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r_pitch * 0.15, Math.sin(a) * r_pitch * 0.15);
      ctx.lineTo(Math.cos(a) * r_pitch * 0.52, Math.sin(a) * r_pitch * 0.52);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';

    // ── Hub
    ctx.beginPath();
    ctx.arc(0, 0, r_pitch * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = '#64748b';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Keyway slot in hub (realistic detail)
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(-r_pitch * 0.05, -r_pitch * 0.13, r_pitch * 0.1, r_pitch * 0.1);

    // ── Rotation marker line
    ctx.strokeStyle = '#f1f5f990';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(r_pitch * 0.14, 0);
    ctx.lineTo(r_pitch * 0.5, 0);
    ctx.stroke();

    // ── Pitch circle (dashed — the true rolling circle)
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = color.replace('cc', '') + '50';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r_pitch, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  function animate() {
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#1a2a3a';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const { T1, T2, inputRPM } = state;
    const GR = T2 / T1;

    // ── CORRECT: pitch circle radius ∝ number of teeth (fundamental gear law)
    // Scale so the larger gear always fits nicely in the canvas
    const ppt   = Math.min(4.8, 190 / Math.max(T1, T2)); // pixels per tooth
    const r1    = Math.max(28, T1 * ppt);
    const r2    = Math.max(28, T2 * ppt);
    // r2 / r1 = T2 / T1 exactly — this is the gear ratio shown visually

    // Position gears side by side touching
    const gap    = 6;
    const totalW = r1 + r2 + gap;
    const cx     = W / 2;
    const cy     = H / 2;
    const x1     = cx - totalW / 2 + r1;
    const x2     = cx + totalW / 2 - r2;

    drawGear(x1, cy, r1, T1, state.angle, '#6366f1cc');
    drawGear(x2, cy, r2, T2, -state.angle * (T1 / T2), '#10b981cc');

    // ── Pitch circle dashed rings (the true meshing circles — radius ∝ teeth)
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#6366f160';
    ctx.beginPath(); ctx.arc(x1, cy, r1, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#10b98160';
    ctx.beginPath(); ctx.arc(x2, cy, r2, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // ── Pitch point (contact point on pitch circles)
    ctx.beginPath();
    ctx.arc(x1 + r1, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // ── Ratio annotation
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`GR = ${GR.toFixed(2)}:1  |  r₁:r₂ = ${T1}:${T2}`, W / 2, H - 10);

    // Gear labels above and below
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#6366f1';
    ctx.fillText(`Driver  T₁=${T1}`, x1, cy - r1 - 18);
    ctx.fillText(`${inputRPM} RPM`, x1, cy - r1 - 5);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Driven  T₂=${T2}`, x2, cy - r2 - 18);
    ctx.fillText(`${(inputRPM / GR).toFixed(0)} RPM`, x2, cy - r2 - 5);

    // Advance angle (proportional to RPM)
    state.angle += (inputRPM / 60) * (Math.PI * 2) * (1 / 60);

    animId = requestAnimationFrame(animate);
    updateOutput();
  }

  // Stop animation when tab changes
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      } else if (btn.dataset.tab === 'tab-simulation' && !animId) {
        animate();
      }
    });
  });

  animate();
}

// ════════════════════════════════════════════════
//  4. STRESS-STRAIN CURVE
// ════════════════════════════════════════════════
function buildStressStrainSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');

  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'ss_E', "Young's Modulus");
  addOutputItem(output, 'ss_ys', 'Yield Strength');
  addOutputItem(output, 'ss_uts', 'UTS');

  const materials = {
    mild_steel: {
      label: 'Mild Steel (Fe250)',
      E: 200, Ey: 250, Ep: 300, Eu: 410, ef: 25,
      colorE: '#6366f1', colorP: '#8b5cf6'
    },
    high_steel: {
      label: 'High Carbon Steel',
      E: 210, Ey: 600, Ep: 620, Eu: 800, ef: 8,
      colorE: '#ef4444', colorP: '#f97316'
    },
    aluminum: {
      label: 'Aluminium 6061',
      E: 70, Ey: 270, Ep: 280, Eu: 310, ef: 12,
      colorE: '#06b6d4', colorP: '#3b82f6'
    },
    cast_iron: {
      label: 'Cast Iron (Brittle)',
      E: 170, Ey: 200, Ep: 0, Eu: 250, ef: 0.6,
      colorE: '#94a3b8', colorP: '#94a3b8'
    }
  };

  let curMat = 'mild_steel';

  addSelect(controls, 'Material', Object.entries(materials).map(([k, v]) => ({ value: k, label: v.label })), v => {
    curMat = v; draw();
  });

  function buildCurve(mat) {
    const { E, Ey, Ep, Eu, ef } = mat;
    const pts = [];
    // Elastic region: σ = E × ε (linear)
    const eAtYield = Ey / E; // in %  (using E in GPa, stress in MPa)
    const steps_e  = 40;
    for (let i = 0; i <= steps_e; i++) {
      const e = (i / steps_e) * eAtYield;
      pts.push([e, e * E]);
    }
    if (mat === materials.cast_iron || curMat === 'cast_iron') {
      // Brittle: straight to fracture
      pts.push([ef, Eu]);
      return pts;
    }
    // Yield plateau (mild steel style)
    if (Ep > Ey) {
      const eAtPlat = eAtYield + (Ep - Ey) / E + 0.5;
      for (let i = 0; i <= 10; i++) {
        const e = eAtYield + (i / 10) * (eAtPlat - eAtYield);
        pts.push([e, Ey + (Ep - Ey) * Math.sqrt(i / 10) * 0.5]);
      }
    }
    // Strain hardening to UTS
    const eAtUTS = eAtYield + 2;
    const steps_h = 30;
    for (let i = 1; i <= steps_h; i++) {
      const t   = i / steps_h;
      const e   = (eAtYield + (eAtUTS - eAtYield) * t);
      const sig = Ep + (Eu - Ep) * Math.pow(t, 0.5);
      pts.push([e, sig]);
    }
    // Necking to fracture
    const steps_n = 20;
    for (let i = 1; i <= steps_n; i++) {
      const t   = i / steps_n;
      const e   = eAtUTS + t * (ef - eAtUTS);
      const sig = Eu - (Eu - Ey * 0.7) * Math.pow(t, 0.6);
      pts.push([e, sig]);
    }
    return pts;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const mat  = materials[curMat];
    const pts  = buildCurve(mat);

    const pad  = { left: 65, right: 20, top: 20, bottom: 50 };
    const cW   = W - pad.left - pad.right;
    const cH   = H - pad.top  - pad.bottom;

    const eMax = Math.max(...pts.map(p => p[0])) * 1.12;
    const sMax = Math.max(...pts.map(p => p[1])) * 1.2;

    const ex = e => pad.left + (e / eMax) * cW;
    const sy = s => pad.top  + (1 - s / sMax) * cH;

    // Grid
    ctx.strokeStyle = '#1e2d45';
    ctx.lineWidth = 1;
    for (let s = 0; s <= sMax; s += 100) {
      ctx.beginPath(); ctx.moveTo(pad.left, sy(s)); ctx.lineTo(W - pad.right, sy(s)); ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(s, pad.left - 4, sy(s) + 3);
    }
    for (let e = 0; e <= eMax; e += 2) {
      ctx.beginPath(); ctx.moveTo(ex(e), pad.top); ctx.lineTo(ex(e), H - pad.bottom); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, H - pad.bottom);
    ctx.lineTo(W - pad.right, H - pad.bottom);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Strain ε (%)', W / 2, H - 10);
    ctx.save();
    ctx.translate(14, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Stress σ (MPa)', 0, 0);
    ctx.restore();

    // Toughness area (fill under curve)
    ctx.beginPath();
    ctx.moveTo(ex(pts[0][0]), sy(pts[0][1]));
    pts.forEach(p => ctx.lineTo(ex(p[0]), sy(p[1])));
    ctx.lineTo(ex(pts[pts.length - 1][0]), sy(0));
    ctx.lineTo(ex(pts[0][0]), sy(0));
    ctx.closePath();
    ctx.fillStyle = mat.colorE + '20';
    ctx.fill();

    // Stress-strain curve
    ctx.beginPath();
    ctx.strokeStyle = mat.colorE;
    ctx.lineWidth   = 3;
    ctx.shadowColor = mat.colorE + '80';
    ctx.shadowBlur  = 6;
    pts.forEach((p, i) => {
      i === 0 ? ctx.moveTo(ex(p[0]), sy(p[1])) : ctx.lineTo(ex(p[0]), sy(p[1]));
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Key point markers
    const { Ey, Eu, ef, E } = mat;
    const eAtY = Ey / E;

    const keyPts = [
      { e: eAtY, s: Ey, label: `Yield\n${Ey} MPa`, color: '#f59e0b' },
      { e: eAtY + 2, s: Eu, label: `UTS\n${Eu} MPa`, color: '#ef4444' },
      { e: ef, s: curMat === 'cast_iron' ? Eu : Ey * 0.7, label: 'Fracture', color: '#94a3b8' }
    ];

    keyPts.forEach(kp => {
      if (kp.e > eMax || kp.s > sMax) return;
      ctx.beginPath();
      ctx.arc(ex(kp.e), sy(kp.s), 5, 0, Math.PI * 2);
      ctx.fillStyle = kp.color;
      ctx.fill();
      ctx.fillStyle = kp.color;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      kp.label.split('\n').forEach((line, i) => {
        ctx.fillText(line, ex(kp.e) + 8, sy(kp.s) + i * 13 - 6);
      });
    });

    // Elastic slope annotation
    ctx.strokeStyle = '#2a4a6a';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ex(0), sy(0));
    ctx.lineTo(ex(eAtY * 0.7), sy(Ey * 0.7));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#6366f1';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`E = ${E} GPa`, ex(eAtY * 0.1), sy(Eu * 0.5));

    // Output
    document.getElementById('ss_E').textContent  = E + ' GPa';
    document.getElementById('ss_ys').textContent = Ey + ' MPa';
    document.getElementById('ss_uts').textContent = Eu + ' MPa';
  }

  draw();
}

// ════════════════════════════════════════════════
//  5. FLUID FLOW (Reynolds Number)
// ════════════════════════════════════════════════
function buildFluidSim(container) {
  const W = 560, H = 240;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');

  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'fl_re',   'Reynolds Number');
  addOutputItem(output, 'fl_type', 'Flow Regime');
  addOutputItem(output, 'fl_ff',   'Friction Factor f');

  const fluids = {
    water: { rho: 1000, mu: 0.001,   label: 'Water (20°C)' },
    oil:   { rho: 900,  mu: 0.1,     label: 'Oil (20°C)' },
    air:   { rho: 1.2,  mu: 0.0000181, label: 'Air (20°C)' }
  };

  const state = { velocity: 1.5, diameter: 50, fluid: 'water' };
  let particles = [];
  let animId2   = null;

  function initParticles() {
    particles = [];
    const pipeY1 = 60, pipeY2 = H - 60;
    const pipeH  = pipeY2 - pipeY1;
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: pipeY1 + Math.random() * pipeH,
        baseY: pipeY1 + Math.random() * pipeH,
        vy: 0,
        hue: 180 + Math.random() * 60
      });
    }
  }

  addSlider(controls, 'Velocity', 1, 100, state.velocity * 10, 1, ' (×0.1 m/s)', v => {
    state.velocity = v / 10; calcAndDraw();
  });
  addSlider(controls, 'Diameter', 10, 200, state.diameter, 5, ' mm', v => {
    state.diameter = v; calcAndDraw();
  });
  addSelect(controls, 'Fluid', Object.entries(fluids).map(([k, v]) => ({ value: k, label: v.label })), v => {
    state.fluid = v; calcAndDraw();
  });

  function calcRe() {
    const f = fluids[state.fluid];
    return (f.rho * state.velocity * (state.diameter / 1000)) / f.mu;
  }

  function calcAndDraw() {}  // handled in animation loop

  initParticles();

  function animate2() {
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const Re    = calcRe();
    const pipeY1 = 60, pipeY2 = H - 60, pipeH = pipeY2 - pipeY1;
    const isTurb = Re > 4000;
    const isTrans = Re >= 2300 && Re <= 4000;

    // Pipe walls
    const wallColor = isTurb ? '#ef4444' : isTrans ? '#f59e0b' : '#10b981';
    ctx.fillStyle   = '#1a2236';
    ctx.fillRect(0, pipeY1, W, pipeH);
    ctx.fillStyle = wallColor + '40';
    ctx.fillRect(0, pipeY1 - 10, W, 10);
    ctx.fillRect(0, pipeY2, W, 10);
    ctx.strokeStyle = wallColor;
    ctx.lineWidth   = 2;
    ctx.strokeRect(0, pipeY1 - 10, W, pipeH + 20);

    // Speed of particles
    const speedFactor = state.velocity * 2;

    // Update & draw particles
    particles.forEach(p => {
      const turbFactor = isTurb ? (Re - 4000) / 40000 : 0;
      const transFactor = isTrans ? 0.3 : 0;

      // Move right
      p.x += speedFactor * (0.8 + Math.random() * 0.4);

      if (isTurb) {
        p.vy = (Math.random() - 0.5) * 4 * turbFactor * 5 + 0.3;
        p.y += p.vy;
        // Bounce off walls
        if (p.y < pipeY1 + 2) p.y = pipeY1 + 2;
        if (p.y > pipeY2 - 2) p.y = pipeY2 - 2;
      } else if (isTrans) {
        if (Math.random() < 0.1) p.vy = (Math.random() - 0.5) * 2;
        p.y += p.vy * 0.5;
        p.vy *= 0.9;
        if (p.y < pipeY1 + 2) { p.y = pipeY1 + 2; p.vy = 0; }
        if (p.y > pipeY2 - 2) { p.y = pipeY2 - 2; p.vy = 0; }
      } else {
        // Laminar: drift back to base Y
        p.y += (p.baseY - p.y) * 0.1;
      }

      if (p.x > W + 4) {
        p.x = -4;
        p.y = pipeY1 + Math.random() * pipeH;
        p.baseY = p.y;
      }

      const alpha = isTurb ? 0.7 : 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
      ctx.fill();
    });

    // Velocity profile for laminar
    if (!isTurb && !isTrans) {
      const R = pipeH / 2;
      const cy = (pipeY1 + pipeY2) / 2;
      ctx.strokeStyle = '#6366f150';
      ctx.lineWidth = 1;
      for (let y = pipeY1; y <= pipeY2; y += 8) {
        const r = Math.abs(y - cy) / R;
        const v = speedFactor * 10 * (1 - r * r);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(40 + v, y);
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`V = ${state.velocity} m/s`, 10, pipeY1 - 18);
    ctx.fillText(`D = ${state.diameter} mm`, 10, pipeY1 - 6);

    const label = isTurb ? '🌀 TURBULENT' : isTrans ? '⚡ TRANSITIONAL' : '〰️ LAMINAR';
    ctx.fillStyle = wallColor;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, W - 10, pipeY1 - 10);

    // Friction factor
    const f = isTurb ? 0.316 / Math.pow(Re, 0.25) : (Re > 0 ? 64 / Re : 0);

    // Output values
    document.getElementById('fl_re').textContent   = Re.toLocaleString('en', { maximumFractionDigits: 0 });
    document.getElementById('fl_type').textContent = isTurb ? 'Turbulent' : isTrans ? 'Transitional' : 'Laminar';
    document.getElementById('fl_ff').textContent   = f.toFixed(4);

    animId2 = requestAnimationFrame(animate2);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId2) {
        cancelAnimationFrame(animId2); animId2 = null;
      } else if (btn.dataset.tab === 'tab-simulation' && !animId2) {
        animate2();
      }
    });
  });

  animate2();
}

// ════════════════════════════════════════════════
//  6. TORSION
// ════════════════════════════════════════════════
function buildTorsionSim(container) {
  const W = 560, H = 260;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'tor_stress', 'Max Shear Stress (MPa)');
  addOutputItem(output, 'tor_angle',  'Angle of Twist (°)');
  addOutputItem(output, 'tor_j',      'Polar Moment J (cm⁴)');

  const state = { T: 500, d_outer: 50, d_inner: 0, L: 1.0, G: 80e9 };

  addSlider(controls, 'Torque (T)', 100, 2000, state.T, 50, ' N·m', v => { state.T = v; draw(); });
  addSlider(controls, 'Outer Diameter', 20, 100, state.d_outer, 2, ' mm', v => { state.d_outer = v; draw(); });
  addSlider(controls, 'Inner Diameter', 0, 80, state.d_inner, 2, ' mm (0 = solid)', v => { state.d_inner = Math.min(v, state.d_outer - 4); draw(); });
  addSlider(controls, 'Shaft Length', 0.2, 3, state.L * 10, 1, ' (×0.1 m)', v => { state.L = v / 10; draw(); });

  function calcJ() {
    const ro = state.d_outer / 2000, ri = state.d_inner / 2000;
    return (Math.PI / 32) * (Math.pow(state.d_outer / 1000, 4) - Math.pow(state.d_inner / 1000, 4));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const J     = calcJ();
    const r_o   = (state.d_outer / 1000) / 2;
    const tauMax = (state.T * r_o) / J;
    const phi   = (state.T * state.L) / (state.G * J);

    // Shaft body
    const shaftY = H / 2, shaftH = state.d_outer * 1.5;
    const shaftX1 = 60, shaftX2 = W - 60;
    const grad = ctx.createLinearGradient(0, shaftY - shaftH / 2, 0, shaftY + shaftH / 2);
    grad.addColorStop(0, '#4f5e7a');
    grad.addColorStop(0.4, '#8b9ab8');
    grad.addColorStop(0.6, '#6b7d9a');
    grad.addColorStop(1, '#2a3548');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.rect(shaftX1, shaftY - shaftH / 2, shaftX2 - shaftX1, shaftH);
    ctx.fill();
    ctx.strokeStyle = '#2a3a55';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hollow bore
    if (state.d_inner > 2) {
      const boreH = state.d_inner * 1.5;
      ctx.fillStyle = '#0e1628';
      ctx.beginPath();
      ctx.ellipse(shaftX1 + 1, shaftY, 8, boreH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(shaftX2 - 1, shaftY, 8, boreH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fixed wall (left)
    ctx.fillStyle = '#1a2236';
    ctx.fillRect(shaftX1 - 20, shaftY - 60, 20, 120);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    for (let y = shaftY - 60; y < shaftY + 60; y += 12) {
      ctx.beginPath(); ctx.moveTo(shaftX1 - 20, y); ctx.lineTo(shaftX1 - 32, y + 10); ctx.stroke();
    }

    // Twist spiral lines on shaft surface
    const numLines = 6;
    const phiDeg = phi * (180 / Math.PI);
    for (let i = 0; i < numLines; i++) {
      const t = i / numLines;
      const startAngle = t * Math.PI * 2;
      ctx.strokeStyle = `rgba(99,102,241,${0.4 + 0.3 * Math.sin(startAngle)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = shaftX1; x <= shaftX2; x += 2) {
        const progress = (x - shaftX1) / (shaftX2 - shaftX1);
        const angle    = startAngle + progress * phi * 3;
        const y        = shaftY + (shaftH / 2 - 4) * Math.sin(angle);
        x === shaftX1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Torque arrows (right end)
    const arrowR = shaftH / 2 + 18;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth   = 2.5;
    for (let i = 0; i < 3; i++) {
      const a1 = (i / 3) * Math.PI * 2;
      const a2 = a1 + Math.PI * 0.5;
      ctx.beginPath();
      ctx.arc(shaftX2 + 16, shaftY, arrowR - i * 4, a1, a2);
      ctx.stroke();
    }

    // Angle annotation
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`T = ${state.T} N·m`, shaftX2 + 40, shaftY + arrowR + 20);

    // Length label
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(shaftX1, shaftY + shaftH / 2 + 12); ctx.lineTo(shaftX2, shaftY + shaftH / 2 + 12); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`L = ${state.L.toFixed(1)} m`, W / 2, shaftY + shaftH / 2 + 28);

    // Outputs
    document.getElementById('tor_stress').textContent = (tauMax / 1e6).toFixed(1) + ' MPa';
    document.getElementById('tor_angle').textContent  = (phi * 180 / Math.PI).toFixed(3) + '°';
    document.getElementById('tor_j').textContent      = (J * 1e8).toFixed(4) + ' cm⁴';
  }
  draw();
}

// ════════════════════════════════════════════════
//  7. EULER BUCKLING
// ════════════════════════════════════════════════
function buildBucklingSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'buck_pcr',    'Critical Load P_cr (kN)');
  addOutputItem(output, 'buck_stress', 'Critical Stress (MPa)');
  addOutputItem(output, 'buck_lambda', 'Slenderness Ratio λ');

  const state = { L: 3, b: 50, h: 50, E: 200e9, endCond: 'pinpin', load: 0 };
  let animAngle = 0, animDir = 1;

  addSlider(controls, 'Column Height', 1, 8, state.L, 0.5, ' m', v => { state.L = v; draw(0); });
  addSlider(controls, 'Width (mm)', 20, 120, state.b, 5, ' mm', v => { state.b = v; draw(0); });
  addSlider(controls, 'Height (mm)', 20, 120, state.h, 5, ' mm', v => { state.h = v; draw(0); });
  addSelect(controls, 'End Conditions', [
    { value: 'pinpin',   label: 'Pin-Pin (Le = L)' },
    { value: 'fixfree',  label: 'Fixed-Free (Le = 2L)' },
    { value: 'fixfix',   label: 'Fixed-Fixed (Le = 0.5L)' },
    { value: 'fixpin',   label: 'Fixed-Pin (Le = 0.7L)' }
  ], v => { state.endCond = v; draw(0); });

  const leFactors = { pinpin: 1.0, fixfree: 2.0, fixfix: 0.5, fixpin: 0.7 };

  function calcPcr() {
    const b = state.b / 1000, h = state.h / 1000;
    const I = Math.min((b * h * h * h) / 12, (h * b * b * b) / 12);
    const A = b * h;
    const Le = state.L * leFactors[state.endCond];
    const Pcr = (Math.PI * Math.PI * state.E * I) / (Le * Le);
    const k   = Math.sqrt(I / A);
    const lambda = Le / k;
    const sigma_cr = (Math.PI * Math.PI * state.E) / (lambda * lambda);
    return { Pcr, sigma_cr, lambda, Le };
  }

  function draw(deflection) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const { Pcr, sigma_cr, lambda, Le } = calcPcr();
    const cw = 16;
    const colH = H - 100;
    const cx   = W / 2;
    const topY = 50, botY = topY + colH;

    // Ground hatch
    ctx.fillStyle = '#1a2236';
    ctx.fillRect(cx - 40, botY, 80, 10);
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 40 + i * 14, botY + 10);
      ctx.lineTo(cx - 40 + i * 14 - 8, botY + 20);
      ctx.stroke();
    }

    // Draw column with deflection
    const amplitude = deflection * 40;
    ctx.strokeStyle = deflection > 0.3 ? '#ef4444' : '#6366f1';
    ctx.lineWidth   = cw;
    ctx.lineCap     = 'round';
    ctx.shadowColor = deflection > 0.3 ? '#ef444480' : '#6366f180';
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = topY + t * colH;
      const x = cx + amplitude * Math.sin(Math.PI * t);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Top load arrow
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle   = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, topY - 40); ctx.lineTo(cx, topY - 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx - 8, topY - 16); ctx.lineTo(cx + 8, topY - 16); ctx.closePath(); ctx.fill();

    // Load label
    const loadLabel = deflection > 0 ? `P > P_cr !` : `P = ${(Pcr / 1000).toFixed(1)} kN`;
    ctx.fillStyle = deflection > 0.3 ? '#ef4444' : '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(loadLabel, cx, topY - 48);

    // End condition symbols
    const endC = state.endCond;
    [topY, botY].forEach((y, idx) => {
      if (endC === 'pinpin') {
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx - 10, y + (idx === 0 ? -18 : 18)); ctx.lineTo(cx + 10, y + (idx === 0 ? -18 : 18)); ctx.closePath(); ctx.fill();
      } else if (endC === 'fixfix' || (endC === 'fixpin' && idx === 1) || (endC === 'fixfree' && idx === 1)) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(cx - 24, y - 6, 48, 12);
      }
    });

    // Stats
    document.getElementById('buck_pcr').textContent    = (Pcr / 1000).toFixed(2) + ' kN';
    document.getElementById('buck_stress').textContent = (sigma_cr / 1e6).toFixed(0) + ' MPa';
    document.getElementById('buck_lambda').textContent = lambda.toFixed(0);
  }

  // Animation of buckling
  let animId3 = null, buckling = false, buckleVal = 0;
  const buckleBtn = document.createElement('button');
  buckleBtn.textContent = '▶ Simulate Buckling';
  buckleBtn.style.cssText = 'background:var(--accent);border:none;color:#fff;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;margin-top:12px;width:100%';
  container.appendChild(buckleBtn);

  buckleBtn.addEventListener('click', () => {
    buckleVal = 0; buckleBtn.disabled = true;
    const animBuckle = () => {
      buckleVal = Math.min(buckleVal + 0.015, 1);
      draw(buckleVal);
      if (buckleVal < 1) { animId3 = requestAnimationFrame(animBuckle); }
      else { setTimeout(() => { buckleVal = 0; draw(0); buckleBtn.disabled = false; }, 1500); }
    };
    animId3 = requestAnimationFrame(animBuckle);
  });

  draw(0);
}

// ════════════════════════════════════════════════
//  8. SPRING
// ════════════════════════════════════════════════
function buildSpringSim(container) {
  const W = 560, H = 300;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'spr_defl',   'Deflection δ (mm)');
  addOutputItem(output, 'spr_energy', 'Strain Energy (J)');
  addOutputItem(output, 'spr_stress', 'Max Shear Stress (MPa)');

  const state = { F: 200, k: 8000, d_wire: 6, D_coil: 40 };

  addSlider(controls, 'Applied Force', 10, 800, state.F, 10, ' N', v => { state.F = v; draw(); });
  addSlider(controls, 'Spring Stiffness k', 1000, 20000, state.k, 500, ' N/m', v => { state.k = v; draw(); });
  addSlider(controls, 'Wire Diameter d', 3, 12, state.d_wire, 0.5, ' mm', v => { state.d_wire = v; draw(); });
  addSlider(controls, 'Coil Diameter D', 20, 80, state.D_coil, 2, ' mm', v => { state.D_coil = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const { F, k, d_wire, D_coil } = state;
    const delta = F / k;
    const U     = 0.5 * k * delta * delta;
    const C     = D_coil / d_wire;
    const Kw    = (4 * C - 1) / (4 * C - 4) + 0.615 / C;
    const tau   = Kw * (8 * F * (D_coil / 1000)) / (Math.PI * Math.pow(d_wire / 1000, 3));

    // Draw spring (natural length vs compressed)
    const naturalCoils = 8;
    const naturalLen = 200;
    const deflPx     = Math.min(delta * 3000, naturalLen * 0.7);
    const compLen    = naturalLen - deflPx;

    const springX    = W / 2;
    const topY       = 40;
    const botY       = topY + naturalLen;
    const compBotY   = topY + compLen;

    // Ceiling
    ctx.fillStyle = '#1a2236';
    ctx.fillRect(springX - 50, topY - 16, 100, 16);
    for (let i = 0; i < 7; i++) { ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(springX - 50 + i * 14, topY - 16); ctx.lineTo(springX - 50 + i * 14 - 8, topY - 28); ctx.stroke(); }

    // Spring coils
    const coilColor = delta > 0.04 ? '#ef4444' : '#6366f1';
    ctx.strokeStyle = coilColor;
    ctx.lineWidth = Math.max(2, d_wire / 3);
    ctx.shadowColor = coilColor + '60';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    const pts = naturalCoils * 20;
    for (let i = 0; i <= pts; i++) {
      const t = i / pts;
      const y = topY + 4 + t * (compLen - 8);
      const x = springX + (D_coil / 2) * Math.sin(t * naturalCoils * Math.PI * 2);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Mass block (attached at bottom of spring)
    const blockW = 60, blockH = 40;
    ctx.fillStyle = '#1a2236';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.fillRect(springX - blockW / 2, compBotY, blockW, blockH);
    ctx.strokeRect(springX - blockW / 2, compBotY, blockW, blockH);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${F} N`, springX, compBotY + 25);

    // Force arrow (downward)
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle   = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(springX, compBotY + blockH); ctx.lineTo(springX, compBotY + blockH + 28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(springX, compBotY + blockH + 34); ctx.lineTo(springX - 7, compBotY + blockH + 18); ctx.lineTo(springX + 7, compBotY + blockH + 18); ctx.closePath(); ctx.fill();

    // Deflection annotation
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(springX + D_coil / 2 + 20, botY); ctx.lineTo(springX + D_coil / 2 + 20, compBotY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`δ = ${(delta * 1000).toFixed(1)} mm`, springX + D_coil / 2 + 26, (botY + compBotY) / 2 + 4);

    // Side labels
    ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`k = ${k} N/m`, springX - D_coil / 2 - 10, topY + compLen / 2);

    document.getElementById('spr_defl').textContent   = (delta * 1000).toFixed(2) + ' mm';
    document.getElementById('spr_energy').textContent = U.toFixed(3) + ' J';
    document.getElementById('spr_stress').textContent = (tau / 1e6).toFixed(1) + ' MPa';
  }
  draw();
}

// ════════════════════════════════════════════════
//  9. OTTO CYCLE (P-V Diagram)
// ════════════════════════════════════════════════
function buildOttoSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'otto_eff',  'Thermal Efficiency');
  addOutputItem(output, 'otto_t3',   'Peak Temp T₃ (K)');
  addOutputItem(output, 'otto_mep',  'MEP (bar)');

  const state = { r: 10, T1: 300, P1: 1.01, Qin: 800 };
  const gamma = 1.4, cv = 0.718;

  addSlider(controls, 'Compression Ratio r', 4, 16, state.r, 0.5, ':1', v => { state.r = v; draw(); });
  addSlider(controls, 'Intake Temp T₁', 280, 340, state.T1, 5, ' K', v => { state.T1 = v; draw(); });
  addSlider(controls, 'Heat Input Q_in', 400, 1500, state.Qin, 50, ' kJ/kg', v => { state.Qin = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const { r, T1, P1, Qin } = state;
    const V1 = 1.0, V2 = V1 / r;

    const T2 = T1 * Math.pow(r, gamma - 1);
    const P2 = P1 * Math.pow(r, gamma);
    const T3 = T2 + Qin / cv;
    const P3 = P2 * (T3 / T2);
    const T4 = T3 / Math.pow(r, gamma - 1);
    const P4 = P3 / Math.pow(r, gamma);
    const Qout = cv * (T4 - T1);
    const eta = 1 - Qout / Qin;
    const Wnet = Qin - Qout;
    const displacement = V1 - V2;
    const MEP = Wnet / displacement; // kPa * m³/kg = kJ/kg / 1 m³/kg

    const pad = { left: 60, right: 20, top: 20, bottom: 50 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;

    const Vmin = V2 * 0.7, Vmax = V1 * 1.2;
    const Pmax_disp = P3 * 1.2, Pmin_disp = P1 * 0.5;

    const vx = v => pad.left + ((v - Vmin) / (Vmax - Vmin)) * cW;
    const py = p => pad.top + (1 - (p - Pmin_disp) / (Pmax_disp - Pmin_disp)) * cH;

    // Grid
    ctx.strokeStyle = '#1e2d45'; ctx.lineWidth = 1;
    [V2, V1 / 2, V1].forEach(v => { ctx.beginPath(); ctx.moveTo(vx(v), pad.top); ctx.lineTo(vx(v), H - pad.bottom); ctx.stroke(); });
    [P1, P2 / 2, P2, P3].forEach(p => { if (p > Pmin_disp && p < Pmax_disp) { ctx.beginPath(); ctx.moveTo(pad.left, py(p)); ctx.lineTo(W - pad.right, py(p)); ctx.stroke(); } });

    // Axes
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, H - pad.bottom); ctx.lineTo(W - pad.right, H - pad.bottom); ctx.stroke();

    ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Specific Volume v (m³/kg)', W / 2, H - 10);
    ctx.save(); ctx.translate(14, H / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Pressure P (bar)', 0, 0); ctx.restore();

    // ── Cycle curves ──
    function isentropicCurve(from, to) {
      const [V_a, P_a] = from, [V_b, P_b] = to;
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const v = V_a + t * (V_b - V_a);
        const p = P_a * Math.pow(V_a / v, gamma);
        i === 0 ? ctx.moveTo(vx(v), py(p)) : ctx.lineTo(vx(v), py(p));
      }
      ctx.stroke();
    }

    // Fill cycle area
    ctx.beginPath();
    ctx.moveTo(vx(V2), py(P2));
    ctx.lineTo(vx(V2), py(P3));
    ctx.lineTo(vx(V1), py(P4));
    ctx.lineTo(vx(V1), py(P1));
    // Isentropic back to 2 (simplified as straight for fill)
    ctx.closePath();
    ctx.fillStyle = 'rgba(99,102,241,0.12)';
    ctx.fill();

    // 1→2 Isentropic compression
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 3;
    isentropicCurve([V1, P1], [V2, P2]);
    // 2→3 Constant volume heat addition
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(vx(V2), py(P2)); ctx.lineTo(vx(V2), py(P3)); ctx.stroke();
    // 3→4 Isentropic expansion
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
    isentropicCurve([V2, P3], [V1, P4]);
    // 4→1 Constant volume heat rejection
    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(vx(V1), py(P4)); ctx.lineTo(vx(V1), py(P1)); ctx.stroke();

    // State points
    const pts = { '1': [V1, P1], '2': [V2, P2], '3': [V2, P3], '4': [V1, P4] };
    Object.entries(pts).forEach(([lbl, [v, p]]) => {
      ctx.beginPath(); ctx.arc(vx(v), py(p), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f1f5f9'; ctx.fill();
      ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; ctx.stroke();
      const offsets = { '1': [10, 14], '2': [10, -10], '3': [10, -10], '4': [-14, 14] };
      const [ox, oy] = offsets[lbl];
      ctx.fillStyle = '#f1f5f9'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(lbl, vx(v) + ox, py(p) + oy);
    });

    // Leg labels
    const labels = [
      { v: (V1 + V2) / 2, p: P1 * Math.pow(V1 / ((V1 + V2) / 2), gamma) * 1.15, text: 'Compression', color: '#6366f1' },
      { v: V2 * 0.82, p: (P2 + P3) / 2, text: 'Combustion', color: '#f59e0b' },
      { v: (V1 + V2) / 2, p: P3 * Math.pow(V2 / ((V1 + V2) / 2), gamma) * 0.85, text: 'Power Stroke', color: '#10b981' },
      { v: V1 * 1.08, p: (P1 + P4) / 2, text: 'Exhaust', color: '#06b6d4' }
    ];
    labels.forEach(l => {
      ctx.fillStyle = l.color; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      if (l.p > Pmin_disp && l.p < Pmax_disp) ctx.fillText(l.text, vx(l.v), py(l.p));
    });

    document.getElementById('otto_eff').textContent = (eta * 100).toFixed(1) + '%';
    document.getElementById('otto_t3').textContent  = T3.toFixed(0) + ' K';
    document.getElementById('otto_mep').textContent = (MEP / 100).toFixed(2) + ' bar';
  }
  draw();
}

// ════════════════════════════════════════════════
//  10. HEAT CONDUCTION (Composite Wall)
// ════════════════════════════════════════════════
function buildHeatSim(container) {
  const W = 560, H = 280;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'heat_q',    'Heat Flux q (W/m²)');
  addOutputItem(output, 'heat_rtot', 'Total R_th (K·m²/W)');
  addOutputItem(output, 'heat_tmid', 'Mid-Wall Temp (°C)');

  const materials = {
    brick:     { k: 0.9,  color: '#b45309', label: 'Brick (k=0.9)' },
    concrete:  { k: 1.7,  color: '#64748b', label: 'Concrete (k=1.7)' },
    insulation:{ k: 0.04, color: '#fbbf24', label: 'Insulation (k=0.04)' },
    steel:     { k: 50,   color: '#475569', label: 'Steel (k=50)' },
    glass:     { k: 1.0,  color: '#7dd3fc', label: 'Glass (k=1.0)' },
    timber:    { k: 0.15, color: '#92400e', label: 'Timber (k=0.15)' }
  };

  const state = { T_hot: 35, T_cold: 5, mat1: 'brick', t1: 200, mat2: 'insulation', t2: 80 };

  addSlider(controls, 'Hot Side Temp', 10, 80, state.T_hot, 1, '°C', v => { state.T_hot = v; draw(); });
  addSlider(controls, 'Cold Side Temp', -10, 25, state.T_cold, 1, '°C', v => { state.T_cold = v; draw(); });
  addSlider(controls, 'Layer 1 Thickness', 50, 400, state.t1, 10, ' mm', v => { state.t1 = v; draw(); });
  addSlider(controls, 'Layer 2 Thickness', 20, 200, state.t2, 5, ' mm', v => { state.t2 = v; draw(); });
  addSelect(controls, 'Layer 1 Material', Object.entries(materials).map(([k, v]) => ({ value: k, label: v.label })), v => { state.mat1 = v; draw(); });
  addSelect(controls, 'Layer 2 Material', Object.entries(materials).map(([k, v]) => ({ value: k, label: v.label })), v => { state.mat2 = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const { T_hot, T_cold, mat1, t1, mat2, t2 } = state;
    const k1 = materials[mat1].k, k2 = materials[mat2].k;
    const R1 = (t1 / 1000) / k1, R2 = (t2 / 1000) / k2;
    const R_tot = R1 + R2;
    const q    = (T_hot - T_cold) / R_tot;
    const T_mid = T_hot - q * R1;

    const wallY1 = 40, wallY2 = H - 40;
    const wallH  = wallY2 - wallY1;
    const totalT = t1 + t2;
    const w1 = (t1 / totalT) * (W - 160);
    const w2 = (t2 / totalT) * (W - 160);
    const startX = 80;

    // Hot side (left zone)
    const hotGrad = ctx.createLinearGradient(0, 0, startX, 0);
    hotGrad.addColorStop(0, '#ef444490');
    hotGrad.addColorStop(1, '#ef444420');
    ctx.fillStyle = hotGrad;
    ctx.fillRect(0, wallY1, startX, wallH);
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${T_hot}°C`, 40, H / 2);

    // Layer 1
    ctx.fillStyle = materials[mat1].color + 'bb';
    ctx.fillRect(startX, wallY1, w1, wallH);
    ctx.strokeStyle = '#0e1628'; ctx.lineWidth = 2;
    ctx.strokeRect(startX, wallY1, w1, wallH);

    // Layer 2
    ctx.fillStyle = materials[mat2].color + 'bb';
    ctx.fillRect(startX + w1, wallY1, w2, wallH);
    ctx.strokeRect(startX + w1, wallY1, w2, wallH);

    // Cold side (right zone)
    const coldGrad = ctx.createLinearGradient(startX + w1 + w2, 0, W, 0);
    coldGrad.addColorStop(0, '#3b82f620');
    coldGrad.addColorStop(1, '#3b82f690');
    ctx.fillStyle = coldGrad;
    ctx.fillRect(startX + w1 + w2, wallY1, W - startX - w1 - w2, wallH);
    ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${T_cold}°C`, W - 40, H / 2);

    // Temperature profile line
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, wallY1 + wallH * (1 - (T_hot - Math.min(T_hot, T_cold)) / Math.max(1, T_hot - T_cold)));

    const leftT = T_hot, rightT = T_cold;
    const TRange = leftT - rightT > 0 ? leftT - rightT : 1;

    const plotT = (T, x) => wallY1 + wallH * (1 - (T - rightT) / TRange);

    ctx.moveTo(0, plotT(T_hot, 0));
    ctx.lineTo(startX, plotT(T_hot, startX));
    ctx.lineTo(startX + w1, plotT(T_mid, startX + w1));
    ctx.lineTo(startX + w1 + w2, plotT(T_cold, startX + w1 + w2));
    ctx.lineTo(W, plotT(T_cold, W));
    ctx.stroke();

    // Layer labels
    [{ x: startX + w1 / 2, label: `${materials[mat1].label.split('(')[0].trim()}`, sublabel: `${t1}mm` },
     { x: startX + w1 + w2 / 2, label: `${materials[mat2].label.split('(')[0].trim()}`, sublabel: `${t2}mm` }
    ].forEach(l => {
      ctx.fillStyle = '#f1f5f9'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(l.label, l.x, wallY1 + 18);
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
      ctx.fillText(l.sublabel, l.x, wallY1 + 30);
    });

    // T_mid dot
    ctx.beginPath(); ctx.arc(startX + w1, plotT(T_mid, 0), 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`T_mid=${T_mid.toFixed(1)}°C`, startX + w1 + 6, plotT(T_mid, 0) - 4);

    document.getElementById('heat_q').textContent    = q.toFixed(1) + ' W/m²';
    document.getElementById('heat_rtot').textContent = R_tot.toFixed(3) + ' K·m²/W';
    document.getElementById('heat_tmid').textContent = T_mid.toFixed(1) + '°C';
  }
  draw();
}

// ════════════════════════════════════════════════
//  11. CAM & FOLLOWER
// ════════════════════════════════════════════════
function buildCamSim(container) {
  const W = 560, H = 300;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'cam_disp',  'Follower Lift (mm)');
  addOutputItem(output, 'cam_angle', 'Cam Angle (°)');
  addOutputItem(output, 'cam_type',  'Phase');

  const state = { rpm: 300, camType: 'shm', angle: 0 };
  let animId5 = null;

  addSlider(controls, 'Cam Speed', 60, 1200, state.rpm, 60, ' RPM', v => { state.rpm = v; });
  addSelect(controls, 'Cam Profile', [
    { value: 'shm',      label: 'Simple Harmonic Motion' },
    { value: 'cycloidal',label: 'Cycloidal' },
    { value: 'uniform',  label: 'Uniform Velocity' }
  ], v => { state.camType = v; });

  const R_base = 45, h = 35, beta = 180;

  function getFollowerDisp(angleDeg) {
    const a = ((angleDeg % 360) + 360) % 360;
    const { camType } = state;
    if (a < beta) {
      const theta = a, b = beta;
      if (camType === 'shm')       return (h / 2) * (1 - Math.cos(Math.PI * theta / b));
      if (camType === 'cycloidal') return h * (theta / b - (1 / (2 * Math.PI)) * Math.sin(2 * Math.PI * theta / b));
      if (camType === 'uniform')   return h * theta / b;
    } else if (a < 270) {
      return h; // dwell
    } else {
      const theta = a - 270, b = 90;
      return h * (1 - theta / b); // return stroke
    }
  }

  function getCamRadius(angleDeg) {
    return R_base + getFollowerDisp(angleDeg);
  }

  function draw(angle) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const camCX = 140, camCY = H / 2;

    // Draw cam profile
    ctx.beginPath();
    for (let a = 0; a <= 360; a++) {
      const r = getCamRadius(a - angle);
      const rad = (a * Math.PI) / 180;
      const px = camCX + r * Math.cos(rad);
      const py = camCY + r * Math.sin(rad);
      a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(camCX, camCY, 10, camCX, camCY, R_base + h);
    grad.addColorStop(0, '#4f46e5');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; ctx.stroke();

    // Cam centre
    ctx.beginPath(); ctx.arc(camCX, camCY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f5f9'; ctx.fill();

    // Shaft (vertical follower on right)
    const followerX = camCX + R_base + h + 40;
    const followerBaseY = camCY + R_base + h + 20;
    const lift = getFollowerDisp(0);
    const followerY = followerBaseY - lift * 2.5;

    // Guide
    ctx.fillStyle = '#1a2236';
    ctx.fillRect(followerX - 14, camCY - R_base - h - 30, 28, 2 * (R_base + h) + 40);
    ctx.strokeStyle = '#2a3a55'; ctx.lineWidth = 1;
    ctx.strokeRect(followerX - 14, camCY - R_base - h - 30, 28, 2 * (R_base + h) + 40);

    // Follower rod
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(followerX - 5, followerY + 20, 10, followerBaseY - followerY - 20);

    // Follower roller at bottom of rod — contacts cam
    const camContactAngle = 0; // follower at 0 degrees from cam centre (rightward)
    const contactR = getCamRadius(- angle);
    ctx.beginPath();
    ctx.arc(followerX, followerBaseY - lift * 2.5 + 20, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981'; ctx.fill();
    ctx.strokeStyle = '#0e1628'; ctx.lineWidth = 2; ctx.stroke();

    // Follower head block
    ctx.fillStyle = '#475569';
    ctx.fillRect(followerX - 18, followerY - 16, 36, 20);
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 1.5;
    ctx.strokeRect(followerX - 18, followerY - 16, 36, 20);

    // Displacement-time chart (right side)
    const chartX = followerX + 60, chartW = W - chartX - 16;
    const chartY = 30, chartH = H - 60;
    ctx.strokeStyle = '#1e2d45'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(chartX, chartY); ctx.lineTo(chartX, chartY + chartH); ctx.lineTo(chartX + chartW, chartY + chartH); ctx.stroke();

    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let a = 0; a <= 360; a++) {
      const d = getFollowerDisp(a);
      const x = chartX + (a / 360) * chartW;
      const y = chartY + chartH - (d / h) * chartH;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current angle marker on chart
    const curA = ((angle % 360) + 360) % 360;
    const markerX = chartX + (curA / 360) * chartW;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(markerX, chartY); ctx.lineTo(markerX, chartY + chartH); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Cam Angle →', chartX + chartW / 2, chartY + chartH + 14);
    ctx.fillText('Lift ↑', chartX - 8, chartY + chartH / 2);

    const phase = curA < beta ? 'Rise' : curA < 270 ? 'Dwell' : 'Return';
    document.getElementById('cam_disp').textContent  = lift.toFixed(1) + ' mm';
    document.getElementById('cam_angle').textContent = curA.toFixed(0) + '°';
    document.getElementById('cam_type').textContent  = phase;

    state.angle = angle + (state.rpm / 60) * (Math.PI * 2) / 60;
    animId5 = requestAnimationFrame(() => draw(state.angle));
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId5) { cancelAnimationFrame(animId5); animId5 = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId5) draw(state.angle);
    });
  });

  draw(0);
}

// ════════════════════════════════════════════════
//  12. BERNOULLI — VENTURI FLOW
// ════════════════════════════════════════════════
function buildBernoulliSim(container) {
  const W = 560, H = 240;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'ber_v2',    'Throat Velocity V₂ (m/s)');
  addOutputItem(output, 'ber_dp',    'Pressure Drop ΔP (kPa)');
  addOutputItem(output, 'ber_q',     'Flow Rate Q (L/s)');

  const state = { V1: 2, D1: 100, D2: 40, rho: 1000 };

  addSlider(controls, 'Inlet Velocity V₁', 1, 10, state.V1, 0.5, ' m/s', v => { state.V1 = v; draw(); });
  addSlider(controls, 'Pipe Diameter D₁', 50, 200, state.D1, 10, ' mm', v => { state.D1 = v; draw(); });
  addSlider(controls, 'Throat Diameter D₂', 10, 100, state.D2, 5, ' mm', v => { state.D2 = Math.min(v, state.D1 - 10); draw(); });

  let particles = [];
  function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) particles.push({ x: Math.random() * W, relY: Math.random() * 2 - 1, speed: 1 });
  }
  initParticles();

  let animId6 = null;

  function pipeProfile(x) {
    const cx = W / 2;
    const narrow = 40;
    const dist = Math.abs(x - cx) / (W / 2 - 40);
    const r1 = state.D1 / 2, r2 = state.D2 / 2;
    return r2 + (r1 - r2) * Math.min(1, dist * 1.5);
  }

  function localVelocity(x) {
    const r = pipeProfile(x);
    const A = Math.PI * Math.pow(r / 1000, 2);
    const A1 = Math.PI * Math.pow(state.D1 / 2000, 2);
    return state.V1 * A1 / A;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const cy = H / 2;
    const scale = 0.8;

    // Draw pipe walls
    ctx.fillStyle = '#1e2d45';
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) { const r = pipeProfile(x) * scale; x === 0 ? ctx.moveTo(x, cy - r) : ctx.lineTo(x, cy - r); }
    for (let x = W; x >= 0; x -= 2) { const r = pipeProfile(x) * scale; ctx.lineTo(x, cy + r); }
    ctx.closePath();
    ctx.fillStyle = '#1e2d45';
    ctx.fill();
    // Pipe outline
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) { const r = pipeProfile(x) * scale; x === 0 ? ctx.moveTo(x, cy - r) : ctx.lineTo(x, cy - r); }
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) { const r = pipeProfile(x) * scale; x === 0 ? ctx.moveTo(x, cy + r) : ctx.lineTo(x, cy + r); }
    ctx.stroke();

    // Pressure columns
    const A1 = Math.PI * Math.pow(state.D1 / 2000, 2);
    const A2 = Math.PI * Math.pow(state.D2 / 2000, 2);
    const V2 = state.V1 * A1 / A2;
    const dP = 0.5 * state.rho * (V2 * V2 - state.V1 * state.V1);

    const cols = [
      { x: 80, V: state.V1, label: 'P₁ (inlet)' },
      { x: W / 2, V: V2, label: 'P₂ (throat)' },
      { x: W - 80, V: state.V1, label: 'P₃ (outlet)' }
    ];
    const maxP_display = 0.5 * state.rho * state.V1 * state.V1;
    cols.forEach(col => {
      const staticP = 0.5 * state.rho * (V2 * V2 - col.V * col.V);
      const colH = 40 + (1 - staticP / (dP + 1)) * 40;
      const colTop = cy - pipeProfile(col.x) * scale - colH - 4;
      ctx.fillStyle = '#06b6d480';
      ctx.fillRect(col.x - 8, colTop, 16, colH);
      ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 1.5;
      ctx.strokeRect(col.x - 8, colTop, 16, colH);
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(col.label, col.x, colTop - 6);
    });

    // Animate particles
    particles.forEach(p => {
      const r = pipeProfile(p.x) * scale;
      const localV = localVelocity(p.x);
      p.x += localV * 1.5;
      const y = cy + p.relY * r;
      if (Math.abs(p.relY) < 0.9) {
        ctx.beginPath();
        ctx.arc(p.x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${180 + localV * 10}, 70%, 65%)`;
        ctx.fill();
      }
      if (p.x > W + 4) { p.x = -4; p.relY = Math.random() * 1.6 - 0.8; }
    });

    // Velocity label at throat
    const tR = pipeProfile(W / 2) * scale;
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`V₂ = ${V2.toFixed(1)} m/s`, W / 2, cy + tR + 20);
    ctx.fillStyle = '#6366f1';
    ctx.fillText(`V₁ = ${state.V1} m/s`, 60, cy + pipeProfile(0) * scale + 20);

    document.getElementById('ber_v2').textContent = V2.toFixed(2) + ' m/s';
    document.getElementById('ber_dp').textContent = (Math.abs(dP) / 1000).toFixed(2) + ' kPa';
    document.getElementById('ber_q').textContent  = (state.V1 * A1 * 1000).toFixed(2) + ' L/s';

    animId6 = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId6) { cancelAnimationFrame(animId6); animId6 = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId6) draw();
    });
  });

  draw();
}

// ════════════════════════════════════════════════
//  13. METAL CUTTING (Taylor's Tool Life)
// ════════════════════════════════════════════════
function buildMetalCuttingSim(container) {
  const W = 560, H = 300;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'cut_life',  'Tool Life T (min)');
  addOutputItem(output, 'cut_mrr',   'MRR (cm³/min)');
  addOutputItem(output, 'cut_power', 'Cutting Power (W)');

  const materials = {
    mild_steel:  { C: 250, n: 0.25, Fc: 150, label: 'Mild Steel' },
    cast_iron:   { C: 200, n: 0.20, Fc: 130, label: 'Cast Iron' },
    aluminum:    { C: 400, n: 0.30, Fc: 60,  label: 'Aluminium' },
    titanium:    { C: 120, n: 0.15, Fc: 300, label: 'Titanium' }
  };

  const state = { V: 100, f: 0.2, d: 2, mat: 'mild_steel' };

  addSlider(controls, 'Cutting Speed V', 20, 400, state.V, 10, ' m/min', v => { state.V = v; draw(); });
  addSlider(controls, 'Feed f', 5, 50, state.f * 100, 5, ' (×0.01 mm/rev)', v => { state.f = v / 100; draw(); });
  addSlider(controls, 'Depth of Cut d', 0.5, 5, state.d * 2, 1, ' (×0.5 mm)', v => { state.d = v / 2; draw(); });
  addSelect(controls, 'Workpiece Material', Object.entries(materials).map(([k, v]) => ({ value: k, label: v.label })), v => { state.mat = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const mat  = materials[state.mat];
    const { n, C, Fc } = mat;
    const { V, f, d } = state;

    const T    = Math.pow(C / V, 1 / n);
    const MRR  = V * f * d * 1000 / 1000; // cm³/min approx
    const Fcut = Fc * f * d;
    const P    = (Fcut * V) / 60;

    const pad  = { left: 65, right: 20, top: 20, bottom: 50 };
    const cW   = W - pad.left - pad.right;
    const cH   = H - pad.top  - pad.bottom;

    const Vmin = 10, Vmax = 500;
    const Tmin = 0, Tmax = Math.pow(C / Vmin, 1 / n) * 1.2;

    const vx = v => pad.left + (Math.log(v / Vmin) / Math.log(Vmax / Vmin)) * cW;
    const ty = t => pad.top  + (1 - Math.min(t, Tmax) / Tmax) * cH;

    // Grid
    ctx.strokeStyle = '#1e2d45'; ctx.lineWidth = 1;
    [20, 50, 100, 200, 400].forEach(v => { ctx.beginPath(); ctx.moveTo(vx(v), pad.top); ctx.lineTo(vx(v), H - pad.bottom); ctx.stroke(); ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(v, vx(v), H - pad.bottom + 14); });
    [0, 30, 60, 120, 240].forEach(t => { if (t <= Tmax) { ctx.beginPath(); ctx.moveTo(pad.left, ty(t)); ctx.lineTo(W - pad.right, ty(t)); ctx.stroke(); ctx.fillStyle = '#475569'; ctx.textAlign = 'right'; ctx.font = '9px sans-serif'; ctx.fillText(t, pad.left - 4, ty(t) + 3); } });

    // Taylor curve
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 3;
    ctx.shadowColor = '#6366f180'; ctx.shadowBlur = 6;
    ctx.beginPath();
    let first = true;
    for (let v = Vmin; v <= Vmax; v += 2) {
      const t = Math.pow(C / v, 1 / n);
      if (t > Tmax) continue;
      first ? ctx.moveTo(vx(v), ty(t)) : ctx.lineTo(vx(v), ty(t));
      first = false;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current operating point
    if (T <= Tmax && V >= Vmin && V <= Vmax) {
      ctx.beginPath(); ctx.arc(vx(V), ty(T), 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 2; ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = '#ef444488'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(vx(V), pad.top); ctx.lineTo(vx(V), ty(T)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.left, ty(T)); ctx.lineTo(vx(V), ty(T)); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Zone labels
    ctx.fillStyle = '#10b98188'; ctx.fillRect(pad.left, pad.top, cW * 0.35, cH);
    ctx.fillStyle = '#ef444422'; ctx.fillRect(pad.left + cW * 0.65, pad.top, cW * 0.35, cH);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Low Speed\nLong Tool Life', pad.left + cW * 0.17, pad.top + 30);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('High Speed\nShort Tool Life', pad.left + cW * 0.82, pad.top + 30);

    // Axes labels
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('Cutting Speed V (m/min)', W / 2, H - 10);
    ctx.save(); ctx.translate(14, H / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Tool Life T (min)', 0, 0); ctx.restore();
    ctx.fillStyle = '#6366f1'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`VTⁿ = C  [n=${n}, C=${C}]`, pad.left + 4, pad.top + 14);

    document.getElementById('cut_life').textContent  = T.toFixed(1) + ' min';
    document.getElementById('cut_mrr').textContent   = MRR.toFixed(2) + ' cm³/min';
    document.getElementById('cut_power').textContent = P.toFixed(0) + ' W';
  }
  draw();
}

// ════════════════════════════════════════════════
//  14. CASTING (Solidification Time)
// ════════════════════════════════════════════════
function buildCastingSim(container) {
  const W = 560, H = 300;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'cast_ts',  'Solidification Time (s)');
  addOutputItem(output, 'cast_vsa', 'V/SA Ratio (m)');
  addOutputItem(output, 'cast_riser','Riser Vol (% of casting)');

  const state = { width: 200, height: 100, depth: 80, B: 500 };

  addSlider(controls, 'Width (mm)', 50, 400, state.width, 10, ' mm', v => { state.width = v; draw(); });
  addSlider(controls, 'Height (mm)', 30, 300, state.height, 10, ' mm', v => { state.height = v; draw(); });
  addSlider(controls, 'Depth (mm)', 30, 200, state.depth, 10, ' mm', v => { state.depth = v; draw(); });
  addSlider(controls, 'Mould Constant B', 100, 1200, state.B, 50, ' s/m²', v => { state.B = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const { width: W_, height: H_, depth: D_, B } = state;
    const w = W_ / 1000, h = H_ / 1000, d = D_ / 1000;

    const V  = w * h * d;
    const SA = 2 * (w * h + h * d + w * d);
    const ratio = V / SA;
    const ts = B * ratio * ratio;

    // Riser sizing (Chvorinov: riser must solidify last)
    const riserRatio = ratio * 1.2;
    const rV = V * 0.06 / 0.95; // ~6% shrinkage for steel, 5% efficiency
    const riserVol = rV;

    // Draw 3D box (isometric)
    const scale = 0.5;
    const ox = 160, oy = H / 2;
    const px = W_ * scale * 0.5, py = H_ * scale, pz = D_ * scale * 0.4;

    function iso(x, y, z) {
      return { x: ox + x * 0.6 - z * 0.6, y: oy - y + x * 0.3 + z * 0.3 };
    }

    // Faces
    const corners = [
      iso(0, 0, 0), iso(px, 0, 0), iso(px, py, 0), iso(0, py, 0),
      iso(0, 0, pz), iso(px, 0, pz), iso(px, py, pz), iso(0, py, pz)
    ];

    const faces = [
      { verts: [4, 5, 6, 7], color: '#2a4f6a' },
      { verts: [0, 1, 5, 4], color: '#1e3a52' },
      { verts: [1, 2, 6, 5], color: '#25476a' }
    ];

    faces.forEach(face => {
      ctx.beginPath();
      face.verts.forEach((vi, i) => {
        const { x, y } = corners[vi];
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = face.color;
      ctx.fill();
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; ctx.stroke();
    });

    // Solidification rings animation (concentric)
    const ringCount = 4;
    const progress = (Date.now() % 3000) / 3000;
    for (let r = ringCount; r >= 1; r--) {
      const fade = (r / ringCount) * (1 - progress * 0.3);
      const t = r / ringCount;
      const fw = px * (1 - t * 0.7), fh = py * (1 - t * 0.7), fd = pz * (1 - t * 0.7);
      const fo = iso(px * t * 0.35, py * t * 0.35, pz * t * 0.35);
      ctx.strokeStyle = `rgba(99,102,241,${fade * 0.6})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(fo.x, fo.y - fh, fw, fh);
    }

    // Riser cylinder on top
    const riserTop = iso(px / 2, py + 30, pz / 2);
    const riserW = 20, riserH = 40;
    ctx.fillStyle = '#f59e0b60';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(riserTop.x, riserTop.y, riserW, 8, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f59e0b40';
    ctx.fillRect(riserTop.x - riserW, riserTop.y - riserH, riserW * 2, riserH);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Riser', riserTop.x, riserTop.y - riserH - 4);

    // Labels
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`${W_} × ${H_} × ${D_} mm`, ox + px + 20, oy);
    ctx.fillText(`V = ${(V * 1e6).toFixed(0)} cm³`, ox + px + 20, oy + 16);
    ctx.fillText(`SA = ${(SA * 1e4).toFixed(0)} cm²`, ox + px + 20, oy + 32);

    document.getElementById('cast_ts').textContent    = ts.toFixed(1) + ' s';
    document.getElementById('cast_vsa').textContent   = (ratio * 1000).toFixed(1) + ' mm';
    document.getElementById('cast_riser').textContent = ((riserVol / V) * 100).toFixed(0) + '%';

    requestAnimationFrame(draw);
  }
  draw();
}

// ════════════════════════════════════════════════
//  15. WELDING (HAZ & Heat Input)
// ════════════════════════════════════════════════
function buildWeldingSim(container) {
  const W = 560, H = 280;
  const canvas = makeCanvas(container, W, H);
  const ctx    = canvas.getContext('2d');
  const controls = makeControls(container);
  const output   = makeOutput(container);
  addOutputItem(output, 'weld_hi',  'Heat Input Q (kJ/mm)');
  addOutputItem(output, 'weld_haz', 'HAZ Width (approx mm)');
  addOutputItem(output, 'weld_ce',  'Carbon Equivalent CE');

  const steels = {
    mild:    { C: 0.15, Mn: 0.7, Cr: 0, Mo: 0, V: 0, Ni: 0, Cu: 0, label: 'Mild Steel S275' },
    medium:  { C: 0.30, Mn: 1.0, Cr: 0.5, Mo: 0, V: 0, Ni: 0, Cu: 0, label: 'Medium Carbon S355' },
    high:    { C: 0.45, Mn: 1.2, Cr: 0.8, Mo: 0.2, V: 0, Ni: 0.5, Cu: 0, label: 'High Strength (HSLA)' },
    stainless: { C: 0.05, Mn: 1.5, Cr: 18, Mo: 0, V: 0, Ni: 10, Cu: 0, label: '316 Stainless Steel' }
  };

  const state = { V_arc: 24, I: 180, speed: 5, steel: 'mild' };

  addSlider(controls, 'Arc Voltage', 16, 36, state.V_arc, 1, ' V', v => { state.V_arc = v; draw(); });
  addSlider(controls, 'Current', 80, 400, state.I, 10, ' A', v => { state.I = v; draw(); });
  addSlider(controls, 'Travel Speed', 2, 15, state.speed, 1, ' mm/s', v => { state.speed = v; draw(); });
  addSelect(controls, 'Steel Grade', Object.entries(steels).map(([k, v]) => ({ value: k, label: v.label })), v => { state.steel = v; draw(); });

  let weldX = 0;
  let animId7 = null;

  function calcCE() {
    const s = steels[state.steel];
    return s.C + s.Mn / 6 + (s.Cr + s.Mo + s.V) / 5 + (s.Ni + s.Cu) / 15;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, W, H);

    const Q   = (state.V_arc * state.I) / (state.speed * 1000);
    const CE  = calcCE();
    const haz = Q * 8 + CE * 3; // approx HAZ width in mm

    // Workpiece
    const plateY  = H / 2 - 30, plateH = 60;
    const weldBW  = 8;
    const hazW    = Math.min(haz * 4, 60);

    // Base metal
    const baseGrad = ctx.createLinearGradient(0, plateY, 0, plateY + plateH);
    baseGrad.addColorStop(0, '#4f5e7a');
    baseGrad.addColorStop(0.5, '#6b7d9a');
    baseGrad.addColorStop(1, '#3a4a60');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, plateY, W, plateH);

    // HAZ zone (orange-ish)
    const hazX = Math.max(0, weldX - hazW);
    const hazGrad = ctx.createLinearGradient(hazX, 0, hazX + hazW, 0);
    hazGrad.addColorStop(0, 'transparent');
    hazGrad.addColorStop(0.3, `rgba(245,158,11,${Math.min(CE / 0.8, 0.5)})`);
    hazGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = hazGrad;
    ctx.fillRect(hazX, plateY, hazW, plateH);

    // Weld bead (deposited)
    if (weldX > 0) {
      const wGrad = ctx.createLinearGradient(0, plateY - 4, 0, plateY + 6);
      wGrad.addColorStop(0, '#94a3b8');
      wGrad.addColorStop(0.4, '#6b7d9a');
      wGrad.addColorStop(1, '#3a4a60');
      ctx.fillStyle = wGrad;
      ctx.beginPath();
      ctx.ellipse(weldX / 2, plateY + 3, weldX / 2, weldBW / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Welding torch
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(weldX, plateY - 50); ctx.lineTo(weldX, plateY - 4); ctx.stroke();

    // Arc glow
    const arcR = Q * 6 + 8;
    const arcGrad = ctx.createRadialGradient(weldX, plateY, 2, weldX, plateY, arcR);
    arcGrad.addColorStop(0, 'rgba(255,255,150,0.9)');
    arcGrad.addColorStop(0.3, 'rgba(245,158,11,0.6)');
    arcGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = arcGrad;
    ctx.beginPath(); ctx.arc(weldX, plateY, arcR, 0, Math.PI * 2); ctx.fill();

    // Travel direction arrow
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(weldX + 20, plateY - 25); ctx.lineTo(weldX + 45, plateY - 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(weldX + 45, plateY - 25); ctx.lineTo(weldX + 35, plateY - 31); ctx.lineTo(weldX + 35, plateY - 19); ctx.closePath(); ctx.fillStyle = '#10b981'; ctx.fill();

    // Weld params display
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`${state.V_arc}V  ${state.I}A  ${state.speed}mm/s`, 10, 20);
    ctx.fillStyle = CE > 0.45 ? '#ef4444' : CE > 0.35 ? '#f59e0b' : '#10b981';
    ctx.fillText(`CE = ${CE.toFixed(3)} — ${CE > 0.45 ? 'Pre-heat REQUIRED' : CE > 0.35 ? 'Pre-heat advisable' : 'Good weldability'}`, 10, 35);
    ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif';
    ctx.fillText('Note: HAZ width shown is a qualitative trend indicator, not a measured formula.', 10, H - 6);

    // Advance torch
    weldX = (weldX + state.speed * 0.4) % (W + 60);

    document.getElementById('weld_hi').textContent  = Q.toFixed(3) + ' kJ/mm';
    document.getElementById('weld_haz').textContent = haz.toFixed(1) + ' mm (qualitative)';
    document.getElementById('weld_ce').textContent  = CE.toFixed(3);

    animId7 = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId7) { cancelAnimationFrame(animId7); animId7 = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId7) draw();
    });
  });

  draw();
}

// ════════════════════════════════════════════════
//  FALLBACK: Coming Soon for unmapped sims
// ════════════════════════════════════════════════
function buildComingSoon(container) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'text-align:center;padding:60px 20px;color:var(--muted);';
  wrap.innerHTML = '<div style="font-size:3rem;margin-bottom:16px">🚧</div><div style="font-size:1.1rem;font-weight:600;">Interactive simulation coming soon!</div>';
  container.appendChild(wrap);
}

// ══════════════════════════════════════════
// NEW SIM: Helical Spring Design
// ══════════════════════════════════════════
function buildSpringSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'sp_k', 'Spring Rate k');
  addOutputItem(output, 'sp_tau', 'Shear Stress τ');
  addOutputItem(output, 'sp_delta', 'Deflection δ');
  addOutputItem(output, 'sp_kw', 'Wahl Factor Kw');

  let state = { W: 500, D: 50, d: 6, Nc: 8, G: 80000 };
  addSlider(controls, 'Load W (N)', 100, 1000, state.W, 50, '', v => { state.W = v; draw(); });
  addSlider(controls, 'Mean Dia D (mm)', 20, 80, state.D, 2, '', v => { state.D = v; draw(); });
  addSlider(controls, 'Wire Dia d (mm)', 2, 12, state.d, 1, '', v => { state.d = v; draw(); });
  addSlider(controls, 'Active Coils Nc', 4, 20, state.Nc, 1, '', v => { state.Nc = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { W: load, D, d, Nc, G } = state;
    const Dm = D / 1000, dm = d / 1000, Gpa = G * 1e6;
    const k = Gpa * Math.pow(dm, 4) / (8 * Math.pow(Dm, 3) * Nc);
    const C = D / d;
    const Kw = (4*C - 1)/(4*C - 4) + 0.615/C;
    const tau = Kw * 8 * load * Dm / (Math.PI * Math.pow(dm, 3)) / 1e6;
    const delta = load / k * 1000;

    // Draw coil spring schematic
    const cx = W / 2, sy = 40, ey = H - 40;
    const coilW = 60, turns = Math.min(Nc, 12);
    const pitch = (ey - sy) / turns;
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = Math.max(2, d * 1.5);
    ctx.beginPath();
    ctx.moveTo(cx, sy);
    for (let i = 0; i <= turns * 20; i++) {
      const t = i / 20;
      const x = cx + coilW * Math.sin(t * Math.PI * 2);
      const y = sy + t * pitch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // End plates
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - coilW - 10, sy); ctx.lineTo(cx + coilW + 10, sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - coilW - 10, ey); ctx.lineTo(cx + coilW + 10, ey); ctx.stroke();

    // Load arrow
    ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, ey + 20); ctx.lineTo(cx, ey + 5);
    ctx.lineTo(cx - 8, ey + 12); ctx.moveTo(cx, ey + 5); ctx.lineTo(cx + 8, ey + 12);
    ctx.stroke();
    ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`W=${load} N`, cx, ey + 36);

    // Spring index & status
    const stressOk = tau < 500;
    ctx.fillStyle = stressOk ? '#10b981' : '#ef4444';
    ctx.font = '11px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`C = ${C.toFixed(1)}  ${stressOk ? '✓ Safe' : '⚠ Overstressed'}`, 16, 20);

    document.getElementById('sp_k').textContent = (k / 1000).toFixed(2) + ' kN/m';
    document.getElementById('sp_tau').textContent = tau.toFixed(1) + ' MPa' + (stressOk ? ' ✓' : ' ✗');
    document.getElementById('sp_delta').textContent = delta.toFixed(1) + ' mm';
    document.getElementById('sp_kw').textContent = Kw.toFixed(3);
  }
  draw();
}

// ── PATCH: update initSimulation dispatcher ──────────────────────────────────
const _origInit = initSimulation;
initSimulation = function(type, concept) {
  const extra = {
    'torsion':           buildTorsionSim,
    'buckling':          buildBucklingSim,
    'spring':            buildSpringSim,
    'otto':              buildOttoSim,
    'heat':              buildHeatSim,
    'cam':               buildCamSim,
    'bernoulli':         buildBernoulliSim,
    'metal-cutting':     buildMetalCuttingSim,
    'casting':           buildCastingSim,
    'welding':           buildWeldingSim,
    'sfd-bmd':           buildSfdBmdSim,
    'diesel':            buildDieselSim,
    'refrigeration':     buildRefrigerationSim,
    'pump':              buildPumpSim,
    'four-bar':          buildFourBarSim,
    'flywheel':          buildFlywheelSim,
    'injection-moulding':buildInjectionMouldingSim,
    'sheet-metal':       buildSheetMetalSim,
    'pipe-networks':     buildPipeNetworkSim,
    'mohrs-circle':      buildMohrsCircleSim,
    'brayton-cycle':     buildBraytonSim,
    'boundary-layer':    buildBoundaryLayerSim,
    'rotor-balancing':   buildRotorBalancingSim,
    'cnc-machining':     buildCncSim,
    'thin-walled-vessels': buildThinWalledSim
  };
  const container = document.getElementById('simulation-container');
  container.innerHTML = '';
  if (extra[type]) extra[type](container);
  else _origInit(type, concept);
};

// ══════════════════════════════════════════
// NEW SIM: SFD & BMD — Interactive Beam
// ══════════════════════════════════════════
function buildSfdBmdSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'sfd_ra', 'Reaction RA');
  addOutputItem(output, 'sfd_rb', 'Reaction RB');
  addOutputItem(output, 'sfd_mmax', 'Max BM');

  let state = { w: 10, P: 20, a: 2, L: 6 };
  addSlider(controls, 'UDL w (kN/m)', 0, 30, state.w, 1, '', v => { state.w = v; draw(); });
  addSlider(controls, 'Point Load P (kN)', 0, 50, state.P, 1, '', v => { state.P = v; draw(); });
  addSlider(controls, 'Load at x (m)', 0.5, state.L - 0.5, state.a, 0.5, '', v => { state.a = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { w, P, a, L } = state;
    const RA = (w * L * L / 2 + P * (L - a)) / L;
    const RB = w * L + P - RA;
    const mxPos = RA / w;
    const Mmax = RA * mxPos - w * mxPos * mxPos / 2;

    // Beam line
    const bx = 40, bw = W - 80, by = 80;
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.stroke();

    // Supports
    ctx.fillStyle = '#10b981'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('A', bx, by + 20); ctx.fillText('B', bx + bw, by + 20);
    ctx.fillText(`RA=${RA.toFixed(1)} kN`, bx, by + 34);
    ctx.fillText(`RB=${RB.toFixed(1)} kN`, bx + bw, by + 34);

    // SFD
    const sfdY = 160, sfdH = 50;
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2;
    ctx.beginPath();
    const px = x => bx + (x / L) * bw;
    const pv = v => sfdY - (v / Math.max(Math.abs(RA), Math.abs(RB), 1)) * sfdH;
    ctx.moveTo(px(0), pv(RA));
    ctx.lineTo(px(a), pv(RA - w * a));
    ctx.lineTo(px(a), pv(RA - w * a - P));
    ctx.lineTo(px(L), pv(RA - w * L - P));
    ctx.stroke();
    ctx.fillStyle = '#a78bfa'; ctx.fillText('SFD', bx - 25, sfdY);

    // BMD
    const bmdY = 250, bmdH = 50;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath();
    const pm = (x) => {
      let m = RA * x - w * x * x / 2;
      if (x > a) m -= P * (x - a);
      return bmdY - (m / Math.max(Mmax, 1)) * bmdH;
    };
    ctx.moveTo(px(0), bmdY);
    for (let i = 1; i <= 60; i++) { const x = (i / 60) * L; ctx.lineTo(px(x), pm(x)); }
    ctx.lineTo(px(L), bmdY); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.fillText('BMD', bx - 25, bmdY);

    document.getElementById('sfd_ra').textContent = RA.toFixed(2) + ' kN';
    document.getElementById('sfd_rb').textContent = RB.toFixed(2) + ' kN';
    document.getElementById('sfd_mmax').textContent = Mmax.toFixed(2) + ' kN·m';
  }
  draw();
}

// ══════════════════════════════════════════
// NEW SIM: Diesel Cycle P-V Diagram
// ══════════════════════════════════════════
function buildDieselSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'diesel_eta', 'Diesel Efficiency');
  addOutputItem(output, 'diesel_rc', 'Cut-off Ratio');
  addOutputItem(output, 'diesel_t2', 'T₂ (K)');

  let state = { r: 18, Qin: 900, T1: 300 };
  addSlider(controls, 'Compression Ratio r', 12, 24, state.r, 1, '', v => { state.r = v; draw(); });
  addSlider(controls, 'Heat Input Qin (kJ/kg)', 400, 1400, state.Qin, 50, '', v => { state.Qin = v; draw(); });

  const g = 1.4, cp = 1.005, cv = 0.718;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { r, Qin, T1 } = state;
    const T2 = T1 * Math.pow(r, g - 1);
    const T3 = T2 + Qin / cp;
    const rc = T3 / T2;
    const eta = 1 - (1 / Math.pow(r, g - 1)) * (Math.pow(rc, g) - 1) / (g * (rc - 1));
    const p1 = 100, v1 = 1, v2 = v1 / r, v3 = v2 * rc;
    const p2 = p1 * Math.pow(r, g), p3 = p2, p4 = p3 * Math.pow(v3, g) / Math.pow(v1, g);

    const vmax = v1, pmax = p2;
    const mx = 50, mw = W - 80, my = 20, mh = H - 60;
    const px = v => mx + (v / vmax) * mw;
    const py = p => my + mh - (p / pmax) * mh;

    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    ctx.strokeRect(mx, my, mw, mh);

    // Process lines
    const pts = [[v2,p2],[v3,p3]]; // 2→3 constant pressure
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px(v2), py(p2)); ctx.lineTo(px(v3), py(p3)); ctx.stroke();

    // 3→4 isentropic expansion
    ctx.strokeStyle = '#10b981';
    ctx.beginPath(); ctx.moveTo(px(v3), py(p3));
    for (let i = 1; i <= 40; i++) { const v = v3 + (v1-v3)*i/40; ctx.lineTo(px(v), py(p3*Math.pow(v3/v,g))); }
    ctx.stroke();

    // 1→2 isentropic compression
    ctx.strokeStyle = '#60a5fa';
    ctx.beginPath(); ctx.moveTo(px(v1), py(p1));
    for (let i = 1; i <= 40; i++) { const v = v1 - (v1-v2)*i/40; ctx.lineTo(px(v), py(p1*Math.pow(v1/v,g))); }
    ctx.stroke();

    // 4→1 isochoric
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath(); ctx.moveTo(px(v1), py(p4)); ctx.lineTo(px(v1), py(p1)); ctx.stroke();

    ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace'; ctx.textAlign = 'left';
    ctx.fillText('P', mx - 12, my + 10); ctx.fillText('V', mx + mw, my + mh + 14);

    document.getElementById('diesel_eta').textContent = (eta * 100).toFixed(1) + '%';
    document.getElementById('diesel_rc').textContent = rc.toFixed(2);
    document.getElementById('diesel_t2').textContent = T2.toFixed(0) + ' K';
  }
  draw();
}

// ══════════════════════════════════════════
// NEW SIM: Refrigeration Cycle
// ══════════════════════════════════════════
function buildRefrigerationSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'ref_cop', 'COP (Refrigerator)');
  addOutputItem(output, 'ref_cophp', 'COP (Heat Pump)');
  addOutputItem(output, 'ref_carnot', 'Carnot COP');

  let state = { TL: -10, TH: 40, RE: 130, W: 40 };
  addSlider(controls, 'Evap Temp TL (°C)', -30, 10, state.TL, 1, '', v => { state.TL = v; draw(); });
  addSlider(controls, 'Cond Temp TH (°C)', 25, 60, state.TH, 1, '', v => { state.TH = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { TL, TH } = state;
    const TLk = TL + 273, THk = TH + 273;
    const COP_R = TLk / (THk - TLk);
    const COP_HP = THk / (THk - TLk);

    // Draw schematic
    const cx = W / 2, cy = H / 2;
    const boxes = [
      { x: cx, y: 40, label: 'CONDENSER', sub: `TH = ${TH}°C`, col: '#ef4444' },
      { x: cx, y: H - 40, label: 'EVAPORATOR', sub: `TL = ${TL}°C`, col: '#60a5fa' },
      { x: 100, y: cy, label: 'COMPRESSOR', sub: 'Work In', col: '#10b981' },
      { x: W - 100, y: cy, label: 'EXP. VALVE', sub: 'h₃=h₄', col: '#a78bfa' }
    ];
    ctx.font = '10px monospace'; ctx.textAlign = 'center';
    boxes.forEach(b => {
      ctx.fillStyle = b.col + '33';
      ctx.strokeStyle = b.col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(b.x - 60, b.y - 20, 120, 36, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = b.col; ctx.fillText(b.label, b.x, b.y - 4); ctx.fillText(b.sub, b.x, b.y + 10);
    });

    ctx.fillStyle = '#64748b'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`COP_R = ${COP_R.toFixed(2)}`, cx, cy - 10);
    ctx.fillText(`COP_HP = ${COP_HP.toFixed(2)}`, cx, cy + 10);

    document.getElementById('ref_cop').textContent = COP_R.toFixed(3);
    document.getElementById('ref_cophp').textContent = COP_HP.toFixed(3);
    document.getElementById('ref_carnot').textContent = COP_R.toFixed(3) + ' (Carnot limit)';
  }
  draw();
}

// ══════════════════════════════════════════
// NEW SIM: Pump H-Q Curve
// ══════════════════════════════════════════
function buildPumpSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'pump_op_h', 'Operating Head');
  addOutputItem(output, 'pump_op_q', 'Operating Flow');
  addOutputItem(output, 'pump_npsha', 'NPSHA');

  let state = { H0: 30, staticH: 5, suction: 3, speed: 100 };
  addSlider(controls, 'Shutoff Head H₀ (m)', 10, 50, state.H0, 1, '', v => { state.H0 = v; draw(); });
  addSlider(controls, 'Static Head (m)', 0, 20, state.staticH, 1, '', v => { state.staticH = v; draw(); });
  addSlider(controls, 'Speed (%)', 60, 120, state.speed, 5, '', v => { state.speed = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { H0, staticH, speed } = state;
    const N = speed / 100;
    const H0n = H0 * N * N;
    const mx = 60, mw = W - 80, my = 20, mh = H - 60;
    const Qmax = 0.06, Hmax = 55;
    const px = q => mx + (q / Qmax) * mw;
    const py = h => my + mh - (h / Hmax) * mh;

    // Axes
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, my + mh); ctx.lineTo(mx + mw, my + mh); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace';
    ctx.textAlign = 'center'; ctx.fillText('Flow Q (m³/s)', mx + mw / 2, my + mh + 20);
    ctx.textAlign = 'right'; ctx.fillText('Head H (m)', mx - 5, my + 10);

    // Pump curve H = H0n - k*Q^2
    const k = H0n / (Qmax * Qmax);
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const q = (i / 50) * Qmax;
      const h = H0n - k * q * q;
      if (h < 0) break;
      i === 0 ? ctx.moveTo(px(q), py(h)) : ctx.lineTo(px(q), py(h));
    }
    ctx.stroke();

    // System curve H = staticH + ks*Q^2
    const ks = (H0n * 0.7 - staticH) / (Qmax * 0.7 * Qmax * 0.7);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const q = (i / 50) * Qmax;
      const h = staticH + ks * q * q;
      i === 0 ? ctx.moveTo(px(q), py(h)) : ctx.lineTo(px(q), py(h));
    }
    ctx.stroke();

    // Operating point (approximate intersection)
    const Qop = Math.sqrt((H0n - staticH) / (k + ks));
    const Hop = H0n - k * Qop * Qop;
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(px(Qop), py(Hop), 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#60a5fa'; ctx.textAlign = 'left'; ctx.fillText('Pump Curve', mx + 5, my + 15);
    ctx.fillStyle = '#f59e0b'; ctx.fillText('System Curve', mx + 5, my + 30);

    const NPSHA = 10.11 - 3 - 1.5;
    document.getElementById('pump_op_h').textContent = Hop.toFixed(1) + ' m';
    document.getElementById('pump_op_q').textContent = (Qop * 1000).toFixed(1) + ' L/s';
    document.getElementById('pump_npsha').textContent = NPSHA.toFixed(2) + ' m';
  }
  draw();
}

// ══════════════════════════════════════════
// NEW SIM: Four-Bar Linkage Animation
// ══════════════════════════════════════════
function buildFourBarSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'fb_grashof', 'Grashof');
  addOutputItem(output, 'fb_type', 'Mechanism Type');
  addOutputItem(output, 'fb_mu', 'Trans. Angle μ');

  let state = { a: 50, b: 120, c: 100, d: 150, omega: 1 };
  let animId = null, theta2 = 0;
  addSlider(controls, 'Crank a (mm)', 20, 80, state.a, 5, '', v => { state.a = v; });
  addSlider(controls, 'Coupler b (mm)', 80, 160, state.b, 5, '', v => { state.b = v; });
  addSlider(controls, 'Rocker c (mm)', 60, 140, state.c, 5, '', v => { state.c = v; });
  addSlider(controls, 'Frame d (mm)', 100, 180, state.d, 5, '', v => { state.d = v; });

  const scale = 1.5;
  const ox = 120, oy = H / 2;

  function solve(th2) {
    const { a, b, c, d } = state;
    const Ax = a * Math.cos(th2), Ay = a * Math.sin(th2);
    const Dx = d, Dy = 0;
    const AC = Math.sqrt((Ax-Dx)*(Ax-Dx) + Ay*Ay);
    if (AC > b + c || AC < Math.abs(b - c)) return null;
    const alpha = Math.atan2(Ay - Dy, Ax - Dx);
    const cosB = (b*b + AC*AC - c*c) / (2*b*AC);
    const beta = Math.acos(Math.max(-1, Math.min(1, cosB)));
    const th3 = alpha - beta;
    const Bx = Ax + b * Math.cos(th3), By = Ay + b * Math.sin(th3);
    const mu = Math.abs(Math.atan2(By - Dy, Bx - Dx) - th3) * 180 / Math.PI;
    return { Bx, By, mu: Math.min(mu, 180 - mu) };
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    theta2 += 0.02;
    const { a, b, c, d } = state;
    const s = Math.min(a,b,c,d), l = Math.max(a,b,c,d);
    const pq = a+b+c+d - s - l;
    const grashof = s + l <= pq;

    const sol = solve(theta2);
    if (sol) {
      const { Bx, By, mu } = sol;
      const A = [ox + a*Math.cos(theta2)*scale, oy - a*Math.sin(theta2)*scale];
      const B = [ox + Bx*scale, oy - By*scale];
      const O = [ox, oy]; const D = [ox + d*scale, oy];

      // Draw links
      const links = [[O, A, '#60a5fa'], [A, B, '#a78bfa'], [B, D, '#f59e0b']];
      links.forEach(([p1,p2,col]) => {
        ctx.strokeStyle = col; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]); ctx.stroke();
      });
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.setLineDash([5,5]);
      ctx.beginPath(); ctx.moveTo(O[0],O[1]); ctx.lineTo(D[0],D[1]); ctx.stroke();
      ctx.setLineDash([]);

      [O, A, B, D].forEach(p => {
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(p[0],p[1],5,0,Math.PI*2); ctx.fill();
      });

      document.getElementById('fb_grashof').textContent = grashof ? 'Yes ✓' : 'No ✗';
      document.getElementById('fb_type').textContent = grashof ? 'Crank-Rocker' : 'Double-Rocker';
      document.getElementById('fb_mu').textContent = mu.toFixed(1) + '°';
    }
    animId = requestAnimationFrame(animate);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) { cancelAnimationFrame(animId); animId = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId) animate();
    });
  });
  animate();
}

// ══════════════════════════════════════════
// NEW SIM: Flywheel Energy
// ══════════════════════════════════════════
function buildFlywheelSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'fw_I', 'Required I (kg·m²)');
  addOutputItem(output, 'fw_mass', 'Flywheel Mass (kg)');
  addOutputItem(output, 'fw_eta', 'Speed Fluctuation');

  let state = { N: 600, dE: 1500, Cs: 150, R: 0.5 };
  addSlider(controls, 'Speed N (RPM)', 200, 1200, state.N, 50, '', v => { state.N = v; draw(); });
  addSlider(controls, 'ΔE (J)', 500, 5000, state.dE, 100, '', v => { state.dE = v; draw(); });
  addSlider(controls, '1/Cs (smoothness)', 50, 300, state.Cs, 10, '', v => { state.Cs = v; draw(); });

  let angle = 0, animId = null;
  function draw() {
    angle += 0.04;
    ctx.clearRect(0, 0, W, H);
    const { N, dE, Cs, R } = state;
    const omega = 2 * Math.PI * N / 60;
    const I = dE / ((1/Cs) * omega * omega);
    const rho = 7200, t = 0.08;
    const r4 = 2 * I / (rho * Math.PI * t);
    const Rf = Math.pow(r4, 0.25);
    const mass = rho * Math.PI * Rf * Rf * t;

    const cx = W / 2, cy = H / 2, drawR = Math.min(100, Rf * 120);
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, cy, drawR, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.stroke();

    // Spokes
    for (let i = 0; i < 4; i++) {
      const a = angle + i * Math.PI / 2;
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + drawR * Math.cos(a), cy + drawR * Math.sin(a)); ctx.stroke();
    }

    // Energy bar
    const barX = 20, barY = 40, barH = 200;
    const fill = 0.5 + 0.5 * Math.sin(angle * 2);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(barX, barY, 18, barH);
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(barX, barY + barH * (1-fill), 18, barH * fill);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('KE', barX+9, barY - 5);

    document.getElementById('fw_I').textContent = I.toFixed(2) + ' kg·m²';
    document.getElementById('fw_mass').textContent = mass.toFixed(1) + ' kg';
    document.getElementById('fw_eta').textContent = ((1/Cs)*100).toFixed(1) + '%';

    animId = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) { cancelAnimationFrame(animId); animId = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId) draw();
    });
  });
  draw();
}

// ══════════════════════════════════════════
// 1. Mohr's Circle
// ══════════════════════════════════════════
function buildMohrsCircleSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'mc_s1', 'σ₁ (Max Principal)');
  addOutputItem(output, 'mc_s2', 'σ₂ (Min Principal)');
  addOutputItem(output, 'mc_tmax', 'τ_max (Max Shear)');

  let state = { sx: 80, sy: 20, txy: 40 };
  addSlider(controls, 'σx (MPa)', -100, 200, state.sx, 5, '', v => { state.sx = v; draw(); });
  addSlider(controls, 'σy (MPa)', -100, 200, state.sy, 5, '', v => { state.sy = v; draw(); });
  addSlider(controls, 'τxy (MPa)', -100, 100, state.txy, 5, '', v => { state.txy = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { sx, sy, txy } = state;
    const avg = (sx + sy) / 2;
    const R = Math.sqrt(Math.pow((sx - sy)/2, 2) + Math.pow(txy, 2));
    const s1 = avg + R, s2 = avg - R;
    
    // Auto-scale
    const maxVal = Math.max(Math.abs(s1), Math.abs(s2), R * 2);
    const scale = (W/2 - 40) / (maxVal || 1);
    const cx = W / 2, cy = H / 2;

    // Grid & Axes
    ctx.strokeStyle = '#1e2d45'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px monospace';
    ctx.fillText('σ', W - 15, cy - 10); ctx.fillText('τ', cx + 10, 15);

    // Circle
    const pxC = cx + avg * scale;
    const pxR = R * scale;
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(pxC, cy, pxR, 0, Math.PI * 2); ctx.stroke();

    // Diameter points (σx, -τxy) and (σy, τxy)
    const pxX = cx + sx * scale, pyX = cy + txy * scale; // τxy plotting convention
    const pxY = cx + sy * scale, pyY = cy - txy * scale;
    ctx.strokeStyle = '#10b981'; ctx.beginPath(); ctx.moveTo(pxX, pyX); ctx.lineTo(pxY, pyY); ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(pxX, pyX, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(pxY, pyY, 4, 0, Math.PI*2); ctx.fill();

    document.getElementById('mc_s1').textContent = s1.toFixed(1) + ' MPa';
    document.getElementById('mc_s2').textContent = s2.toFixed(1) + ' MPa';
    document.getElementById('mc_tmax').textContent = R.toFixed(1) + ' MPa';
  }
  draw();
}

// ══════════════════════════════════════════
// 2. Brayton Cycle
// ══════════════════════════════════════════
function buildBraytonSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'bc_eff', 'Efficiency η');
  addOutputItem(output, 'bc_wnet', 'Net Work (kJ/kg)');
  addOutputItem(output, 'bc_bwr', 'Back Work Ratio');

  let state = { rp: 12, T3: 1300 };
  addSlider(controls, 'Pressure Ratio (rp)', 4, 30, state.rp, 1, '', v => { state.rp = v; draw(); });
  addSlider(controls, 'Max Temp T3 (K)', 1000, 1600, state.T3, 50, '', v => { state.T3 = v; draw(); });

  const T1 = 300, cp = 1.005, k = 1.4;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { rp, T3 } = state;
    
    // Thermodynamics
    const T2 = T1 * Math.pow(rp, (k-1)/k);
    const T4 = T3 / Math.pow(rp, (k-1)/k);
    const Wc = cp * (T2 - T1), Wt = cp * (T3 - T4);
    const Wnet = Wt - Wc, Qin = cp * (T3 - T2);
    const eff = Wnet / Qin;
    const bwr = Wc / Wt;

    // T-s Diagram Drawing
    // Entropy arbitrary scale: s2-s1 = 0 (isentropic), s3-s2 = cp ln(T3/T2) - R ln(1)
    const s1 = 1, s2 = 1;
    const s3 = s2 + cp * Math.log(T3 / T2);
    const s4 = s3; // isentropic expansion
    
    const margin = 40;
    const scaleT = (H - 2*margin) / 1600;
    const scaleS = (W - 2*margin) / 2.5;

    // Axes
    ctx.strokeStyle = '#1e2d45'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(margin, margin); ctx.lineTo(margin, H - margin); ctx.lineTo(W - margin, H - margin); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px monospace';
    ctx.fillText('T', margin - 15, margin); ctx.fillText('s', W - margin + 10, H - margin + 5);

    // Isobars (curved)
    ctx.strokeStyle = '#334155'; ctx.setLineDash([5,5]); ctx.beginPath();
    for (let s = s1; s <= s3; s += 0.05) {
      const T_low = T1 * Math.exp((s - s1)/cp);
      const T_high = T2 * Math.exp((s - s2)/cp);
      if (s === s1) { ctx.moveTo(margin + s * scaleS, H - margin - T_low * scaleT); }
      else { ctx.lineTo(margin + s * scaleS, H - margin - T_low * scaleT); }
    }
    ctx.stroke(); ctx.beginPath();
    for (let s = s2; s <= s3; s += 0.05) {
      const T_high = T2 * Math.exp((s - s2)/cp);
      if (s === s2) { ctx.moveTo(margin + s * scaleS, H - margin - T_high * scaleT); }
      else { ctx.lineTo(margin + s * scaleS, H - margin - T_high * scaleT); }
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Cycle Path
    const pts = [
      {x: margin + s1 * scaleS, y: H - margin - T1 * scaleT}, // 1
      {x: margin + s2 * scaleS, y: H - margin - T2 * scaleT}, // 2
      {x: margin + s3 * scaleS, y: H - margin - T3 * scaleT}, // 3
      {x: margin + s4 * scaleS, y: H - margin - T4 * scaleT}  // 4
    ];
    
    ctx.fillStyle = '#f59e0b55'; ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[1].x, pts[1].y);
    for (let s = s2; s <= s3; s += 0.05) { ctx.lineTo(margin + s * scaleS, H - margin - (T2 * Math.exp((s - s2)/cp)) * scaleT); }
    ctx.lineTo(pts[3].x, pts[3].y);
    for (let s = s4; s >= s1; s -= 0.05) { ctx.lineTo(margin + s * scaleS, H - margin - (T1 * Math.exp((s - s1)/cp)) * scaleT); }
    ctx.fill();
    
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();

    document.getElementById('bc_eff').textContent = (eff * 100).toFixed(1) + '%';
    document.getElementById('bc_wnet').textContent = Wnet.toFixed(1);
    document.getElementById('bc_bwr').textContent = (bwr * 100).toFixed(1) + '%';
  }
  draw();
}

// ══════════════════════════════════════════
// 3. Boundary Layer
// ══════════════════════════════════════════
function buildBoundaryLayerSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'bl_rex', 'Reynolds No (Rex)');
  addOutputItem(output, 'bl_thick', 'Thickness δ (mm)');
  addOutputItem(output, 'bl_cf', 'Skin Friction Cf');

  let state = { U: 10, x: 0.5 };
  addSlider(controls, 'Velocity U (m/s)', 1, 50, state.U, 1, '', v => { state.U = v; draw(); });
  addSlider(controls, 'Distance x (m)', 0.1, 2.0, state.x, 0.1, '', v => { state.x = v; draw(); });

  const nu = 1.5e-5; // Air kinematic viscosity
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { U, x } = state;
    const Rex = (U * x) / nu;
    const isTurb = Rex > 5e5;
    
    const delta = isTurb ? (0.38 * x) / Math.pow(Rex, 0.2) : (5.0 * x) / Math.sqrt(Rex);
    const Cf = isTurb ? 0.0592 / Math.pow(Rex, 0.2) : 0.664 / Math.sqrt(Rex);

    // Plate
    const py = H - 40;
    ctx.fillStyle = '#334155'; ctx.fillRect(20, py, W - 40, 10);

    // Profile curve
    const pxX = 20 + (x / 2.0) * (W - 80);
    const dH = Math.min((delta / 0.05) * 200, 200); // Scale delta for visual

    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pxX, py);
    for (let i = 0; i <= 10; i++) {
      const u_ratio = i / 10;
      // Blasius approx: u/U = 2(y/d) - (y/d)^2
      // Power law: u/U = (y/d)^(1/7)
      const y_ratio = isTurb ? Math.pow(u_ratio, 7) : (1 - Math.sqrt(1 - u_ratio)); // Inverse approx
      ctx.lineTo(pxX - u_ratio * 80, py - (y_ratio || 0) * dH);
    }
    ctx.stroke();

    // Arrows
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const y_ratio = i / 5;
      const u_ratio = isTurb ? Math.pow(y_ratio, 1/7) : (2*y_ratio - y_ratio*y_ratio);
      const y_pos = py - y_ratio * dH;
      const arr_len = u_ratio * 80;
      ctx.beginPath(); ctx.moveTo(pxX - arr_len, y_pos); ctx.lineTo(pxX, y_pos); ctx.stroke();
      // Arrowhead
      ctx.beginPath(); ctx.moveTo(pxX, y_pos); ctx.lineTo(pxX - 5, y_pos - 3); ctx.lineTo(pxX - 5, y_pos + 3); ctx.fillStyle = '#94a3b8'; ctx.fill();
    }

    // Boundary layer edge
    ctx.strokeStyle = '#6366f1'; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(20, py);
    for (let xi = 20; xi <= pxX; xi += 5) {
      const realX = ((xi - 20) / (W - 80)) * 2.0;
      const r_x = (U * realX) / nu;
      const d_x = (r_x > 5e5) ? (0.38 * realX) / Math.pow(r_x, 0.2) : (5.0 * realX) / Math.sqrt(r_x);
      const dy = Math.min((d_x / 0.05) * 200, 200);
      xi === 20 ? ctx.moveTo(xi, py) : ctx.lineTo(xi, py - dy);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Status
    ctx.fillStyle = isTurb ? '#f59e0b' : '#10b981'; ctx.font = '14px monospace';
    ctx.fillText(isTurb ? 'Turbulent' : 'Laminar', pxX - 40, py + 25);

    document.getElementById('bl_rex').textContent = Rex.toExponential(2);
    document.getElementById('bl_thick').textContent = (delta * 1000).toFixed(2);
    document.getElementById('bl_cf').textContent = Cf.toExponential(2);
  }
  draw();
}

// ══════════════════════════════════════════
// 4. Rotor Balancing
// ══════════════════════════════════════════
function buildRotorBalancingSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'rb_mb', 'Balancing Mass (kg)');
  addOutputItem(output, 'rb_ang', 'Angle θ_b (°)');

  let state = { m1: 4, r1: 75, th1: 0, m2: 3, r2: 85, th2: 60, rb: 100 };
  addSlider(controls, 'Mass 1 (kg)', 1, 10, state.m1, 0.5, '', v => { state.m1 = v; draw(); });
  addSlider(controls, 'Angle 1 (°)', 0, 360, state.th1, 5, '', v => { state.th1 = v; draw(); });
  addSlider(controls, 'Mass 2 (kg)', 1, 10, state.m2, 0.5, '', v => { state.m2 = v; draw(); });
  addSlider(controls, 'Angle 2 (°)', 0, 360, state.th2, 5, '', v => { state.th2 = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { m1, r1, th1, m2, r2, th2, rb } = state;
    
    // Unbalance vectors
    const H1 = m1 * r1 * Math.cos(th1 * Math.PI/180);
    const V1 = m1 * r1 * Math.sin(th1 * Math.PI/180);
    const H2 = m2 * r2 * Math.cos(th2 * Math.PI/180);
    const V2 = m2 * r2 * Math.sin(th2 * Math.PI/180);
    
    const sumH = H1 + H2, sumV = V1 + V2;
    const R = Math.sqrt(sumH*sumH + sumV*sumV);
    const thR = Math.atan2(sumV, sumH) * 180 / Math.PI;
    
    // Balancing mass
    const mb = R / rb;
    let thb = thR + 180;
    if (thb > 360) thb -= 360;

    const cx = W / 4, cy = H / 2; // Rotor view
    const pCx = 3 * W / 4, pCy = H / 2; // Polygon view

    // 1. Draw Rotor View
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2); ctx.fill();

    function drawVector(x, y, mag, angle, color, label) {
      const px = x + mag * Math.cos(angle * Math.PI/180);
      const py = y - mag * Math.sin(angle * Math.PI/180); // canvas Y is down
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(px, py); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2); ctx.fill();
      ctx.font = '12px monospace'; ctx.fillText(label, px + 10, py);
      return {px, py};
    }

    drawVector(cx, cy, r1, th1, '#ef4444', 'm1');
    drawVector(cx, cy, r2, th2, '#f97316', 'm2');
    drawVector(cx, cy, rb, thb, '#10b981', 'mb');

    // 2. Draw Vector Polygon View (scaled)
    const scale = 80 / Math.max(R, m1*r1, m2*r2);
    ctx.fillStyle = '#94a3b8'; ctx.fillText('Force Polygon', pCx - 40, 20);
    
    // Start at center
    const pt1 = drawVector(pCx, pCy, m1*r1*scale, th1, '#ef4444', '');
    const pt2 = drawVector(pt1.px, pt1.py, m2*r2*scale, th2, '#f97316', '');
    // Balancing vector closes the gap
    drawVector(pt2.px, pt2.py, mb*rb*scale, thb, '#10b981', 'Close');

    document.getElementById('rb_mb').textContent = mb.toFixed(2);
    document.getElementById('rb_ang').textContent = thb.toFixed(1);
  }
  draw();
}

// ══════════════════════════════════════════
// 5. CNC Machining
// ══════════════════════════════════════════
function buildCncSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'cnc_cmd', 'Executing Block');
  addOutputItem(output, 'cnc_pos', 'Position (X, Y)');

  let state = { feed: 100 };
  addSlider(controls, 'Feedrate Override (%)', 10, 200, state.feed, 10, '', v => { state.feed = v; });

  const path = [
    { type: 'G00', x: 50, y: 50 },
    { type: 'G01', x: 200, y: 50, f: 200 },
    { type: 'G01', x: 200, y: 150, f: 200 },
    { type: 'G02', x: 250, y: 200, cx: 250, cy: 150, f: 100 }, // CW arc
    { type: 'G01', x: 350, y: 200, f: 200 },
    { type: 'G00', x: 50, y: 50 }
  ];

  let t = 0, currentLeg = 0, animId = null;
  let toolX = 50, toolY = 50;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Stock material
    ctx.fillStyle = '#1e293b'; ctx.fillRect(40, 40, 360, 200);
    // Machine Zero (G54)
    ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(30, 40); ctx.lineTo(50, 40); ctx.moveTo(40, 30); ctx.lineTo(40, 50); ctx.stroke();

    // Draw full path trace
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
    for (let i=1; i<path.length; i++) {
      if (path[i].type === 'G02') {
        ctx.arc(path[i].cx, path[i].cy, 50, Math.PI, Math.PI*1.5, false);
      } else {
        ctx.lineTo(path[i].x, path[i].y);
      }
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Animate Tool
    const leg = path[currentLeg];
    const next = path[currentLeg + 1];
    
    if (next) {
      const speed = leg.type === 'G00' ? 10 : (next.f / 60) * (state.feed/100);
      
      if (next.type === 'G02') {
        const totalAng = Math.PI/2;
        const angSpeed = speed / 50; // v = rw -> w = v/r
        t += angSpeed;
        if (t >= totalAng) { t = 0; currentLeg++; }
        else {
          toolX = next.cx + 50 * Math.cos(Math.PI + t);
          toolY = next.cy + 50 * Math.sin(Math.PI + t);
        }
      } else {
        const dx = next.x - toolX, dy = next.y - toolY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= speed) {
          toolX = next.x; toolY = next.y; currentLeg++;
        } else {
          toolX += (dx/dist) * speed; toolY += (dy/dist) * speed;
        }
      }
    } else {
      currentLeg = 0; // loop
    }

    // Cut path (trail)
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.arc(toolX, toolY, 10, 0, Math.PI*2); ctx.fill();

    // Tool
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(toolX, toolY, 10, 0, Math.PI*2); ctx.stroke();
    // Crosshair
    ctx.beginPath(); ctx.moveTo(toolX-15, toolY); ctx.lineTo(toolX+15, toolY); ctx.moveTo(toolX, toolY-15); ctx.lineTo(toolX, toolY+15); ctx.stroke();

    const cmdCode = next ? `${next.type} X${next.x} Y${next.y}` : 'END';
    document.getElementById('cnc_cmd').textContent = cmdCode;
    document.getElementById('cnc_pos').textContent = `${toolX.toFixed(1)}, ${toolY.toFixed(1)}`;

    animId = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) { cancelAnimationFrame(animId); animId = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId) draw();
    });
  });
  draw();
}

// ══════════════════════════════════════════
// 6. Injection Moulding
// ══════════════════════════════════════════
function buildInjectionMouldingSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'im_stage', 'Cycle Stage');
  addOutputItem(output, 'im_time', 'Elapsed Time (s)');

  let state = { tInject: 2, tCool: 5, tEject: 2 };
  addSlider(controls, 'Cooling Time (s)', 2, 10, state.tCool, 1, '', v => { state.tCool = v; });

  let time = 0, animId = null;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { tInject, tCool, tEject } = state;
    const totalTime = tInject + tCool + tEject + 2; // +2 for mold opening/closing
    
    time += 0.05; // 50ms per frame approx
    if (time > totalTime) time = 0;

    let stage = '';
    let moldGap = 0;
    let plasticFill = 0;
    let plasticColor = '#f59e0b'; // molten

    if (time < 1) { // Closing
      stage = 'Mold Closing';
      moldGap = 60 * (1 - time);
    } else if (time < 1 + tInject) { // Injecting
      stage = 'Injection & Packing';
      moldGap = 0;
      plasticFill = (time - 1) / tInject;
    } else if (time < 1 + tInject + tCool) { // Cooling
      stage = 'Cooling';
      moldGap = 0;
      plasticFill = 1;
      const coolRatio = (time - (1 + tInject)) / tCool;
      const gb = Math.floor(158 - 100 * coolRatio); // orange to blueish
      plasticColor = `rgb(245, ${gb}, 11)`; 
    } else if (time < 1 + tInject + tCool + 1) { // Opening
      stage = 'Mold Opening';
      moldGap = 60 * (time - (1 + tInject + tCool));
      plasticFill = 1;
      plasticColor = '#3b82f6'; // solid
    } else { // Ejecting
      stage = 'Ejection';
      moldGap = 60;
      plasticFill = 1;
      plasticColor = '#3b82f6';
    }

    const cx = W / 2, cy = H / 2;

    // Fixed Mold Half (Left)
    ctx.fillStyle = '#475569'; ctx.fillRect(cx - 100, cy - 80, 80, 160);
    // Moving Mold Half (Right)
    ctx.fillStyle = '#475569'; ctx.fillRect(cx - 20 + moldGap, cy - 80, 80, 160);

    // Cavity (T-shape part) inside the molds
    if (plasticFill > 0) {
      ctx.fillStyle = plasticColor;
      const h_fill = 80 * plasticFill;
      // Draw plastic in cavity, shifts with moving mold during ejection
      const shift = stage === 'Ejection' ? (time - (1+tInject+tCool+1)) * 40 : 0;
      ctx.fillRect(cx - 20 + (stage === 'Mold Opening' || stage === 'Ejection' ? moldGap : 0) + shift, cy - 40, 20, h_fill);
      if (plasticFill > 0.5) {
        const w_fill = 60 * ((plasticFill - 0.5)*2);
        ctx.fillRect(cx - 50 + (stage === 'Mold Opening' || stage === 'Ejection' ? moldGap : 0) + shift, cy - 20, w_fill, 20);
      }
    }

    // Nozzle
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(cx - 160, cy - 10, 60, 20);
    if (stage === 'Injection & Packing') {
      // Flow indicator
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(cx - 110, cy - 5); ctx.lineTo(cx - 100, cy); ctx.lineTo(cx - 110, cy + 5); ctx.fill();
    }

    document.getElementById('im_stage').textContent = stage;
    document.getElementById('im_time').textContent = time.toFixed(1);

    animId = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) { cancelAnimationFrame(animId); animId = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId) draw();
    });
  });
  draw();
}

// ══════════════════════════════════════════
// 7. Sheet Metal Forming
// ══════════════════════════════════════════
function buildSheetMetalSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'sm_angle', 'Final Bend Angle');
  addOutputItem(output, 'sm_force', 'Punch Force (kN)');

  let state = { t: 2, UTS: 400, angle: 90 };
  addSlider(controls, 'Thickness t (mm)', 0.5, 5, state.t, 0.5, '', v => { state.t = v; draw(); });
  addSlider(controls, 'Material UTS (MPa)', 200, 800, state.UTS, 50, '', v => { state.UTS = v; draw(); });
  addSlider(controls, 'Target Angle (°)', 60, 150, state.angle, 5, '', v => { state.angle = v; draw(); });

  let time = 0, animId = null;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { t, UTS, angle } = state;
    
    // Mechanics approx
    const L = 100, W_die = 40;
    const force = (1.33 * t*t * L * UTS) / W_die / 1000; // kN
    
    // Springback approx: K = final_angle / initial_angle
    // Higher UTS = more springback (lower K). Typical K for steel is 0.98.
    const springbackAngle = (UTS / 800) * 5; // up to 5 degrees springback
    const finalAngle = angle + springbackAngle;

    time += 0.02;
    if (time > 3) time = 0;

    const cx = W / 2, cy = H / 2 + 50;
    const dieAngle = (angle / 2) * Math.PI / 180;
    
    // Die (V-Block)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 80);
    ctx.lineTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
    ctx.lineTo(cx + 80, cy - 80); ctx.lineTo(cx + 100, cy - 80);
    ctx.lineTo(cx + 100, cy + 40); ctx.lineTo(cx - 100, cy + 40);
    ctx.lineTo(cx - 100, cy - 80);
    ctx.fill();

    let punchY = cy - 120;
    let sheetAngle = 0;

    if (time < 1) { // Punch coming down
      punchY = cy - 120 + time * 110;
      sheetAngle = (time * (180 - angle) / 2) * Math.PI / 180;
    } else if (time < 2) { // Holding at bottom
      punchY = cy - 10;
      sheetAngle = ((180 - angle) / 2) * Math.PI / 180;
    } else { // Punch going up, springback
      punchY = cy - 10 - (time - 2) * 110;
      sheetAngle = ((180 - finalAngle) / 2) * Math.PI / 180;
    }

    // Sheet
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = t * 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    // Left wing
    ctx.moveTo(cx - 80 * Math.cos(sheetAngle), cy - 10 - 80 * Math.sin(sheetAngle));
    ctx.lineTo(cx, cy - 10);
    // Right wing
    ctx.lineTo(cx + 80 * Math.cos(sheetAngle), cy - 10 - 80 * Math.sin(sheetAngle));
    ctx.stroke();

    // Punch
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(cx - 20, punchY - 100);
    ctx.lineTo(cx + 20, punchY - 100);
    ctx.lineTo(cx + 10, punchY); ctx.lineTo(cx - 10, punchY);
    ctx.fill();

    // Annotations
    ctx.fillStyle = '#f59e0b'; ctx.font = '12px monospace';
    if (time >= 2) {
      ctx.fillText(`Springback: ${springbackAngle.toFixed(1)}°`, cx - 40, cy - 60);
    }

    document.getElementById('sm_angle').textContent = (180 - sheetAngle*2 * 180/Math.PI).toFixed(1) + '°';
    document.getElementById('sm_force').textContent = force.toFixed(1);

    animId = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) { cancelAnimationFrame(animId); animId = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId) draw();
    });
  });
  draw();
}

// ══════════════════════════════════════════
// 8. Thin-Walled Pressure Vessels
// ══════════════════════════════════════════
function buildThinWalledSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'tw_hoop', 'Hoop Stress σ_h (MPa)');
  addOutputItem(output, 'tw_long', 'Long Stress σ_l (MPa)');

  let state = { P: 5, D: 1000, t: 10 };
  addSlider(controls, 'Pressure P (MPa)', 1, 20, state.P, 1, '', v => { state.P = v; draw(); });
  addSlider(controls, 'Diameter D (mm)', 500, 2000, state.D, 100, '', v => { state.D = v; draw(); });
  addSlider(controls, 'Thickness t (mm)', 5, 50, state.t, 5, '', v => { state.t = v; draw(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { P, D, t } = state;
    
    const hoop = (P * D) / (2 * t);
    const long = (P * D) / (4 * t);

    const cx = W / 4, cy = H / 2;
    const rBase = 80;
    // Visual expansion based on pressure
    const expand = (P / 20) * 15;

    // Cross section
    ctx.strokeStyle = '#334155'; ctx.lineWidth = t/2;
    ctx.beginPath(); ctx.arc(cx, cy, rBase, 0, Math.PI*2); ctx.stroke();
    // Expanded
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.arc(cx, cy, rBase + expand, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);

    // Pressure arrows
    ctx.strokeStyle = '#38bdf8'; ctx.fillStyle = '#38bdf8'; ctx.lineWidth = 2;
    for (let a = 0; a < 360; a += 45) {
      const px = cx + (rBase - 20) * Math.cos(a*Math.PI/180);
      const py = cy + (rBase - 20) * Math.sin(a*Math.PI/180);
      const ex = cx + rBase * Math.cos(a*Math.PI/180);
      const ey = cy + rBase * Math.sin(a*Math.PI/180);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI*2); ctx.fill();
    }

    // Side view
    const sx = cx + 160, sy = cy - rBase;
    const slen = 160;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, slen, rBase*2);
    // Expanded side view
    ctx.strokeStyle = '#ef4444'; ctx.setLineDash([5, 5]);
    ctx.strokeRect(sx - expand/2, sy - expand, slen + expand, rBase*2 + expand*2);
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8'; ctx.font = '12px monospace';
    ctx.fillText(`Hoop = ${hoop.toFixed(1)} MPa`, cx - 40, cy + rBase + 30);
    ctx.fillText(`Long = ${long.toFixed(1)} MPa`, sx + 30, cy + rBase + 30);

    document.getElementById('tw_hoop').textContent = hoop.toFixed(1);
    document.getElementById('tw_long').textContent = long.toFixed(1);
  }
  draw();
}

// ══════════════════════════════════════════
// 9. Pipe Networks & Minor Losses
// ══════════════════════════════════════════
function buildPipeNetworkSim(container) {
  const W = 560, H = 320;
  const canvas = makeCanvas(container, W, H);
  const ctx = canvas.getContext('2d');
  const controls = makeControls(container);
  const output = makeOutput(container);
  addOutputItem(output, 'pn_q1', 'Flow Q₁ (m³/s)');
  addOutputItem(output, 'pn_q2', 'Flow Q₂ (m³/s)');
  addOutputItem(output, 'pn_hl', 'Head Loss (m)');

  let state = { Qt: 0.5, k1: 5, k2: 20 };
  addSlider(controls, 'Total Flow Q (m³/s)', 0.1, 1.0, state.Qt, 0.1, '', v => { state.Qt = v; draw(); });
  addSlider(controls, 'Pipe 1 Valve Loss (K₁)', 1, 50, state.k1, 1, '', v => { state.k1 = v; draw(); });
  addSlider(controls, 'Pipe 2 Valve Loss (K₂)', 1, 50, state.k2, 1, '', v => { state.k2 = v; draw(); });

  let offset = 0, animId = null;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { Qt, k1, k2 } = state;
    
    // In parallel pipes, head loss is equal: hL = K1*Q1^2 = K2*Q2^2
    // Therefore Q1/Q2 = sqrt(K2/K1)
    // And Q1 + Q2 = Qt
    const ratio = Math.sqrt(k2 / k1);
    const Q2 = Qt / (1 + ratio);
    const Q1 = Qt - Q2;
    const hL = k1 * Math.pow(Q1, 2);

    offset += 2;
    if (offset > 20) offset = 0;

    const cx = W / 2, cy = H / 2;
    
    // Pipes
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 10; ctx.lineJoin = 'round';
    
    // Main Inlet
    ctx.beginPath(); ctx.moveTo(40, cy); ctx.lineTo(120, cy); ctx.stroke();
    // Pipe 1 (Top)
    ctx.beginPath(); ctx.moveTo(120, cy); ctx.lineTo(160, cy - 60); ctx.lineTo(400, cy - 60); ctx.lineTo(440, cy); ctx.stroke();
    // Pipe 2 (Bottom)
    ctx.beginPath(); ctx.moveTo(120, cy); ctx.lineTo(160, cy + 60); ctx.lineTo(400, cy + 60); ctx.lineTo(440, cy); ctx.stroke();
    // Main Outlet
    ctx.beginPath(); ctx.moveTo(440, cy); ctx.lineTo(520, cy); ctx.stroke();

    // Valves
    ctx.fillStyle = '#ef4444';
    // Valve 1 (Top)
    const v1_size = 10 + (k1 / 50) * 15;
    ctx.beginPath(); ctx.moveTo(280, cy - 60); ctx.lineTo(280-v1_size, cy-60-v1_size); ctx.lineTo(280+v1_size, cy-60-v1_size); ctx.fill();
    ctx.beginPath(); ctx.moveTo(280, cy - 60); ctx.lineTo(280-v1_size, cy-60+v1_size); ctx.lineTo(280+v1_size, cy-60+v1_size); ctx.fill();
    // Valve 2 (Bottom)
    const v2_size = 10 + (k2 / 50) * 15;
    ctx.beginPath(); ctx.moveTo(280, cy + 60); ctx.lineTo(280-v2_size, cy+60-v2_size); ctx.lineTo(280+v2_size, cy+60-v2_size); ctx.fill();
    ctx.beginPath(); ctx.moveTo(280, cy + 60); ctx.lineTo(280-v2_size, cy+60+v2_size); ctx.lineTo(280+v2_size, cy+60+v2_size); ctx.fill();

    // Flow animation (particles)
    ctx.fillStyle = '#38bdf8';
    function drawFlow(startX, startY, endX, endY, flowRate, pathOffset) {
      if (flowRate < 0.01) return;
      const dist = Math.sqrt(Math.pow(endX-startX, 2) + Math.pow(endY-startY, 2));
      const steps = Math.floor(dist / 20);
      for (let i = 0; i < steps; i++) {
        const t = ((i * 20 + pathOffset) % dist) / dist;
        const px = startX + t * (endX - startX);
        const py = startY + t * (endY - startY);
        ctx.beginPath(); ctx.arc(px, py, 3 + flowRate*5, 0, Math.PI*2); ctx.fill();
      }
    }

    const v1 = Q1 * 20; // speed visual
    const v2 = Q2 * 20;
    
    drawFlow(40, cy, 120, cy, Qt, offset*2);
    drawFlow(120, cy, 160, cy - 60, Q1, offset*v1/10);
    drawFlow(160, cy - 60, 400, cy - 60, Q1, offset*v1/10);
    drawFlow(400, cy - 60, 440, cy, Q1, offset*v1/10);
    
    drawFlow(120, cy, 160, cy + 60, Q2, offset*v2/10);
    drawFlow(160, cy + 60, 400, cy + 60, Q2, offset*v2/10);
    drawFlow(400, cy + 60, 440, cy, Q2, offset*v2/10);

    drawFlow(440, cy, 520, cy, Qt, offset*2);

    ctx.fillStyle = '#94a3b8'; ctx.font = '12px monospace';
    ctx.fillText(`${(Q1*100).toFixed(0)}% Flow`, 250, cy - 85);
    ctx.fillText(`${(Q2*100).toFixed(0)}% Flow`, 250, cy + 95);

    document.getElementById('pn_q1').textContent = Q1.toFixed(3);
    document.getElementById('pn_q2').textContent = Q2.toFixed(3);
    document.getElementById('pn_hl').textContent = hL.toFixed(2);

    animId = requestAnimationFrame(draw);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab !== 'tab-simulation' && animId) { cancelAnimationFrame(animId); animId = null; }
      else if (btn.dataset.tab === 'tab-simulation' && !animId) draw();
    });
  });
  draw();
}

