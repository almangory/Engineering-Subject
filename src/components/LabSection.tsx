import React, { useState, useEffect, useRef } from "react";
import { Activity, Compass, Zap, HelpCircle, RefreshCw, Play, Pause, ChevronLeft, Award } from "lucide-react";

interface LabSectionProps {
  activeLab?: "projection" | "engine" | "elasticity" | "capacitor";
  setActiveLab?: (lab: "projection" | "engine" | "elasticity" | "capacitor") => void;
}

export default function LabSection({ activeLab: propActiveLab, setActiveLab: propSetActiveLab }: LabSectionProps = {}) {
  const [localActiveLab, setLocalActiveLab] = useState<"projection" | "engine" | "elasticity" | "capacitor">("projection");

  const activeLab = propActiveLab !== undefined ? propActiveLab : localActiveLab;
  const setActiveLab = propSetActiveLab !== undefined ? propSetActiveLab : setLocalActiveLab;

  // ==========================================
  // 1. Orthographic Projection Simulator State
  // ==========================================
  const [projectionAngle, setProjectionAngle] = useState<"first" | "third">("first");
  const [selectedView, setSelectedView] = useState<"isometric" | "front" | "top" | "side">("isometric");

  // ==========================================
  // 2. 4-Stroke Engine Simulator State
  // ==========================================
  const [enginePlaying, setEnginePlaying] = useState(false);
  const [engineStroke, setEngineStroke] = useState<0 | 1 | 2 | 3>(0); // 0: Suction, 1: Compression, 2: Power, 3: Exhaust
  const [pistonPosition, setPistonPosition] = useState(50); // percentage 20 to 100
  const engineTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enginePlaying) {
      engineTimer.current = setInterval(() => {
        setEngineStroke((prev) => {
          const next = ((prev + 1) % 4) as 0 | 1 | 2 | 3;
          return next;
        });
      }, 1800);
    } else {
      if (engineTimer.current) clearInterval(engineTimer.current);
    }
    return () => {
      if (engineTimer.current) clearInterval(engineTimer.current);
    };
  }, [enginePlaying]);

  // Adjust piston height dynamically based on stroke state
  useEffect(() => {
    // 0: Suction (piston moves down: 20 -> 90)
    // 1: Compression (piston moves up: 90 -> 20)
    // 2: Power (piston driven down: 20 -> 95)
    // 3: Exhaust (piston moves up: 95 -> 20)
    if (engineStroke === 0) setPistonPosition(85);
    else if (engineStroke === 1) setPistonPosition(25);
    else if (engineStroke === 2) setPistonPosition(90);
    else if (engineStroke === 3) setPistonPosition(20);
  }, [engineStroke]);

  // ==========================================
  // 3. Stress-Strain Elasticity Tester State
  // ==========================================
  const [selectedMaterial, setSelectedMaterial] = useState<"steel" | "cast-iron" | "copper" | "aluminum">("steel");
  const [appliedForce, setAppliedForce] = useState(15000); // Newtons

  const materialProperties = {
    "steel": { name: "الصلب الكربوني", E: 200, yieldPoint: 250, ultimate: 400, color: "stroke-slate-400 fill-slate-350" },
    "cast-iron": { name: "حديد الزهر الرمادي", E: 100, yieldPoint: 120, ultimate: 200, color: "stroke-slate-500 fill-slate-450" },
    "copper": { name: "النحاس النقي", E: 110, yieldPoint: 70, ultimate: 220, color: "stroke-amber-600 fill-amber-500" },
    "aluminum": { name: "الألومنيوم الطري", E: 70, yieldPoint: 95, ultimate: 150, color: "stroke-cyan-500 fill-cyan-400" },
  };

  const currentProps = materialProperties[selectedMaterial] || materialProperties["steel"];
  const barArea = 100; // cross sectional area in mm2 (10x10)
  const barLength = 200; // original length in mm

  // stress = Force / Area (N/mm2 or MPa)
  const calculatedStress = appliedForce / barArea;
  // strain = Stress / Young's modulus E (Young modulus is in GPa, convert to MPa by multiplying by 1000)
  const calculatedStrain = calculatedStress / (currentProps.E * 1000);
  // change in length delta_L = strain * original_length
  const extension = calculatedStrain * barLength;

  // Determine current structural zone
  const getStructuralZone = () => {
    if (calculatedStress <= currentProps.yieldPoint * 0.8) {
      return { label: "حد التناسب (المرونة الكاملة)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    } else if (calculatedStress <= currentProps.yieldPoint) {
      return { label: "نقطة الخضوع (بداية التشوه الدائم)", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    } else if (calculatedStress <= currentProps.ultimate) {
      return { label: "الإجهاد الأقصى (مقاومة قصوى)", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" };
    } else {
      return { label: "نقطة الكسر (انهيار المادة وتفتتها!)", color: "text-rose-500 bg-rose-500/10 border-rose-500/30" };
    }
  };

  const zone = getStructuralZone();

  // ==========================================
  // 4. Capacitor Charger Lab State
  // ==========================================
  const [plateArea, setBarArea] = useState(15); // Area in cm2
  const [plateDistance, setPlateDistance] = useState(2); // Distance in mm (0.5 to 5.0)
  const [dielectric, setDielectric] = useState<"air" | "paper" | "ceramic" | "mica">("air");
  const [voltage, setVoltage] = useState(6); // Volts

  const dielectricValues = {
    "air": { name: "الهواء (فراغ)", er: 1.0 },
    "paper": { name: "الورق المشبع بالشمع", er: 4.5 },
    "ceramic": { name: "السيراميك المستقر", er: 6.0 },
    "mica": { name: "المايكا الدقيقة", er: 7.0 },
  };

  const currentEr = dielectricValues[dielectric].er;
  const eo = 8.854; // pF/m or 10^-12 F/m
  // C = (er * eo * Area_cm2 * 10^-4) / (Distance_mm * 10^-3) = er * eo * Area_cm2 * 0.1 / Distance_mm
  const capacitance = (currentEr * eo * plateArea * 0.1) / plateDistance; // in pF
  const storedCharge = capacitance * voltage; // in pC
  const storedEnergy = 0.5 * capacitance * Math.pow(voltage, 2); // in pJ

  return (
    <div className="space-y-6" id="interactive-lab">
      {/* Lab Tabs switcher */}
      <div className="flex flex-wrap gap-2.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm" id="lab-selector">
        {[
          { id: "projection", name: "معمل الإسقاط المتعامد", icon: Compass },
          { id: "engine", name: "محاكي الأشواط الأربعة", icon: RefreshCw },
          { id: "elasticity", name: "معمل الإجهاد وقانون هوك", icon: Activity },
          { id: "capacitor", name: "معمل شحن المكثفات والفيض", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeLab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md scale-105"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          LAB 1: Orthographic Projection Simulator
          ========================================================================= */}
      {activeLab === "projection" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="projection-lab">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-2">محاكاة الإسقاط المتعامد</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                راقب إسقاط حواف مكعب معقد ذو تجويف على مستويات الإسقاط الثلاثة. تعلم كيف يتغير موضع المساقط بحسب نظام الزاوية الأولى أو الثالثة.
              </p>
            </div>

            {/* Projection system selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">نظام الإسقاط المتبع:</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setProjectionAngle("first")}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    projectionAngle === "first" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  الزاوية الأولى (السوداني)
                </button>
                <button
                  onClick={() => setProjectionAngle("third")}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    projectionAngle === "third" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  الزاوية الثالثة
                </button>
              </div>
            </div>

            {/* View Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">اختيار زاوية النظر والمساقط:</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: "isometric", name: "المنظور ثلاثي الأبعاد (الأيزومتري)" },
                  { id: "front", name: "منظر رأسي / أمامي (Front View)" },
                  { id: "top", name: "منظر أفقي (Top View)" },
                  { id: "side", name: "منظر جانبي (Side View)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedView(item.id as any)}
                    className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      selectedView === item.id
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-500/20"
                        : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Rule card */}
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-xs text-slate-600 space-y-2">
              <span className="font-bold text-emerald-600">💡 قاعدة المنهج السوداني للزاوية الأولى:</span>
              <p className="leading-relaxed">
                في الإسقاط بزاوية أولى، نضع دائماً المسقط الأفقي (العلوي) في لوحة الرسم <strong>بالأسفل</strong> (تحت المسقط الأمامي الرأسي).
              </p>
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            <h4 className="absolute top-4 right-4 text-xs font-bold text-slate-400">شاشة العرض الهندسية التفاعلية</h4>

            {/* Simulated 3D block projection */}
            <div className="w-full max-w-lg flex flex-col items-center">
              {selectedView === "isometric" && (
                <div className="w-full flex justify-center py-6">
                  {/* Elegant Isometric projection layout */}
                  <svg viewBox="0 0 320 220" className="w-80 h-auto text-slate-300">
                    {/* Draw projection grid background */}
                    <path d="M 160 0 L 160 220 M 0 110 L 320 110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Base plane */}
                    <polygon points="160,110 240,150 160,190 80,150" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    
                    {/* Standard L-Shaped Block in Isometric view (30 degrees) */}
                    {/* Front-left face */}
                    <polygon points="160,110 160,150 120,130 120,90" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    {/* Front-right face */}
                    <polygon points="160,110 160,150 200,130 200,90" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
                    {/* Top block top face */}
                    <polygon points="160,110 120,90 160,70 200,90" fill="#475569" stroke="#f59e0b" strokeWidth="2" />
                    {/* Pushed in step cavity block layout */}
                    <polygon points="140,100 140,120 180,100 180,80" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" />

                    {/* Left coordinate 30 degree line */}
                    <line x1="160" y1="150" x2="60" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
                    {/* Right coordinate 30 degree line */}
                    <line x1="160" y1="150" x2="260" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />

                    {/* Angle labels */}
                    <text x="80" y="125" fill="#f59e0b" className="text-[10px] font-mono">°٣٠</text>
                    <text x="235" y="125" fill="#f59e0b" className="text-[10px] font-mono">°٣٠</text>
                  </svg>
                </div>
              )}

              {/* Front, Top, and Side 2D layout based on selection */}
              {selectedView === "front" && (
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 160 160" className="w-48 h-auto">
                    <rect x="20" y="20" width="120" height="120" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <rect x="20" y="80" width="120" height="60" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="20" y1="80" x2="140" y2="80" stroke="#f59e0b" strokeWidth="2" />
                  </svg>
                  <span className="text-sm font-bold text-white mt-4">المسقط الرأسي (Front View)</span>
                  <p className="text-xs text-slate-400 mt-1">يظهر كشكل L أو كتلتين مستطيلتين بسبب النظر من الأمام تماماً</p>
                </div>
              )}

              {selectedView === "top" && (
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 160 160" className="w-48 h-auto">
                    <rect x="20" y="20" width="120" height="120" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                    <rect x="20" y="20" width="60" height="120" fill="rgba(96,165,250,0.08)" stroke="#60a5fa" strokeWidth="1.5" />
                    <line x1="80" y1="20" x2="80" y2="140" stroke="#60a5fa" strokeWidth="2" />
                  </svg>
                  <span className="text-sm font-bold text-white mt-4">المسقط الأفقي (Top View)</span>
                  <p className="text-xs text-slate-400 mt-1">يظهر كتلتين متجاورتين ممتدتين من الأعلى</p>
                </div>
              )}

              {selectedView === "side" && (
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 160 160" className="w-48 h-auto">
                    <rect x="20" y="20" width="120" height="120" fill="none" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="20" y1="60" x2="140" y2="60" stroke="#34d399" strokeWidth="2" />
                    <rect x="20" y="60" width="120" height="80" fill="rgba(52,211,153,0.08)" stroke="#34d399" strokeWidth="1.5" />
                  </svg>
                  <span className="text-sm font-bold text-white mt-4">المسقط الجانبي (Side View)</span>
                  <p className="text-xs text-slate-400 mt-1">يظهر كتلتين مختلفتي الارتفاع عند النظر من الجانب الأيسر</p>
                </div>
              )}

              {/* Dynamic 2D Board Arrangement layout comparing Angle 1 vs Angle 3 */}
              <div className="mt-8 border-t border-slate-800/80 pt-6 w-full max-w-md">
                <span className="text-xs text-slate-400 block text-center mb-3">ترتيب المساقط على ورقة الرسم الفنية:</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-400">
                  {projectionAngle === "first" ? (
                    <>
                      {/* Row 1 */}
                      <div className="border border-slate-800 p-2.5 rounded-lg bg-slate-900/50">الجانبي الأيمن</div>
                      <div className="border-2 border-amber-500/50 p-2.5 rounded-lg bg-slate-900 text-white">الرأسي (الأمامي)</div>
                      <div className="border border-slate-800 p-2.5 rounded-lg bg-slate-900/50">الجانبي الأيسر</div>
                      {/* Row 2 */}
                      <div></div>
                      <div className="border-2 border-sky-500/50 p-2.5 rounded-lg bg-slate-900 text-white">الأفقي (العلوي)</div>
                      <div></div>
                    </>
                  ) : (
                    <>
                      {/* Row 1 */}
                      <div></div>
                      <div className="border-2 border-sky-500/50 p-2.5 rounded-lg bg-slate-900 text-white">الأفقي (العلوي)</div>
                      <div></div>
                      {/* Row 2 */}
                      <div className="border border-slate-800 p-2.5 rounded-lg bg-slate-900/50">الجانبي الأيسر</div>
                      <div className="border-2 border-amber-500/50 p-2.5 rounded-lg bg-slate-900 text-white">الرأسي (الأمامي)</div>
                      <div className="border border-slate-800 p-2.5 rounded-lg bg-slate-900/50">الجانبي الأيمن</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAB 2: 4-Stroke Engine Simulator
          ========================================================================= */}
      {activeLab === "engine" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="engine-lab">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-2">محاكي المحرك رباعي الأشواط</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                شاهد كيف يتحول الضغط والحرارة الناتجة عن احتراق خليط الوقود والهواء بداخل غرفة الأسطوانة إلى حركة ترددية للمكبس، ومن ثم حركة دورانية عبر ذراع التوصيل لعمود المرفق.
              </p>
            </div>

            {/* Play Pause Auto-animation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEnginePlaying(!enginePlaying)}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                  enginePlaying ? "bg-emerald-700 text-white" : "bg-emerald-600 text-white shadow-sm"
                }`}
              >
                {enginePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{enginePlaying ? "إيقاف الحركة" : "تشغيل مستمر"}</span>
              </button>
              
              <button
                onClick={() => {
                  setEnginePlaying(false);
                  setEngineStroke((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
                }}
                className="px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
              >
                خطوة تالية
              </button>
            </div>

            {/* Step selections */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">أشواط المكبس (اختر شوطاً يدوياً):</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 0, name: "١. شوط السحب (Suction)", desc: "صمام السحب مفتوح، الطرد مغلق. المكبس يتحرك لأسفل" },
                  { id: 1, name: "٢. شوط الضغط (Compression)", desc: "الصمامات مغلقة. المكبس يصعد ويضغط الخليط" },
                  { id: 2, name: "٣. شوط القدرة / الاشتعال (Power)", desc: "شرارة شمعة الإشعال تحرق المزيج بقوة لأسفل" },
                  { id: 3, name: "٤. شوط الطرد (Exhaust)", desc: "صمام الطرد مفتوح. المكبس يصعد ويطرد العادم" },
                ].map((stroke) => (
                  <button
                    key={stroke.id}
                    onClick={() => {
                      setEnginePlaying(false);
                      setEngineStroke(stroke.id as any);
                    }}
                    className={`w-full text-right p-3 rounded-xl transition border flex flex-col text-xs ${
                      engineStroke === stroke.id
                        ? "bg-emerald-50 border-emerald-500 text-slate-800 shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={`font-bold ${engineStroke === stroke.id ? "text-emerald-700" : "text-slate-700"}`}>{stroke.name}</span>
                    <span className="text-[10px] text-slate-500 mt-1">{stroke.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Graphical Display of Piston */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Dynamic visual indicator representing flame or fuel */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-xs text-slate-400">حالة الشوط الحالية:</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                {engineStroke === 0 ? "السحب" : engineStroke === 1 ? "الضغط" : engineStroke === 2 ? "القدرة (الشرارة)" : "الطرد"}
              </span>
            </div>

            {/* Animated SVG Piston, Crankshaft, Spark Plug and Valves */}
            <svg viewBox="0 0 240 320" className="w-64 h-auto text-slate-300">
              {/* Cylinder wall boundaries */}
              <line x1="60" y1="40" x2="60" y2="240" stroke="currentColor" strokeWidth="4" />
              <line x1="180" y1="40" x2="180" y2="240" stroke="currentColor" strokeWidth="4" />
              <line x1="60" y1="40" x2="180" y2="40" stroke="currentColor" strokeWidth="4" />

              {/* Spark Plug in center top */}
              <rect x="110" y="15" width="20" height="25" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="120" y1="40" x2="120" y2="44" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Power Stroke - Flame explosion spark effect */}
              {engineStroke === 2 && (
                <g>
                  <circle cx="120" cy="48" r="18" fill="rgba(239, 68, 68, 0.4)" className="animate-ping" />
                  <path d="M 120 40 L 105 55 L 115 52 L 110 65 L 135 48 L 125 48 Z" fill="#ef4444" stroke="#f59e0b" strokeWidth="1" />
                </g>
              )}

              {/* Intake Valve (Left) and Exhaust Valve (Right) */}
              {/* Valve state dynamically rendering based on stroke */}
              {/* Stroke 0: Suction - Intake open (moved down) */}
              <g id="intake-valve" transform={engineStroke === 0 ? "translate(0, 12)" : "translate(0, 0)"}>
                <line x1="85" y1="20" x2="85" y2="40" stroke={engineStroke === 0 ? "#10b981" : "currentColor"} strokeWidth="3" />
                <polygon points="75,40 95,40 85,35" fill={engineStroke === 0 ? "#10b981" : "currentColor"} />
              </g>

              {/* Stroke 3: Exhaust - Exhaust open (moved down) */}
              <g id="exhaust-valve" transform={engineStroke === 3 ? "translate(0, 12)" : "translate(0, 0)"}>
                <line x1="155" y1="20" x2="155" y2="40" stroke={engineStroke === 3 ? "#ef4444" : "currentColor"} strokeWidth="3" />
                <polygon points="145,40 165,40 155,35" fill={engineStroke === 3 ? "#ef4444" : "currentColor"} />
              </g>

              {/* Gas / Fuel color inside cylinder */}
              {/* Suction/Compression shows fuel/air mixture (greenish-sky), Power shows orange fire, Exhaust shows gray smoke */}
              <rect
                x="62"
                y="42"
                width="116"
                height={pistonPosition}
                fill={
                  engineStroke === 0 || engineStroke === 1
                    ? "rgba(14, 165, 233, 0.15)"
                    : engineStroke === 2
                    ? "rgba(245, 158, 11, 0.25)"
                    : "rgba(148, 163, 184, 0.2)"
                }
              />

              {/* The Piston moving up/down */}
              <g transform={`translate(0, ${pistonPosition})`}>
                {/* Piston body */}
                <rect x="62" y="40" width="116" height="50" rx="3" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
                {/* Piston pin */}
                <circle cx="120" cy="65" r="8" fill="#475569" stroke="currentColor" strokeWidth="1.5" />
                {/* Piston rings notches */}
                <line x1="62" y1="48" x2="68" y2="48" stroke="currentColor" strokeWidth="2" />
                <line x1="62" y1="56" x2="68" y2="56" stroke="currentColor" strokeWidth="2" />
                <line x1="174" y1="48" x2="180" y2="48" stroke="currentColor" strokeWidth="2" />
                <line x1="174" y1="56" x2="180" y2="56" stroke="currentColor" strokeWidth="2" />
                
                {/* Connecting rod (top pin attachment) */}
                <line x1="120" y1="65" x2="120" y2="120" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* Rotating Crankshaft representation linked with piston height */}
              {/* Dynamically draw linking line from bottom of rod to rotation wheel */}
              {(() => {
                const rodY = pistonPosition + 120;
                // Calculate rotational angle based on stroke
                const angleRad = (engineStroke * Math.PI) / 2;
                const crankRadius = 35;
                const crankX = 120 + crankRadius * Math.cos(angleRad);
                const crankY = 240 + crankRadius * Math.sin(angleRad);
                return (
                  <g>
                    {/* Connecting rod from piston base pin to crank pin */}
                    <line x1="120" y1={rodY} x2={crankX} y2={crankY} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                    
                    {/* Rotational Crank wheel */}
                    <circle cx="120" cy="240" r="35" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3" />
                    <circle cx={crankX} cy={crankY} r="5" fill="#f59e0b" />
                    <line x1="120" y1="240" x2={crankX} y2={crankY} stroke="currentColor" strokeWidth="2" />
                    <circle cx="120" cy="240" r="8" fill="#475569" stroke="currentColor" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>
            <p className="text-[11px] text-slate-400 mt-4 text-center max-w-sm">
              أثناء حركة المكبس لأسفل في شوط القدرة، يدور عمود المرفق بمقدار ١٨٠ درجة لنقل الحركة الدائرية لبقية عجلات السيارة.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAB 3: Stress-Strain Elasticity Tester
          ========================================================================= */}
      {activeLab === "elasticity" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="elasticity-lab">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm text-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">معمل إجهاد المواد وقانون هوك</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                اضبط الحمل المؤثر وشاهد التمدد والاستجابة الميكانيكية للمعدن. حدد متى يحدث التشوه الدائم ومتى ينهار العمود بالكامل!
              </p>
            </div>

            {/* Select Material */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">اختر مادة العمود المعدني:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(materialProperties) as Array<keyof typeof materialProperties>).map((key) => {
                  const props = materialProperties[key];
                  const isSelected = selectedMaterial === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedMaterial(key)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        isSelected ? "bg-emerald-600 text-white shadow-sm border-transparent" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {props.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider for Force */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">القوة المؤثرة (ق):</span>
                <span className="font-mono text-emerald-600 font-bold">{appliedForce.toLocaleString()} نيوتن</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={appliedForce}
                onChange={(e) => setAppliedForce(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>١,٠٠٠ N</span>
                <span>٢٥,٠٠٠ N</span>
                <span>٥٠,٠٠٠ N</span>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200 text-xs font-mono text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">مساحة المقطع العرضي (م):</span>
                <span className="text-slate-800 font-bold">{barArea} ملم²</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold text-emerald-600">الإجهاد (هـ = ق / م):</span>
                <span className="text-emerald-600 font-bold">{calculatedStress.toFixed(1)} نيوتن/ملم²</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">معامل المرونة (ي):</span>
                <span className="text-slate-800 font-bold">{currentProps.E} جيجا باسكال</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">الانفعال الناتج (ع):</span>
                <span className="text-slate-800 font-bold">{calculatedStrain.toFixed(6)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-emerald-600">التمدد الإجمالي (Δل):</span>
                <span className="text-emerald-600">{extension.toFixed(4)} ملم</span>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
            {/* Structural Zone alert */}
            <div className={`p-3 border rounded-xl text-center text-xs font-bold ${zone.color}`} id="elasticity-zone-badge">
              حالة المعدن الحالية: {zone.label}
            </div>

            {/* Live visual bar extension representation */}
            <div className="flex justify-center items-center py-6" id="bar-stress-visual">
              <div className="flex flex-col items-center bg-slate-900 border border-slate-800/80 rounded-xl p-6 w-full max-w-sm">
                <span className="text-xs text-slate-400 mb-2 font-mono">الاستجابة لشد القوة الميكانيكية</span>
                <div className="relative flex items-center justify-center w-full h-16 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                  {/* Left fixed block */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-800 border-r border-slate-700 flex items-center justify-center">
                    <span className="text-[10px] text-slate-500 font-bold rotate-90">تثبيت</span>
                  </div>
                  
                  {/* Pull arrows */}
                  {calculatedStress > currentProps.yieldPoint && (
                    <div className="absolute right-12 w-6 h-6 border-t-2 border-r-2 border-rose-500 rotate-45 animate-ping" />
                  )}

                  {/* Stretching bar */}
                  {/* Visual stretch length proportional to extension */}
                  <div
                    style={{ width: `${120 + Math.min(extension * 8000, 80)}px` }}
                    className={`h-6 rounded-r bg-slate-500 border border-slate-300 shadow-lg transition-all duration-300 flex items-center justify-end px-2`}
                  >
                    <span className="text-[9px] font-mono text-slate-950 font-black">+{extension.toFixed(3)}ملم</span>
                  </div>
                </div>
                {/* Arrow indicator */}
                <div className="flex justify-between w-full mt-2.5 px-6 text-[10px] text-slate-500 font-mono">
                  <span>الطول الأصلي ل = ٢٠٠ ملم</span>
                  <span>قوة الشد (ق) ➜</span>
                </div>
              </div>
            </div>

            {/* Curve plot stress vs strain */}
            <div className="border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-400 block mb-2 font-mono">المنحني التوضيحي للجهد والانفعال (Stress-Strain Curve):</span>
              <div className="relative h-24 bg-slate-950 rounded-xl p-2 border border-slate-800/60 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 320 80">
                  {/* Axis */}
                  <line x1="10" y1="70" x2="310" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1="10" y1="10" x2="10" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  
                  {/* Custom Stress-Strain curve path */}
                  <path d="M 10 70 Q 100 40 150 42 T 260 20 T 310 70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  
                  {/* Highlight current stress dot on the path */}
                  {(() => {
                    const ratio = Math.min(calculatedStress / currentProps.ultimate, 1.1);
                    const posX = 10 + ratio * 240;
                    const posY = 70 - Math.min(ratio * 50, 60);
                    return (
                      <g>
                        <circle cx={posX} cy={posY} r="5" fill="#f59e0b" className="animate-pulse" />
                        <line x1={posX} y1="70" x2={posX} y2={posY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" />
                      </g>
                    );
                  })()}
                </svg>
                {/* Labels on chart */}
                <div className="absolute left-2 top-2 text-[8px] font-mono text-slate-500">الإجهاد (هـ)</div>
                <div className="absolute right-2 bottom-2 text-[8px] font-mono text-slate-500">الانفعال (ع)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAB 4: Capacitor Charger Lab
          ========================================================================= */}
      {activeLab === "capacitor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="capacitor-lab">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm text-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">معمل شحن المكثفات والطاقة</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                اضبط مساحة اللوحات $A$ والمسافة $d$ ونوع المادة العازلة لمشاهدة تغير سعة المكثف $C = \epsilon A/d$ وتخزين شحنة الطاقة.
              </p>
            </div>

            {/* Select Dielectric */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">مادة الوسط العازل (ε):</label>
              <select
                value={dielectric}
                onChange={(e) => setDielectric(e.target.value as any)}
                className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
              >
                <option value="air">الهواء (فراغ) (ε_r = ١.٠)</option>
                <option value="paper">الورق المشبع بالشمع (ε_r = ٤.٥)</option>
                <option value="ceramic">السيراميك المستقر (ε_r = ٦.٠)</option>
                <option value="mica">المايكا الدقيقة (ε_r = ٧.٠)</option>
              </select>
            </div>

            {/* Area Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-bold">مساحة اللوح (أ):</span>
                <span className="text-emerald-600 font-bold">١٥ سم²</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                disabled
                value="15"
                className="w-full accent-emerald-600 opacity-60"
              />
              <span className="text-[9px] text-slate-400 block">مثبتة للقياس في التمرين</span>
            </div>

            {/* Distance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-bold">المسافة بين اللوحين (ف):</span>
                <span className="text-emerald-600 font-bold">{plateDistance.toFixed(1)} ملم</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={plateDistance}
                onChange={(e) => setPlateDistance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>١ ملم</span>
                <span>٣ ملم</span>
                <span>٥ ملم</span>
              </div>
            </div>

            {/* Battery Voltage slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-bold">جهد شحن البطارية (جـ):</span>
                <span className="text-emerald-600 font-bold">{voltage} فولت</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="2"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* Output Display Card */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
            {/* Visual plates with charge and electric field lines density */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 mb-3 font-mono">النموذج الفيزيائي للمكثف ثنائي اللوحين</span>
              
              <div className="relative w-full max-w-xs h-[160px] flex flex-col justify-between items-center py-4 border border-slate-800 rounded-lg bg-slate-950">
                {/* Top plate (+) */}
                <div className="w-48 h-3.5 bg-red-500 border border-red-400 rounded flex items-center justify-around px-2 text-[9px] font-bold text-white">
                  {voltage > 0 ? (
                    <>
                      <span>+</span>
                      <span>+</span>
                      <span>+</span>
                      <span>+</span>
                      <span>+</span>
                    </>
                  ) : (
                    <span className="text-slate-400 text-[10px]">اللوح العلوي (موجب)</span>
                  )}
                </div>

                {/* Electric field lines */}
                {voltage > 0 && (
                  <div className="absolute inset-x-0 top-12 bottom-12 flex justify-around px-8">
                    {Array.from({ length: Math.min(Math.floor(capacitance / 4) + 1, 8) }).map((_, i) => (
                      <div key={i} className="w-0.5 h-full bg-amber-500/40 animate-pulse border-r border-dashed border-amber-400/40" />
                    ))}
                  </div>
                )}

                {/* Bottom plate (-) */}
                <div className="w-48 h-3.5 bg-blue-500 border border-blue-400 rounded flex items-center justify-around px-2 text-[9px] font-bold text-white">
                  {voltage > 0 ? (
                    <>
                      <span>-</span>
                      <span>-</span>
                      <span>-</span>
                      <span>-</span>
                      <span>-</span>
                    </>
                  ) : (
                    <span className="text-slate-400 text-[10px]">اللوح السفلي (سالب)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Calculations and formulas output */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-5">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block">السعة الكلية للمكثف (س)</span>
                <div className="text-lg font-mono font-bold text-amber-400 mt-1">{capacitance.toFixed(2)} pF</div>
                <span className="text-[9px] text-slate-500 font-mono">بيكو فاراد</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block">الشحنة المخزنة (ش = س × جـ)</span>
                <div className="text-lg font-mono font-bold text-sky-400 mt-1">{storedCharge.toFixed(2)} pC</div>
                <span className="text-[9px] text-slate-500 font-mono">بيكو كولوم</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block">الطاقة المخزنة (ط = ١/٢ × س × جـ²)</span>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">{storedEnergy.toFixed(2)} pJ</div>
                <span className="text-[9px] text-slate-500 font-mono">بيكو جول</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
