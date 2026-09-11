import React, { useState } from "react";
import { Search, Book, Sparkles, RefreshCw, HelpCircle, GraduationCap } from "lucide-react";

export interface Term {
  id: string;
  wordAr: string;
  wordEn: string;
  definition: string;
  category: "drawing" | "mechanical" | "electrical" | "civil-env";
  categoryAr: string;
}

export const termsData: Term[] = [
  // ==========================================
  // الباب الأول: أساسيات الرسم الهندسي
  // ==========================================
  {
    id: "term-1",
    wordAr: "الإسقاط",
    wordEn: "Projection",
    definition: "وقوع حواف الجسم ونزولها في شكل خطوط مستقيمة لتلتقي مع مستوٍ معين لتكوين شكل هندسي يمثل ملامح الجسم على ورقة الرسم.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-2",
    wordAr: "الإسقاط المتعامد",
    wordEn: "Orthogonal Projection",
    definition: "طريقة لوصف الشكل الحقيقي للجسم بإسقاط أشعة عمودية من حواف الجسم على مستويات متعامدة على بعضها، حيث يظهر الضلع الموازي بطوله الحقيقي، والضلع العمودي كنقطة واحدة، والسطح العمودي كخط مستقيم.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-3",
    wordAr: "نظام الإسقاط بالزاوية الأولى",
    wordEn: "First Angle Projection",
    definition: "النظام العالمي المعتمد في المنهج السوداني، حيث يقع فيه المسقط الأفقي تحت المسقط الرأسي في لوحة الرسم، ويقع المسقط الجانبي الأيسر على يمين المسقط الرأسي.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-4",
    wordAr: "نظام الإسقاط بالزاوية الثالثة",
    wordEn: "Third Angle Projection",
    definition: "نظام إسقاط يقع فيه المسقط الأفقي فوق المسقط الرأسي، بينما يقع المسقط الجانبي الأيسر على يسار المسقط الرأسي في اللوحة.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-5",
    wordAr: "المنظور الأيزومتري",
    wordEn: "Isometric Projection",
    definition: "رسم مجسم يميل فيه المحوران الجانبيان بزاوية 30 درجة على الأفقي، مع بقاء الخطوط الرأسية قائمة، وتشكل نقطة التقاء المحورين زاوية منفرجة 120 درجة وتؤخذ عليه القياسات بأطوالها الحقيقية.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-6",
    wordAr: "المنظور المائل (الكافاليير)",
    wordEn: "Oblique Projection",
    definition: "رسم مجسم يظهر فيه الوجه الأمامي بأبعاده وزواياه الحقيقية القائمة، بينما تميل خطوط العمق بزاوية 45 درجة على الأفقي، ويضرب مقاس العمق في النصف (0.5) لتجنب التشويه البصري.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-7",
    wordAr: "الرسم الكروكي (التكريك)",
    wordEn: "Freehand Sketching",
    definition: "الرسم باليد الحرة دون استخدام الأدوات الهندسية (المساطر والفرجار) لنقل الأفكار التصميمية بسرعة، مع رسم الخطوط الأفقية من اليسار لليمين والعمودية من أعلى لأسفل.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-8",
    wordAr: "خط البعد",
    wordEn: "Dimension Line",
    definition: "خط رفيع متصل ينتهي طرفاه بأسهم، ويوضع على مسافة لا تقل عن 8 إلى 10 مم من حافة الجسم، ويكتب المقاس الرقمي فوق منتصفه بالمليمتر.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-9",
    wordAr: "خطوط المساعدة والإرشاد",
    wordEn: "Extension Lines",
    definition: "خطوط رفيعة تمتد من أطراف الشكل خارج حدوده لتحدد بداية ونهاية خط البعد، وتبتعد عن جسم الرسم مسافة 1 إلى 2 مم لتجنب التلامس.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },

  // ==========================================
  // الباب الثاني: أساسيات الهندسة الميكانيكية
  // ==========================================
  {
    id: "term-10",
    wordAr: "الفلزات الحديدية",
    wordEn: "Ferrous Metals",
    definition: "المعادن التي تحتوي على عنصر الحديد في بنيتها البلورية، وتتميز بصلادتها العالية وقابليتها للتمغنط وجذب المغناطيس، مثل حديد الزهر والصلب.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-11",
    wordAr: "الفلزات اللاحديدية",
    wordEn: "Non-Ferrous Metals",
    definition: "المعادن الخالية من عنصر الحديد في بنيتها، ولا تنجذب للمغناطيس وتمتاز بمقاومة الصدأ، مثل النحاس، الألومنيوم، الخارصين، الرصاص والقصدير.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-12",
    wordAr: "الفرن اللافح (العالي)",
    wordEn: "Blast Furnace",
    definition: "فرن مخروطي ضخم مبني من الطوب الحراري ومغلف بالصاج، يشحن بخام الهيماتيت وفحم الكوك والحجر الجيري لإنتاج حديد زهر التماسيح والخبث عند 1300° مئوية.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-13",
    wordAr: "حديد زهر التماسيح (الغفل)",
    wordEn: "Pig Iron",
    definition: "المنتج الأولي المستخلص مباشرة من أسفل الفرن اللافح، ويحتوي على نسبة كربون عالية وشوائب تجعله قصفاً وهشاً وغير قابل للتشكيل المباشر.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-14",
    wordAr: "دست الصهر (الكيوبولا)",
    wordEn: "Cupola Furnace",
    definition: "فرن أسطواني يستخدم لإعادة صهر حديد التماسيح مع الخردة وفحم الكوك لإنتاج حديد الزهر المسبوك بشتى أنواعه في المسابك الصناعية.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-15",
    wordAr: "حديد الزهر الرمادي",
    wordEn: "Gray Cast Iron",
    definition: "نوع ممتاز من حديد الزهر يحتوي على كربون حر في شكل رقائق جرافيت، يمتاز بقدرة فائقة على امتصاص الاهتزازات وتحمل الضغط وسهولة التشغيل، ويستخدم لكتل المحركات وقواعد الآلات.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-16",
    wordAr: "الصلب الكربوني",
    wordEn: "Carbon Steel",
    definition: "سبيكة من الحديد والكربون تقل فيها نسبة الكربون عن 1.8%، وتنقسم إلى صلب منخفض الكربون (للمنشآت والتسليح)، ومتوسط (للمحاور والمطارق)، وعالي (لأدوات القطع والمبارد).",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-17",
    wordAr: "عملية الدرفلة",
    wordEn: "Rolling Process",
    definition: "تشكيل الكتل المعدنية بالضغط وتمريرها بين درافيل دوارة متعاكسة، وتجرى على الساخن (1300°م) للمقاطع الكبيرة، أو على البارد للحصول على رقائق صاج ناعمة ذات دقة عالية.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-18",
    wordAr: "النحاس الأصفر (البرنج)",
    wordEn: "Brass",
    definition: "سبيكة تتكون من النحاس الأحمر (70%) والخارصين (30%)، تتميز بالمرونة وقابلية التشكيل والبريق وتستخدم في الصنابير ومقابض الأبواب والزخارف.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-19",
    wordAr: "سبيكة البرنز",
    wordEn: "Bronze",
    definition: "سبيكة تتكون من النحاس مضافاً إليه القصدير أو النيكل أو الألومنيوم، وتتميز بمقاومة الاحتكاك والتآكل الشديدين وتستخدم للأجراس وتروس السفن والبرنز الفسفوري.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-20",
    wordAr: "السبيكة البيضاء (البابيت)",
    wordEn: "White Metal (Babbitt)",
    definition: "سبيكة من القصدير والنحاس والأنتيمونيا والرصاص، ناعمة الملمس وتستخدم لتبطين كراسي المحاور (البلي) لتقليل الاحتكاك مع أعمدة الدوران الفولاذية.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-21",
    wordAr: "دورة أوتو الرباعية",
    wordEn: "Four-Stroke Otto Cycle",
    definition: "دورة المحرك الحراري التي تتم في 4 أشواط للمكبس ودورتين لعمود المرفق: شوط السحب، شوط الضغط، شوط القدرة (الاشتعال الفعال بضغط 42 كجم/سم²)، وشوط طرد العادم.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-22",
    wordAr: "المغذي (الكاربريتر)",
    wordEn: "Carburetor",
    definition: "جهاز في مجموعة الوقود يخلط البنزين برذاذ الهواء بنسبة دقيقة قدرها 1 : 15 بالوزن لإرسال الشحنة المتجانسة لأسطوانات المحرك.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },

  // ==========================================
  // الباب الثالث: أساسيات الهندسة الكهربائية
  // ==========================================
  {
    id: "term-23",
    wordAr: "قانون كولوم",
    wordEn: "Coulomb's Law",
    definition: "القوة الميكانيكية المتبادلة بين شحنتين كهربائيتين تتناسب طردياً مع حاصل ضرب الشحنتين وعكسياً مع مربع المسافة الفاصلة بينهما: ق = (ش١ × ش٢) / (٤ × π × ε × ف²).",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-24",
    wordAr: "المواصلة الكهربائية",
    wordEn: "Conductance",
    definition: "مقياس قدرة المادة على توصيل التيار الكهربائي وتساوي مقلوب المقاومة (ص = ١ / م)، وتقاس بوحدة السيمنز (Siemens - S).",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-25",
    wordAr: "المكثف الكهربائي",
    wordEn: "Capacitor",
    definition: "عنصر كهربائي يخزن الطاقة والشحنات في مجال كهربائي، ويتكون من لوحين موصلين متوازيين تفصلهما مادة عازلة.",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-26",
    wordAr: "سعة المكثف والفاراد",
    wordEn: "Capacitance & Farad",
    definition: "النسبة بين الشحنة المخزنة وفرق الجهد (س = ش / جـ)، والفاراد هو سعة المكثف الذي يخزن كولوم واحد عند فرق جهد واحد فولت.",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-27",
    wordAr: "قانون الحث لفارادي",
    wordEn: "Faraday's Law of Induction",
    definition: "تتولد قوة دافعة كهربائية حثية في أي ملف سلكي عند تغير الفيض المغناطيسي المار خلاله، ويتناسب مقدارها طردياً مع معدل التغير في الفيض.",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-28",
    wordAr: "الممانعة المغناطيسية",
    wordEn: "Magnetic Reluctance",
    definition: "مقاومة الدائرة المغناطيسية لمرور خطوط الفيض المغناطيسي وتساوي: م_م = ف / (μ × ح)، وتقاس بوحدة أمبير-لفة / ويبر.",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-29",
    wordAr: "الحث الذاتي وقانون لينز",
    wordEn: "Self-Inductance & Lenz's Law",
    definition: "تولد قوة دافعة كهربائية حثية معارضة في الملف نفسه عند تغير التيار المار فيه، وتقاس المحاثة (ل) بوحدة الهنري (Henry - H).",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },
  {
    id: "term-30",
    wordAr: "التشويب البلوري (Doping)",
    wordEn: "Semiconductor Doping",
    definition: "إضافة ذرات شوائب ضئيلة لبلورة شبه الموصل النقية (السيليكون)، لإنتاج بلورة سالبة n-type بشوائب خماسية التكافؤ (كالزرنيخ) أو بلورة موجبة p-type بشوائب ثلاثية (كالبورون).",
    category: "electrical",
    categoryAr: "الباب الثالث: الهندسة الكهربائية",
  },

  // ==========================================
  // الباب الرابع: أساسيات الهندسة المدنية والبيئة
  // ==========================================
  {
    id: "term-31",
    wordAr: "المنشأة الهندسية",
    wordEn: "Engineering Structure",
    definition: "جسم هندسي مصمم لمقاومة الأحمال المؤثرة عليه دون حدوث تشوهات ضارة ونقلها بأمان عبر الركائز إلى أساسات الأرض.",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-32",
    wordAr: "الجملونات الإنشائية",
    wordEn: "Trusses",
    definition: "هياكل مثلثية مؤلفة من عناصر مستقيمة متصلة عند العقد لحمل أسقف المباني وبحور الجسور الطويلة، وتنقل الأحمال في شكل قوى شد محورية (أزرق) أو ضغط (أحمر) فقط.",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-33",
    wordAr: "الركائز الإنشائية للعتبات",
    wordEn: "Structural Supports",
    definition: "وسائل تثبيت العتبات ونقل ردود الأفعال، وتشمل: الركيزة الدحروج (تقاوم قوة عمودية)، المفصلة (تقاوم قوتين عمودية وأفقية)، والتثبيت التام الكابولي (يقاوم القوى الرأسية والأفقية وعزم الانحناء).",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-34",
    wordAr: "الأساسات السطحية والعميقة",
    wordEn: "Shallow & Deep Foundations",
    definition: "الأساسات السطحية (القواعد المنفصلة والشريطية واللبشة) تستخدم في التربة القوية القريبة، بينما العميقة (الخوازيق والدعائم) تستخدم لاختراق التربة الضعيفة ونقل الأحمال للصخور العميقة.",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-35",
    wordAr: "الإجهاد والانفعال وقانون هوك",
    wordEn: "Stress, Strain & Hooke's Law",
    definition: "الإجهاد هو القوة مقسومة على المساحة (هـ = ق / م)، والانفعال هو التغير في الطول مقسوماً على الطول الأصلي (ع = Δل / ل)، وقانون هوك يثبت ثبات النسبة ي = هـ / ع ضمن حدود المرونة.",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-36",
    wordAr: "لزوجة الموائع وقانون نيوتن",
    wordEn: "Fluid Viscosity & Newton's Law",
    definition: "مقاومة المائع للجريان والقص الداخلي، وقانون نيوتن للزوجة يربط القوة بمساحة اللوح وتدرج السرعة: ق = لز × م × (ع / ص)، وتقاس اللزوجة الديناميكية بنيوتن.ثانية/م².",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-37",
    wordAr: "الأمطار الحمضية",
    wordEn: "Acid Rains",
    definition: "أمطار تتكون عند تفاعل أكاسيد الكبريت SOx وأكاسيد النيتروجين NOx المنبعثة من المصانع والعوادم مع رطوبة الجو، وتسبب تآكل المباني وتلف المحاصيل وهلاك الكائنات المائية.",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
  {
    id: "term-38",
    wordAr: "تصنيف أمراض المياه البيئية",
    wordEn: "Water-Related Diseases Classification",
    definition: "أربعة أصناف معتمدة: منقولة بالماء (كالكوليرا والتيفود بابتلاع الجرثومة)، عدم النظافة (كالرمد والجرب لنقص ماء الغسيل)، تلامسية (كالبلهارسيا باختراق الجلد)، ونواقل الجراثيم (كالملاريا لنواقل الحشرات المائية).",
    category: "civil-env",
    categoryAr: "الباب الرابع: الهندسة المدنية والبيئة",
  },
];

interface TermsSectionProps {
  onAskAi: (topic: string) => void;
  lang?: "ar" | "en";
}

export default function TermsSection({ onAskAi }: TermsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"glossary" | "flashcards">("glossary");

  // Filter logic
  const filteredTerms = termsData.filter((term) => {
    const matchesSearch =
      term.wordAr.includes(searchQuery) ||
      term.wordAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.wordEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.includes(searchQuery);
    
    const matchesCategory = activeCategory === "all" || term.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "جميع الأبواب الأربعة" },
    { id: "drawing", label: "الباب الأول: الرسم الهندسي" },
    { id: "mechanical", label: "الباب الثاني: الهندسة الميكانيكية" },
    { id: "electrical", label: "الباب الثالث: الهندسة الكهربائية" },
    { id: "civil-env", label: "الباب الرابع: الهندسة المدنية والبيئة" },
  ];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % (filteredTerms.length || 1));
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev - 1 + filteredTerms.length) % (filteredTerms.length || 1));
    }, 150);
  };

  const handleRandomCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredTerms.length);
      setFlashcardIndex(randomIndex);
    }, 150);
  };

  return (
    <div className="space-y-6" id="terms-section-root">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            <span>معجم المصطلحات والتعريفات الهندسية</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            قاموس مصطلحات تفاعلي وبطاقات استذكار ذكية لتسهيل حفظ القوانين والمفاهيم لطلاب الشهادة السودانية.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-stretch md:self-auto justify-center">
          <button
            onClick={() => { setViewMode("glossary"); setIsFlipped(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === "glossary"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            مسرد القاموس الكامل
          </button>
          <button
            onClick={() => { setViewMode("flashcards"); setIsFlipped(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === "flashcards"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            بطاقات الاستذكار الذكية (فلاش كارد)
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      {viewMode === "glossary" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Right Filters sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 h-fit space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-2">
              تصفية حسب الباب
            </h4>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setFlashcardIndex(0);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold text-right transition shrink-0 ${
                    activeCategory === cat.id
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick stats */}
            <div className="border-t border-slate-100 pt-3 hidden lg:block">
              <span className="text-[10px] font-bold text-slate-400 block">إحصاءات المصطلحات</span>
              <span className="text-xs text-slate-600 mt-1 block">
                عدد المصطلحات المعروضة: <strong className="text-indigo-600 font-mono text-sm">{filteredTerms.length}</strong> مصطلح
              </span>
            </div>
          </div>

          {/* Left search & vocabulary list */}
          <div className="lg:col-span-9 space-y-5">
            {/* Search Input bar */}
            <div className="relative bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center">
              <span className="pr-3 text-slate-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="ابحث عن أي مصطلح باللغة العربية أو الإنجليزية أو بالتعريف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-right pr-2 pl-4 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs transition"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Vocabulary Cards list */}
            {filteredTerms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms.map((term) => (
                  <div
                    key={term.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header Row of individual term */}
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                            {term.categoryAr.split(":")[0]}
                          </span>
                          <h4 className="text-lg font-black text-slate-800 mt-1 flex items-center gap-1.5">
                            <span>{term.wordAr}</span>
                          </h4>
                          <span className="text-xs font-mono text-slate-400 font-semibold block uppercase">
                            {term.wordEn}
                          </span>
                        </div>
                      </div>

                      {/* Main Definition Body */}
                      <p className="text-slate-600 text-xs leading-relaxed mt-3 border-t border-slate-50 pt-3">
                        {term.definition}
                      </p>
                    </div>

                    {/* Quick helper footer to ask AI */}
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => onAskAi(`اشرح لي بالتفصيل وبلحن وبأمثلة عملية مصطلح: ${term.wordAr} (${term.wordEn}) وكيف يأتي سؤاله بالشهادة السودانية.`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition active:scale-95"
                        title="اسأل المعلم الذكي عن هذا المصطلح"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>اسأل المعلم الذكي ✦</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
                <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">لا توجد مصطلحات مطابقة للبحث</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  حاول تغيير كلمة البحث أو اختيار باب آخر من القائمة لتصفية المصطلحات المتاحة.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* FLASHCARDS INTERACTIVE MODE */
        <div className="max-w-2xl mx-auto space-y-6" id="flashcard-container">
          {filteredTerms.length > 0 ? (
            <>
              {/* Progress counter */}
              <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                <span>تصفية: <strong>{categories.find(c => c.id === activeCategory)?.label}</strong></span>
                <span>البطاقة <strong className="font-mono text-indigo-600 text-sm">{flashcardIndex + 1}</strong> من أصل <strong className="font-mono text-sm">{filteredTerms.length}</strong></span>
              </div>

              {/* The Actual Flips Card component */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`cursor-pointer h-72 md:h-80 w-full relative perspective-1000 transition-all duration-500 transform-style-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side */}
                <div className={`absolute inset-0 bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md transition-all duration-300 backface-hidden ${
                  isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                      {filteredTerms[flashcardIndex]?.categoryAr}
                    </span>
                    <span className="text-xs text-slate-400 block pt-1">ما هو تعريف المصطلح التالي؟</span>
                  </div>

                  <div className="text-center py-6">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                      {filteredTerms[flashcardIndex]?.wordAr}
                    </h3>
                    <p className="text-sm font-mono text-indigo-500 uppercase tracking-wide font-bold mt-1">
                      {filteredTerms[flashcardIndex]?.wordEn}
                    </p>
                  </div>

                  <div className="text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5 animate-pulse">
                    <RefreshCw className="h-4 w-4" />
                    <span>انقر لقلب البطاقة ومعرفة الإجابة والتفسير</span>
                  </div>
                </div>

                {/* Back Side */}
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-700 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md transition-all duration-300 backface-hidden rotate-y-180 ${
                  isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
                }`}>
                  <div>
                    <span className="text-[10px] font-black text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full inline-block">
                      {filteredTerms[flashcardIndex]?.categoryAr}
                    </span>
                    <h4 className="text-lg font-bold text-indigo-200 mt-2">
                      {filteredTerms[flashcardIndex]?.wordAr}
                    </h4>
                  </div>

                  <div className="py-4 text-right">
                    <p className="text-xs md:text-sm text-indigo-100 leading-relaxed font-medium">
                      {filteredTerms[flashcardIndex]?.definition}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAi(`اشرح لي بالتفصيل الممتع مصطلح: ${filteredTerms[flashcardIndex]?.wordAr}`);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                      <span>شرح أعمق بالذكاء الاصطناعي</span>
                    </button>
                    <span className="text-[10px] text-slate-400">انقر مرة أخرى للعودة للمصطلح</span>
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={handlePrevCard}
                  className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition active:scale-95 text-center shadow-sm"
                >
                  السابق ◀
                </button>
                <button
                  onClick={handleRandomCard}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl text-xs transition active:scale-95 text-center"
                  title="بطاقة عشوائية"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextCard}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition active:scale-95 text-center shadow-sm"
                >
                  التالي ▶
                </button>
              </div>

              {/* Hotkey Hint */}
              <p className="text-[10px] text-slate-400 text-center">
                تصفية البطاقات حسب الباب الذي تريده من تبويب مسرد القاموس باليمين!
              </p>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-700">لا توجد مصطلحات في هذا الباب</h4>
              <p className="text-xs text-slate-400">يرجى تبديل الباب أو تنظيف شريط البحث.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
