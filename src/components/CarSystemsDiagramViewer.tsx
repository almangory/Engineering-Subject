import React, { useState } from "react";
import { 
  Fuel, 
  Snowflake, 
  Droplet, 
  Zap, 
  Maximize2, 
  X, 
  Layers, 
  Cpu, 
  AlertCircle,
  Sparkles,
  Search,
  BookOpen
} from "lucide-react";

export type CarSystemKey = "fuel" | "cooling" | "lube" | "ignition";

interface SystemData {
  key: CarSystemKey;
  name: string;
  shortName: string;
  icon: any;
  color: string;
  badgeBg: string;
  borderColor: string;
  imageSrc: string;
  title: string;
  primaryRole: string;
  curriculumFact: string;
  examQuestion: string;
  parts: { name: string; desc: string; highlight?: boolean }[];
}

export const CAR_SYSTEMS_DATA: Record<CarSystemKey, SystemData> = {
  fuel: {
    key: "fuel",
    name: "نظام الوقود والمغذي (الكربوريتر)",
    shortName: "مجموعة الوقود",
    icon: Fuel,
    color: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    borderColor: "border-amber-500",
    imageSrc: "/images/curriculum/fuel_carburetor_system.jpg",
    title: "نظام الوقود في محرك كلاسيكي / المغذي (الكربوريتر)",
    primaryRole: "خلط البنزين مع الهواء بنسبة مثالية 1 : 15 بالوزن وتزويد الأسطوانات بالخليط المناسب لجميع سرعات المحرك.",
    curriculumFact: "نسبة خلط الكاربريتر القياسية للدوران البطيء (Idling) هي 1 وقود : 15 هواء بالوزن. النسبة الأقل من 15 تسمى خليطاً غنياً (Rich)، والأعلى خليطاً فقيراً (Lean).",
    examQuestion: "ما هي النسبة المثالية لخلط الوقود بالهواء وزناً في المغذي؟ الإجابة: 1 : 15 وزناً.",
    parts: [
      { name: "أنبوبة فنتوري (Venturi Tube)", desc: "عنق تضييق يرفع سرعة الهواء ويخفض الضغط وفق مبدأ برنولي ليسحب رذاذ البنزين.", highlight: true },
      { name: "الفونية الرئيسية (Main Jet)", desc: "فتحة دقيقة لمعايرة كمية الوقود المنساب إلى تيار الهواء في عنق فنتوري.", highlight: true },
      { name: "غرفة العوامة (Float Chamber)", desc: "مستودع وقود ذو منسوب ثابت يمنع فيضان البنزين قبل سحبه من الفونية." },
      { name: "العوامة وصمام الإبرة (Float & Needle)", desc: "تغلق فتحة دخول البنزين عند بلوغ المستوى المطلوب وتفتح عند انخفاضه." },
      { name: "صمام الخنق (Choke Valve)", desc: "صمام علوي يخنق تيار الهواء لتوفير خليط غني لتسهيل تشغيل المحرك على البارد.", highlight: true },
      { name: "صمام الفراشة (Throttle Valve)", desc: "صمام سفلي متصل بدواسة السائق للتحكم بكمية الشحنة الداخلة وسرعة المحرك." },
      { name: "مسمار خليط السرعة البطيئة (Idle Screw)", desc: "معايرة تدفق البنزين والهواء أثناء دوران المحرك بدون ضغط الدواسة." },
      { name: "مضخة ومرشح الوقود (Pump & Filter)", desc: "سحب البنزين من الخزان وتصفيته من الشوائب وضخه نحو المغذي." },
    ],
  },
  cooling: {
    key: "cooling",
    name: "نظام التبريد والمشع (الرديتر)",
    shortName: "مجموعة التبريد",
    icon: Snowflake,
    color: "text-sky-600",
    badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
    borderColor: "border-sky-500",
    imageSrc: "/images/curriculum/cooling_radiator_system.jpg",
    title: "نظام التبريد في محرك احتراق داخلي / المشع (الرديتر)",
    primaryRole: "المحافظة على درجة حرارة تشغيل مثالية للمحرك (190° - 230° فهرنهايت / 85° - 90°م) لمنع صهر وتلف أجزاء المحرك.",
    curriculumFact: "حرارة التشغيل القياسية للمحرك تبلغ (190-230°F). يعمل غطاء الرديتر المضغوط على رفع درجة غليان الماء فوق 100°م لمنع التبخر السريع.",
    examQuestion: "ما وظيفة المنظم الحراري (الثرموستات) في نظام التبريد؟ الإجابة: حجز ماء التبريد داخل المحرك حتى يسخن لدرجة التشغيل ثم السماح له بالمرور للمشع.",
    parts: [
      { name: "المشع (الرديتر Radiator)", desc: "خزان علوي وخزان سفلي وبينهما شبكة أنابيب وزعانف رقيقة لتبديد الحرارة للهواء.", highlight: true },
      { name: "غطاء المشع الضاغط (Pressure Cap)", desc: "مزود بصمام ضغط لرفع درجة غليان الماء فوق 100°م وصمام تفريغ لحماية الخراطيم.", highlight: true },
      { name: "المنظم الحراري (الثرموستات Thermostat)", desc: "صمام يفتح تلقائياً عند 85°-90°م لتوجيه الماء للرديتر، ويغلق على البارد عبر التحويلة.", highlight: true },
      { name: "مضخة المياه (Water Pump)", desc: "مضخة طرد مركزي تدور بقشاط المحرك لتدوير الماء قسرياً عبر قمصان الأسطوانات." },
      { name: "مروحة التبريد (Cooling Fan)", desc: "سحب تيار الهواء عبر زعانف الرديتر لتبريده عند توقف أو بطء السيارة." },
      { name: "قمصان التبريد (Water Jackets)", desc: "تجاويف مائية مصبوبة تحيط بالأسطوانات ورأس المحرك لامتصاص حرارة الاحتراق." },
      { name: "الخرطوم العلوي والسفلي", desc: "خراطيم مطاطية مرنة تنقل الماء الساخن للرديتر والماء المبرد للمحرك." },
    ],
  },
  lube: {
    key: "lube",
    name: "نظام تزييت المحرك (مسار الزيت)",
    shortName: "مجموعة التزييت",
    icon: Droplet,
    color: "text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderColor: "border-emerald-500",
    imageSrc: "/images/curriculum/lubrication_system.jpg",
    title: "نظام تزييت المحرك: مسار تدفق الزيت ومضخة التروس",
    primaryRole: "تقليل الاحتكاك والتآكل بين الأجزاء المعدنية المتحركة، وتبريد المحرك، وحمل برادة الحديد المتآكلة.",
    curriculumFact: "تستخدم معظم المحركات مضخة زيت ترسية موجبة الإزاحة، مزودة بصمام أمان (Pressure Relief Valve) لمنع انفجار الفلتر أو خراطيم الزيت عند ارتفاع الضغط.",
    examQuestion: "اذكر ثلاث فوائد لدورة التزييت في المحرك. الإجابة: تقليل الاحتكاك والتآكل، تبريد الأجزاء وحمل الحرارة، وتنظيف المحرك وحمل برادة المعادن وحبك الضغط.",
    parts: [
      { name: "وعاء الزيت (الكرتير Oil Pan)", desc: "حوض سفلي لتجميع زيت المحرك وتبريده وترسيب الرواسب الثقيلة.", highlight: true },
      { name: "مضخة الزيت الترسية (Gear Pump)", desc: "ترس قائد وترس منقاد يسحبان الزيت ويضغطانه نحو مجاري التزييت.", highlight: true },
      { name: "صمام تصريف الضغط الزائد (Relief Valve)", desc: "صمام ياي ومكبس يفتح عند ارتفاع الضغط ليعيد الزيت الفائض للكرتير.", highlight: true },
      { name: "مرشح الزيت (Oil Filter)", desc: "فلتر ورقي لاحتجاز برادة المعادن الدقيقة والكربون قبل وصول الزيت للمحاور." },
      { name: "مصفاة سحب الزيت (Pickup Strainer)", desc: "شبكة سلكية مغمورة في الزيت لمنع الشوائب الكبيرة من إعطاب المضخة." },
      { name: "قنوات الزيت الرئيسية (Main Galleries)", desc: "ممرات دقيقة داخل كتلة الأسطوانات تغذي كراسي الكرنك وعمود الكامات بالزيت." },
      { name: "سيخ فحص منسوب الزيت (Dipstick)", desc: "مؤشر معدني لمعايرة مستوى الزيت والتأكد من جودته ولزوجته." },
    ],
  },
  ignition: {
    key: "ignition",
    name: "نظام الاشتعال وموزع الشرر (الديلكو)",
    shortName: "مجموعة الاشتعال",
    icon: Zap,
    color: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    borderColor: "border-rose-500",
    imageSrc: "/images/curriculum/ignition_system.jpg",
    title: "نظام الاشتعال ذو الشرارة الموزعة (نظام الموزع - الديلكو)",
    primaryRole: "توليد شرارة كهربائية ذات جهد عالٍ جداً (15-30 ألف فولت) وتوزيعها على الشمعات في نهاية شوط الضغط.",
    curriculumFact: "ترتيب الاشتعال القياسي للمحرك رباعي الأسطوانات في المنهج السوداني هو: 1 - 3 - 4 - 2 لضمان توازن دوران عمود المرفق.",
    examQuestion: "ما هو ترتيب الاشتعال لمحرك رباعي الأسطوانات؟ الإجابة: ( 1 - 3 - 4 - 2 ).",
    parts: [
      { name: "البطارية ومفتاح التشغيل (12V)", desc: "مصدر التيار المستمر منخفض الجهد لبدء تفعيل الدائرة الكهربائية." },
      { name: "ملف الإشعال (البوبينة Coil)", desc: "محول يرفع الجهد من 12V إلى (15,000-30,000V) عبر حث الملف الابتدائي والثانوي.", highlight: true },
      { name: "موزع الشرر (الاسبراتير / Delco)", desc: "الجهاز المسؤول عن توقيت وتوزيع شرارة الجهد العالي لشمعات الأسطوانات.", highlight: true },
      { name: "قاطع الدائرة (البلاتين Breaker Points)", desc: "نقاط تلامس تفتح وتقطع تيار الابتدائي فجأة لتحفيز انهيار المجال المغناطيسي.", highlight: true },
      { name: "المكثف (Condenser)", desc: "يمتص الشحنة الارتدادية لمنع تفحم البلاتين بالشرارة ويسرع انهيار الفيض.", highlight: true },
      { name: "الشاكوش الدوار (Rotor Arm)", desc: "ذراع يدور داخل غطاء الموزع لتوجيه الجهد العالي لأسلاك الأسطوانات بالترتيب." },
      { name: "شمعات الاحتراق (Spark Plugs)", desc: "إحداث الشرارة الكهربائية عبر خلوص القطبين لإشعال الشحنة المضغوطة." },
      { name: "ترتيب الاشتعال: 1 - 3 - 4 - 2", desc: "التسلسل الدوري لإشعال الأسطوانات الأربع لتحقيق اتزان عزم الدوران.", highlight: true },
    ],
  },
};

