import React, { useState, useEffect, useRef } from "react";
import { Activity, Compass, Zap, HelpCircle, RefreshCw, Play, Pause, ChevronLeft, Award, Flame, Droplet, Layers, HelpCircle as Info, CheckCircle2, RotateCcw, Sparkles, BookOpen } from "lucide-react";
import { EngineeringBlueprintModal } from "./EngineeringBlueprintModal";
import { CAR_SYSTEMS_DATA } from "./CarSystemsDiagramViewer";
import { LabCanvas3D } from "./lab3d/LabCanvas3D";

interface LabSectionProps {
  activeLab?: string; // Can be a lab ID or lesson ID
  setActiveLab?: (lab: any) => void;
  lang?: "ar" | "en";
  onAskAi?: (topic: string) => void;
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

export default function LabSection({ 
  activeLab: propActiveLab, 
  setActiveLab: propSetActiveLab,
  lang = "ar",
  onAskAi
}: LabSectionProps) {
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
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(true);

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
      {/* 🇸🇩 بنر معمل نقلة الهندسي الافتراضي المعتمد */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl border border-emerald-500/30"
        style={{ background: "linear-gradient(135deg, #064E3B 0%, #065f46 45%, #0f172a 100%)" }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-bold text-emerald-200 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>🇸🇩 منظومة المناهج السودانية التفاعلية | منصة نقلة</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>معمل نقلة الهندسي الافتراضي</span>
              <span className="text-emerald-400">🔬</span>
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              بيئة محاكاة رقمية وتجارب عملية تفاعلية (٢٢ محاكاة حية) مصممة ومطابقة تماماً لكتاب العلوم الهندسية للصف الثاني الثانوي بمركز بخت الرضا.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <div className="px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-emerald-200 block font-medium">إجمالي التجارب المعملية</span>
              <span className="text-base font-black text-white font-mono">٢٢ محاكاة معملية</span>
            </div>
            <div className="px-3.5 py-2 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30 text-center">
              <span className="text-[10px] text-emerald-300 block font-medium">حالة المعمل الرقمي</span>
              <span className="text-xs font-bold text-emerald-200 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                جاهز للتجربة الحية ⚡
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Main Chapters Categories Switcher (Naqla Bento Tabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" id="lab-chapters-switcher">
        {[
          { id: "projection", name: "الباب الأول: الرسم الهندسي", sub: "٦ تجارب محاكاة", icon: Compass, accent: "emerald" },
          { id: "engine", name: "الباب الثاني: الميكانيكا", sub: "٦ تجارب محاكاة", icon: RefreshCw, accent: "emerald" },
          { id: "capacitor", name: "الباب الثالث: الكهرباء والإلكترونيات", sub: "٥ تجارب محاكاة", icon: Zap, accent: "emerald" },
          { id: "elasticity", name: "الباب الرابع: المدنية والبيئة", sub: "٥ تجارب محاكاة", icon: Activity, accent: "emerald" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id as any)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border-emerald-500 shadow-lg ring-2 ring-emerald-500/30 scale-102"
                  : "bg-white hover:bg-emerald-50/50 hover:border-emerald-300 border-slate-200 text-slate-700 shadow-2xs"
              }`}
            >
              <div className={`p-2.5 rounded-xl mb-2 transition-all ${
                isActive ? "bg-white/15 text-emerald-300" : "bg-slate-100 text-slate-700"
              }`}>
                <Icon className={`h-5 w-5 ${isActive && tab.id === "engine" ? "animate-spin-slow" : ""}`} />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-tight">{tab.name}</span>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? "text-emerald-200" : "text-slate-400"}`}>
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-navigator Horizontal List of Lessons for Active Chapter */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-xs" id="lab-lessons-nav">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>اختر الدرس لإجراء التجربة العملية الخاصة به ({lessonsInCat.length} تجارب متاحة لهذا الباب):</span>
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full hidden sm:inline-block">
            منهج بخت الرضا
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {lessonsInCat.map((lesson) => {
            const isSelected = selectedLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex-1 min-w-[140px] max-w-[260px] border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 ring-2 ring-emerald-400/20"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80"
                }`}
              >
                <div className="truncate flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                  <span className="truncate">{lesson.name}</span>
                </div>
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
        <div className="order-2 lg:order-1 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">بطاقة تحكّم التجربة</h3>
                  <p className="text-[10px] text-slate-500">عدّل المتغيرات الفيزيائية ولاحظ النتائج فوراً</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
                className="lg:hidden text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition active:scale-95"
              >
                {isMobileControlsOpen ? "تصغير ▴" : "توسيع المتحكمات ▾"}
              </button>
            </div>

            {/* Dynamic Controls Body (collapsible on mobile) */}
            <div className={`${isMobileControlsOpen ? "block" : "hidden lg:block"} space-y-4 text-xs`}>

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
        <div className="order-1 lg:order-2 lg:col-span-8 bg-slate-950 border-2 border-emerald-950/80 rounded-3xl p-4 sm:p-7 min-h-[440px] flex flex-col justify-between relative overflow-hidden text-slate-300 shadow-xl">
          
          {/* Subtle blueprint grid background overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* Visual Header */}
          <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>شاشة المحاكاة التفاعلية الحية</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    NAQLA-LAB v2.5
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  {lessonsInCat.find((l) => l.id === selectedLessonId)?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-900 border border-slate-700/60 text-emerald-300 px-2.5 py-1 rounded-lg font-mono">
                {selectedLessonId}
              </span>
            </div>
          </div>

          {/* Mobile Touch Guidance Banner */}
          <div className="lg:hidden w-full flex items-center justify-between py-1.5 px-3 bg-emerald-950/70 border border-emerald-500/30 rounded-xl text-[10px] text-emerald-300 my-2">
            <span>👆 تفاعل باللمس: المس وحرك للتفاعل الحي والمباشر</span>
            <span className="font-mono font-bold text-emerald-400">3D/2D LAB</span>
          </div>

          {/* DYNAMIC 3D WEBGL CANVAS CORE */}
          <div className="flex-1 w-full my-3">
            <LabCanvas3D
              lessonId={selectedLessonId}
              params={{
                // Ch 1
                projBeamActive,
                orthoAngle,
                projectionAngle,
                isometricStyle,
                dimDistance,

                // Ch 2
                metalType: metalSelected,
                metalTestType,
                furnaceTemp,
                furnaceCoke,
                furnaceLimestone,
                furnaceRunning,
                furnaceTapped,
                rollingTemp: rollingTemp === 'hot' ? 1150 : 300,
                rollingPasses: Math.max(1, Math.round((20 - rollerGap) / 3)),
                alloyMixCopper,
                alloyMixZinc: alloyMixOther,
                alloyMixTin: alloyMixOther,
                enginePlaying,
                engineStroke,
                activeCarSystem,
                carburetorRatio,

                // Ch 3
                coulombQ1,
                coulombQ2,
                coulombDist,
                dielectric,
                plateDist,
                voltage,
                plateArea,
                magnetPos: inductionMagnetX,
                magnetOscillating: false,
                coilTurns: 20,
                switchClosed: !selfIndSwitchOpen,
                inductanceL: selfIndLValue,
                dopingType:
                  semiconductorDopeType === 'pure'
                    ? 'intrinsic'
                    : semiconductorDopeType === 'n'
                    ? 'n-type'
                    : 'p-type',

                // Ch 4
                trussLoad,
                trussType: 'warren',
                foundationType,
                buildingWeight,
                elasticForce,
                elasticMaterial,
                viscosityFluid,
                fluidBallY,
                fluidBallRolling,
                pollutionSlider,
                acidRainActive: pollutionSlider > 50,
              }}
            />
          </div>

          {/* Visual Footer details */}
          <div className="relative z-10 border-t border-slate-800/80 pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🇸🇩</span>
              <span className="font-bold text-slate-300">المنهج السوداني - معتمد لشهادة الثانوية العامة (بخت الرضا)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 border border-emerald-500/20 rounded-full font-bold">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>محاكاة علمية مطابقة لمعايير نقلة ⚡</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
