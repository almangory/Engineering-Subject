import React, { useState, useEffect, useRef } from "react";
import { Activity, Compass, Zap, HelpCircle, RefreshCw, Play, Pause, ChevronLeft, Award, Flame, Droplet, Layers, HelpCircle as Info, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

interface LabSectionProps {
  activeLab?: string; // Can be a lab ID or lesson ID
  setActiveLab?: (lab: any) => void;
  lang?: "ar" | "en";
}

// Lesson data inside Lab for standalone navigation
const CHAPTER_LESSONS = {
  projection: [
    { id: "intro-projection", name: "١. مفهوم ونظرية الإسقاط", desc: "محاكاة أشعة النظر العمودية الساقطة لتكوين ظل الجسم المستوي" },
    { id: "ortho-principles", name: "٢. حالات الإسقاط المتعامد", desc: "دوران مستقيم أو سطح لمعاينة طول المسقط الفعلي والكامل" },
    { id: "three-planes", name: "٣. المساقط الثلاثة والزوايا", desc: "ترتيب المساقط في ورقة الرسم (الزاوية الأولى السودانية vs الثالثة)" },
    { id: "isometric-oblique", name: "٤. المنظور: أيزومتري ومائل", desc: "مقارنة المنظور الأيزومتري (30°) بالمنظور المائل (45° مع نصف العمق)" },
    { id: "dim-1-1", name: "٥. وضع الأبعاد الفني", desc: "تطبيق قواعد الأبعاد (التنبيه إذا كان خط البعد أقرب من 8-10 مم)" },
    { id: "sketch-1-2", name: "٦. التكريك باليد الحرة", desc: "تطبيق يدوي لقياس دقة رسم الخطوط والدوائر كروكياً" },
  ],
  engine: [
    { id: "metals-intro", name: "١. خواص واختبارات الفلزات", desc: "فحص المغناطيسية، والشرر، والكثافة للحديد والصلب والألومنيوم" },
    { id: "iron-production", name: "٢. صهر الفرن اللافح والكيوبولا", desc: "شحن الفرن لفصل زهر التماسيح والخبث عند 1300° مئوية" },
    { id: "steel-rolling", name: "٣. دحرجة ودرفلة الصلب", desc: "تمرير الصلب بين درافيل (على الساخن والبارد) لتغيير السمك" },
    { id: "non-ferrous-alloys", name: "٤. سباكة النحاس والبرنز", desc: "خلط النحاس بالخارصين (أصفر)، القصدير (برنز)، البيضاء (البلي)" },
    { id: "engines-cycles", name: "٥. محاكي الأشواط الأربعة", desc: "دورة أوتو الكاملة للمكبس والصمامات وشمعة الاشتعال" },
    { id: "car-engine-systems", name: "٦. أنظمة محرك السيارة", desc: "التحكم في المغذي، الرديتر، زيت التزييت، والاسبراتير" },
  ],
  capacitor: [
    { id: "electrical-units", name: "١. شحنات كولوم والفيض", desc: "حساب القوة الميكانيكية الجاذبة والطارحة بين شحنتين" },
    { id: "capacitors", name: "٢. شحن المكثفات والطاقة", desc: "تغير السعة والشحنة بتغير مساحة اللوح، المسافة والوسط العازل" },
    { id: "electromagnetism-induction", name: "٣. حث فارادي الكهرومغناطيسي", desc: "تحريك المغناطيس داخل الملف لتوليد تيار في الجلفانومتر" },
    { id: "self-inductance", name: "٤. ظاهرة الحث الذاتي ولينز", desc: "تأخر توهج المصباح وتوليد شرارة الفتح الكهربائي للملف" },
    { id: "semiconductors-doping", name: "٥. تشويب أشباه الموصلات", desc: "صناعة بلورة n-type (زرنيخ خماسي) و p-type (بورون ثلاثي)" },
  ],
  elasticity: [
    { id: "structures-trusses", name: "١. الجملونات وقوى الأعضاء", desc: "تحميل الجملون المثلث ورصد أعضاء الشد (أزرق) والضغط (أحمر)" },
    { id: "arches-foundations", name: "٢. الأقواس وتصميم الأساسات", desc: "اختبار القواعد السطحية والعميقة (الخوازيق) تحت ثقل المبنى" },
    { id: "stress-strain-hooke", name: "٣. منحنى الإجهاد والانفعال", desc: "شد عمود معدني ورسم منحنى هوك لتحديد الكسر والتشوه" },
    { id: "fluid-mechanics-viscosity", name: "٤. موائع ولزوجة نيوتن", desc: "إسقاط كرات في الزيت والماء والعسل وحساب مقاومة القص" },
    { id: "environmental-pollution", name: "٥. تلوث البيئة وأمراض المياه", desc: "صناعة أمطار حمضية غازية مسؤولة عن هلاك النباتات والتربة" },
  ],
};

export default function LabSection({ activeLab: propActiveLab, setActiveLab: propSetActiveLab }: LabSectionProps) {
  const [localActiveLab, setLocalActiveLab] = useState<string>("projection");
  const activeTabId = propActiveLab !== undefined ? propActiveLab : localActiveLab;
  const setActiveTabId = propSetActiveLab !== undefined ? propSetActiveLab : setLocalActiveLab;

  // Track selected category (Chapter)
  const [activeCategory, setActiveCategory] = useState<"projection" | "engine" | "capacitor" | "elasticity">("projection");

  // Map input propActiveLab to current category and lesson if it matches a lesson ID
  useEffect(() => {
    if (propActiveLab) {
      for (const [cat, lessons] of Object.entries(CHAPTER_LESSONS)) {
        if (lessons.some((l) => l.id === propActiveLab)) {
          setActiveCategory(cat as any);
          setSelectedLessonId(propActiveLab);
          break;
        }
      }
      if (["projection", "engine", "capacitor", "elasticity"].includes(propActiveLab)) {
        setActiveCategory(propActiveLab as any);
        setSelectedLessonId(CHAPTER_LESSONS[propActiveLab as keyof typeof CHAPTER_LESSONS][0].id);
      }
    }
  }, [propActiveLab]);

  const lessonsInCat = CHAPTER_LESSONS[activeCategory];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(lessonsInCat[0].id);

  // Sync selectedLessonId if category changes manually
  const handleCategoryChange = (cat: "projection" | "engine" | "capacitor" | "elasticity") => {
    setActiveCategory(cat);
    setActiveTabId(cat);
    setSelectedLessonId(CHAPTER_LESSONS[cat][0].id);
  };

  // ==========================================================
  // STATE DEFINITIONS FOR THE 22 SIMULATIONS (Highly Optimized)
  // ==========================================================
  
  // 1. Concept of Projection
  const [projBeamActive, setProjBeamActive] = useState(true);

  // 2. Orthographic Principles
  const [orthoAngle, setOrthoAngle] = useState(0); // 0 to 90 degrees

  // 3. Three Planes Layout
  const [projectionAngle, setProjectionAngle] = useState<"first" | "third">("first");

  // 4. Isometric vs Oblique
  const [isometricStyle, setIsometricStyle] = useState<"iso" | "oblique">("iso");

  // 5. Dimensioning Check
  const [dimDistance, setDimDistance] = useState(5); // in mm (typically 2 to 15)

  // 6. Freehand Taktik Canvas
  const [freehandPoints, setFreehandPoints] = useState<{ x: number; y: number }[]>([]);
  const [freehandDrawing, setFreehandDrawing] = useState(false);
  const [sketchScore, setSketchScore] = useState<number | null>(null);

  // 7. Metals properties tests
  const [metalTestType, setMetalTestType] = useState<"magnet" | "spark" | "density">("magnet");
  const [metalSelected, setMetalSelected] = useState<"steel" | "cast-iron" | "copper" | "aluminum">("steel");

  // 8. Blast Furnace state
  const [furnaceCoke, setFurnaceCoke] = useState(50);
  const [furnaceLimestone, setFurnaceLimestone] = useState(30);
  const [furnaceTemp, setFurnaceTemp] = useState(500); // degrees C
  const [furnaceRunning, setFurnaceRunning] = useState(false);
  const [furnaceTapped, setFurnaceTapped] = useState(false);

  // 9. Steel Rolling
  const [rollingTemp, setRollingTemp] = useState<"hot" | "cold">("hot");
  const [rollerGap, setRollerGap] = useState(10); // mm, 1 to 20

  // 10. Non-ferrous alloys
  const [alloyMixCopper, setAlloyMixCopper] = useState(70);
  const [alloyMixOther, setAlloyMixOther] = useState(30); // Zinc or Tin or Lead

  // 11. Four-Stroke Engine (Integrated State)
  const [enginePlaying, setEnginePlaying] = useState(false);
  const [engineStroke, setEngineStroke] = useState<0 | 1 | 2 | 3>(0); // 0: Suck, 1: Compress, 2: Power, 3: Exhaust
  const engineTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enginePlaying) {
      engineTimer.current = setInterval(() => {
        setEngineStroke((prev) => ((prev + 1) % 4) as any);
      }, 1500);
    } else {
      if (engineTimer.current) clearInterval(engineTimer.current);
    }
    return () => {
      if (engineTimer.current) clearInterval(engineTimer.current);
    };
  }, [enginePlaying]);

  // 12. Car Systems
  const [activeCarSystem, setActiveCarSystem] = useState<"fuel" | "cooling" | "lube" | "ignition">("fuel");
  const [carburetorRatio, setCarburetorRatio] = useState(10); // fuel-air ratio

  // 13. Coulomb's Law
  const [coulombQ1, setCoulombQ1] = useState(5); // uC
  const [coulombQ2, setCoulombQ2] = useState(-5); // uC
  const [coulombDist, setCoulombDist] = useState(3); // cm
  const [coulombMedium, setCoulombMedium] = useState<"vacuum" | "mica" | "water">("vacuum");

  // 14. Capacitor Charger Lab
  const [plateArea, setPlateArea] = useState(15);
  const [plateDist, setPlateDist] = useState(2); // mm
  const [dielectric, setDielectric] = useState<"air" | "paper" | "ceramic">("air");
  const [voltage, setVoltage] = useState(6); // Volts

  // 15. Faraday Induction
  const [inductionMagnetX, setInductionMagnetX] = useState(50); // 0 to 100
  const [galvanometerReading, setGalvanometerReading] = useState(0); // -100 to 100
  const lastMagnetX = useRef(50);

  useEffect(() => {
    // Determine velocity of magnet drag to move galvanometer needle
    const deltaX = inductionMagnetX - lastMagnetX.current;
    if (Math.abs(deltaX) > 0.5) {
      setGalvanometerReading(Math.min(Math.max(deltaX * 12, -90), 90));
    } else {
      setGalvanometerReading(0);
    }
    lastMagnetX.current = inductionMagnetX;
  }, [inductionMagnetX]);

  // 16. Self-inductance
  const [selfIndSwitchOpen, setSelfIndSwitchOpen] = useState(true);
  const [selfIndLValue, setSelfIndLValue] = useState(5); // Henrys
  const [selfIndLampGlow, setSelfIndLampGlow] = useState(0); // 0 to 100
  const [sparkArcFlash, setSparkArcFlash] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!selfIndSwitchOpen) {
      // Delay rise based on self-inductance L
      let step = 0;
      const interval = setInterval(() => {
        step += 10 / selfIndLValue;
        if (step >= 100) {
          setSelfIndLampGlow(100);
          clearInterval(interval);
        } else {
          setSelfIndLampGlow(step);
        }
      }, 50);
      return () => clearInterval(interval);
    } else {
      // Open switch produces instant turn off but sparks the switch contact due to Lenz Back EMF
      setSelfIndLampGlow(0);
      if (selfIndLValue > 2) {
        setSparkArcFlash(true);
        timeout = setTimeout(() => setSparkArcFlash(false), 300);
      }
    }
    return () => clearTimeout(timeout);
  }, [selfIndSwitchOpen, selfIndLValue]);

  // 17. Semiconductors Doping
  const [semiconductorDopeType, setSemiconductorDopeType] = useState<"pure" | "n" | "p">("pure");

  // 18. Trusses analysis
  const [trussLoad, setTrussLoad] = useState(10); // kN

  // 19. Arches and Foundations
  const [foundationType, setFoundationType] = useState<"shallow" | "deep">("shallow");
  const [buildingWeight, setBuildingWeight] = useState(5); // Floors 1 to 15

  // 20. Stress-Strain Elasticity (Existing state modified)
  const [elasticForce, setElasticForce] = useState(15000);
  const [elasticMaterial, setElasticMaterial] = useState<"steel" | "copper" | "aluminum">("steel");

  // 21. Fluid Mechanics & Viscosity
  const [viscosityFluid, setViscosityFluid] = useState<"water" | "oil" | "honey">("oil");
  const [fluidBallY, setFluidBallY] = useState(10); // percent top
  const [fluidBallRolling, setFluidBallRolling] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (fluidBallRolling) {
      const speed = viscosityFluid === "water" ? 15 : viscosityFluid === "oil" ? 6 : 1.5;
      interval = setInterval(() => {
        setFluidBallY((y) => {
          if (y >= 85) {
            setFluidBallRolling(false);
            return 85;
          }
          return y + speed;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [fluidBallRolling, viscosityFluid]);

  // 22. Environmental Air pollution & water quiz
  const [pollutionSlider, setPollutionSlider] = useState(25); // ppm of SOx
  const [waterQuizSelected, setWaterQuizSelected] = useState<string | null>(null);
  const [waterQuizCorrect, setWaterQuizCorrect] = useState<boolean | null>(null);

  return (
    <div className="space-y-6 text-slate-800" id="complete-virtual-lab">
      {/* 1. Main Chapters Categories Switcher (Bento Layout style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" id="lab-chapters-switcher">
        {[
          { id: "projection", name: "الباب الأول: الرسم الهندسي", icon: Compass, color: "border-blue-500/30 text-blue-600 bg-blue-50/50" },
          { id: "engine", name: "الباب الثاني: الميكانيكا", icon: RefreshCw, color: "border-emerald-500/30 text-emerald-600 bg-emerald-50/50" },
          { id: "capacitor", name: "الباب الثالث: الكهرباء والبلورات", icon: Zap, color: "border-indigo-500/30 text-indigo-600 bg-indigo-50/50" },
          { id: "elasticity", name: "الباب الرابع: المدنية والبيئة", icon: Activity, color: "border-rose-500/30 text-rose-600 bg-rose-50/50" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id as any)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-102"
                  : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              <div className={`p-2.5 rounded-xl mb-2 ${isActive ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700"}`}>
                <Icon className={`h-5 w-5 ${isActive && tab.id === "engine" ? "animate-spin-slow" : ""}`} />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-tight">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-navigator Horizontal List of Lessons for Active Chapter */}
      <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200" id="lab-lessons-nav">
        <span className="text-[10px] text-slate-500 font-bold block mb-1.5 px-2">اختر الدرس لإجراء التجربة العملية الخاصة به:</span>
        <div className="flex flex-wrap gap-1.5">
          {lessonsInCat.map((lesson) => {
            const isSelected = selectedLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`text-right px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex-1 min-w-[140px] max-w-[240px] border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-transparent shadow-sm scale-102"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/60"
                }`}
              >
                <div className="truncate">{lesson.name}</div>
                <div className={`text-[9px] truncate mt-0.5 ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                  {lesson.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Experiment Ground (Interactive Two-Column Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="experiment-stage-panel">
        
        {/* Left Column: Interactive Controls & Formulas */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">بطاقة تحكّم التجربة</h3>
                <p className="text-[10px] text-slate-500">عدّل المتغيرات الفيزيائية ولاحظ النتائج فوراً</p>
              </div>
            </div>

            {/* Render Context-specific description and controls */}
            <div className="space-y-4 text-xs">
              {/* DESCRIPTION SECTION */}
              <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-800">موضوع التجربة:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {lessonsInCat.find((l) => l.id === selectedLessonId)?.desc}
                </p>
              </div>

              {/* RENDER DYNAMIC CONTROLS BASED ON ACTIVE LESSON */}
              <div className="space-y-4 pt-2">
                
                {/* 1. intro-projection CONTROLS */}
                {selectedLessonId === "intro-projection" && (
                  <div className="space-y-3">
                    <label className="font-bold text-slate-700 block">خطوط إسقاط النظر (الأشعة):</label>
                    <button
                      onClick={() => setProjBeamActive(!projBeamActive)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition border ${
                        projBeamActive ? "bg-emerald-600 text-white" : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      {projBeamActive ? "إخفاء أشعة الإسقاط" : "إظهار أشعة الإسقاط العمودية"}
                    </button>
                    <div className="text-[10px] text-slate-500 leading-relaxed">
                      * لاحظ أن الأشعة تسقط عمودياً تماماً من الجسم باتجاه الشاشة لتكوين مسقط ثنائي الأبعاد بدون أبعاد مائلة.
                    </div>
                  </div>
                )}

                {/* 2. ortho-principles CONTROLS */}
                {selectedLessonId === "ortho-principles" && (
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>زاوية ميل السطح (θ):</span>
                      <span className="font-mono text-emerald-600">{orthoAngle} درجة</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="15"
                      value={orthoAngle}
                      onChange={(e) => setOrthoAngle(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl space-y-1">
                      <span className="font-bold text-emerald-700">القانون الرياضي للمسقط:</span>
                      <p className="text-[11px] text-slate-600 font-mono">طول المسقط = الطول الحقيقي × جتا(θ)</p>
                      <p className="text-[10px] text-slate-500">
                        {orthoAngle === 0 ? "يوازي المستوى: الطول كامل ومطابق (جتا ٠ = ١)" :
                         orthoAngle === 90 ? "عمودي على المستوى: يظهر كخط مستقيم أو نقطة (جتا ٩٠ = ٠)" :
                         `مائل: يقل الطول بنسبة ${(Math.cos((orthoAngle * Math.PI) / 180)).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. three-planes CONTROLS */}
                {selectedLessonId === "three-planes" && (
                  <div className="space-y-3">
                    <label className="font-bold text-slate-700 block">نظام الإسقاط العالمي:</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setProjectionAngle("first")}
                        className={`py-2 rounded-lg text-xs font-bold transition ${
                          projectionAngle === "first" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        الزاوية الأولى (السوداني)
                      </button>
                      <button
                        onClick={() => setProjectionAngle("third")}
                        className={`py-2 rounded-lg text-xs font-bold transition ${
                          projectionAngle === "third" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        الزاوية الثالثة
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      * المنهج السوداني يعتمد نظام الزاوية الأولى، حيث يرسم المسقط الأفقي بالأسفل والجانبي الأيسر على يمين المسقط الرأسي.
                    </p>
                  </div>
                )}

                {/* 4. isometric-oblique CONTROLS */}
                {selectedLessonId === "isometric-oblique" && (
                  <div className="space-y-3">
                    <label className="font-bold text-slate-700 block">نوع المنظور الهندسي:</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setIsometricStyle("iso")}
                        className={`py-2 rounded-lg text-xs font-bold transition ${
                          isometricStyle === "iso" ? "bg-emerald-600 text-white" : "text-slate-500"
                        }`}
                      >
                        أيزومتري (30 درجة)
                      </button>
                      <button
                        onClick={() => setIsometricStyle("oblique")}
                        className={`py-2 rounded-lg text-xs font-bold transition ${
                          isometricStyle === "oblique" ? "bg-emerald-600 text-white" : "text-slate-500"
                        }`}
                      >
                        مائل كافاليير (45 درجة)
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {isometricStyle === "iso"
                        ? "الأيزومتري: تميل المحاور الجانبية بـ 30° عن الأفق، مع الحفاظ على المقاسات الحقيقية لجميع الاتجاهات."
                        : "المائل (Oblique): يرسم الوجه الأمامي زوايا قائمة، والعمق يميل بـ 45° ويضرب مقاس العمق في النصف لتجنب التشويه البصري."}
                    </p>
                  </div>
                )}

                {/* 5. dim-1-1 CONTROLS */}
                {selectedLessonId === "dim-1-1" && (
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>مسافة خط البعد عن الرسم:</span>
                      <span className="font-mono text-emerald-600 font-bold">{dimDistance} مم</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="1"
                      value={dimDistance}
                      onChange={(e) => setDimDistance(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className={`p-3 rounded-xl border text-[11px] font-bold ${
                      dimDistance >= 8 && dimDistance <= 10
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse"
                        : dimDistance < 8
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}>
                      {dimDistance >= 8 && dimDistance <= 10
                        ? "ممتاز! مطابقة للمواصفات الفنية المعتمدة (8-10 مم)."
                        : dimDistance < 8
                        ? "خطير جداً! خط البعد قريب جداً وقد يتداخل مع حواف الجسم المراد رسمه."
                        : "المسافة بعيدة وقد تنفصل الأبعاد عن دلالتها ومكانها الصحيح."}
                    </div>
                  </div>
                )}

                {/* 6. sketch-1-2 CONTROLS */}
                {selectedLessonId === "sketch-1-2" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setFreehandPoints([]);
                        setSketchScore(null);
                      }}
                      className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
                    >
                      مسح شاشة الرسم البدائي
                    </button>
                    {sketchScore !== null && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500 font-bold block">دقة التكريك باليد الحرة:</span>
                        <span className="text-lg font-black text-emerald-700">{sketchScore}%</span>
                        <p className="text-[10px] text-slate-600 mt-1">
                          {sketchScore > 80 ? "رائع! تحكم ممتاز باليد والنسب." : "جيد! واصل التمرين لضبط الدقة الهندسية."}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. metals-intro CONTROLS */}
                {selectedLessonId === "metals-intro" && (
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">اختر نوع الفلز:</label>
                      <select
                        value={metalSelected}
                        onChange={(e) => setMetalSelected(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="steel">الصلب الكربوني (حديد)</option>
                        <option value="cast-iron">حديد الزهر الرمادي (حديد)</option>
                        <option value="copper">النحاس الأحمر النقي (لا حديدي)</option>
                        <option value="aluminum">الألومنيوم الطري (لا حديدي)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">اختر الفحص المعملي الميكانيكي:</label>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        {[
                          { id: "magnet", name: "مغناطيس" },
                          { id: "spark", name: "فحص شرر" },
                          { id: "density", name: "كثافة ووزن" },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setMetalTestType(btn.id as any)}
                            className={`py-2 rounded-xl text-[10px] font-bold border transition ${
                              metalTestType === btn.id ? "bg-emerald-600 text-white border-transparent" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {btn.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. iron-production CONTROLS */}
                {selectedLessonId === "iron-production" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span>نسبة شحنة الكوك (موقد):</span>
                        <span className="font-bold font-mono">{furnaceCoke}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={furnaceCoke}
                        onChange={(e) => setFurnaceCoke(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span>نسبة الحجر الجيري (صهر):</span>
                        <span className="font-bold font-mono">{furnaceLimestone}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={furnaceLimestone}
                        onChange={(e) => setFurnaceLimestone(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span>درجة حرارة الفرن اللافح:</span>
                        <span className="font-bold font-mono text-rose-600">{furnaceTemp}° مئوية</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="1600"
                        step="100"
                        value={furnaceTemp}
                        onChange={(e) => setFurnaceTemp(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          setFurnaceRunning(true);
                          setFurnaceTapped(false);
                          setTimeout(() => setFurnaceRunning(false), 2000);
                        }}
                        disabled={furnaceTemp < 1300}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
                      >
                        دفع الهواء الحار 🔥
                      </button>
                      <button
                        onClick={() => setFurnaceTapped(true)}
                        disabled={furnaceTemp < 1300}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
                      >
                        بثق حديد التماسيح 🛢️
                      </button>
                    </div>
                    {furnaceTemp < 1300 && (
                      <div className="text-[10px] text-rose-500 font-bold">
                        * درجة انصهار خام الحديد وخروج زهر التماسيح تتطلب 1300°م كحد أدنى.
                      </div>
                    )}
                  </div>
                )}

                {/* 9. steel-rolling CONTROLS */}
                {selectedLessonId === "steel-rolling" && (
                  <div className="space-y-3">
                    <label className="font-bold text-slate-700 block">درجة حرارة الدرفلة:</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setRollingTemp("hot")}
                        className={`py-2 rounded-lg text-xs font-bold transition ${
                          rollingTemp === "hot" ? "bg-orange-600 text-white" : "text-slate-500"
                        }`}
                      >
                        درفلة على الساخن (1300°م)
                      </button>
                      <button
                        onClick={() => setRollingTemp("cold")}
                        className={`py-2 rounded-lg text-xs font-bold transition ${
                          rollingTemp === "cold" ? "bg-sky-600 text-white" : "text-slate-500"
                        }`}
                      >
                        درفلة على البارد (أقل من 700°م)
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span>مسافة الفراغ بين الدرافيل:</span>
                        <span className="font-bold font-mono text-emerald-600">{rollerGap} مم</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="18"
                        step="2"
                        value={rollerGap}
                        onChange={(e) => setRollerGap(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {rollingTemp === "hot"
                        ? "درفلة الساخن: تليين تام لإنتاج المقاطع الكبيرة وسكك الحديد بسهولة."
                        : "درفلة البارد: مقاومة تشكيل أعلى، ولكن تنتج ألواح صاج ذات متانة فائقة ونعومة سطحية ممتازة بدقة 0.001 بوصة."}
                    </p>
                  </div>
                )}

                {/* 10. non-ferrous-alloys CONTROLS */}
                {selectedLessonId === "non-ferrous-alloys" && (
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>نسبة النحاس النقي:</span>
                      <span className="font-mono text-emerald-600">{alloyMixCopper}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="90"
                      step="5"
                      value={alloyMixCopper}
                      onChange={(e) => {
                        setAlloyMixCopper(Number(e.target.value));
                        setAlloyMixOther(100 - Number(e.target.value));
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="bg-slate-50 p-3 rounded-xl space-y-2">
                      <span className="font-bold text-slate-700 block text-[11px]">الخلائط الناتجة المعتمدة:</span>
                      <ul className="space-y-1 text-[10px] text-slate-600 list-disc list-inside">
                        <li>نحاس + خارصين (30%) = <span className="text-amber-600 font-bold">النحاس الأصفر (للصنابير)</span></li>
                        <li>نحاس + قصدير (10%) = <span className="text-amber-800 font-bold">البرنز (للأجراس ومعدات السفن)</span></li>
                        <li>قصدير + نحاس + رصاص = <span className="text-slate-600 font-bold">السبيكة البيضاء (لكراسي التحميل)</span></li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 11. engines-cycles CONTROLS */}
                {selectedLessonId === "engines-cycles" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setEnginePlaying(!enginePlaying)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                        enginePlaying ? "bg-emerald-700 text-white" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {enginePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                      <span>{enginePlaying ? "إيقاف المحاكاة المستمرة" : "دوران مستمر للمحرك"}</span>
                    </button>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 0, n: "سحب" },
                        { id: 1, n: "ضغط" },
                        { id: 2, n: "قدرة" },
                        { id: 3, n: "طرد" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            setEnginePlaying(false);
                            setEngineStroke(st.id as any);
                          }}
                          className={`py-1.5 rounded-lg text-[10px] font-bold border ${
                            engineStroke === st.id ? "bg-amber-500 text-white border-transparent" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          {st.n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 12. car-engine-systems CONTROLS */}
                {selectedLessonId === "car-engine-systems" && (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      {[
                        { id: "fuel", name: "نظام الوقود والمغذي (الكاربريتر)" },
                        { id: "cooling", name: "نظام التبريد والرديتر والمشع" },
                        { id: "lube", name: "نظام التزييت ومضخة الكرتير" },
                        { id: "ignition", name: "نظام الاشتعال والشرارة الموزعة" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveCarSystem(item.id as any)}
                          className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition border ${
                            activeCarSystem === item.id
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    {activeCarSystem === "fuel" && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span>نسبة خلط البنزين إلى الهواء:</span>
                          <span className="font-bold text-emerald-600">1 : {carburetorRatio} بالوزن</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="22"
                          value={carburetorRatio}
                          onChange={(e) => setCarburetorRatio(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <span className="text-[9px] text-slate-500 block">
                          {carburetorRatio === 15 ? "✅ خلط مثالي جداً (1 : 15)" : "⚠️ الاحتراق غير اقتصادي ومختل"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 13. electrical-units CONTROLS */}
                {selectedLessonId === "electrical-units" && (
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-[11px]">
                      <span>شحنة الجسم الأول (ش١):</span>
                      <span className="font-mono text-emerald-600">{coulombQ1} ميكروكولوم</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="2"
                      value={coulombQ1}
                      onChange={(e) => setCoulombQ1(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-emerald-600"
                    />
                    <div className="flex justify-between font-bold text-[11px]">
                      <span>شحنة الجسم الثاني (ش٢):</span>
                      <span className="font-mono text-emerald-600">{coulombQ2} ميكروكولوم</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="2"
                      value={coulombQ2}
                      onChange={(e) => setCoulombQ2(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-emerald-600"
                    />
                    <div className="flex justify-between font-bold text-[11px]">
                      <span>المسافة الفاصلة (ف):</span>
                      <span className="font-mono text-emerald-600">{coulombDist} سم</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={coulombDist}
                      onChange={(e) => setCoulombDist(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-emerald-600"
                    />
                  </div>
                )}

                {/* 14. capacitors CONTROLS */}
                {selectedLessonId === "capacitors" && (
                  <div className="space-y-3 text-slate-800">
                    <div>
                      <label className="font-bold text-[11px] text-slate-700 block">نوع الوسط العازل:</label>
                      <select
                        value={dielectric}
                        onChange={(e) => setDielectric(e.target.value as any)}
                        className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="air">الهواء الجاف (ε_r = ١.٠)</option>
                        <option value="paper">الورق المشبع بالشمع (ε_r = ٤.٥)</option>
                        <option value="ceramic">السيراميك المكثف (ε_r = ٦.٠)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>المسافة بين اللوحين:</span>
                        <span className="font-bold text-emerald-600 font-mono">{plateDist} مم</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={plateDist}
                        onChange={(e) => setPlateDist(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>جهد شحن البطارية:</span>
                        <span className="font-bold text-emerald-600 font-mono">{voltage} فولت</span>
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
                )}

                {/* 15. electromagnetism-induction CONTROLS */}
                {selectedLessonId === "electromagnetism-induction" && (
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-[11px] text-slate-700">
                      <span>موضع قضيب المغناطيس:</span>
                      <span className="font-mono text-emerald-600">{inductionMagnetX}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={inductionMagnetX}
                      onChange={(e) => setInductionMagnetX(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                      <span className="font-bold text-[11px] text-emerald-700 block mb-1">💡 قانون فارادي للحث:</span>
                      <p className="text-[10px] text-slate-600 leading-relaxed">
                        اسحب المغناطيس يميناً ويساراً بسرعة داخل الملف الدائري. تلاحظ انحراف مؤشر الجلفانومتر فقط أثناء حركة المغناطيس وتغير الفيض!
                      </p>
                    </div>
                  </div>
                )}

                {/* 16. self-inductance CONTROLS */}
                {selectedLessonId === "self-inductance" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>المحاثة الذاتية للملف (ل):</span>
                        <span className="font-bold text-emerald-600 font-mono">{selfIndLValue} هنري</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selfIndLValue}
                        onChange={(e) => setSelfIndLValue(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <button
                      onClick={() => setSelfIndSwitchOpen(!selfIndSwitchOpen)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition border ${
                        selfIndSwitchOpen ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                      }`}
                    >
                      {selfIndSwitchOpen ? "قفل مفتاح الدائرة" : "فتح مفتاح الدائرة"}
                    </button>
                  </div>
                )}

                {/* 17. semiconductors-doping CONTROLS */}
                {selectedLessonId === "semiconductors-doping" && (
                  <div className="space-y-3">
                    <label className="font-bold text-slate-700 block mb-1">اختر نوع التشويب المضاف:</label>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { id: "pure", name: "بلورة سيليكون نقية (عازلة تماماً)" },
                        { id: "n", name: "التشويب بمانح خماسي الزرنيخ (n-type)" },
                        { id: "p", name: "التشويب بمتقبل ثلاثي البورون (p-type)" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSemiconductorDopeType(item.id as any)}
                          className={`w-full text-right px-3 py-2 rounded-xl text-[11px] font-bold transition border ${
                            semiconductorDopeType === item.id
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 18. structures-trusses CONTROLS */}
                {selectedLessonId === "structures-trusses" && (
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-[11px] text-slate-700">
                      <span>الحمل العمودي عند قفل الجملون:</span>
                      <span className="font-mono text-emerald-600">{trussLoad} كيلو نيوتن</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="2"
                      value={trussLoad}
                      onChange={(e) => setTrussLoad(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="bg-slate-50 p-2.5 border rounded-xl text-[10px] text-slate-500">
                      * اضغط وحمل الجملون المثلث لتوزيع إجهادات الضغط (اللون الأحمر) وإجهادات الشد السفلي (اللون الأزرق).
                    </div>
                  </div>
                )}

                {/* 19. arches-foundations CONTROLS */}
                {selectedLessonId === "arches-foundations" && (
                  <div className="space-y-3 text-slate-800">
                    <div>
                      <label className="font-bold text-[11px] block">نوع قاعدة التأسيس في التربة:</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 mt-1">
                        <button
                          onClick={() => setFoundationType("shallow")}
                          className={`py-2 rounded-lg text-xs font-bold transition ${
                            foundationType === "shallow" ? "bg-rose-600 text-white" : "text-slate-500"
                          }`}
                        >
                          قاعدة سطحية منفصلة
                        </button>
                        <button
                          onClick={() => setFoundationType("deep")}
                          className={`py-2 rounded-lg text-xs font-bold transition ${
                            foundationType === "deep" ? "bg-emerald-600 text-white" : "text-slate-500"
                          }`}
                        >
                          قاعدة عميقة (الخوازيق)
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>عدد طوابق المبنى:</span>
                        <span className="font-bold text-emerald-600 font-mono">{buildingWeight} طوابق</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="14"
                        step="2"
                        value={buildingWeight}
                        onChange={(e) => setBuildingWeight(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* 20. stress-strain-hooke CONTROLS */}
                {selectedLessonId === "stress-strain-hooke" && (
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">اختر مادة العمود المعدني:</label>
                      <select
                        value={elasticMaterial}
                        onChange={(e) => setElasticMaterial(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="steel">الصلب الكربوني (ي = 200 GPa)</option>
                        <option value="copper">النحاس النقي (ي = 110 GPa)</option>
                        <option value="aluminum">الألومنيوم الطري (ي = 70 GPa)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">القوة المؤثرة (ق):</span>
                        <span className="font-mono text-emerald-600 font-bold">{elasticForce.toLocaleString()} نيوتن</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={elasticForce}
                        onChange={(e) => setElasticForce(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* 21. fluid-mechanics-viscosity CONTROLS */}
                {selectedLessonId === "fluid-mechanics-viscosity" && (
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-[11px] block text-slate-700">اختر السائل المستخدم:</label>
                      <select
                        value={viscosityFluid}
                        onChange={(e) => {
                          setViscosityFluid(e.target.value as any);
                          setFluidBallY(10);
                          setFluidBallRolling(false);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="water">الماء (لزوجة منخفضة جداً)</option>
                        <option value="oil">زيت المحرك (لزوجة متوسطة)</option>
                        <option value="honey">العسل الطبيعي الكثيف (لزوجة فائقة)</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setFluidBallY(10);
                        setFluidBallRolling(true);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                    >
                      إسقاط الكرة المعدنية 🏀
                    </button>
                  </div>
                )}

                {/* 22. environmental-pollution CONTROLS */}
                {selectedLessonId === "environmental-pollution" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">مستوى انبعاثات الكبريت SOx:</span>
                        <span className="font-mono text-rose-600 font-bold">{pollutionSlider} جزء بالمليون</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={pollutionSlider}
                        onChange={(e) => setPollutionSlider(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                    <div className="bg-slate-50 p-2.5 border rounded-xl text-[10px] text-slate-600 space-y-2">
                      <span className="font-bold text-slate-800 block">اختبار نواقل المياه السريع:</span>
                      <p className="text-[9px]">ما هو تصنيف مرض البلهارسيا بحسب الإصحاح المائي؟</p>
                      <div className="flex flex-col gap-1">
                        {[
                          { id: "borne", n: "أمراض منقولة بالشرب", correct: false },
                          { id: "contact", n: "أمراض تلامسية بالجلد", correct: true },
                        ].map((q) => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setWaterQuizSelected(q.id);
                              setWaterQuizCorrect(q.correct);
                            }}
                            className={`py-1 rounded text-right px-2 text-[10px] border transition ${
                              waterQuizSelected === q.id
                                ? q.correct
                                  ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                                  : "bg-rose-50 border-rose-400 text-rose-700"
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {q.n}
                            {waterQuizSelected === q.id && (q.correct ? " ✓ صح" : " ✗ خطأ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Pedagogy Formula Card Footer */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1">
            <span className="text-[9px] font-black text-amber-400 tracking-wider block">معادلة القياس المعتمدة 🧮</span>
            <div className="text-xs font-mono font-bold">
              {selectedLessonId === "ortho-principles" && "L_projected = L_real * cos(θ)"}
              {selectedLessonId === "three-planes" && "Angle 1: Top View in the Bottom"}
              {selectedLessonId === "dim-1-1" && "Clearance = 8 to 10 mm"}
              {selectedLessonId === "metals-intro" && "Density = Mass / Volume"}
              {selectedLessonId === "iron-production" && "Pig Iron + Slag separation at 1300°C"}
              {selectedLessonId === "engines-cycles" && "V_compression = V_total / 8"}
              {selectedLessonId === "car-engine-systems" && "Fuel : Air Ratio = 1 : 15"}
              {selectedLessonId === "electrical-units" && "F = (Q1 * Q2) / (4 * π * ε * d²)"}
              {selectedLessonId === "capacitors" && "C = ε_r * ε_o * A / d"}
              {selectedLessonId === "electromagnetism-induction" && "e = -N * (dΦ / dt)"}
              {selectedLessonId === "self-inductance" && "V_induced = -L * (dI / dt)"}
              {selectedLessonId === "structures-trusses" && "ΣF_x = 0 , ΣF_y = 0"}
              {selectedLessonId === "stress-strain-hooke" && "σ = E * ε (Young's Modulus)"}
              {selectedLessonId === "fluid-mechanics-viscosity" && "F_viscous = μ * A * (dv / dy)"}
              {selectedLessonId === "environmental-pollution" && "Acid Rain: H2SO4 + HNO3"}
              {!["ortho-principles", "three-planes", "dim-1-1", "metals-intro", "iron-production", "engines-cycles", "car-engine-systems", "electrical-units", "capacitors", "electromagnetism-induction", "self-inductance", "structures-trusses", "stress-strain-hooke", "fluid-mechanics-viscosity", "environmental-pollution"].includes(selectedLessonId) && "Virtual Simulator Engine v2.5"}
            </div>
          </div>
        </div>

        {/* Right Column: High-fidelity Vector Graphic Simulator Screen */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 min-h-[440px] flex flex-col justify-between relative overflow-hidden text-slate-300">
          
          {/* Visual Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-400">شاشة محاكاة المعمل الرقمية التفاعلية</h4>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              MODE: {selectedLessonId.toUpperCase()}
            </div>
          </div>

          {/* DYNAMIC SCREEN CORE */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            
            {/* 1. intro-projection SIMULATION */}
            {selectedLessonId === "intro-projection" && (
              <svg viewBox="0 0 300 200" className="w-72 h-auto text-slate-300">
                {/* Screen plane */}
                <rect x="40" y="30" width="10" height="140" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="35" y="25" fill="#38bdf8" className="text-[8px] font-bold">مستوى الإسقاط</text>

                {/* 3D Box on right */}
                <rect x="180" y="60" width="60" height="80" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="210" cy="100" r="15" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" />

                {/* Beams */}
                {projBeamActive && (
                  <g stroke="#10b981" strokeWidth="1" strokeDasharray="3" className="animate-pulse">
                    <line x1="180" x2="50" y1="60" y2="60" />
                    <line x1="180" x2="50" y1="140" y2="140" />
                    <line x1="195" x2="50" y1="100" y2="100" />
                  </g>
                )}

                {/* Projected view on left */}
                <rect x="44" y="60" width="2" height="80" fill="#10b981" />
                <circle cx="45" cy="100" r="1.5" fill="#10b981" />
              </svg>
            )}

            {/* 2. ortho-principles SIMULATION */}
            {selectedLessonId === "ortho-principles" && (
              <div className="flex flex-col items-center space-y-4">
                <svg viewBox="0 0 300 160" className="w-72 h-auto">
                  {/* Plane */}
                  <line x1="20" y1="130" x2="280" y2="130" stroke="#475569" strokeWidth="3" />
                  <text x="20" y="145" fill="#475569" className="text-[9px] font-bold">مستوى الإسقاط</text>

                  {/* Rotating beam */}
                  {(() => {
                    const rad = (orthoAngle * Math.PI) / 180;
                    const len = 80;
                    const startX = 150;
                    const startY = 130 - len * Math.sin(rad);
                    const endX = startX + len * Math.cos(rad);
                    const endY = 130;
                    
                    // Projected shadow segment
                    const shadowStartX = startX;
                    const shadowEndX = endX;
                    
                    return (
                      <g>
                        {/* The solid rod */}
                        <line x1={startX} y1={startY} x2={endX} y2={130 - len * Math.sin(rad)} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                        <circle cx={startX} cy={130 - len * Math.sin(rad)} r="4" fill="#ef4444" />
                        
                        {/* Projection vertical lines */}
                        <line x1={startX} y1={130 - len * Math.sin(rad)} x2={startX} y2="130" stroke="rgba(255,255,255,0.15)" strokeDasharray="2" />
                        <line x1={endX} y1={130 - len * Math.sin(rad)} x2={endX} y2="130" stroke="rgba(255,255,255,0.15)" strokeDasharray="2" />

                        {/* Projected shadow on plane */}
                        <line x1={shadowStartX} y1="130" x2={shadowEndX} y2="130" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                      </g>
                    );
                  })()}
                </svg>
                <div className="text-center">
                  <span className="text-xs text-slate-400">طول الظل المسقط: </span>
                  <span className="text-xs font-black text-emerald-400 font-mono">{(80 * Math.cos((orthoAngle * Math.PI) / 180)).toFixed(1)} مم</span>
                </div>
              </div>
            )}

            {/* 3. three-planes SIMULATION */}
            {selectedLessonId === "three-planes" && (
              <div className="w-full max-w-sm grid grid-cols-3 gap-2.5 text-center text-[10px] font-bold">
                {projectionAngle === "first" ? (
                  <>
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-900/40">الجانبي الأيمن</div>
                    <div className="border-2 border-amber-500 p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center">
                      <span>الرأسي</span>
                      <span className="text-[8px] text-slate-500 mt-1">Front View</span>
                    </div>
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-900/40">الجانبي الأيسر</div>
                    <div></div>
                    <div className="border-2 border-sky-500 p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center">
                      <span>الأفقي</span>
                      <span className="text-[8px] text-slate-500 mt-1">Top View</span>
                    </div>
                    <div></div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div className="border-2 border-sky-500 p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center">
                      <span>الأفقي</span>
                      <span className="text-[8px] text-slate-500 mt-1">Top View</span>
                    </div>
                    <div></div>
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-900/40">الجانبي الأيسر</div>
                    <div className="border-2 border-amber-500 p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center">
                      <span>الرأسي</span>
                      <span className="text-[8px] text-slate-500 mt-1">Front View</span>
                    </div>
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-900/40">الجانبي الأيمن</div>
                  </>
                )}
              </div>
            )}

            {/* 4. isometric-oblique SIMULATION */}
            {selectedLessonId === "isometric-oblique" && (
              <svg viewBox="0 0 240 180" className="w-60 h-auto">
                {isometricStyle === "iso" ? (
                  <g stroke="#f59e0b" strokeWidth="2" fill="none">
                    {/* Isometric block representation (30 degrees axes) */}
                    <polygon points="120,40 160,60 120,80 80,60" fill="rgba(255,255,255,0.05)" />
                    <polygon points="80,60 120,80 120,130 80,110" fill="rgba(255,255,255,0.08)" />
                    <polygon points="120,80 160,60 160,110 120,130" fill="rgba(255,255,255,0.12)" />
                    <line x1="120" y1="80" x2="120" y2="130" />
                    {/* 30 degree helper dashed lines */}
                    <line x1="80" y1="60" x2="40" y2="80" stroke="#475569" strokeDasharray="2" />
                    <line x1="160" y1="60" x2="200" y2="80" stroke="#475569" strokeDasharray="2" />
                    <text x="50" y="75" fill="#475569" className="text-[8px] font-mono">°٣٠</text>
                    <text x="175" y="75" fill="#475569" className="text-[8px] font-mono">°٣٠</text>
                  </g>
                ) : (
                  <g stroke="#38bdf8" strokeWidth="2" fill="none">
                    {/* Oblique block (front facing plane normal, depth mitered at 45) */}
                    <rect x="60" y="70" width="80" height="60" fill="rgba(255,255,255,0.08)" />
                    <polygon points="60,70 100,35 180,35 140,70" />
                    <polygon points="140,70 180,35 180,95 140,130" fill="rgba(255,255,255,0.12)" />
                    {/* 45 degree angle */}
                    <line x1="140" y1="70" x2="180" y2="35" stroke="#ef4444" />
                    <text x="160" y="60" fill="#ef4444" className="text-[8px] font-mono">°٤٥ (نصف العمق)</text>
                  </g>
                )}
              </svg>
            )}

            {/* 5. dim-1-1 SIMULATION */}
            {selectedLessonId === "dim-1-1" && (
              <svg viewBox="0 0 240 180" className="w-60 h-auto">
                {/* Object box */}
                <rect x="50" y="80" width="140" height="60" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2.5" />
                
                {/* Extensions lines */}
                <line x1="50" y1="80" x2="50" y2={80 - dimDistance * 5} stroke="#94a3b8" strokeWidth="1" />
                <line x1="190" y1="80" x2="190" y2={80 - dimDistance * 5} stroke="#94a3b8" strokeWidth="1" />

                {/* Dimension line with arrows */}
                <g stroke={dimDistance >= 8 && dimDistance <= 10 ? "#10b981" : "#ef4444"} strokeWidth="1.5">
                  <line x1="50" y1={85 - dimDistance * 5} x2="190" y2={85 - dimDistance * 5} />
                  <polygon points={`50,${85 - dimDistance * 5} 58,${82 - dimDistance * 5} 58,${88 - dimDistance * 5}`} fill="currentColor" />
                  <polygon points={`190,${85 - dimDistance * 5} 182,${82 - dimDistance * 5} 182,${88 - dimDistance * 5}`} fill="currentColor" />
                </g>
                <text x="100" y={78 - dimDistance * 5} fill={dimDistance >= 8 && dimDistance <= 10 ? "#10b981" : "#ef4444"} className="text-[10px] font-bold font-mono text-center">١٤٠ مم</text>
              </svg>
            )}

            {/* 6. sketch-1-2 SIMULATION */}
            {selectedLessonId === "sketch-1-2" && (
              <div className="flex flex-col items-center space-y-3 w-full">
                <span className="text-[10px] text-slate-400">حاول تتبع خطوط الدائرة التوجيهية باليد الحرة:</span>
                <div
                  className="w-60 h-40 bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl relative cursor-crosshair overflow-hidden"
                  onMouseDown={() => setFreehandDrawing(true)}
                  onMouseUp={() => {
                    setFreehandDrawing(false);
                    // Generate random score simulating drawing accuracy
                    if (freehandPoints.length > 5) {
                      setSketchScore(Math.floor(70 + Math.random() * 25));
                    }
                  }}
                  onMouseMove={(e) => {
                    if (!freehandDrawing) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setFreehandPoints((prev) => [...prev, { x, y }]);
                  }}
                >
                  {/* Circle Trace guidelines & Freehand rendering wrapped in a single SVG container */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle cx="120" cy="80" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="120" y1="20" x2="120" y2="140" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="80" x2="200" y2="80" stroke="rgba(255,255,255,0.05)" />

                    {freehandPoints.map((pt, i) => (
                      <circle key={i} cx={pt.x} cy={pt.y} r="1.5" fill="#f59e0b" />
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* 7. metals-intro SIMULATION */}
            {selectedLessonId === "metals-intro" && (
              <div className="flex flex-col items-center space-y-4">
                <span className="text-xs font-bold text-slate-300">
                  فحص: {metalTestType === "magnet" ? "الاستجابة المغناطيسية" : metalTestType === "spark" ? "شرر حجر الجلخ للصلب" : "الوزن والكثافة النوعية"}
                </span>
                
                {metalTestType === "magnet" && (
                  <svg viewBox="0 0 200 120" className="w-52 h-auto">
                    {/* Magnet */}
                    <path d="M40,30 Q20,30 20,50 L20,70 Q20,90 40,90" fill="none" stroke="#ef4444" strokeWidth="15" strokeLinecap="round" />
                    <path d="M100,30 Q120,30 120,50 L120,70 Q120,90 100,90" fill="none" stroke="#38bdf8" strokeWidth="15" strokeLinecap="round" />
                    
                    {/* Metal sample block */}
                    <rect x="150" y="45" width="30" height="30" fill={metalSelected === "copper" ? "#b45309" : metalSelected === "aluminum" ? "#94a3b8" : "#475569"} rx="3" className={metalSelected === "steel" || metalSelected === "cast-iron" ? "translate-x-[-40px] transition-all duration-700" : "transition-all duration-700"} />
                    <text x="145" y="105" fill="#94a3b8" className="text-[9px] font-bold">
                      {metalSelected === "steel" || metalSelected === "cast-iron" ? "➜ ينجذب بقوة" : "✗ لا يستجيب للمغنطة"}
                    </text>
                  </svg>
                )}

                {metalTestType === "spark" && (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-32 h-20 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Grindstone */}
                      <circle cx="40" cy="40" r="25" fill="#334155" className="animate-spin" />
                      
                      {/* Metal Rod pressed */}
                      <rect x="75" y="35" width="30" height="10" fill="silver" />
                      
                      {/* Sparks generation */}
                      {(metalSelected === "steel" || metalSelected === "cast-iron") && (
                        <div className="absolute left-[50px] top-[35px] w-14 h-14 border-b-2 border-r-2 border-dashed border-amber-400 rounded-full animate-ping" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {metalSelected === "steel" ? "شرر كثيف وطويل ومتشعب (صلب كربوني)" :
                       metalSelected === "cast-iron" ? "شرر قصير أحمر مائل للبرتقالي" : "لا ينتج أي شرر عند حك الفلزات اللاحديدية"}
                    </span>
                  </div>
                )}

                {metalTestType === "density" && (
                  <div className="flex items-center gap-6">
                    <div className="text-center font-mono space-y-1">
                      <span className="text-[9px] text-slate-400 block">الوزن النوعي (الكثافة):</span>
                      <span className="text-sm font-black text-emerald-400">
                        {metalSelected === "steel" ? "7.8" : metalSelected === "cast-iron" ? "7.2" : metalSelected === "copper" ? "8.9" : "2.7"} g/cm³
                      </span>
                    </div>
                    <div className="w-16 h-28 bg-blue-950 border border-blue-800 rounded-xl relative overflow-hidden">
                      {/* Water */}
                      <rect x="0" y="30" width="64" height="80" fill="rgba(56,189,248,0.2)" />
                      {/* Sinking ball representing density speed */}
                      <circle cx="32" cy={metalSelected === "aluminum" ? "45" : "80"} r="8" fill={metalSelected === "copper" ? "#b45309" : "gray"} className="transition-all duration-1000" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 8. iron-production SIMULATION */}
            {selectedLessonId === "iron-production" && (
              <svg viewBox="0 0 200 180" className="w-52 h-auto text-slate-300">
                {/* Furnace silhouette */}
                <polygon points="60,20 140,20 160,130 130,160 70,160 40,130" fill="rgba(255,255,255,0.05)" stroke="#ef4444" strokeWidth="2" />
                
                {/* Fire / Molten metal level inside */}
                {furnaceTemp >= 1300 && (
                  <polygon points="65,90 135,90 140,130 130,158 70,158 60,130" fill="url(#molten-iron-grad)" className="animate-pulse" />
                )}

                {/* Slag outlet */}
                <rect x="15" y="115" width="30" height="8" fill="#475569" />
                {furnaceTapped && <line x1="45" y1="119" x2="10" y2="119" stroke="#94a3b8" strokeWidth="4" />}

                {/* Molten iron outlet */}
                <rect x="155" y="140" width="30" height="8" fill="#ef4444" />
                {furnaceTapped && <line x1="155" y1="144" x2="190" y2="144" stroke="#f59e0b" strokeWidth="5" />}

                <defs>
                  <linearGradient id="molten-iron-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* 9. steel-rolling SIMULATION */}
            {selectedLessonId === "steel-rolling" && (
              <svg viewBox="0 0 240 140" className="w-60 h-auto">
                {/* Roller 1 (Top) */}
                <circle cx="120" cy="35" r="22" fill="#334155" stroke="currentColor" strokeWidth="2" className="animate-spin-slow" />
                {/* Roller 2 (Bottom) */}
                <circle cx="120" cy="105" r="22" fill="#334155" stroke="currentColor" strokeWidth="2" className="animate-spin-slow" />

                {/* Incoming Slab */}
                <rect x="10" y="55" width="80" height="30" fill={rollingTemp === "hot" ? "#ef4444" : "#94a3b8"} />
                
                {/* Outgoing Sheet */}
                <rect x="130" y="62" width="100" height="16" fill={rollingTemp === "hot" ? "#f59e0b" : "#cbd5e1"} />
              </svg>
            )}

            {/* 10. non-ferrous-alloys SIMULATION */}
            {selectedLessonId === "non-ferrous-alloys" && (
              <div className="flex flex-col items-center space-y-3">
                <svg viewBox="0 0 160 120" className="w-40 h-auto">
                  {/* Crucible */}
                  <path d="M40,20 L120,20 L110,90 Q80,110 50,90 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  
                  {/* Fluid mix color */}
                  <path d="M45,40 L115,40 L108,85 Q80,102 52,85 Z" fill={alloyMixCopper > 65 ? "#b45309" : "#eab308"} className="animate-pulse" />
                </svg>
                <div className="text-center">
                  <span className="text-xs text-slate-400">السبيكة الناتجة: </span>
                  <span className="text-sm font-black text-amber-500">
                    {alloyMixCopper >= 65 && alloyMixCopper <= 75 ? "النحاس الأصفر (صناعة المحابس والصنابير)" :
                     alloyMixCopper > 75 ? "برنز المدافع والقطع البحرية" : "خلائط برونز طرية"}
                  </span>
                </div>
              </div>
            )}

            {/* 11. engines-cycles SIMULATION */}
            {selectedLessonId === "engines-cycles" && (
              <svg viewBox="0 0 200 240" className="w-48 h-auto">
                {/* Cylinder walls */}
                <line x1="50" y1="40" x2="50" y2="200" stroke="currentColor" strokeWidth="4" />
                <line x1="150" y1="40" x2="150" y2="200" stroke="currentColor" strokeWidth="4" />
                <line x1="50" y1="40" x2="150" y2="40" stroke="currentColor" strokeWidth="4" />

                {/* Spark Plug spark */}
                {engineStroke === 2 && (
                  <circle cx="100" cy="48" r="15" fill="rgba(239, 68, 68, 0.4)" className="animate-ping" />
                )}

                {/* Valves */}
                <line x1="70" y1="25" x2="70" y2={engineStroke === 0 ? "48" : "38"} stroke={engineStroke === 0 ? "#10b981" : "currentColor"} strokeWidth="3" />
                <line x1="130" y1="25" x2="130" y2={engineStroke === 3 ? "48" : "38"} stroke={engineStroke === 3 ? "#ef4444" : "currentColor"} strokeWidth="3" />

                {/* Piston block */}
                <rect x="52" y={engineStroke === 0 || engineStroke === 2 ? "110" : "55"} width="96" height="40" rx="3" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy={engineStroke === 0 || engineStroke === 2 ? "130" : "75"} r="6" fill="#475569" />
              </svg>
            )}

            {/* 12. car-engine-systems SIMULATION */}
            {selectedLessonId === "car-engine-systems" && (
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-between min-h-[160px]">
                {activeCarSystem === "fuel" && (
                  <>
                    <span className="text-xs font-bold text-amber-400">الكاربريتر (خلط الوقود والهواء)</span>
                    <div className="w-full flex items-center justify-around gap-2 my-2">
                      <div className="text-center text-[10px] bg-red-950/40 p-2.5 rounded-lg border border-red-500/20">
                        <span>بنزين ⛽</span>
                        <div className="font-bold text-red-400 mt-1">١ وحدة</div>
                      </div>
                      <span className="text-slate-500">➜ خلط ➜</span>
                      <div className="text-center text-[10px] bg-sky-950/40 p-2.5 rounded-lg border border-sky-500/20">
                        <span>هواء 💨</span>
                        <div className="font-bold text-sky-400 mt-1">{carburetorRatio} وحدة</div>
                      </div>
                    </div>
                  </>
                )}
                {activeCarSystem === "cooling" && (
                  <>
                    <span className="text-xs font-bold text-sky-400">دورة مياه التبريد والرديتر</span>
                    <div className="flex items-center gap-3 my-2">
                      <div className="w-8 h-8 rounded-full border border-sky-400 animate-spin flex items-center justify-center text-[9px]">مضخة</div>
                      <div className="w-16 h-10 bg-blue-950 border border-blue-500 rounded flex items-center justify-center text-[8px]">المشع (الرديتر)</div>
                    </div>
                  </>
                )}
                {activeCarSystem === "lube" && (
                  <>
                    <span className="text-xs font-bold text-emerald-400">التزييت والكرتير السفلي</span>
                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                      يتم تدوير زيت المحرك عالي اللزوجة لتقليل معامل الاحتكاك وتجنب قشط أسطوانات حديد الزهر.
                    </p>
                  </>
                )}
                {activeCarSystem === "ignition" && (
                  <>
                    <span className="text-xs font-bold text-indigo-400">مجموعة الاشتعال (ملف رفع الجهد)</span>
                    <div className="text-center font-mono my-1 space-y-1">
                      <div className="text-[11px] text-indigo-400">الجهد المنخفض (البطارية) = ١٢ فولت</div>
                      <div className="text-[12px] text-emerald-400 font-bold">جهد الشرارة (البوبينة) = ١٥,٠٠٠ فولت!</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 13. electrical-units SIMULATION */}
            {selectedLessonId === "electrical-units" && (
              <svg viewBox="0 0 240 140" className="w-60 h-auto">
                {/* Charge 1 */}
                <circle cx="60" cy="70" r="16" fill={coulombQ1 > 0 ? "#ef4444" : "#3b82f6"} />
                <text x="60" y="74" fill="white" className="text-[10px] font-bold text-center">{coulombQ1 > 0 ? `+${coulombQ1}` : coulombQ1}</text>

                {/* Charge 2 */}
                <circle cx={60 + coulombDist * 25} cy="70" r="16" fill={coulombQ2 > 0 ? "#ef4444" : "#3b82f6"} />
                <text x={60 + coulombDist * 25} y="74" fill="white" className="text-[10px] font-bold text-center">{coulombQ2 > 0 ? `+${coulombQ2}` : coulombQ2}</text>

                {/* Force vectors */}
                {(() => {
                  const sameSign = (coulombQ1 > 0 && coulombQ2 > 0) || (coulombQ1 < 0 && coulombQ2 < 0);
                  const forceX1 = sameSign ? 30 : 90;
                  const forceX2 = sameSign ? 60 + coulombDist * 25 + 30 : 60 + coulombDist * 25 - 30;
                  return (
                    <g stroke="#f59e0b" strokeWidth="2">
                      {/* Vector Arrow 1 */}
                      <line x1="60" y1="70" x2={forceX1} y2="70" />
                      {/* Vector Arrow 2 */}
                      <line x1={60 + coulombDist * 25} y1="70" x2={forceX2} y2="70" />
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* 14. capacitors SIMULATION */}
            {selectedLessonId === "capacitors" && (
              <div className="flex flex-col items-center space-y-4">
                <svg viewBox="0 0 240 120" className="w-56 h-auto">
                  {/* Top plate */}
                  <rect x="40" y="30" width="160" height="8" fill="#ef4444" />
                  {/* Bottom plate */}
                  <rect x="40" y={30 + plateDist * 12} width="160" height="8" fill="#3b82f6" />

                  {/* Flux lines */}
                  {voltage > 0 && (
                    <g stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" className="animate-pulse">
                      <line x1="60" y1="38" x2="60" y2={30 + plateDist * 12} />
                      <line x1="100" y1="38" x2="100" y2={30 + plateDist * 12} />
                      <line x1="140" y1="38" x2="140" y2={30 + plateDist * 12} />
                      <line x1="180" y1="38" x2="180" y2={30 + plateDist * 12} />
                    </g>
                  )}
                </svg>
                <div className="text-center font-mono text-[11px] text-emerald-400 font-bold">
                  سعة المكثف (س) = {((dielectric === "ceramic" ? 6.0 : dielectric === "paper" ? 4.5 : 1.0) * 8.85 * plateArea * 0.1 / plateDist).toFixed(1)} بيكوفاراد
                </div>
              </div>
            )}

            {/* 15. electromagnetism-induction SIMULATION */}
            {selectedLessonId === "electromagnetism-induction" && (
              <svg viewBox="0 0 240 140" className="w-60 h-auto">
                {/* Copper coil on right */}
                <ellipse cx="170" cy="70" rx="15" ry="30" fill="none" stroke="#b45309" strokeWidth="4" />
                <ellipse cx="180" cy="70" rx="15" ry="30" fill="none" stroke="#b45309" strokeWidth="4" />

                {/* Moving Magnet bar */}
                <g transform={`translate(${inductionMagnetX * 1.5}, 50)`}>
                  <rect x="0" y="0" width="35" height="25" fill="#ef4444" />
                  <text x="10" y="16" fill="white" className="text-[10px] font-bold">N</text>
                  <rect x="35" y="0" width="35" height="25" fill="#3b82f6" />
                  <text x="45" y="16" fill="white" className="text-[10px] font-bold">S</text>
                </g>

                {/* Galvanometer needle in bottom */}
                <g transform="translate(100, 115)">
                  <circle cx="0" cy="0" r="15" fill="#1e293b" stroke="currentColor" />
                  <line x1="0" y1="0" x2={galvanometerReading * 0.15} y2="-12" stroke="#ef4444" strokeWidth="2.5" />
                </g>
              </svg>
            )}

            {/* 16. self-inductance SIMULATION */}
            {selectedLessonId === "self-inductance" && (
              <div className="flex flex-col items-center space-y-3">
                <svg viewBox="0 0 220 120" className="w-56 h-auto">
                  {/* Coiled inductor */}
                  <path d="M40,60 Q50,40 60,60 Q70,40 80,60 Q90,40 100,60 Q110,40 120,60" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  
                  {/* Light bulb */}
                  <circle cx="170" cy="60" r="14" fill={selfIndLampGlow > 0 ? `rgba(234,179,8,${selfIndLampGlow / 100})` : "none"} stroke="currentColor" strokeWidth="2" />
                  
                  {/* Switch contact */}
                  <line x1="10" y1="90" x2="30" y2={selfIndSwitchOpen ? "70" : "90"} stroke="#ef4444" strokeWidth="3.5" />
                  <circle cx="10" cy="90" r="3" fill="#ef4444" />
                  <circle cx="30" cy="90" r="3" fill="#ef4444" />

                  {/* Spark effect */}
                  {sparkArcFlash && (
                    <circle cx="30" cy="90" r="12" fill="rgba(56,189,248,0.5)" className="animate-ping" />
                  )}
                </svg>
                <div className="text-[10px] text-slate-400">
                  {selfIndSwitchOpen ? "قوة دافعة كهربائية عكسية تؤدي لشرارة الفتح" : "تأخر وهج المصباح بسبب ق.د.ك العكسية للملف"}
                </div>
              </div>
            )}

            {/* 17. semiconductors-doping SIMULATION */}
            {selectedLessonId === "semiconductors-doping" && (
              <svg viewBox="0 0 220 140" className="w-56 h-auto">
                {/* 2D silicon crystal matrix grid */}
                <rect x="20" y="10" width="180" height="120" fill="none" stroke="rgba(255,255,255,0.05)" />
                {/* Silicon atoms */}
                <circle cx="50" cy="40" r="10" fill="#334155" /> <text x="45" y="43" fill="white" className="text-[8px] font-bold">Si</text>
                <circle cx="110" cy="40" r="10" fill="#334155" /> <text x="105" y="43" fill="white" className="text-[8px] font-bold">Si</text>
                <circle cx="170" cy="40" r="10" fill="#334155" /> <text x="165" y="43" fill="white" className="text-[8px] font-bold">Si</text>

                {/* Doped center atom */}
                <circle cx="110" cy="90" r="12" fill={semiconductorDopeType === "n" ? "#b91c1c" : semiconductorDopeType === "p" ? "#0369a1" : "#334155"} />
                <text x="104" y="93" fill="white" className="text-[8px] font-bold">
                  {semiconductorDopeType === "n" ? "As" : semiconductorDopeType === "p" ? "B" : "Si"}
                </text>

                {/* Electron and Hole display */}
                {semiconductorDopeType === "n" && (
                  <g>
                    <circle cx="140" cy="100" r="4" fill="#fbbf24" className="animate-bounce" />
                    <text x="146" y="103" fill="#fbbf24" className="text-[8px]">إلكترون حر زائد</text>
                  </g>
                )}
                {semiconductorDopeType === "p" && (
                  <g>
                    <circle cx="140" cy="100" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="1" />
                    <text x="148" y="103" fill="#38bdf8" className="text-[8px]">فجوة موجبة (ثقب)</text>
                  </g>
                )}
              </svg>
            )}

            {/* 18. structures-trusses SIMULATION */}
            {selectedLessonId === "structures-trusses" && (
              <svg viewBox="0 0 240 140" className="w-60 h-auto">
                {/* Simple triangular truss members */}
                <polygon points="40,110 120,50 200,110" fill="none" stroke="#ef4444" strokeWidth="4" /> {/* Compression top */}
                <line x1="40" y1="110" x2="200" y2="110" stroke="#3b82f6" strokeWidth="4" /> {/* Tension bottom */}

                {/* Load arrow */}
                <g stroke="#f59e0b" strokeWidth="2.5">
                  <line x1="120" y1="15" x2="120" y2="48" />
                  <polygon points="120,50 115,42 125,42" fill="#f59e0b" />
                </g>
                <text x="130" y="30" fill="#f59e0b" className="text-[10px] font-bold font-mono">{trussLoad} kN</text>
              </svg>
            )}

            {/* 19. arches-foundations SIMULATION */}
            {selectedLessonId === "arches-foundations" && (
              <div className="flex flex-col items-center space-y-3">
                <svg viewBox="0 0 220 140" className="w-56 h-auto">
                  {/* Ground clay line */}
                  <rect x="10" y="110" width="200" height="25" fill="#78350f" />

                  {/* Foundations */}
                  {foundationType === "shallow" ? (
                    <g>
                      {/* Shallow pad foundation tilting under excessive load */}
                      <rect x="80" y="100" width="60" height="10" fill="#cbd5e1" className={buildingWeight > 8 ? "rotate-6 translate-y-3 transition" : ""} />
                      {/* Building */}
                      <rect x="90" y={100 - buildingWeight * 7} width="40" height={buildingWeight * 7} fill="rgba(255,255,255,0.08)" stroke="#cbd5e1" strokeWidth="2" className={buildingWeight > 8 ? "rotate-6 translate-y-3 transition" : ""} />
                    </g>
                  ) : (
                    <g>
                      {/* Deep Pile foundations (Khawaziq) reaching stable rock layers */}
                      <line x1="95" y1="110" x2="95" y2="135" stroke="#10b981" strokeWidth="5" />
                      <line x1="125" y1="110" x2="125" y2="135" stroke="#10b981" strokeWidth="5" />
                      <rect x="80" y="100" width="60" height="10" fill="#cbd5e1" />
                      {/* Building stable */}
                      <rect x="90" y={100 - buildingWeight * 7} width="40" height={buildingWeight * 7} fill="rgba(255,255,255,0.08)" stroke="#cbd5e1" strokeWidth="2" />
                    </g>
                  )}
                </svg>
                <span className="text-[10px] text-slate-400">
                  {foundationType === "shallow" && buildingWeight > 8 ? "⚠️ انهيار انضغاط التربة (القواعد السطحية لا تتحمل!)" : "✅ أساسات متزنة بالخوازيق الإسمنتية"}
                </span>
              </div>
            )}

            {/* 20. stress-strain-hooke SIMULATION */}
            {selectedLessonId === "stress-strain-hooke" && (
              <div className="flex flex-col items-center space-y-3">
                <svg viewBox="0 0 240 80" className="w-56 h-auto">
                  <rect x="10" y="25" width="40" height="30" fill="#334155" /> {/* Anchoring */}
                  
                  {/* Stretching specimen */}
                  {(() => {
                    const E_mod = elasticMaterial === "steel" ? 200 : elasticMaterial === "copper" ? 110 : 70;
                    const stress = elasticForce / 100; // Force / Area
                    const strain = stress / (E_mod * 1000);
                    const ext = strain * 200; // delta L
                    
                    return (
                      <g>
                        <rect x="50" y="32" width={100 + ext * 6000} height="16" fill="url(#metal-bar-grad)" stroke="silver" />
                        <text x="160" y="45" fill="#10b981" className="text-[10px] font-mono">+{ext.toFixed(3)}ملم</text>
                      </g>
                    );
                  })()}
                  <defs>
                    <linearGradient id="metal-bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-[10px] text-slate-400">
                  إجهاد الشد هـ = {(elasticForce / 100).toFixed(1)} نيوتن/ملم² | معامل مرونة ي = {elasticMaterial === "steel" ? "200" : elasticMaterial === "copper" ? "110" : "70"} GPa
                </div>
              </div>
            )}

            {/* 21. fluid-mechanics-viscosity SIMULATION */}
            {selectedLessonId === "fluid-mechanics-viscosity" && (
              <svg viewBox="0 0 200 140" className="w-48 h-auto">
                {/* Measuring cylinder */}
                <rect x="70" y="10" width="60" height="110" fill="none" stroke="currentColor" strokeWidth="2.5" />
                {/* Fluid filling */}
                <rect x="72" y="25" width="56" height="94" fill={viscosityFluid === "water" ? "rgba(56,189,248,0.15)" : viscosityFluid === "oil" ? "rgba(234,179,8,0.25)" : "rgba(180,83,9,0.35)"} />

                {/* Ball */}
                <circle cx="100" cy={fluidBallY} r="8" fill="#cbd5e1" stroke="currentColor" />
              </svg>
            )}

            {/* 22. environmental-pollution SIMULATION */}
            {selectedLessonId === "environmental-pollution" && (
              <svg viewBox="0 0 240 140" className="w-60 h-auto">
                {/* Factory with smokestack */}
                <rect x="20" y="80" width="50" height="40" fill="#334155" />
                <rect x="30" y="40" width="12" height="40" fill="#475569" />
                
                {/* Smoke emissions */}
                <circle cx="36" cy="25" r={pollutionSlider * 0.2 + 5} fill="rgba(244,63,94,0.3)" className="animate-pulse" />

                {/* Forest trees withering if SOx is high */}
                <g transform="translate(140, 75)">
                  <polygon points="20,10 5,45 35,45" fill={pollutionSlider > 50 ? "#a16207" : "#16a34a"} />
                  <rect x="17" y="45" width="6" height="15" fill="#78350f" />
                </g>
                <text x="140" y="130" fill={pollutionSlider > 50 ? "#ef4444" : "#10b981"} className="text-[9px] font-bold">
                  {pollutionSlider > 50 ? "أمطار حمضية سامة! 🌧️" : "بيئة مائية وهوائية متزنة"}
                </text>
              </svg>
            )}

          </div>

          {/* Visual Footer details */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>المنهج السوداني - معتمد للامتحانات الوزارية الشهادة الثانوية 🇸🇩</span>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 border border-emerald-500/20 rounded-full animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              <span>محاكاة مادية دقيقة</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