export const CarSystemsDiagramViewer: React.FC<{
  initialSystem?: CarSystemKey;
  onAskAi?: (topic: string) => void;
  lang?: "ar" | "en";
}> = ({ initialSystem = "fuel", onAskAi, lang = "ar" }) => {
  const [activeSystem, setActiveSystem] = useState<CarSystemKey>(initialSystem);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const sys = CAR_SYSTEMS_DATA[activeSystem];

  return (
    <div className="w-full flex flex-col gap-4 text-right" dir="rtl">
      {/* Subsystem Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {(Object.keys(CAR_SYSTEMS_DATA) as CarSystemKey[]).map((key) => {
          const item = CAR_SYSTEMS_DATA[key];
          const Icon = item.icon;
          const isActive = activeSystem === key;

          return (
            <button
              key={key}
              onClick={() => {
                setActiveSystem(key);
                setSelectedPart(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? `bg-white text-slate-900 shadow border ${item.borderColor} ring-2 ring-indigo-500/10`
                  : "bg-transparent text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? item.color : "text-slate-400"}`} />
              <span className="truncate">{item.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Main Diagram Presentation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Card Header with Educational Fact */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${sys.badgeBg}`}>
                مخطط هندسي معتمد من كتاب الوزارة
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Unit 2 • Lesson 6</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{sys.name}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{sys.primaryRole}</p>
          </div>

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>تكبير المخطط بملء الشاشة 🔍</span>
          </button>
        </div>

        {/* Infographic Image & Breakdown Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Diagram Image Container */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner cursor-pointer hover:border-indigo-400 transition duration-300 flex items-center justify-center"
            >
              <img
                src={sys.imageSrc}
                alt={sys.title}
                className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex items-end justify-center p-4">
                <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-sm flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-indigo-400" />
                  انقر للتكبير التفاعلي وقراءة المسميات بالتفصيل
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-indigo-500" />
              <span>مخطط هندسي توضيحي مفصل لمسار ومكونات {sys.shortName} في منهج الشهادة السودانية</span>
            </p>
          </div>

          {/* Right / Interactive Components Breakdown */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-600" />
                أجزاء المنظومة وشرحها الهندسي:
              </span>
              <span className="text-[10px] text-slate-500 font-bold">{sys.parts.length} أجزاء رئيسية</span>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {sys.parts.map((p, idx) => {
                const isSelected = selectedPart === p.name;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPart(isSelected ? null : p.name)}
                    className={`p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-300 shadow-sm"
                        : p.highlight
                        ? "bg-amber-50/40 border-amber-200/80 hover:bg-amber-50"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-bold ${p.highlight ? "text-slate-900" : "text-slate-700"}`}>
                        {idx + 1}. {p.name}
                      </span>
                      {p.highlight && (
                        <span className="text-[9px] font-black text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded shrink-0">
                          هام بالامتحان
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Exam Tip Alert */}
            <div className="mt-2 p-3 bg-indigo-50/80 border border-indigo-200/70 rounded-xl flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[11px] leading-relaxed">
                <span className="font-bold text-indigo-900 block">سؤال امتحاني متكرر (بخت الرضا):</span>
                <p className="text-indigo-800">{sys.examQuestion}</p>
              </div>
            </div>

            {onAskAi && (
              <button
                onClick={() => onAskAi(`اشرح لي بالتفصيل أجزاء ومسار تدفق ${sys.name} حسب كتاب العلوم الهندسية للصف الثاني ثانوي.`)}
                className="mt-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95"
              >
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>اسأل ذكاء نقلة عن هذه المنظومة ✦</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / High-Resolution Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-xl bg-slate-800 ${sys.color}`}>
                  <sys.icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-base font-black">{sys.title}</h4>
                  <p className="text-xs text-slate-400">{sys.primaryRole}</p>
                </div>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950">
              <img
                src={sys.imageSrc}
                alt={sys.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>

            {/* Modal Footer with quick facts */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{sys.curriculumFact}</span>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
              >
                إغلاق العرض المكبر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PistonCutawayDiagramViewer: React.FC<{
  onAskAi?: (topic: string) => void;
  lang?: "ar" | "en";
}> = ({ onAskAi, lang = "ar" }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const parts = [
    { name: "تاج المكبس المقعر (Piston Crown)", desc: "سطح مقعر لزيادة اضطراب الخليط وضمان احتراق تام متجانس في شوط القدرة." },
    { name: "حلقات الضغط العلوية (Compression Rings)", desc: "حلقات في الحزوز العلوية لمنع تسرب غازات الضغط والاشتعال نحو الكرتير." },
    { name: "حلقة كشط الزيت بنابض ذهبي (Oil Scraper Ring)", desc: "مع مسارات تصريف دقيقة لكشط الزيت الزائد ومنع حرقه في غرفة الاحتراق." },
    { name: "مسمار المكبس الأسطواني المجوف (Gudgeon Pin)", desc: "معدن فولاذي مقوى ومجوف لتخفيف وزنه وتثبيت ذراع التوصيل بالمكبس." },
    { name: "ذراع التوصيل بشكل حرف I (I-Beam Connecting Rod)", desc: "مقطع هندسي يقاوم إجهادات الانحناء الميكانيكية العالية وينقل قوة الاحتراق للكرنك." },
    { name: "عمود المرفق وثقالات الاتزان (Crankshaft & Counterweights)", desc: "تحويل الحركة الخطية الترددية لحركة دورانية مع كبح الاهتزازات." },
  ];

  return (
    <div className="w-full flex flex-col gap-4 text-right" dir="rtl">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                تشريح هندسي قطاعي (Quarter-Cutaway)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Unit 2 • Lesson 5</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              التشريح الهندسي للمكبس الحقيقي وذراع التوصيل وعمود المرفق
            </h3>
            <p className="text-xs text-slate-600">
              النموذج الواقعي للأجزاء الميكانيكية المتحركة داخل محرك الاحتراق الداخلي رباعي الأشواط
            </p>
          </div>

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>تكبير التشريح 🔍</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner cursor-pointer hover:border-indigo-400 transition duration-300 flex items-center justify-center"
            >
              <img
                src="/images/curriculum/piston_conrod_cutaway.jpg"
                alt="تشريح المكبس الحقيقي"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex items-end justify-center p-4">
                <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-sm flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-indigo-400" />
                  انقر للتكبير وتأمل تفاصيل قطاع المكبس وحلقاته
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-indigo-500" />
              <span>قطاع هندسي ميكانيكي يبين التاج المقعر، وحلقات الضغط والكشط، وبنز المكبس، وذراع التوصيل</span>
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Layers className="h-4 w-4 text-indigo-600" />
              التفاصيل التشريحية للمكبس في المنهج:
            </span>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {parts.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <span className="font-bold text-slate-900 block">{idx + 1}. {p.name}</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {onAskAi && (
              <button
                onClick={() => onAskAi("اشرح لي مكونات المكبس وذراع التوصيل ووظيفة كل حلقة من حلقات المكبس في محرك الاحتراق الداخلي.")}
                className="mt-2 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95"
              >
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>اسأل ذكاء نقلة عن تشريح المكبس ✦</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h4 className="text-base font-black">تشريح المكبس الحقيقي وذراع التوصيل وعمود المرفق</h4>
                <p className="text-xs text-slate-400">قطاع هندسي ميكانيكي عالي الدقة</p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950">
              <img
                src="/images/curriculum/piston_conrod_cutaway.jpg"
                alt="تشريح المكبس الحقيقي"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>لاحظ حلقات الضغط العلوية وحلقة كشط الزيت مع نابض التمدد الذهبي وثقوب تصريف الزيت.</span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
