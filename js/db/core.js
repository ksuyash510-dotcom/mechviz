// MechViz — Modular Database Core
// Each category file pushes its concepts here.
// To add a new subject: create js/db/your-subject.js, push to MECHVIZ_DB.concepts.

const MECHVIZ_DB = {
  categories: [
    { id: "som",    name: "Strength of Materials", color: "#ef4444",  icon: "🔩" },
    { id: "thermo", name: "Thermodynamics",         color: "#f97316",  icon: "♨️" },
    { id: "tom",    name: "Theory of Machines",     color: "#a78bfa",  icon: "⚙️" },
    { id: "fluid",  name: "Fluid Mechanics",        color: "#38bdf8",  icon: "💧" },
    { id: "mfg",    name: "Manufacturing",          color: "#34d399",  icon: "🏭" }
  ],
  concepts: []  // populated by category files below
};
