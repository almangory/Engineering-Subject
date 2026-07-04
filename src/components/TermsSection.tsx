import React, { useState } from "react";
import { Search, Book, Sparkles, RefreshCw, HelpCircle, GraduationCap } from "lucide-react";

export interface Term {
  id: string;
  wordAr: string;
  wordEn: string;
  definition: string;
  category: "drawing" | "mechanical" | "materials" | "electrical";
  categoryAr: string;
}

export const termsData: Term[] = [
  // الباب الأول
  {
    id: "term-1",
    wordAr: "الإسقاط",
    wordEn: "Projection",
    definition: "إسقاط أشعة من نقاط حواف الجسم لتلتقي مع مستوى معين لتكوين مسقط ثلاثي أو ثنائي الأبعاد يمثل ملامح الجسم على ورقة الرسم.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-2",
    wordAr: "الإسقاط المتعامد",
    wordEn: "Orthogonal Projection",
    definition: "وصف دقيق للشكل الفعلي ثلاثي الأبعاد للجسم من خلال إسقاط أشعة متعامدة من نقاط الجسم على ثلاثة مستويات رئيسية متعامدة متبادلة (رأسي، أفقي، جانبي).",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-3",
    wordAr: "المنظور الأيزومتري",
    wordEn: "Isometric Projection",
    definition: "رسم مجسم يميل فيه المحوران الجانبيان بزاوية 30 درجة على الأفقي، مع بقاء المحور الرأسي قائماً عمودياً، لتظهر أبعاد الطول والعرض والارتفاع بنسب بصرية متزنة.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-4",
    wordAr: "المنظور المائل",
    wordEn: "Oblique Projection",
    definition: "رسم مجسم يظهر فيه الوجه الأمامي بأبعاده وزواياه الحقيقية تماماً، بينما تميل الخطوط الجانبية (خطوط العمق) بزاوية 45 درجة على الأفقي، ويتم تقليص العمق لنصف قيمته تفادياً للتشويه البصري.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-5",
    wordAr: "الرسم الكروكي / التكريك",
    wordEn: "Freehand Sketching",
    definition: "الرسم باليد الحرة وبأقلام الرصاص فقط دون استخدام أدوات هندسية كالمساطر والفرجار، مع مراعاة النسب والأبعاد البصرية العامة للأشكال والمكعبات.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },
  {
    id: "term-6",
    wordAr: "خط البعد",
    wordEn: "Dimension Line",
    definition: "خط رفيع مستمر ينتهي برأسي سهمين ملامسين لخطوط المساعدة، ويكتب فوقه المقاس الهندسي الفعلي لوجه الجسم بالمليمترات.",
    category: "drawing",
    categoryAr: "الباب الأول: الرسم الهندسي",
  },

  // الباب الثاني
  {
    id: "term-7",
    wordAr: "الفلزات",
    wordEn: "Metals",
    definition: "عناصر صلبة متبلورة تتميز باللمعان والبريق المعدني، والقدرة العالية على توصيل الحرارة والكهرباء، وقابلية التشكيل بالسحب والضغط والطرق.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-8",
    wordAr: "الحديد الغفل / التماسيح",
    wordEn: "Pig Iron",
    definition: "الحديد الأولي المستخلص مباشرة من الفرن العالي (اللافح) مصهوراً، ويحتوي على شوائب كثيرة ونسبة عالية جداً من الكربون (أكثر من 4%) مما يجعله قصفاً للغاية.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-9",
    wordAr: "حديد الزهر",
    wordEn: "Cast Iron",
    definition: "سبيكة حديدية صلبة تحتوي على نسبة كربون تتراوح بين 2% و 4%. يتميز بصلابة عالية ومقاومة للصدأ وقدرة على امتصاص الاهتزازات، لكنه قصف لا يقبل الطرق والتصفيح.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-10",
    wordAr: "حديد الصلب / الفولاذ",
    wordEn: "Steel",
    definition: "سبيكة من الحديد منقى من الشوائب ومتحكم بنسبة الكربون فيها (أقل من 1.5%)، يتميز بمرونة عالية وقوة شد كبيرة وقابلية للتشكيل الميكانيكي بالطرق والدرفلة.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-11",
    wordAr: "محرك الاحتراق الداخلي",
    wordEn: "Internal Combustion Engine",
    definition: "آلة حرارية تحول طاقة الوقود الكيميائية الكامنة إلى طاقة ميكانيكية حركية نافعة، عن طريق حرق الوقود والهواء معاً في حيز مغلق يسمى أسطوانة الاحتراق.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-12",
    wordAr: "الشوط",
    wordEn: "Engine Stroke",
    definition: "المسافة الخطية التي يقطعها المكبس داخل أسطوانة المحرك عند حركته بين النقطة الميتة العليا (ن.م.ع) والنقطة الميتة السفلى (ن.م.س).",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-13",
    wordAr: "سبيكة البرنز",
    wordEn: "Bronze Alloy",
    definition: "مخلوط سبيكي يتكون أساساً من النحاس الأحمر مع القصدير بنسب محددة، ويتميز بمقاومة عالية جداً للتآكل والاحتكاك والشد.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },
  {
    id: "term-14",
    wordAr: "النحاس الأصفر",
    wordEn: "Brass",
    definition: "سبيكة تتألف من خلط النحاس الأحمر مع فلز الخارصين (الزنك)، وتتميز بقابليتها للتشكيل والبريق الجذاب وتستخدم كثيراً في صناعة الوصلات الميكانيكية والأنابيب.",
    category: "mechanical",
    categoryAr: "الباب الثاني: الهندسة الميكانيكية",
  },

  // الباب الثالث
  {
    id: "term-15",
    wordAr: "الإجهاد",
    wordEn: "Stress",
    definition: "القوة الداخلية المؤثرة عمودياً على وحدة المساحة من المقطع المستعرض للمادة المختبرة (الإجهاد = القوة / مساحة المقطع).",
    category: "materials",
    categoryAr: "الباب الثالث: هندسة المواد وتجربة الشد",
  },
  {
    id: "term-16",
    wordAr: "الانفعال",
    wordEn: "Strain",
    definition: "مقياس التغير أو الاستطالة النسبية الحاصلة في طول المادة بالنسبة لطولها الأصلي نتيجة تأثير إجهاد الشد الخارجي (الانفعال = التغير في الطول / الطول الأصلي).",
    category: "materials",
    categoryAr: "الباب الثالث: هندسة المواد وتجربة الشد",
  },
  {
    id: "term-17",
    wordAr: "معامل المرونة / معامل يونغ",
    wordEn: "Young's Modulus",
    definition: "النسبة الثابتة رياضياً بين الإجهاد والانفعال داخل حدود مرونة المادة، وهو مقياس فيزيائي لمدى صلابة المادة وقدرتها على مقاومة التشوه.",
    category: "materials",
    categoryAr: "الباب الثالث: هندسة المواد وتجربة الشد",
  },
  {
    id: "term-18",
    wordAr: "حد المرونة",
    wordEn: "Elastic Limit",
    definition: "أقصى إجهاد يمكن للمادة تحمله بحيث إذا زالت القوة المؤثرة، عادت المادة إلى شكلها وأبعادها الأصلية بالكامل دون تشوه دائم.",
    category: "materials",
    categoryAr: "الباب الثالث: هندسة المواد وتجربة الشد",
  },
  {
    id: "term-19",
    wordAr: "اللدونة",
    wordEn: "Plasticity",
    definition: "قدرة المادة على الاحتفاظ بالتشوه الدائم والاستطالة الثابتة الحاصلة لها بعد زوال القوة المسببة للشد دون حدوث كسر مفاجئ.",
    category: "materials",
    categoryAr: "الباب الثالث: هندسة المواد وتجربة الشد",
  },
  {
    id: "term-20",
    wordAr: "القصافة",
    wordEn: "Brittleness",
    definition: "خاصية المادة التي تنكسر مباشرة وتنهار فجأة بمجرد تحميلها أحمالاً تفوق قدرتها دون إبداء أي استطالة أو تحذير مرن (مثل الزجاج وحديد الزهر).",
    category: "materials",
    categoryAr: "الباب الثالث: هندسة المواد وتجربة الشد",
  },

  // الباب الرابع
  {
    id: "term-21",
    wordAr: "المكثف الكهربائي",
    wordEn: "Capacitor",
    definition: "جهاز لتخزين الطاقة الكهربائية والشحنات في مجال مستقطب، يتألف من لوحين متوازيين موصلين تفصل بينهما مادة عازلة كهربائياً.",
    category: "electrical",
    categoryAr: "الباب الرابع: الهندسة الكهربائية والمكثفات",
  },
  {
    id: "term-22",
    wordAr: "سعة المكثف",
    wordEn: "Capacitance",
    definition: "كمية الشحنة الكهربائية المختزنة على لوحي المكثف نسبةً لفرق الجهد المطبق بينهما (السعة = الشحنة / فرق الجهد)، وتقاس بالفاراد.",
    category: "electrical",
    categoryAr: "الباب الرابع: الهندسة الكهربائية والمكثفات",
  },
  {
    id: "term-23",
    wordAr: "المادة العازلة",
    wordEn: "Dielectric Material",
    definition: "مادة غير موصلة (مثل الميكا، السيراميك، الهواء، الورق) توضع في الفجوة بين لوحي المكثف، تعمل على زيادة ثبات الجهد وقدرة المكثف الاستيعابية للشحنات.",
    category: "electrical",
    categoryAr: "الباب الرابع: الهندسة الكهربائية والمكثفات",
  },
  {
    id: "term-24",
    wordAr: "الفاراد",
    wordEn: "Farad",
    definition: "الوحدة الدولية لقياس سعة المكثف الكهربائي، وتعبر عن سعة المكثف الذي يخزن شحنة قدرها كولوم واحد عند تطبيق فرق جهد مقداره فولت واحد.",
    category: "electrical",
    categoryAr: "الباب الرابع: الهندسة الكهربائية والمكثفات",
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
    { id: "all", label: "جميع الأبواب" },
    { id: "drawing", label: "الرسم الهندسي" },
    { id: "mechanical", label: "الهندسة الميكانيكية" },
    { id: "materials", label: "هندسة المواد" },
    { id: "electrical", label: "الهندسة الكهربائية" },
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
