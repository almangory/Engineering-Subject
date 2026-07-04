import React, { useState, useEffect } from "react";
import { curriculumData } from "../data/curriculumData";
import ReviewSummaryExporter from "./ReviewSummaryExporter";
import { Chapter, Lesson } from "../types";
import { Search, ChevronLeft, ChevronDown, BookOpen, Compass, Award, Cpu, Star, HelpCircle, ArrowLeft, RefreshCw, Zap, Activity, Heart, Maximize2, X, Type, Check, Lightbulb, Video } from "lucide-react";
import { UI_TRANSLATIONS, LESSON_TRANSLATIONS } from "../utils/translations";

const CHAPTER_VIDEOS: Record<string, string> = {
  "chapter-1": "https://drive.google.com/file/d/1zJFZNcScTSp_Vt0ykfHYBG43uqsDrzsI/preview",
  "chapter-2": "https://drive.google.com/file/d/1OP-xcYtE90oC43jCRV_aMy07D43oFJjO/preview",
  "chapter-3": "https://drive.google.com/file/d/17_g6bEPc9jw9t0Juwzx9pBhFRfrLueCP/preview",
  "chapter-4": "https://drive.google.com/file/d/1cM1mEUZdiuVc7ltQoYnpDxbqHWAcQmD7/preview",
};

interface CurriculumExplorerProps {
  onAskAi: (topic: string) => void;
  onGoToLab?: (labId: string) => void;
  lang?: "ar" | "en";
}

const lessonLabMapping: Record<
  string,
  {
    labId: "projection" | "engine" | "elasticity" | "capacitor";
    labName: string;
    description: string;
  }
> = {
  // Chapter 1
  "intro-projection": {
    labId: "projection",
    labName: "معمل الإسقاط المتعامد ثلاثي الأبعاد",
    description: "جرّب إسقاط الخطوط والنقاط والمجسمات في معمل الإسقاط المتعامد ثلاثي الأبعاد لدراسة نظرية الإسقاط بزاوية نظر أولى وثالثة.",
  },
  "ortho-principles": {
    labId: "projection",
    labName: "معمل الإسقاط المتعامد ثلاثي الأبعاد",
    description: "شاهد إسقاط الأسطح المتعامدة والمستقيمات المتوازية، وراقب كيف يظهر مسقط السطح العمودي كخط مستقيم والسطح الموازي ببعده الحقيقي.",
  },
  "three-planes": {
    labId: "projection",
    labName: "معمل الإسقاط المتعامد ثلاثي الأبعاد",
    description: "افتح لوحة الرسم الهندسية وتعرف على توزيع المساقط الثلاثة (الرأسي، الأفقي، والجانبي) وتطبيق قاعدة المنهج السوداني للزاوية الأولى.",
  },
  "isometric-oblique": {
    labId: "projection",
    labName: "معمل الإسقاط المتعامد ثلاثي الأبعاد",
    description: "تفاعل مع المنظور ثلاثي الأبعاد (الأيزومتري) ودوّر المجسم لرؤيته من زوايا ميكانيكية مختلفة لفهم الإسقاط الأيزومتري الكامل.",
  },
  "dim-1-1": {
    labId: "projection",
    labName: "معمل الإسقاط المتعامد ثلاثي الأبعاد",
    description: "تدرّب على قراءة وفهم مقاسات وأبعاد الأسطح والمجسمات على لوحة الرسم الهندسية ثلاثية الأبعاد وكتابتها بشكل صحيح.",
  },
  "sketch-1-2": {
    labId: "projection",
    labName: "معمل الإسقاط المتعامد ثلاثي الأبعاد",
    description: "تصور المجسمات الهندسية ورسمها باليد الحرة عبر مقارنة المنظور الأيزومتري بالمساقط الثنائية لمطابقتها عملياً.",
  },

  // Chapter 2
  "metals-intro": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "اختبر الخواص الميكانيكية للمواد مثل المرونة والصلادة وقابلية الطرق، وشاهد استجابة الصلب والنحاس والألومنيوم تحت الأحمال الشديدة.",
  },
  "iron-production": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "تستخدم أفران الصهر كفرن الكيوبولا لإنتاج حديد الزهر الرمادي والصلب المستخدمين في صناعة مكابس محركات الاحتراق الداخلي.",
  },
  "steel-rolling": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "اختبر قوة شد وصلابة منتجات الصلب الكربوني الناتجة عن عمليات الدرفلة في معمل إجهاد المواد وقانون هوك المخصص.",
  },
  "non-ferrous-alloys": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "قارن سلوك تمدد وإجهاد النحاس النقي والألومنيوم الطري كفلزات لاحديدية وسبائكها المعتمدة تحت قوى الشد الميكانيكية.",
  },
  "engines-cycles": {
    labId: "engine",
    labName: "محاكي الأشواط الأربعة التفاعلي",
    description: "شغّل محاكي الاحتراق الداخلي وتابع حركة المكبس في الأشواط الأربعة: السحب، الضغط، القدرة، والطرد بدقة خطوة بخطوة مع التحكم الكامل بالصمامات.",
  },
  "car-engine-systems": {
    labId: "engine",
    labName: "محاكي الأشواط الأربعة التفاعلي",
    description: "شاهد صمامات السحب والطرد وشمعة الاحتراق (مجموعة الاشتعال) بداخل غرفة الأسطوانة أثناء التشغيل الفعلي للمحرك وربطها بالأنظمة الأربعة.",
  },

  // Chapter 3
  "electrical-units": {
    labId: "capacitor",
    labName: "معمل شحن المكثفات والفيض",
    description: "تحكم بجهد البطارية بالفولت والمسافة بالمليمتر وراقب الشحنة الكهربائية المتولدة بالكولوم تطبيقاً لقانون كولوم والشحنات المتجاذبة.",
  },
  "capacitors": {
    labId: "capacitor",
    labName: "معمل شحن المكثفات والفيض",
    description: "غيّر مساحة اللوحات ونوع العازل كالميكا والسيراميك والورق، واحسب السعة المتغيرة والطاقة المخزنة بالجول فورياً تحت تأثير الجهد الكهربائي.",
  },
  "electromagnetism-induction": {
    labId: "capacitor",
    labName: "معمل شحن المكثفات والفيض",
    description: "تفاعل مع الفيض الكهربائي والمجال المتكون بين لوحي المكثف المشحون عند توصيله ببطارية ذات جهد كهربائي مستمر ومقدار الطاقة المخزنة.",
  },
  "self-inductance": {
    labId: "capacitor",
    labName: "معمل شحن المكثفات والفيض",
    description: "شاهد كيف يتم تخزين الطاقة الكهربائية والمغناطيسية في الدائرة والتحكم فيها بفضل خصائص السعة والمادة العازلة المستخدمة.",
  },
  "semiconductors-doping": {
    labId: "capacitor",
    labName: "معمل شحن المكثفات والفيض",
    description: "تعتمد صناعة المكثفات الحديثة فائقة السعة على بلورات وأشباه موصلات مشوبة لزيادة كفاءة الوسط العازل وتخزين شحنات هائلة.",
  },

  // Chapter 4
  "structures-trusses": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "تحتوي الجملونات والعتبات على مقاطع صلبة تقاوم قوى الشد والضغط. اختبر أقصى إجهاد تتحمله المادة قبل الانهيار الكلي.",
  },
  "arches-foundations": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "تتعرض أساسات ودعائم الجسور لقوى انضغاط هائلة من منشآت الأقواس. تدرّب على حساب الإجهاد الميكانيكي الواقع على الركيزة لتجنب الانهيار.",
  },
  "stress-strain-hooke": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "اضبط القوة المؤثرة بالنيوتن على العمود المعدني لحساب قيمة الإجهاد والانفعال والتمدد الإجمالي بناءً على قانون هوك للمرونة.",
  },
  "fluid-mechanics-viscosity": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "دراسة قوى القص الداخلية وسلوك التشوه للموائع اللزجة والمواد تحت تأثير الأحمال الميكانيكية المباشرة وتطبيقات الضغوط.",
  },
  "environmental-pollution": {
    labId: "elasticity",
    labName: "معمل إجهاد المواد وقانون هوك",
    description: "تتسبب الأمطار الحمضية في تآكل وهلاك حديد التسليح والمعادن في المنشآت المدنية. تفاعل مع المعمل لترى تأثير إجهاد المواد وتلفها المبكر.",
  },
};

export interface LessonSummary {
  takeaways: string[];
  examTip: string;
}

export const lessonSummaries: Record<string, LessonSummary> = {
  "intro-projection": {
    takeaways: [
      "الإسقاط هو وقوع حواف الجسم ونزولها في شكل خطوط مستقيمة لتلتقي مع مستو معين لتكوين شكل ثنائي الأبعاد.",
      "تختلف الطرق وفقاً لاتجاه تسليط النظر؛ فإذا كان مائلاً سمي إسقاطاً مائلاً، وإذا كان من نقطة مركزية سمي إسقاطاً تصويرياً.",
      "الشكل المتكون من توصيل نقاط التقاطع يسمى (مسقط) الجسم، والمستقيمات الساقطة تسمى (مستقيمات الإسقاط)."
    ],
    examTip: "انتبه لتعريف الإسقاط العام والإسقاط المائل، والفرق بين الإسقاط المتعامد والتصويري، حيث يتكرر هذا التعريف في أسئلة 'اكتب المصطلح العلمي'."
  },
  "ortho-principles": {
    takeaways: [
      "الإسقاط المتعامد يصف الشكل الحقيقي للجسم بإسقاط أشعة عمودية تماماً على مستويات متعامدة متبادلة.",
      "الأضلاع والسطوح الموازية لمستوى الإسقاط تظهر ببعدها وشكلها الحقيقي الكامل.",
      "الأضلاع المتعامدة مع مستوى الإسقاط تظهر كنقطة واحدة، والسطوح المتعامدة تظهر كخط مستقيم واحد يمثل حافتها."
    ],
    examTip: "تذكر دائماً القاعدة الذهبية: مسقط أي ضلع مستقيم عمودي على مستوى الإسقاط يظهر كـ 'نقطة واحدة فقط'، بينما السطح العمودي يظهر كـ 'خط مستقيم'."
  },
  "three-planes": {
    takeaways: [
      "تستخدم ثلاثة مساقط متعامدة (الرأسي والأفقي والجانبي) لتوضيح تفاصيل وأبعاد الأجسام الهندسية المعقدة.",
      "في نظام الزاوية الأولى المعتمد بالسودان، يرسم المسقط الأفقي دائماً أسفل المسقط الرأسي، والجانبي الأيسر على يمين الرأسي.",
      "في نظام الزاوية الثالثة، يرسم المسقط الأفقي أعلى المسقط الرأسي، والجانبي الأيسر على يسار الرأسي."
    ],
    examTip: "احفظ جيداً موضع المسقط الأفقي في نظام الزاوية الأولى؛ فهو يقع تحت المسقط الرأسي مباشرة في اللوحات الهندسية، وهو السؤال الأكثر تكراراً في امتحانات الشهادة."
  },
  "isometric-oblique": {
    takeaways: [
      "المنظور الأيزومتري يميل فيه المحوران الجانبيان بـ 30 درجة على الأفقي، وتكون الزاوية بينهما 120 درجة والخطوط الرأسية قائمة.",
      "المنظور المائل (الأوبليك) يرسم فيه الوجه الأمامي بأبعاده الحقيقية وزوايا قائمة، وتميل خطوط العمق بـ 45 درجة.",
      "يتم ضرب أبعاد خطوط العمق في المنظور المائل في نصف مقاسها الحقيقي (0.5) لتقليل التشويه والخلل البصري."
    ],
    examTip: "احفظ الزوايا المعتمدة للمنظورين: الأيزومتري يميل بزاوية 30 درجة، بينما المائل يميل بزاوية 45 درجة مع تقليص عمقه للنصف."
  },
  "dim-1-1": {
    takeaways: [
      "تكتب الأبعاد بأرقام تدل على المقاس الفعلي بالمليمتر، وتوضع الأرقام دائماً أعلى منتصف خط البعد الرفيع.",
      "تترك مسافة كافية (من 8 إلى 10 ملم) بين خط البعد وحواف الجسم لتجنب التشويه والخلط البصري.",
      "يرمز للقطر الكامل للدوائر بالرمز (ق) أو (ϕ)، ويرمز لنصف قطر الأقواس والمنحنيات بالرمز (نق) أو (R)."
    ],
    examTip: "انتبه لرموز القياس؛ (ق) تعني القطر الكامل وتوضع للدوائر، أما (نق) فتعني نصف القطر وتوضع للأقواس المفتوحة والمنحنيات."
  },
  "sketch-1-2": {
    takeaways: [
      "الرسم الكروكي (التكريك) هو الرسم باليد الحرة دون استخدام أدوات هندسية كالمساطر والفرجار مع مراعاة النسب التقريبية.",
      "عند التكريك، ترسم الخطوط الأفقية دائماً من اليسار إلى اليمين، والخطوط العمودية من أعلى إلى أسفل.",
      "لرسم الدوائر يدوياً، نبدأ برسم محورين متعامدين ثم نضع علامات مسافات تقريبية لتسهيل رسم القوس الدائري المتناسق."
    ],
    examTip: "الرسم الكروكي يهدف لنقل الأفكار والتصاميم بسرعة باليد الحرة، وتذكر قواعد واتجاه حركة اليد أثناء رسم الخطوط الأفقية والعمودية."
  },
  "metals-intro": {
    takeaways: [
      "تنقسم الفلزات الهندسية لفلزات حديدية (تشتمل على الحديد وتتميز بالصلادة والمغنطة) ولاحديدية (كالنحاس والألومنيوم).",
      "الخواص الميكانيكية تشمل المرونة، الصلادة (مقاومة الخدش والقطع)، المطيلية (السحب لأسلاك)، والمتانة (تحمل الصدمات).",
      "الخواص الكيميائية تعني مقاومة التآكل والصدأ والتفاعل مع الأحماض والعوامل الجوية المختلفة."
    ],
    examTip: "امتحانات الشهادة تركز بشدة على المصطلحات الميكانيكية؛ تذكر أن 'الصلادة' هي مقاومة الخدش والتغلغل، بينما 'المطيلية' هي قابلية السحب لأسلاك رفيعة."
  },
  "iron-production": {
    takeaways: [
      "يتم استخلاص حديد زهر التماسيح من خام الهيماتيت داخل الفرن اللافح (العالي) باستخدام فحم الكوك والحجر الجيري كمساعد صهر.",
      "الحجر الجيري يتحد مع الشوائب الرملية بالفرن اللافح ليكوّن الخبث الخفيف الذي يطفو فوق مصهور الحديد.",
      "فرن الكيوبولا (دست الصهر) يستخدم لإعادة صهر حديد التماسيح لإنتاج حديد الزهر الرمادي (المقاوم للاهتزاز والضغط) والأبيض واللدن."
    ],
    examTip: "احفظ مكونات شحنة الفرن اللافح ووظيفة كل منها؛ خصوصاً دور فحم الكوك (موقد ومصدر كربون واختزال) والحجر الجيري (مساعد صهر ومزيل للشوائب)."
  },
  "steel-rolling": {
    takeaways: [
      "الصلب الكربوني هو سبيكة حديد وكربون (نسبة الكربون أقل من 1.8%)، ويقسم إلى منخفض ومتوسط وعالي الكربون حسب صلابته.",
      "يستخدم الصلب منخفض الكربون في المنشآت والسيارات، بينما يستخدم الصلب عالي الكربون (صلب العدة) لشفرات ومقصات ومبارد القطع الشديدة.",
      "الدرفلة هي عملية تشكيل الصلب بالضغط بين درافيل دوارة بالضغط والحرارة، وتجرى على الساخن للأشكال الكبيرة وعلى البارد للرقائق الدقيقة والملساء."
    ],
    examTip: "الصلب عالي الكربون تتراوح نسبته بين (0.7% - 1.8%) وهو صلب قوي جداً يقبل التقسية الحرارية وتصنع منه 'أدوات القطع والمبارد'."
  },
  "non-ferrous-alloys": {
    takeaways: [
      "النحاس الأحمر يمتاز بكثافة 8.92 وانصهار عند 1083م، وهو ممتاز التوصيل ومقاوم للصدأ.",
      "سبيكة النحاس الأصفر (البرنج Brass) تتكون من نحاس وخارصين، وسبيكة البرنز تتكون من نحاس وقصدير.",
      "السبائك البيضاء (البابيت Babbitt) تتكون من قصدير وأنتيمون ونحاس، وتتميز بنعومتها الفائقة وتستخدم لتبطين كراسي المحاور ميكانيكياً."
    ],
    examTip: "سؤال مكرر جداً: ما هي مكونات النحاس الأصفر؟ الإجابة: (نحاس + خارصين). وما هي مكونات البرنز؟ الإجابة: (نحاس + قصدير)."
  },
  "capacitors": {
    takeaways: [
      "المكثف الهندسي يخزن الشحنات والطاقة الكهربائية في مجال عازل، وتقاس سعته بالفاراد (F).",
      "تعتمد السعة طردياً على مساحة اللوحين ونوع المادة العازلة (سماحيتها)، وعكسياً على المسافة بين اللوحين.",
      "المكثفات الإلكتروليتية ثابتة ومستقطبة كيميائياً، وتمتاز بسعات هائلة وتستخدم لتنعيم التيار المستمر وتثبيت الجهد."
    ],
    examTip: "احفظ قانون سعة اللوحين: س = (ح × ε) / ف. تذكر أن زيادة المسافة 'ف' تقلل السعة، وزيادة مساحة الألواح 'ح' تزيد السعة."
  },
  "electromagnetism-induction": {
    takeaways: [
      "خطوط الفيض المغناطيسي مسارات وهمية مغلقة تتجه خارج المغناطيس من القطب الشمالي N إلى الجنوبي S.",
      "الحث الكهرومغناطيسي (فارادي) يولد قوة دافعة كهربائية حثية نتيجة لتغير الفيض المغناطيسي المار بملف السلك.",
      "الممانعة المغناطيسية تشبه المقاومة الكهربائية وهي ممانعة المسار لمرور الفيض وتعتمد على طول المسار ومساحته ونفاذيته."
    ],
    examTip: "احفظ قانون الممانعة المغناطيسية: م_م = ف / (μ × ح)، وقانون الفيض: الفيض = ق.د.م / م_م."
  },
  "self-inductance": {
    takeaways: [
      "الحث الذاتي هو تولد قوة دافعة كهربائية حثية في نفس الملف نتيجة لتغير شدة التيار الكهربائي المار فيه نفسه.",
      "قانون لينز ينص على أن القوة الحثية المتولدة تعارض دائماً التغير في التيار المسبب لها (ويرمز لذلك بالإشارة السالبة في القانون).",
      "تقاس المحاثة الذاتية بالهنري (H)، وتزيد طردياً بزيادة مربع عدد اللفات ونفاذية الوسط العازل ومساحة المقطع."
    ],
    examTip: "تذكر دائماً أن وحدة قياس المحاثة (ل) هي 'الهنري'، وقانون الجهد الحثي الذاتي هو: ق.د.ك = - ل × (ت٢ - ت١) / ن."
  },
  "semiconductors-doping": {
    takeaways: [
      "السيليكون والجرمانيوم أشباه موصلات رباعية التكافؤ تترابط بروابط تساهمية قوية وتكون عازلة تماماً عند الصفر المطلق.",
      "التشويب هو إضافة شوائب لزيادة الموصلية؛ الشوائب خماسية التكافؤ (كالزرنيخ) تعطي بلورة سالبة (n-type) حاملاتها الإلكترونات.",
      "الشوائب ثلاثية التكافؤ (كالالبورون) تعطي بلورة موجبة (p-type) حاملاتها الأكثرية الفجوات الثقيلة (Holes)."
    ],
    examTip: "احفظ نوع الشائبة وعلاقتها بالبلورة: ذرة خماسية (مانحة) تعطي n-type، وذرة ثلاثية (مستقبلة) تعطي p-type."
  },
  "structures-trusses": {
    takeaways: [
      "المنشآت الهندسية مصممة لمقاومة الأحمال الخارجية ونقل القوى بأمان للأرض دون تشوهات كبيرة تخل بسلامتها.",
      "الجملونات هياكل مثلثية خفيفة ممتازة لحمل الأسقف وبحور الجسور الطويلة وتنقل القوى في أضلاعها كقوى شد أو ضغط محوري فقط.",
      "الركائز ثلاثة أنواع: ركيزة دحروج (رد فعل واحد رأسي)، ركيزة مفصلة (ردان رأسي وأفقي)، ركيزة تثبيت تام كالكابولي (٣ ردود تشمل العزم)."
    ],
    examTip: "احفظ عدد ردود الأفعال لكل ركيزة: الدحروج = ١، المفصلة = ٢، التثبيت التام (الكابولي) = ٣ (أفقي، رأسي، وعزم انحناء)."
  },
  "arches-foundations": {
    takeaways: [
      "الأقواس تنقل الأحمال كقوى انضغاط محورية كبيرة نحو الركائز الجانبية المتينة ومكوناتها التاج والظهر والضلع.",
      "الأساسات هي الوسيط الذي ينقل أحمال المنشأة بأمان للتربة، وتنقسم لسطحية (قواعد ولبشة) وعميقة (دعائم وخوازيق).",
      "الأساسات العميقة تستخدم لتفادي تربة السطح الضعيفة ونقل الأحمال إلى طبقة صخرية صلبة بعيدة عن السطح."
    ],
    examTip: "انتبه إلى متى تستخدم الأساسات العميقة (الخوازيق والدعائم)؛ وهي عندما تكون طبقات التربة القريبة من السطح ضعيفة جداً لا تتحمل الأحمال."
  },
  "stress-strain-hooke": {
    takeaways: [
      "الإجهاد هو القوة الداخلية المقاومة لكل وحدة مساحة (هـ = ق / م) ويقاس بالنيوتن/متر مربع أو باسكال.",
      "الانفعال هو التغير النسبي في الطول نتيجة للإجهاد (ع = Δل / ل) وهو قيمة نسبية ليس لها وحدة قياس أبداً.",
      "قانون هوك ينص على تناسب الإجهاد طردياً مع الانفعال ضمن حدود المرونة، وثابت التناسب هو معامل المرونة (ي = هـ / ع)."
    ],
    examTip: "سؤال مكرر جداً في الامتحان: علل: الانفعال ليس له وحدة تمييز قياسية؟ الإجابة: لأنه نسبة بين طولين متجانسين (تغير الطول إلى الطول الأصلي)."
  },
  "fluid-mechanics-viscosity": {
    takeaways: [
      "الموائع تشتمل على السوائل والغازات، وهي تمتاز بقابليتها للانسياب والجريان وعدم اتخاذ شكل محدد ثابت.",
      "اللزوجة هي مقاومة المائع للجريان والقص وتنشأ من قوى التماسك الجزيئي الداخلي.",
      "بارتفاع درجة الحرارة: تقل لزوجة السوائل (لتفكك الروابط)، وتزداد لزوجة الغازات (لزيادة معدل تصادم جزيئاتها)."
    ],
    examTip: "احفظ تأثير الحرارة على اللزوجة؛ فالحرارة تزيد لزوجة الغازات وتقلل لزوجة السوائل، وقانون نيوتن للزوجة: ق = لز × م × (ع / ص)."
  },
  "environmental-pollution": {
    takeaways: [
      "تتكون الأمطار الحمضية من ذوبان غازات أكاسيد الكبريت SOx والنيتروجين NOx الناتجة عن عوادم السيارات والمصانع في الرطوبة الجوية.",
      "الأمطار الحمضية تؤدي لتآكل التربة وتلف المحاصيل والمنشآت وتسمم الأحياء المائية بمجاري المياه العذبة.",
      "تقسم الأمراض المتعلقة بالمياه لـ ٤ أقسام: منقولة بالماء (كالكوليرا)، بسبب غياب النظافة (كالجرب)، تلامسية (كالبلهارسيا)، وعبر نواقل مائية (كالملاريا)."
    ],
    examTip: "احفظ تصنيف أمراض المياه الأربعة والأمثلة عليها؛ البلهارسيا مثال للأمراض 'التلامسية'، وحمى الملاريا مثال للأمراض المنقولة عبر 'نواقل الجراثيم'."
  }
};

export const englishSummaries: Record<string, LessonSummary> = {
  "intro-projection": {
    takeaways: [
      "Projection is when the edges of an object project as straight lines onto a plane to form a 2D representation.",
      "Methods differ by sight-line direction: oblique projection is slanted, perspective projection uses a central point.",
      "The resulting drawing is called the 'view' or 'projection', and the rays are 'projection lines'."
    ],
    examTip: "Learn the formal definitions of projection and oblique projection. They frequently appear in 'Write the scientific term' questions."
  },
  "ortho-principles": {
    takeaways: [
      "Orthographic projection describes true shapes by projecting lines perpendicular to mutually orthogonal planes.",
      "Edges and surfaces parallel to the projection plane appear in their true shape and dimensions.",
      "Lines perpendicular to a plane project as a single point; perpendicular surfaces project as a single line."
    ],
    examTip: "Remember the gold rule: a line perpendicular to a plane projects as a point, and a perpendicular surface projects as a line."
  },
  "three-planes": {
    takeaways: [
      "Three perpendicular planes (vertical, horizontal, side) are used to clarify details of complex 3D objects.",
      "In First-Angle projection (used in Sudan), the plan is below the elevation, and the LHS view is on the right of the elevation.",
      "In Third-Angle projection, the plan is above the elevation, and the LHS view is on the left of the elevation."
    ],
    examTip: "Always memorize the location of the horizontal plane (Plan) in First-Angle system: it is drawn directly underneath the Vertical plane."
  },
  "isometric-oblique": {
    takeaways: [
      "In isometric projection, side axes are angled at 30 degrees to the horizontal, creating 120-degree angles between axes.",
      "Oblique projection draws the front face flat (true shape) with side depth drawn at 30, 45, or 60 degrees (usually 45).",
      "Isometric views show 3D details equally, whereas oblique views focus details on the frontal plane."
    ],
    examTip: "Identify the receding axis angles: 30° for Isometric, and 45° (or 30°/60°) for Oblique projection."
  },
  "engine-intro": {
    takeaways: [
      "Internal combustion engines convert thermal energy from fuel combustion inside the cylinder into mechanical work.",
      "Engines are categorized by fuel (petrol/spark ignition vs. diesel/compression ignition) and cycle strokes.",
      "The piston moves linearly between Top Dead Center (TDC) and Bottom Dead Center (BDC)."
    ],
    examTip: "Understand the conversion of fuel's chemical energy into heat, then into mechanical motion via pistons and crankshafts."
  },
  "four-stroke": {
    takeaways: [
      "A four-stroke cycle completes 4 piston strokes (Suction, Compression, Power, Exhaust) during two crankshaft rotations.",
      "Valves open and close at precise points: intake valve opens during suction, and both valves are closed during compression and power.",
      "The power stroke is the only stroke that produces mechanical work; others are driven by flywheel momentum."
    ],
    examTip: "Be prepared to draw or list the sequence of the 4 strokes in order: Suction -> Compression -> Power -> Exhaust."
  },
  "two-stroke": {
    takeaways: [
      "Two-stroke engines complete the cycle in 2 piston strokes (one revolution), replacing valves with cylinder ports.",
      "Fuel mixture is pre-compressed in the crankcase before entering the combustion chamber via transfer ports.",
      "They offer higher power density but suffer from fuel loss (scavenging losses) and higher emissions."
    ],
    examTip: "Compare two-stroke vs four-stroke: two-stroke has no valves (uses ports), fires every revolution, and lacks a separate oil sump."
  },
  "engine-calc": {
    takeaways: [
      "Swept volume (Vs) is the cylinder volume displaced by the piston between TDC and BDC: Vs = (π/4) * d² * L.",
      "Compression ratio (r) is total cylinder volume divided by clearance volume: r = (Vs + Vc) / Vc.",
      "Indicated Power (IP) calculates internal cylinder power, while Brake Power (BP) is the usable shaft power."
    ],
    examTip: "Make sure your units match when calculating power: convert cylinder diameter (bore) and stroke length to meters!"
  },
  "tensile-test": {
    takeaways: [
      "Tensile testing applies uniaxial stretching force to a specimen to study strength, elasticity, and deformation.",
      "A standard dog-bone specimen is gripped in a Universal Testing Machine (UTM) to record load-deformation curves.",
      "Ductile materials show significant narrowing (necking) before fracture, while brittle materials snap cleanly."
    ],
    examTip: "Study the shape of a tensile test specimen. The enlarged ends prevent slipping and ensure failure occurs in the middle gauge section."
  },
  "stress-strain": {
    takeaways: [
      "Hooke's law states that stress is directly proportional to strain within the elastic limit: Stress = E * Strain.",
      "The curve details key zones: Proportional limit, Elastic limit, Yield point, Ultimate Tensile Strength, and Fracture.",
      "Modulus of elasticity (Young's Modulus) represents material stiffness, measured in Pascals (N/m²)."
    ],
    examTip: "Understand the difference between elastic deformation (reversible) and plastic deformation (permanent) after the yield point."
  },
  "stress-calc": {
    takeaways: [
      "Normal stress (σ) is load divided by original cross-sectional area: σ = P / A.",
      "Strain (ε) is change in length divided by original gauge length: ε = ΔL / L.",
      "Factor of Safety (FoS) is the ultimate stress divided by allowable working stress: FoS = σ_ultimate / σ_allowable."
    ],
    examTip: "Always remember that strain is a dimensionless ratio, whereas stress shares the exact same unit as pressure (Pascal or N/m²)."
  },
  "structures-trusses": {
    takeaways: [
      "Structures are designed to withstand external loads and transmit forces safely to the ground without excessive deformation.",
      "Trusses are light triangular frames ideal for roofs and bridges, transmitting load axial forces (tension or compression) only.",
      "Supports are categorized: roller support (1 reaction), pinned/hinged (2 reactions), fixed support like a cantilever (3 reactions)."
    ],
    examTip: "Remember the reactions for each support: Roller = 1, Pinned = 2, Fixed (Cantilever) = 3 (horizontal, vertical, and bending moment)."
  },
  "arches-foundations": {
    takeaways: [
      "Arches transfer loads down to solid abutments primarily through thrust/axial compression forces.",
      "Foundations act as the medium transferring structural loads safely to the soil; split into shallow and deep categories.",
      "Deep foundations (piles and caissons) are utilized to bypass weak surface soil layers to solid load-bearing rocks."
    ],
    examTip: "Be sure to explain when deep foundations (piles) are required: specifically, when top soil strata are too weak to support load."
  },
  "stress-strain-hooke": {
    takeaways: [
      "Stress is the internal resisting force per unit area (σ = P / A) measured in Pascals or N/m².",
      "Strain is the relative deformation change in length (ε = dL / L) and has no units.",
      "Hooke's Law states stress is proportional to strain in elastic limits, where Young's Modulus (E = σ / ε) is the constant."
    ],
    examTip: "Common exam question: Explain why strain is dimensionless. Answer: It is the ratio of two homogenous lengths (change in length over original length)."
  },
  "fluid-mechanics-viscosity": {
    takeaways: [
      "Fluids comprise both liquids and gases, characterized by their ability to flow and conform to container shapes.",
      "Viscosity is a fluid's internal resistance to flow and shear, stemming from cohesive molecular attractions.",
      "With temperature rise: liquid viscosity decreases (weakening bonds) whereas gaseous viscosity increases (increasing molecular collisions)."
    ],
    examTip: "Memorize temperature effects: heat increases gas viscosity but decreases liquid viscosity. Newton's law: F = μ * A * (dv / dy)."
  },
  "environmental-pollution": {
    takeaways: [
      "Acid rain is formed when sulfur oxides (SOx) and nitrogen oxides (NOx) gases from industrial emissions dissolve in air moisture.",
      "Acid rain corrodes buildings, degrades soil fertility, damages agricultural crops, and pollutes freshwater ecosystems.",
      "Water-related diseases are grouped into 4 categories: water-borne (e.g. cholera), water-washed (e.g. scabies), water-based (e.g. schistosomiasis), and insect-vectors (e.g. malaria)."
    ],
    examTip: "Remember water disease examples: Schistosomiasis (bilharzia) is 'water-based / contact' while Malaria is 'water-insect-vector'."
  }
};

function renderLessonDiagram(lessonId: string) {
  switch (lessonId) {
    case "intro-projection":
      return (
        <div className="w-full max-w-sm" id="diagram-intro-projection">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            {/* Projection Plane */}
            <rect x="240" y="25" width="130" height="150" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
            <text x="305" y="195" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">مستوى الإسقاط (٢D)</text>
            
            {/* 3D Box (Original Object) */}
            <g transform="translate(30, 75)">
              <rect x="0" y="0" width="50" height="50" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              <path d="M0,0 L18,-18 L68,-18 L50,0 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              <path d="M50,0 L68,-18 L68,32 L50,50 Z" fill="#64748b" stroke="#475569" strokeWidth="1" />
            </g>
            <text x="65" y="150" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">المجسم المراد إسقاطه</text>
            
            {/* Rays */}
            <path d="M98,57 L240,57" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
            <path d="M80,75 L240,75" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
            <path d="M80,125 L240,125" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
            <text x="160" y="50" textAnchor="middle" className="text-[9px] font-bold fill-amber-600">أشعة إسقاط متوازية وعمودية</text>
            
            {/* Projected 2D shape */}
            <rect x="265" y="57" width="50" height="50" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2.5" />
            <text x="290" y="90" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">المسقط المسطح الناتج</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">مبدأ الإسقاط: تسليط أشعة عمودية من حواف الجسم للحصول على تمثيل ثنائي الأبعاد</p>
        </div>
      );
    case "ortho-principles":
      return (
        <div className="w-full max-w-lg" id="diagram-ortho-principles">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            {/* Parallel Line case */}
            <g transform="translate(10, 15)">
              <rect x="10" y="40" width="160" height="12" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <line x1="30" y1="20" x2="150" y2="20" stroke="#10b981" strokeWidth="3.5" />
              <text x="90" y="13" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600">مستقيم يوازي المستوى (أ ب)</text>
              <path d="M30,20 L30,40 M150,20 L150,40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
              <line x1="30" y1="46" x2="150" y2="46" stroke="#2563eb" strokeWidth="2" />
              <text x="90" y="70" textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">يظهر المسقط بطوله الحقيقي الكامل (أَ بَ)</text>
            </g>
            {/* Perpendicular Surface case */}
            <g transform="translate(210, 15)">
              <polygon points="30,20 110,20 80,50" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.5" />
              <text x="70" y="13" textAnchor="middle" className="text-[10px] font-bold fill-pink-600">سطح مستوٍ عمودي على المستوى</text>
              <path d="M30,20 L30,70 M110,20 L110,70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
              <line x1="15" y1="70" x2="125" y2="70" stroke="#94a3b8" strokeWidth="1" />
              <line x1="30" y1="70" x2="110" y2="70" stroke="#e11d48" strokeWidth="3" />
              <text x="70" y="90" textAnchor="middle" className="text-[10px] fill-rose-600 font-bold">يظهر كـ (خط مستقيم حافة) فقط</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">القاعدة الذهبية للإسقاط: الأسطح الموازية تظهر بأبعادها الحقيقية والعمودية تظهر كخطوط</p>
        </div>
      );
    case "three-planes":
      return (
        <div className="w-full max-w-md" id="diagram-three-planes">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <line x1="200" y1="10" x2="200" y2="210" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            <line x1="20" y1="110" x2="380" y2="110" stroke="#2563eb" strokeWidth="2" />
            <text x="350" y="102" className="text-[9px] font-bold fill-blue-600 font-mono">س - س (خط الأرض)</text>
            
            {/* Front View (Top Right in Sudanese 1st Angle) */}
            <g transform="translate(210, 10)">
              <rect x="10" y="5" width="130" height="85" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="30,70 110,70 110,30 70,30 70,50 30,50" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />
              <text x="75" y="45" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">المسقط الرأسي (أمام)</text>
            </g>
            {/* Side View (Top Left - Left Side View drawn on the Right of Front View? Actually Left side view is on the Left in 3rd angle, on the Right in 1st angle) */}
            <g transform="translate(40, 10)">
              <rect x="10" y="5" width="130" height="85" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
              <rect x="40" y="30" width="70" height="40" fill="#f1f5f9" stroke="#475569" strokeWidth="1" />
              <text x="75" y="45" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">المسقط الجانبي</text>
            </g>
            {/* Top View (Bottom Right - under Front view) */}
            <g transform="translate(210, 120)">
              <rect x="10" y="5" width="130" height="85" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
              <rect x="30" y="30" width="80" height="40" fill="#dcfce7" stroke="#15803d" strokeWidth="1" />
              <text x="75" y="45" textAnchor="middle" className="text-[10px] font-bold fill-emerald-700">المسقط الأفقي (أعلى)</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">توزيع المساقط بنظام الزاوية الأولى المعتمد في المنهج السوداني (الأفقي تحت الرأسي)</p>
        </div>
      );
    case "isometric-oblique":
      return (
        <div className="w-full max-w-md" id="diagram-isometric-oblique">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            {/* Isometric */}
            <g transform="translate(15, 10)">
              <text x="80" y="15" textAnchor="middle" className="text-[11px] font-bold fill-indigo-600">المنظور الأيزومتري (٣٠° / ٣٠°)</text>
              <path d="M 10,130 L 150,130" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M 80,130 L 140,95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
              <path d="M 80,130 L 20,95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
              <text x="130" y="125" className="text-[8px] fill-amber-600 font-bold">٣٠°</text>
              <text x="35" y="125" className="text-[8px] fill-amber-600 font-bold">٣٠°</text>
              <g transform="translate(80,130)">
                <path d="M 0,0 L 40,-23 L 40,-69 L 0,-46 Z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
                <path d="M 0,0 L -40,-23 L -40,-69 L 0,-46 Z" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
                <path d="M 0,-46 L 40,-69 L 0,-92 L -40,-69 Z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
              </g>
            </g>
            {/* Oblique */}
            <g transform="translate(205, 10)">
              <text x="80" y="15" textAnchor="middle" className="text-[11px] font-bold fill-emerald-600">المنظور المائل (٤٥°)</text>
              <path d="M 10,130 L 150,130" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M 40,130 L 110,60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
              <text x="80" y="125" className="text-[8px] fill-amber-600 font-bold">٤٥°</text>
              <g transform="translate(30,75)">
                <rect x="0" y="10" width="45" height="45" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M 0,10 L 22,-12 L 67,-12 L 45,10 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M 45,10 L 67,-12 L 67,33 L 45,55 Z" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
              </g>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">الأيزومتري يميل بزاوية ٣٠° من الطرفين، بينما المائل يميل وجهه الجانبي بزاوية ٤٥°</p>
        </div>
      );
    case "dim-1-1":
      return (
        <div className="w-full max-w-sm" id="diagram-dim-1-1">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="100" y="55" width="200" height="95" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <circle cx="150" cy="102" r="16" fill="none" stroke="#475569" strokeWidth="1.5" />
            
            <line x1="100" y1="150" x2="100" y2="195" stroke="#64748b" strokeWidth="1" />
            <line x1="300" y1="150" x2="300" y2="195" stroke="#64748b" strokeWidth="1" />
            <line x1="100" y1="185" x2="300" y2="185" stroke="#ef4444" strokeWidth="1.5" />
            <polygon points="100,185 110,181 110,189" fill="#ef4444" />
            <polygon points="300,185 290,181 290,189" fill="#ef4444" />
            <text x="200" y="176" textAnchor="middle" className="text-[11px] font-bold fill-red-600">٢٠٠ ملم (البعد الرقمي)</text>
            <text x="260" y="205" className="text-[8px] fill-slate-400">خط مساعد</text>
            <text x="140" y="205" className="text-[8px] fill-red-500">خط البعد بسهمين</text>
            
            <line x1="150" y1="102" x2="200" y2="78" stroke="#ef4444" strokeWidth="1.5" />
            <polygon points="150,102 158,103 154,108" fill="#ef4444" />
            <text x="212" y="75" className="text-[11px] font-bold fill-red-600 font-mono">ق ٣٠</text>
            <text x="245" y="75" className="text-[9px] fill-slate-500">رمز القطر الكامل (ق)</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">القواعد القياسية للأبعاد: خطوط الأبعاد رفيعة وتنتهي بأسهم، والبعد الرقمي يكتب فوق الخط</p>
        </div>
      );
    case "sketch-1-2":
      return (
        <div className="w-full max-w-sm" id="diagram-sketch-1-2">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <circle cx="200" cy="110" r="65" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3" />
            <line x1="110" y1="110" x2="290" y2="110" stroke="#94a3b8" strokeWidth="1" />
            <line x1="200" y1="20" x2="200" y2="200" stroke="#94a3b8" strokeWidth="1" />
            <line x1="135" y1="45" x2="265" y2="175" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3" />
            
            <g transform="translate(240, 65)">
              <polygon points="0,0 -12,8 -4,20" fill="#f59e0b" />
              <polygon points="-12,8 -25,16 -17,28 -4,20" fill="#d97706" />
              <polygon points="-1,1 -4,2 -2,3" fill="#000" />
              <text x="15" y="-5" className="text-[10px] font-black fill-amber-600">رسم كروكي يدوي</text>
            </g>
            
            <circle cx="200" cy="45" r="3" fill="#ef4444" />
            <circle cx="200" cy="175" r="3" fill="#ef4444" />
            <circle cx="135" cy="110" r="3" fill="#ef4444" />
            <circle cx="265" cy="110" r="3" fill="#ef4444" />
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">خطوات رسم الدائرة اليدوية الكروكية: ارسم المحاور أولاً ثم حدد أنصاف الأقطار بنقاط تقريبية</p>
        </div>
      );
    case "metals-intro":
      return (
        <div className="w-full max-w-md" id="diagram-metals-intro">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="15" y="15" width="170" height="90" rx="6" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
            <text x="100" y="40" textAnchor="middle" className="text-[11px] font-bold fill-slate-800">الفلزات الحديدية (Ferrous)</text>
            <text x="100" y="60" textAnchor="middle" className="text-[9px] fill-slate-500">تحتوي على حديد ومغناطيسية</text>
            <text x="100" y="80" textAnchor="middle" className="text-[10px] font-bold fill-blue-600">مثل: حديد التسليح والصلب والزهر</text>
            
            <rect x="215" y="15" width="170" height="90" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="300" y="40" textAnchor="middle" className="text-[11px] font-bold fill-amber-800">الفلزات اللاحديدية (Non-Ferrous)</text>
            <text x="300" y="60" textAnchor="middle" className="text-[9px] fill-slate-600">مقاومة للصدأ، ولا تنجذب للمغناطيس</text>
            <text x="300" y="80" textAnchor="middle" className="text-[10px] font-bold fill-amber-600">مثل: النحاس والبرنز والألومنيوم</text>
            
            <g transform="translate(80, 125)">
              <line x1="0" y1="20" x2="240" y2="20" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="30" y1="5" x2="70" y2="5" stroke="#ef4444" strokeWidth="1.5" />
              <polygon points="30,5 35,2 35,8" fill="#ef4444" />
              <polygon points="70,5 65,2 65,8" fill="#ef4444" />
              <text x="50" y="-5" textAnchor="middle" className="text-[9px] fill-red-500 font-bold">اختبار الشد (المرونة)</text>
              
              <polygon points="180,-2 185,12 175,12" fill="#3b82f6" />
              <text x="180" y="-8" textAnchor="middle" className="text-[9px] fill-blue-600 font-bold">اختبار الصلادة (الخدش والقطع)</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">تنقسم المعادن الهندسية إلى حديدية ولاحديدية وتتميز بالخواص الفيزيائية والميكانيكية</p>
        </div>
      );
    case "iron-production":
      return (
        <div className="w-full max-w-sm" id="diagram-iron-production">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <g transform="translate(150, 10)">
              <polygon points="20,20 35,130 75,130 90,20" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
              <polygon points="35,130 25,175 85,175 75,130" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
              
              <text x="55" y="45" textAnchor="middle" className="text-[9px] fill-slate-500 font-black">١٣٠٠° مئوية</text>
              <text x="55" y="75" textAnchor="middle" className="text-[10px] fill-red-500 font-black animate-pulse">صهر واختزال الكوك</text>
              
              <path d="M20,160 L5,165" stroke="#ef4444" strokeWidth="2" />
              <text x="-40" y="168" className="text-[9px] fill-red-600 font-bold">حديد زهر التماسيح</text>
              
              <path d="M85,155 L100,158" stroke="#f59e0b" strokeWidth="2" />
              <text x="105" y="161" className="text-[9px] fill-amber-600 font-bold">الشوائب (الخبث)</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">مخطط الفرن العالي اللافح: يخلط الخام بفحم الكوك والحجر الجيري لإنتاج حديد زهر التماسيح</p>
        </div>
      );
    case "steel-rolling":
      return (
        <div className="w-full max-w-sm" id="diagram-steel-rolling">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <g transform="translate(120, 15)">
              <circle cx="80" cy="50" r="35" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
              <path d="M68,25 A15,15 0 0,1 92,25" fill="none" stroke="#ef4444" strokeWidth="2" />
              
              <circle cx="80" cy="130" r="35" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
              <path d="M92,155 A15,15 0 0,1 68,155" fill="none" stroke="#ef4444" strokeWidth="2" />
              
              <rect x="-50" y="80" width="95" height="24" fill="#f87171" stroke="#b91c1c" strokeWidth="1" />
              <text x="-35" y="94" className="text-[10px] font-bold fill-white">كتلة سميكة</text>
              
              <rect x="115" y="88" width="95" height="8" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1" />
              <text x="140" y="82" className="text-[10px] font-bold fill-red-600">صاج رقيق مدرفل</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">الدرفلة: تمرير المعدن بين درافيل دوارة بالضغط لتقليل السمك وإنتاج رقائق الصاج الناعمة</p>
        </div>
      );
    case "non-ferrous-alloys":
      return (
        <div className="w-full max-w-md" id="diagram-non-ferrous-alloys">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <g transform="translate(40, 15)">
              <text x="60" y="12" textAnchor="middle" className="text-[11px] font-bold fill-amber-700">سبيكة النحاس الأصفر (Brass)</text>
              <rect x="10" y="20" width="100" height="100" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
              <circle cx="30" cy="40" r="10" fill="#fbbf24" stroke="#d97706" />
              <circle cx="55" cy="40" r="10" fill="#fbbf24" stroke="#d97706" />
              <circle cx="80" cy="40" r="10" fill="#b45309" stroke="#78350f" />
              <circle cx="30" cy="65" r="10" fill="#fbbf24" stroke="#d97706" />
              <circle cx="55" cy="65" r="10" fill="#b45309" stroke="#78350f" />
              <circle cx="80" cy="65" r="10" fill="#fbbf24" stroke="#d97706" />
              <text x="60" y="135" textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">نحاس أحمر + خارصين (زنك)</text>
            </g>
            <g transform="translate(220, 15)">
              <text x="60" y="12" textAnchor="middle" className="text-[11px] font-bold fill-orange-700">سبيكة البرنز (Bronze)</text>
              <rect x="10" y="20" width="100" height="100" rx="4" fill="#ffedd5" stroke="#ea580c" strokeWidth="1" />
              <circle cx="30" cy="40" r="10" fill="#f97316" stroke="#c2410c" />
              <circle cx="55" cy="40" r="10" fill="#f97316" stroke="#c2410c" />
              <circle cx="80" cy="40" r="10" fill="#f97316" stroke="#c2410c" />
              <circle cx="30" cy="65" r="10" fill="#64748b" stroke="#334155" />
              <circle cx="55" cy="65" r="10" fill="#f97316" stroke="#c2410c" />
              <circle cx="80" cy="65" r="10" fill="#f97316" stroke="#c2410c" />
              <text x="60" y="135" textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">نحاس أحمر + قصدير (Tin)</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">السبائك اللاحديدية المعتمدة: تركيبات ذرات النحاس مع الزنك (للنحاس الأصفر) ومع القصدير (للبرنز)</p>
        </div>
      );
    case "engines-cycles":
      return (
        <div className="w-full max-w-lg" id="diagram-engines-cycles">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <g transform="translate(10, 10)">
              {/* Stroke 1 */}
              <g transform="translate(5, 5)">
                <rect x="10" y="20" width="40" height="70" fill="none" stroke="#475569" strokeWidth="1.5" />
                <rect x="13" y="55" width="34" height="25" fill="#94a3b8" />
                <line x1="30" y1="80" x2="30" y2="120" stroke="#475569" strokeWidth="2" />
                <line x1="16" y1="20" x2="16" y2="28" stroke="#ef4444" strokeWidth="2" />
                <text x="30" y="140" textAnchor="middle" className="text-[9px] font-bold fill-blue-600">١. شوط السحب</text>
              </g>
              {/* Stroke 2 */}
              <g transform="translate(100, 5)">
                <rect x="10" y="20" width="40" height="70" fill="none" stroke="#475569" strokeWidth="1.5" />
                <rect x="13" y="32" width="34" height="25" fill="#94a3b8" />
                <line x1="30" y1="57" x2="30" y2="100" stroke="#475569" strokeWidth="2" />
                <line x1="16" y1="20" x2="16" y2="15" stroke="#475569" strokeWidth="2" />
                <line x1="44" y1="20" x2="44" y2="15" stroke="#475569" strokeWidth="2" />
                <text x="30" y="140" textAnchor="middle" className="text-[9px] font-bold fill-amber-600">٢. شوط الضغط</text>
              </g>
              {/* Stroke 3 */}
              <g transform="translate(195, 5)">
                <rect x="10" y="20" width="40" height="70" fill="none" stroke="#475569" strokeWidth="1.5" />
                <rect x="13" y="48" width="34" height="25" fill="#475569" />
                <line x1="30" y1="73" x2="30" y2="115" stroke="#475569" strokeWidth="2" />
                <circle cx="30" cy="20" r="6" fill="#f59e0b" opacity="0.8" />
                <text x="30" y="140" textAnchor="middle" className="text-[9px] font-bold fill-red-600">٣. شوط القدرة</text>
              </g>
              {/* Stroke 4 */}
              <g transform="translate(290, 5)">
                <rect x="10" y="20" width="40" height="70" fill="none" stroke="#475569" strokeWidth="1.5" />
                <rect x="13" y="32" width="34" height="25" fill="#94a3b8" />
                <line x1="30" y1="57" x2="30" y2="100" stroke="#475569" strokeWidth="2" />
                <line x1="44" y1="20" x2="44" y2="28" stroke="#ea580c" strokeWidth="2" />
                <text x="30" y="140" textAnchor="middle" className="text-[9px] font-bold fill-slate-600">٤. شوط الطرد</text>
              </g>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">دورة الأشواط الأربعة لمحرّك الاحتراق الداخلي: السحب، ثم الضغط، ثم حدوث الاشتعال للقدرة، ثم الطرد</p>
        </div>
      );
    case "car-engine-systems":
      return (
        <div className="w-full max-w-sm" id="diagram-car-engine-systems">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="130" y="30" width="140" height="120" rx="8" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="200" y="55" textAnchor="middle" className="text-[11px] font-black fill-slate-800">الأسطوانة والكباس</text>
            
            <g transform="translate(20, 45)">
              <rect x="0" y="0" width="85" height="35" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="42" y="21" textAnchor="middle" className="text-[9px] font-bold fill-blue-700">نظام الوقود (المغذّي)</text>
            </g>
            
            <g transform="translate(295, 45)">
              <rect x="0" y="0" width="85" height="35" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="42" y="21" textAnchor="middle" className="text-[9px] font-bold fill-red-700">نظام الاشتعال (البواجي)</text>
            </g>
            
            <g transform="translate(20, 110)">
              <rect x="0" y="0" width="85" height="35" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="42" y="21" textAnchor="middle" className="text-[9px] font-bold fill-emerald-700">نظام التبريد (الرديتر)</text>
            </g>
            
            <g transform="translate(295, 110)">
              <rect x="0" y="0" width="85" height="35" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <text x="42" y="21" textAnchor="middle" className="text-[9px] font-bold fill-amber-700">نظام التزييت (الزيت)</text>
            </g>
            
            <line x1="105" y1="62" x2="130" y2="62" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3" />
            <line x1="270" y1="62" x2="295" y2="62" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3" />
            <line x1="105" y1="127" x2="130" y2="127" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3" />
            <line x1="270" y1="127" x2="295" y2="127" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3" />
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">تكامل أنظمة السيارة: التزييت، والوقود، والكهرباء، والحرارة حول الأسطوانة لضمان استقرار المحرك</p>
        </div>
      );
    case "electrical-units":
      return (
        <div className="w-full max-w-sm" id="diagram-electrical-units">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <circle cx="120" cy="100" r="20" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
            <text x="120" y="104" textAnchor="middle" className="text-[12px] font-bold fill-blue-700">+ق١</text>
            
            <circle cx="280" cy="100" r="20" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
            <text x="280" y="104" textAnchor="middle" className="text-[12px] font-bold fill-red-700">-ق٢</text>
            
            <line x1="140" y1="100" x2="260" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
            
            <line x1="150" y1="100" x2="190" y2="100" stroke="#059669" strokeWidth="2.5" />
            <polygon points="190,100 182,96 182,104" fill="#059669" />
            <text x="170" y="90" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600">قوة التجاذب</text>
            
            <line x1="250" y1="100" x2="210" y2="100" stroke="#059669" strokeWidth="2.5" />
            <polygon points="210,100 218,96 218,104" fill="#059669" />
            
            <line x1="120" y1="130" x2="280" y2="130" stroke="#475569" strokeWidth="1" />
            <line x1="120" y1="125" x2="120" y2="135" stroke="#475569" strokeWidth="1" />
            <line x1="280" y1="125" x2="280" y2="135" stroke="#475569" strokeWidth="1" />
            <text x="200" y="145" textAnchor="middle" className="text-[11px] fill-slate-600">المسافة بين الشحنات (ف)</text>
            <text x="200" y="185" textAnchor="middle" className="text-[12px] font-bold fill-indigo-600 font-mono">ق = أ × (ق١ × ق٢) / (ف)٢</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">قانون كولوم الكهربائي: الشحنات المختلفة تتجاذب طردياً مع مقاديرها وعكسياً مع مربع المسافة</p>
        </div>
      );
    case "capacitors":
      return (
        <div className="w-full max-w-sm" id="diagram-capacitors">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="130" y="40" width="12" height="120" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <text x="136" y="105" textAnchor="middle" className="text-[11px] font-bold fill-blue-600">++++</text>
            
            <rect x="250" y="40" width="12" height="120" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <text x="256" y="105" textAnchor="middle" className="text-[11px] font-bold fill-red-600">----</text>
            
            <rect x="144" y="40" width="104" height="120" fill="#fef3c7" opacity="0.75" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
            <text x="196" y="100" textAnchor="middle" className="text-[11px] font-bold fill-amber-700">الوسط العازل (المادة)</text>
            
            <path d="M130,100 L80,100 L80,180 L180,180" stroke="#475569" strokeWidth="1.5" fill="none" />
            <path d="M262,100 L310,100 L310,180 L210,180" stroke="#475569" strokeWidth="1.5" fill="none" />
            
            <line x1="180" y1="170" x2="180" y2="190" stroke="#475569" strokeWidth="3" />
            <line x1="210" y1="175" x2="210" y2="185" stroke="#475569" strokeWidth="1.5" />
            <text x="195" y="165" textAnchor="middle" className="text-[9px] font-bold fill-slate-600">البطارية (جـ)</text>
            
            <text x="200" y="210" textAnchor="middle" className="text-[11px] font-bold fill-indigo-600 font-mono">السعة (س) = ε × أ / ف</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">تركيب المكثف الكهربائي: لوحان معدنيان متوازيان يحصران مادة عازلة لتخزين الطاقة الكهربائية</p>
        </div>
      );
    case "electromagnetism-induction":
      return (
        <div className="w-full max-w-sm" id="diagram-electromagnetism-induction">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="100" y="80" width="200" height="40" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <text x="200" y="104" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">قلب حديد مطاوع</text>
            
            <path d="M120,70 Q130,130 140,70" stroke="#ea580c" strokeWidth="3" fill="none" />
            <path d="M150,70 Q160,130 170,70" stroke="#ea580c" strokeWidth="3" fill="none" />
            <path d="M180,70 Q190,130 200,70" stroke="#ea580c" strokeWidth="3" fill="none" />
            <path d="M210,70 Q220,130 230,70" stroke="#ea580c" strokeWidth="3" fill="none" />
            <path d="M240,70 Q250,130 260,70" stroke="#ea580c" strokeWidth="3" fill="none" />
            
            <path d="M90,100 C40,50 360,50 310,100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" fill="none" />
            <path d="M90,100 C40,150 360,150 310,100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" fill="none" />
            
            <text x="200" y="30" textAnchor="middle" className="text-[12px] font-bold fill-blue-600">خطوط المجال (الفيض المغناطيسي)</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">الحث الكهرومغناطيسي: مرور تيار في لولب سلكي يولد مجالاً فيضياً مغناطيسياً كثيفاً في القلب</p>
        </div>
      );
    case "self-inductance":
      return (
        <div className="w-full max-w-sm" id="diagram-self-inductance">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <path d="M80,100 L120,100 Q130,80 140,100 Q150,80 160,100 Q170,80 180,100 Q190,80 200,100 Q210,80 220,100 L260,100" stroke="#2563eb" strokeWidth="2.5" fill="none" />
            <text x="170" y="65" textAnchor="middle" className="text-[12px] font-bold fill-blue-600">ملف حثي (خنق ذاتي)</text>
            
            <ellipse cx="170" cy="90" rx="40" ry="15" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" fill="none" />
            
            <g transform="translate(260, 130)">
              <line x1="0" y1="40" x2="110" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="10" y1="50" x2="10" y2="-10" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M10,40 Q40,40 60,10 L100,10" stroke="#10b981" strokeWidth="2" fill="none" />
              <text x="105" y="48" className="text-[8px] fill-slate-500">زمن</text>
              <text x="0" y="-12" className="text-[8px] fill-slate-500">التيار (ت)</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">الحث الذاتي: يقاوم الملف التغير المفاجئ في شدة التيار الكهربائي وينتج قوة دافعة عكسية</p>
        </div>
      );
    case "semiconductors-doping":
      return (
        <div className="w-full max-w-md" id="diagram-semiconductors-doping">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <g transform="translate(30, 20)">
              <text x="65" y="15" textAnchor="middle" className="text-[11px] font-black fill-slate-800">بلورة نوع N (فوسفور)</text>
              <rect x="10" y="25" width="110" height="110" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="35" cy="50" r="12" fill="#cbd5e1" stroke="#64748b" />
              <text x="35" y="53" textAnchor="middle" className="text-[8px] fill-slate-700">Si</text>
              <circle cx="95" cy="50" r="12" fill="#cbd5e1" stroke="#64748b" />
              <text x="95" y="53" textAnchor="middle" className="text-[8px] fill-slate-700">Si</text>
              
              <circle cx="65" cy="80" r="14" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
              <text x="65" y="83" textAnchor="middle" className="text-[10px] font-bold fill-amber-900">P</text>
              
              <circle cx="95" cy="95" r="4.5" fill="#ef4444" />
              <text x="110" y="98" className="text-[8px] font-bold fill-red-600">-هـ حر</text>
            </g>
            
            <g transform="translate(210, 20)">
              <text x="65" y="15" textAnchor="middle" className="text-[11px] font-black fill-slate-800">بلورة نوع P (بورون)</text>
              <rect x="10" y="25" width="110" height="110" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="35" cy="50" r="12" fill="#cbd5e1" stroke="#64748b" />
              <text x="35" y="53" textAnchor="middle" className="text-[8px] fill-slate-700">Si</text>
              
              <circle cx="65" cy="80" r="14" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
              <text x="65" y="83" textAnchor="middle" className="text-[10px] font-bold fill-emerald-900">B</text>
              
              <circle cx="95" cy="95" r="5" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="2" />
              <text x="110" y="98" className="text-[8px] font-bold fill-emerald-600">فجوة (+)</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">التشويب: إدخال شوائب خماسية لإنتاج بلورة نوع N غنية بالإلكترونات، أو ثلاثية لنوع P غنية بالفجوات</p>
        </div>
      );
    case "structures-trusses":
      return (
        <div className="w-full max-w-sm" id="diagram-structures-trusses">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <polygon points="50,140 150,40 250,140" fill="none" stroke="#475569" strokeWidth="3" />
            <polygon points="150,40 250,40 350,140" fill="none" stroke="#475569" strokeWidth="3" />
            
            <line x1="150" y1="40" x2="250" y2="140" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="250" y1="40" x2="250" y2="140" stroke="#10b981" strokeWidth="2.5" />
            <line x1="150" y1="40" x2="150" y2="140" stroke="#10b981" strokeWidth="2.5" />
            <line x1="50" y1="140" x2="350" y2="140" stroke="#475569" strokeWidth="3" />
            
            <g transform="translate(150, 10)">
              <line x1="0" y1="0" x2="0" y2="25" stroke="#ea580c" strokeWidth="2" />
              <polygon points="0,25 -4,17 4,17" fill="#ea580c" />
              <text x="10" y="15" className="text-[8px] font-bold fill-orange-600">حمل خارجي</text>
            </g>
            
            <polygon points="50,140 40,155 60,155" fill="#475569" />
            <rect x="335" y="140" width="30" height="15" fill="#64748b" />
            
            <text x="260" y="90" className="text-[10px] font-bold fill-emerald-600">عنصر انضغاط (أخضر)</text>
            <text x="130" y="110" className="text-[10px] font-bold fill-red-600">عنصر شد (أحمر)</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">الجملونات الإنشائية: هياكل مثلثة متكاملة تتوزع فيها الأحمال الخارجية كقوى شد أو ضغط نقية</p>
        </div>
      );
    case "arches-foundations":
      return (
        <div className="w-full max-w-sm" id="diagram-arches-foundations">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <path d="M80,150 C80,50 320,50 320,150" fill="none" stroke="#475569" strokeWidth="15" strokeDasharray="18,1" />
            
            <path d="M195,50 L205,50 L200,65 Z" fill="#ef4444" stroke="#475569" strokeWidth="1" />
            <text x="200" y="40" textAnchor="middle" className="text-[10px] font-black fill-red-600">حجر العقد الأساسي</text>
            
            <rect x="60" y="150" width="40" height="40" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <rect x="300" y="150" width="40" height="40" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            
            <path d="M190,65 Q130,80 90,135" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" fill="none" />
            <polygon points="90,135 98,128 92,126" fill="#ef4444" />
            
            <path d="M210,65 Q270,80 310,135" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" fill="none" />
            <polygon points="310,135 308,126 302,128" fill="#ef4444" />
            
            <text x="200" y="110" textAnchor="middle" className="text-[11px] font-bold fill-red-600">تحويل قوى الانحناء إلى ضغط جانبي</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">عقد القوس والأساسات: ينقل الأحمال رأسياً ثم جانبياً للأساسات لزيادة الثبات الميكانيكي</p>
        </div>
      );
    case "stress-strain-hooke":
      return (
        <div className="w-full max-w-sm" id="diagram-stress-strain-hooke">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <line x1="50" y1="180" x2="350" y2="180" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="190" stroke="#475569" strokeWidth="2" />
            <text x="345" y="195" className="text-[10px] fill-slate-600">الانفعال (ع)</text>
            <text x="15" y="15" className="text-[10px] fill-slate-600">الإجهاد (جـ)</text>
            
            <path d="M50,180 L140,100 Q160,90 190,70 T230,40 T270,70 L300,100" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            
            <circle cx="140" cy="100" r="3.5" fill="#10b981" />
            <text x="140" y="90" textAnchor="middle" className="text-[8px] font-bold fill-emerald-600">حد المرونة (قانون هوك)</text>
            
            <circle cx="190" cy="70" r="3.5" fill="#f59e0b" />
            <text x="190" y="60" textAnchor="middle" className="text-[8px] font-bold fill-amber-600">حد الخضوع</text>
            
            <circle cx="250" cy="45" r="3.5" fill="#ef4444" />
            <text x="250" y="35" textAnchor="middle" className="text-[8px] font-bold fill-red-600">أقصى إجهاد شد</text>
            
            <circle cx="300" cy="100" r="3.5" fill="#7f1d1d" />
            <text x="315" y="110" textAnchor="middle" className="text-[8px] font-bold fill-red-900">نقطة الكسر</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">منحنى الإجهاد والانفعال: يوضح حد المرونة الخطي التابع لقانون هوك، والحد اللدن، ومرحلة الانهيار والكسر</p>
        </div>
      );
    case "fluid-mechanics-viscosity":
      return (
        <div className="w-full max-w-sm" id="diagram-fluid-mechanics-viscosity">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="50" y="40" width="280" height="15" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <line x1="330" y1="47" x2="370" y2="47" stroke="#ea580c" strokeWidth="2" />
            <polygon points="370,47 362,43 362,51" fill="#ea580c" />
            <text x="350" y="35" className="text-[9px] font-bold fill-orange-600">السرعة (س)</text>
            
            <rect x="50" y="150" width="280" height="15" fill="#475569" />
            
            <rect x="50" y="55" width="280" height="95" fill="#eff6ff" opacity="0.6" />
            
            <line x1="120" y1="55" x2="120" y2="150" stroke="#334155" strokeWidth="1.5" />
            
            <line x1="120" y1="65" x2="190" y2="65" stroke="#2563eb" strokeWidth="1.5" />
            <polygon points="190,65 184,62 184,68" fill="#2563eb" />
            
            <line x1="120" y1="85" x2="170" y2="85" stroke="#2563eb" strokeWidth="1.5" />
            <polygon points="170,85 164,82 164,88" fill="#2563eb" />
            
            <line x1="120" y1="105" x2="150" y2="105" stroke="#2563eb" strokeWidth="1.5" />
            <polygon points="150,105 144,102 144,108" fill="#2563eb" />
            
            <line x1="120" y1="125" x2="135" y2="125" stroke="#2563eb" strokeWidth="1.5" />
            <polygon points="135,125 129,122 129,128" fill="#2563eb" />
            
            <text x="190" y="105" className="text-[11px] font-bold fill-blue-700">تدرج السرعات للمائع</text>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">اللزوجة وميكانيكا الموائع: الاحتكاك والقص الداخلي بين طبقات المائع عند تحريك اللوح العلوي</p>
        </div>
      );
    case "environmental-pollution":
      return (
        <div className="w-full max-w-sm" id="diagram-environmental-pollution">
          <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
            <rect x="120" y="60" width="160" height="110" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5" />
            
            <path d="M120,90 L150,95 L165,85" stroke="#475569" strokeWidth="2.5" fill="none" />
            <path d="M280,120 L240,125 L230,115" stroke="#475569" strokeWidth="2.5" fill="none" />
            
            <rect x="150" y="80" width="100" height="12" fill="#ea580c" rx="2" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3" />
            <text x="200" y="89" textAnchor="middle" className="text-[8px] font-bold fill-white">تسليح متآكل</text>
            
            <rect x="150" y="125" width="100" height="12" fill="#ea580c" rx="2" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3" />
            <text x="200" y="134" textAnchor="middle" className="text-[8px] font-bold fill-white">تأثير الأمطار الحمضية</text>
            
            <g transform="translate(10, 10)">
              <path d="M80,25 C80,15 120,15 130,25" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <line x1="100" y1="35" x2="95" y2="45" stroke="#2563eb" strokeWidth="1.5" />
              <line x1="120" y1="35" x2="115" y2="45" stroke="#2563eb" strokeWidth="1.5" />
              <text x="145" y="28" className="text-[9px] font-black fill-red-600">أبخرة ملوثة وعوامل صدأ</text>
            </g>
          </svg>
          <p className="text-center text-xs text-indigo-600 font-bold mt-2">التأثير البيئي على المواد: تسبب العوامل الكيميائية تآكلاً للصلب الداخلي وتفتيتاً لخرسانة المبنى</p>
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center text-slate-500">
          <Star className="h-10 w-10 text-blue-600 mb-2 animate-pulse" />
          <p className="text-sm font-bold text-slate-800">جرّب محاكاة المفاهيم عملياً!</p>
          <p className="text-xs text-slate-500 text-center max-w-sm mt-1">
            يمكنك الانتقال لقسم **المعمل التفاعلي** بالأعلى لتجربة المحاكيات والرسومات الهندسية ثنائية وثلاثية الأبعاد وحل أوراق العمل المخصصة لكل باب.
          </p>
        </div>
      );
  }
}

export default function CurriculumExplorer({ onAskAi, onGoToLab, lang = "ar" }: CurriculumExplorerProps) {
  const t = UI_TRANSLATIONS[lang];
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(curriculumData[0]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("intro-projection");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorite_lessons");
    return saved ? JSON.parse(saved) : [];
  });

  const [reviewedLessons, setReviewedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem("reviewed_lessons");
    return saved ? JSON.parse(saved) : ["intro-projection"];
  });

  useEffect(() => {
    setReviewedLessons((prev) => {
      if (!prev.includes(selectedLessonId)) {
        const updated = [...prev, selectedLessonId];
        localStorage.setItem("reviewed_lessons", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, [selectedLessonId]);

  // State to control collapsible chapter lists (accordions)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    return { [curriculumData[0].id]: true };
  });

  // State to control mobile dropdown explorer visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiagramZoomed, setIsDiagramZoomed] = useState(false);

  // Comfortable Reading Mode states
  const [readingTheme, setReadingTheme] = useState<"default" | "sepia" | "dark" | "warm">("default");
  const [readingSize, setReadingSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [readingSpacing, setReadingSpacing] = useState<"normal" | "relaxed">("normal");

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleFavorite = (lessonId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem("favorite_lessons", JSON.stringify(updated));
      window.dispatchEvent(new Event("favorites_updated"));
      return updated;
    });
  };

  const currentLesson = selectedChapter.lessons.find((l) => l.id === selectedLessonId) || selectedChapter.lessons[0];

  // Simple search filter across all chapters and lessons
  const filteredChapters = curriculumData.map((chap) => {
    const matchingLessons = chap.lessons.filter(
      (les) => {
        const trans = LESSON_TRANSLATIONS[les.id];
        const searchTarget = searchQuery.toLowerCase();
        const matchesArTitle = les.title.toLowerCase().includes(searchTarget);
        const matchesEnTitle = trans ? trans.title.toLowerCase().includes(searchTarget) : false;
        const matchesArContent = les.content.some((p) => p.toLowerCase().includes(searchTarget));
        const matchesEnContent = trans ? trans.concept.toLowerCase().includes(searchTarget) : false;
        return matchesArTitle || matchesEnTitle || matchesArContent || matchesEnContent;
      }
    );
    return { ...chap, lessons: matchingLessons };
  }).filter((chap) => {
    const searchTarget = searchQuery.toLowerCase();
    const matchesArChapTitle = chap.arabicTitle.toLowerCase().includes(searchTarget);
    const matchesEnChapTitle = chap.title.toLowerCase().includes(searchTarget);
    return chap.lessons.length > 0 || matchesArChapTitle || matchesEnChapTitle;
  });

  const handleLessonSelect = (chapter: Chapter, lessonId: string) => {
    setSelectedChapter(chapter);
    setSelectedLessonId(lessonId);
    // Expand this chapter when selected
    setExpandedChapters((prev) => ({
      ...prev,
      [chapter.id]: true,
    }));
  };

  const renderLessonContent = (paragraphs: string[]) => {
    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();
      
      // Check if it's a structural heading (ends with : or starts with أولاً/ثانياً/etc. or contains قواعد/خطوات)
      const isHeading = trimmed.endsWith(":") || 
                        trimmed.startsWith("قواعد") || 
                        trimmed.startsWith("شروط") ||
                        (trimmed.length < 100 && (trimmed.startsWith("أولاً") || trimmed.startsWith("ثانياً") || trimmed.startsWith("ثالثاً") || trimmed.startsWith("رابعاً")));
                        
      // Check if it's a list item (starts with digit + dot, or letter + dot, or number in circles)
      const isListItem = /^[0-9١٢٣٤٥٦٧٨٩]+\./.test(trimmed) || 
                         trimmed.startsWith("•") || 
                         trimmed.startsWith("-") ||
                         trimmed.startsWith("أ.") || 
                         trimmed.startsWith("ب.") || 
                         trimmed.startsWith("ت.") || 
                         trimmed.startsWith("ث.");

      if (isHeading) {
        return (
          <h4 
            key={idx} 
            className={`font-black tracking-tight border-r-4 pr-3 mt-6 mb-3 transition-all duration-300 ${
              readingSize === "normal" ? "text-base md:text-lg" : readingSize === "large" ? "text-lg md:text-xl" : "text-xl md:text-2xl"
            } ${
              readingTheme === "default" ? "text-slate-800 border-blue-600" :
              readingTheme === "sepia" ? "text-[#5a2e16] border-[#8a4a21]" :
              readingTheme === "warm" ? "text-[#5c3c26] border-[#9a5d35]" :
              "text-indigo-400 border-indigo-500"
            }`}
          >
            {para}
          </h4>
        );
      }

      if (isListItem) {
        // Extract bullet/number if possible
        const numberMatch = trimmed.match(/^([0-9١٢٣٤٥٦٧٨٩]+|[أبتث])\s*[\.\-:]\s*/);
        const bulletChar = numberMatch ? numberMatch[1] : "•";
        const cleanText = numberMatch ? trimmed.slice(numberMatch[0].length) : trimmed.replace(/^[•-]\s*/, "");

        return (
          <div key={idx} className="flex items-start gap-3 my-3.5 pr-2 transition-all duration-300">
            <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 font-bold text-xs rounded-full mt-0.5 shadow-xs transition-all duration-300 ${
              readingTheme === "default" ? "bg-blue-50 text-blue-600" :
              readingTheme === "sepia" ? "bg-[#eae0c6] text-[#80421d]" :
              readingTheme === "warm" ? "bg-[#eedcb4] text-[#8b4f23]" :
              "bg-indigo-950/80 text-indigo-300 border border-indigo-900/50"
            }`}>
              {bulletChar}
            </span>
            <p className={`text-right flex-1 transition-all duration-300 ${
              readingSpacing === "normal" ? "leading-relaxed" : "leading-loose"
            }`}>
              {cleanText}
            </p>
          </div>
        );
      }

      // Standard paragraph
      return (
        <p 
          key={idx} 
          className={`text-right text-justify transition-all duration-300 ${
            readingSpacing === "normal" ? "leading-relaxed" : "leading-loose"
          }`}
          style={{ textIndent: "1rem" }}
        >
          {para}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn" id="curriculum-explorer-root" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Mobile / Tablet Dropdown Selector (قوائم منسدلة للجوال والتابلت) */}
      <div className="block lg:hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm" id="mobile-curriculum-selector">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-right w-full sm:w-auto">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
              {lang === "en" ? selectedChapter.title.split(":")[0] : (selectedChapter.arabicTitle ? selectedChapter.arabicTitle.split(":")[0] : "المنهج الدراسي")}
            </span>
            <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5 justify-start">
              <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{lang === "en" ? "Current Lesson: " : "الدرس الحالي: "}{(lang === "en" && LESSON_TRANSLATIONS[currentLesson.id]) ? LESSON_TRANSLATIONS[currentLesson.id].title : currentLesson.title}</span>
            </h3>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <span>{isMobileMenuOpen ? (lang === "en" ? "Close Menu" : "إغلاق قائمة المنهج") : (lang === "en" ? "Browse Syllabus ▾" : "تصفح أبواب المنهج ▾")}</span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-fadeIn">
            {/* Search field on mobile */}
            <div className="relative">
              <span className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${lang === "en" ? "left-0 pl-3" : "right-0 pr-3"}`}>
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${lang === "en" ? "pl-9 pr-4 text-left" : "pr-9 pl-4 text-right"}`}
              />
            </div>

            {/* Collapsible Chapters (Accordions) in Mobile Dropdown */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredChapters.map((chapter) => {
                const isChapExpanded = expandedChapters[chapter.id] ?? false;
                const activeChapTitle = lang === "en" ? chapter.title : chapter.arabicTitle;
                const chapLabel = activeChapTitle.split(":")[0];
                const chapName = activeChapTitle.split(":")[1] || activeChapTitle;

                return (
                  <div key={chapter.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className={`w-full bg-slate-50 hover:bg-slate-100/80 p-3 border-b border-slate-200 flex items-center justify-between transition focus:outline-none ${lang === "en" ? "text-left" : "text-right"}`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 font-mono">
                          {chapLabel}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                          {chapName}
                        </h4>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isChapExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isChapExpanded && (
                      <div className="p-1 space-y-1 bg-slate-50/50">
                        {chapter.lessons && chapter.lessons.length > 0 ? (
                          chapter.lessons.map((lesson) => {
                            const isSelected = lesson.id === selectedLessonId;
                            const activeLessonTrans = LESSON_TRANSLATIONS[lesson.id];
                            const lessonTitle = (lang === "en" && activeLessonTrans) ? activeLessonTrans.title : lesson.title;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  handleLessonSelect(chapter as any, lesson.id);
                                  setIsMobileMenuOpen(false); // auto-close
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-200/60"
                                } ${lang === "en" ? "text-left" : "text-right"}`}
                              >
                                <span className="truncate">{lessonTitle}</span>
                                <ChevronLeft className={`h-3.5 w-3.5 flex-shrink-0 ${lang === "en" ? "ml-2 rotate-180" : "mr-2"} ${isSelected ? "text-white" : "text-slate-400"}`} />
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-slate-400 text-xs p-2 text-center">{t.noResults}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile progress tracker & PDF exporter */}
      <div className="block lg:hidden">
        <ReviewSummaryExporter
          reviewedLessons={reviewedLessons}
          favorites={favorites}
          onSelectLesson={(chapterId, lessonId) => {
            const chap = curriculumData.find((c) => c.id === chapterId);
            if (chap) {
              handleLessonSelect(chap as any, lessonId);
            }
          }}
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="curriculum-explorer">
        {/* Sidebar - Search and List of Lessons (Hidden on mobile/tablet) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>{t.searchTitle}</span>
            </h3>

            {/* Search */}
            <div className="relative mb-5" id="search-container">
              <span className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${lang === "en" ? "left-0 pl-3" : "right-0 pr-3"}`}>
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2.5 bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition ${lang === "en" ? "pl-9 pr-4 text-left" : "pr-9 pl-4 text-right"}`}
              />
            </div>

            {/* Chapters and Lessons (Collapsible Accordions for Desktop) */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredChapters.map((chapter) => {
                const isChapExpanded = expandedChapters[chapter.id] ?? false;
                const activeChapTitle = lang === "en" ? chapter.title : chapter.arabicTitle;
                const chapLabel = activeChapTitle.split(":")[0];
                const chapName = activeChapTitle.split(":")[1] || activeChapTitle;

                return (
                  <div key={chapter.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition duration-300">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className={`w-full bg-slate-100 hover:bg-slate-200/80 p-3.5 border-b border-slate-200 flex items-center justify-between transition focus:outline-none ${lang === "en" ? "text-left" : "text-right"}`}
                    >
                      <div>
                        <span className="text-xs font-bold text-blue-600 font-mono tracking-wider">
                          {chapLabel}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">
                          {chapName}
                        </h4>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isChapExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isChapExpanded && (
                      <div className="p-1.5 space-y-1 animate-fadeIn">
                        {chapter.lessons && chapter.lessons.length > 0 ? (
                          chapter.lessons.map((lesson) => {
                            const isSelected = lesson.id === selectedLessonId;
                            const activeLessonTrans = LESSON_TRANSLATIONS[lesson.id];
                            const lessonTitle = (lang === "en" && activeLessonTrans) ? activeLessonTrans.title : lesson.title;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleLessonSelect(chapter as any, lesson.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                                } ${lang === "en" ? "text-left" : "text-right"}`}
                              >
                                <span className="truncate">{lessonTitle}</span>
                                <ChevronLeft className={`h-3.5 w-3.5 flex-shrink-0 ${lang === "en" ? "ml-2 rotate-180" : "mr-2"} ${isSelected ? "text-white" : "text-slate-400"}`} />
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-slate-400 text-xs p-3 text-center">{t.noResults}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <ReviewSummaryExporter
            reviewedLessons={reviewedLessons}
            favorites={favorites}
            onSelectLesson={(chapterId, lessonId) => {
              const chap = curriculumData.find((c) => c.id === chapterId);
              if (chap) {
                handleLessonSelect(chap as any, lessonId);
              }
            }}
            lang={lang}
          />
        </div>

        {/* Main Content Area - Selected Lesson */}
        <div className="lg:col-span-8 space-y-6" id="lesson-content-panel">
          {/* Chapter Explanation Video Card */}
          {CHAPTER_VIDEOS[selectedChapter.id] && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-3 relative overflow-hidden" id="chapter-video-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl">
                    <Video className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">
                      {lang === "en" ? "🎥 Chapter Video Lesson: " : "🎥 الشرح المرئي الكامل: "}
                      {lang === "en" ? (selectedChapter.title.split(":")[1] || selectedChapter.title) : (selectedChapter.arabicTitle ? selectedChapter.arabicTitle.split(":")[1] || selectedChapter.arabicTitle : selectedChapter.title)}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {lang === "en" ? "Official videotaped class for the Sudan National Secondary Certificate syllabus" : "حصة مصورة للمنهج السوداني المعتمد للشهادة الثانوية"}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-full animate-pulse">
                  {lang === "en" ? "Autoplay Active ⚡" : "جاري التشغيل التلقائي ⚡"}
                </div>
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                <iframe
                  key={selectedChapter.id}
                  src={`${CHAPTER_VIDEOS[selectedChapter.id]}?autoplay=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={lang === "en" ? "Syllabus Video Explanation" : "شرح الباب المرئي"}
                />
              </div>
            </div>
          )}

          <div className={`rounded-2xl p-6 md:p-8 border transition-all duration-300 relative overflow-hidden ${
          readingTheme === "default" ? "bg-white border-slate-200 text-slate-700 shadow-sm" :
          readingTheme === "sepia" ? "bg-[#fbf7eb] border-[#e6d8b6] text-[#423223] shadow-md" :
          readingTheme === "warm" ? "bg-[#fcfaf2] border-[#ecdcb9] text-[#46392f] shadow-md" :
          "bg-slate-900 border-slate-800 text-slate-200 shadow-md"
        }`}>
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Chapter header */}
          <div className={`flex items-center justify-between mb-4 border-b pb-5 transition-all duration-300 ${
            readingTheme === "default" ? "border-slate-200" :
            readingTheme === "sepia" ? "border-[#e0d2ae]" :
            readingTheme === "warm" ? "border-[#e4d3aa]" :
            "border-slate-800"
          }`}>
            <div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 ${
                readingTheme === "default" ? "text-blue-600 bg-blue-50" :
                readingTheme === "sepia" ? "text-[#80421d] bg-[#f0e4c6]" :
                readingTheme === "warm" ? "text-[#8b4f23] bg-[#f2e7cc]" :
                "text-indigo-400 bg-indigo-950/80"
              }`}>
                {lang === "en" ? selectedChapter.title.split(":")[0] : (selectedChapter.arabicTitle ? selectedChapter.arabicTitle.split(":")[0] : "المنهج الدراسي")}
              </span>
              <h2 className={`text-xl md:text-2xl font-black mt-2 transition-all duration-300 ${
                readingTheme === "default" ? "text-slate-800" :
                readingTheme === "sepia" ? "text-[#5a2e16]" :
                readingTheme === "warm" ? "text-[#5c3c26]" :
                "text-white"
              }`}>
                {lang === "en" && LESSON_TRANSLATIONS[currentLesson.id] ? LESSON_TRANSLATIONS[currentLesson.id].title : currentLesson.title}
              </h2>
              {(currentLesson.subtitle || (lang === "en" && LESSON_TRANSLATIONS[currentLesson.id])) && (
                <p className={`text-sm mt-1 transition-all duration-300 ${
                  readingTheme === "default" ? "text-slate-500" :
                  readingTheme === "sepia" ? "text-[#7b6752]" :
                  readingTheme === "warm" ? "text-[#7f6f60]" :
                  "text-slate-400"
                }`}>{lang === "en" && LESSON_TRANSLATIONS[currentLesson.id] ? LESSON_TRANSLATIONS[currentLesson.id].subtitle : currentLesson.subtitle}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
              {/* Favorite Lesson Button */}
              <button
                onClick={() => toggleFavorite(currentLesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition duration-300 active:scale-95 ${
                  favorites.includes(currentLesson.id)
                    ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
                title={favorites.includes(currentLesson.id) ? t.removeFromFavorites : t.addToFavorites}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(currentLesson.id) ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                <span>{favorites.includes(currentLesson.id) ? (lang === "en" ? "Starred" : "مفضّل") : (lang === "en" ? "Star" : "أضف للمفضلة")}</span>
              </button>

              {/* Quick Ask AI Trigger */}
              <button
                id={`ask-ai-lesson-${currentLesson.id}`}
                onClick={() => onAskAi(`${selectedChapter.title}: ${(lang === "en" && LESSON_TRANSLATIONS[currentLesson.id]) ? LESSON_TRANSLATIONS[currentLesson.id].title : currentLesson.title}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-xl text-xs font-bold transition duration-300 active:scale-95"
              >
                <Cpu className="h-4 w-4 text-indigo-500 group-hover:text-white animate-pulse" />
                <span>{t.askAiTutor}</span>
              </button>
            </div>
          </div>

          {/* Comfort Reading Toolbar */}
          <div className={`mb-6 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition-all duration-300 ${
            readingTheme === "default" ? "bg-slate-50 border-slate-200" :
            readingTheme === "sepia" ? "bg-[#f5ebd2] border-[#dac9a1]" :
            readingTheme === "warm" ? "bg-[#f7f2e5] border-[#ebd9bd]" :
            "bg-slate-950 border-slate-800"
          }`} id="reading-mode-toolbar">
            <div className="flex items-center gap-1.5">
              <Type className={`h-4 w-4 ${readingTheme === "dark" ? "text-indigo-400" : "text-blue-600"}`} />
              <span className={`text-xs font-black ${readingTheme === "dark" ? "text-slate-300" : "text-slate-700"}`}>{t.comfortableReading}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Color Theme Selector */}
              <div className="flex items-center gap-1 bg-white/40 dark:bg-black/10 p-1 rounded-lg border border-slate-200/50">
                <button
                  onClick={() => setReadingTheme("default")}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${
                    readingTheme === "default"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.default}
                </button>
                <button
                  onClick={() => setReadingTheme("sepia")}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${
                    readingTheme === "sepia"
                      ? "bg-[#80421d] text-white shadow-xs"
                      : "text-[#6b5847] hover:bg-[#e4d4b2]"
                  }`}
                  title="Warm Sepia theme"
                >
                  {lang === "en" ? "Sepia 📖" : "سيبيا 📖"}
                </button>
                <button
                  onClick={() => setReadingTheme("warm")}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${
                    readingTheme === "warm"
                      ? "bg-[#8b4f23] text-white shadow-xs"
                      : "text-[#705e52] hover:bg-[#ebd9bd]"
                  }`}
                  title="Creamy warm theme"
                >
                  {lang === "en" ? "Warm 💡" : "دافئ 💡"}
                </button>
                <button
                  onClick={() => setReadingTheme("dark")}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${
                    readingTheme === "dark"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                  title="Eye-safe Dark theme"
                >
                  {lang === "en" ? "Dark 🌙" : "ليلي 🌙"}
                </button>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-white/40 dark:bg-black/10 p-1 rounded-lg border border-slate-200/50">
                <span className={`text-[9px] px-1 font-black ${readingTheme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{t.textSize}:</span>
                <button
                  onClick={() => setReadingSize("normal")}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition ${
                    readingSize === "normal"
                      ? (readingTheme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-600 text-white")
                      : (readingTheme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setReadingSize("large")}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition ${
                    readingSize === "large"
                      ? (readingTheme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-600 text-white")
                      : (readingTheme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  A+
                </button>
                <button
                  onClick={() => setReadingSize("xlarge")}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition ${
                    readingSize === "xlarge"
                      ? (readingTheme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-600 text-white")
                      : (readingTheme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  A++
                </button>
              </div>

              {/* Line Spacing Selector */}
              <div className="flex items-center gap-1 bg-white/40 dark:bg-black/10 p-1 rounded-lg border border-slate-200/50">
                <span className={`text-[9px] px-1 font-black ${readingTheme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{t.lineSpacing}:</span>
                <button
                  onClick={() => setReadingSpacing("normal")}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition ${
                    readingSpacing === "normal"
                      ? (readingTheme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-600 text-white")
                      : (readingTheme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  {lang === "en" ? "Normal" : "عادي"}
                </button>
                <button
                  onClick={() => setReadingSpacing("relaxed")}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition ${
                    readingSpacing === "relaxed"
                      ? (readingTheme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-600 text-white")
                      : (readingTheme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  {t.relaxed}
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Body paragraphs */}
          <div className={`space-y-4 transition-all duration-300 ${
            readingSize === "normal" ? "text-sm md:text-base" : readingSize === "large" ? "text-base md:text-lg" : "text-lg md:text-xl"
          } ${
            readingTheme === "default" ? "text-slate-700 font-sans" :
            readingTheme === "sepia" ? "text-[#423223]" :
            readingTheme === "warm" ? "text-[#46392f]" :
            "text-slate-300"
          } ${lang === "en" ? "text-left" : "text-right text-justify"}`}>
            {lang === "en" && LESSON_TRANSLATIONS[currentLesson.id] ? (
              <div className="space-y-6">
                {/* Core Concept */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100/50">
                  <h4 className="font-black text-slate-800 mb-2 text-sm uppercase tracking-wide flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Core Concept & Theory</span>
                  </h4>
                  <p className="leading-relaxed text-slate-700">{LESSON_TRANSLATIONS[currentLesson.id].concept}</p>
                </div>

                {/* Key Terminology Directory */}
                <div className="space-y-3">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5 border-b pb-2">
                    <Type className="h-4 w-4 text-indigo-600" />
                    <span>Approved Technical Glossary & Translation</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LESSON_TRANSLATIONS[currentLesson.id].keyTerms.map((term, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 border-b pb-1.5 mb-2">
                            <span className="font-black text-indigo-600 font-mono text-xs">{term.en}</span>
                            <span className="font-bold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded-md">{term.ar}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{term.def}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              currentLesson.content ? (
                renderLessonContent(currentLesson.content)
              ) : (
                <p className="text-slate-400 italic">محتوى الدرس قيد التحميل والتجهيز...</p>
              )
            )}
          </div>

          {/* Formulas and Equations Card */}
          {(() => {
            const activeFormulas = (lang === "en" && LESSON_TRANSLATIONS[currentLesson.id]?.formulas) 
              ? LESSON_TRANSLATIONS[currentLesson.id].formulas 
              : currentLesson.formulas;
            if (!activeFormulas || activeFormulas.length === 0) return null;
            return (
              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5" id="lesson-formulas-card">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Compass className="h-4 w-4 text-blue-600 animate-spin-slow" />
                  <span>{lang === "en" ? "Engineering Laws in this Lesson" : "القوانين الهندسية في هذا الدرس"}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeFormulas.map((form, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-slate-500">{form.name}</span>
                        <div className="my-2.5 p-2 bg-blue-50 border border-blue-100 rounded-md text-center font-mono font-bold text-blue-600 text-sm md:text-base">
                          {form.formula}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{form.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5" id="lesson-diagram-card">
            <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span>{lang === "en" ? "Supporting Engineering Diagrams & Visuals" : "التوضيح والرسومات الهندسية المساندة"}</span>
              </h4>
              <button
                onClick={() => setIsDiagramZoomed(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 bg-white border border-slate-200 rounded-lg transition shadow-sm active:scale-95"
                title={lang === "en" ? "Fullscreen zoom view" : "تكبير الرسم ملء الشاشة"}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>{lang === "en" ? "Fullscreen Zoom" : "تكبير ملء الشاشة"}</span>
              </button>
            </div>
            
            {/* Custom SVG Diagrams based on active lesson */}
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center border border-slate-200 min-h-[220px] shadow-sm">
              {renderLessonDiagram(currentLesson.id)}
            </div>
          </div>

          {/* Associated Lab Card */}
          {(() => {
            const mappedLab = lessonLabMapping[currentLesson.id];
            if (!mappedLab) return null;
            
            const LabIcon = mappedLab.labId === "projection" ? Compass :
                            mappedLab.labId === "engine" ? RefreshCw :
                            mappedLab.labId === "elasticity" ? Activity : Zap;

            const labName = lang === "en"
              ? (mappedLab.labId === "projection" ? "Interactive Orthographic Projection Simulator" :
                 mappedLab.labId === "engine" ? "Internal Combustion Cycle Inspector" :
                 mappedLab.labId === "elasticity" ? "Stress-Strain Hooke's Law Tester" : "Interactive Workbench")
              : mappedLab.labName;

            const labDesc = lang === "en"
              ? (mappedLab.labId === "projection" ? "Manipulate 3D projection beams onto Orthographic planes live." :
                 mappedLab.labId === "engine" ? "Analyze the four-stroke piston cycle with pressure-volume indicators." :
                 mappedLab.labId === "elasticity" ? "Stretch metal bars to plot elastic limits, yield stress, and tensile failures." : mappedLab.description)
              : mappedLab.description;
            
            return (
              <div className="mt-8 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-5" id="lesson-associated-lab-card">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-center shrink-0">
                    <LabIcon className={`h-6 w-6 ${mappedLab.labId === "engine" ? "animate-spin-slow" : mappedLab.labId === "elasticity" ? "animate-pulse" : ""}`} />
                  </div>
                  <div className={`space-y-1 ${lang === "en" ? "text-left md:text-left" : "text-center md:text-right"}`}>
                    <span className="text-[10px] font-black text-emerald-600 tracking-wider bg-emerald-100/60 px-2.5 py-0.5 rounded-full inline-block">
                      {lang === "en" ? "Interactive Study Lab" : "المعمل التفاعلي للدرس"}
                    </span>
                    <h4 className="text-base font-bold text-slate-800">{labName}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{labDesc}</p>
                  </div>
                </div>
                {onGoToLab && (
                  <button
                    onClick={() => onGoToLab(currentLesson.id)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/10 hover:shadow-lg transition duration-300 active:scale-95 shrink-0"
                  >
                    <span>{lang === "en" ? "Enter Lab & Run Experiment" : "دخول المعمل وإجراء التجربة"}</span>
                    <ArrowLeft className={`h-4 w-4 ${lang === "en" ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            );
          })()}

          {/* Lesson Summary Card (تلخيص الدرس) */}
          {(() => {
            const summary = (lang === "en" ? englishSummaries[currentLesson.id] : lessonSummaries[currentLesson.id]) || lessonSummaries[currentLesson.id];
            if (!summary) return null;
            return (
              <div className={`mt-8 border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
                readingTheme === "default" ? "bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border-blue-150 shadow-sm" :
                readingTheme === "sepia" ? "bg-[#f5ead0] border-[#d3c29b] text-[#423223]" :
                readingTheme === "warm" ? "bg-[#f6efe0] border-[#decba3] text-[#46392f]" :
                "bg-slate-950 border-slate-800 text-slate-300"
              }`} id="lesson-summary-card">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b transition-all duration-300 ${
                  readingTheme === "default" ? "border-blue-200/60" :
                  readingTheme === "sepia" ? "border-[#d3c29b]/60" :
                  readingTheme === "warm" ? "border-[#decba3]/60" :
                  "border-slate-800"
                }`}>
                  <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-sm">
                    <Lightbulb className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <h4 className={`text-base font-black transition-all duration-300 ${
                      readingTheme === "default" ? "text-slate-800" :
                      readingTheme === "sepia" ? "text-[#5a2e16]" :
                      readingTheme === "warm" ? "text-[#5c3c26]" :
                      "text-white"
                    }`}>
                      {lang === "en" ? "Smart Revision & Summary Card 📋" : "بطاقة التلخيص والمذاكرة الذكية 📋"}
                    </h4>
                    <p className={`text-[10px] font-bold transition-all duration-300 ${
                      readingTheme === "default" ? "text-slate-500" :
                      readingTheme === "sepia" ? "text-[#7b6752]" :
                      readingTheme === "warm" ? "text-[#7f6f60]" :
                      "text-slate-400"
                    }`}>
                      {lang === "en" ? "Condensed study takeaways for rapid revision and exam readiness" : "الخلاصة المركّزة للدرس لسرعة الحفظ والمراجعة العاجلة قبل الامتحان"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 mb-5">
                  <h5 className={`text-xs font-black transition-all duration-300 ${
                    readingTheme === "default" ? "text-indigo-700" :
                    readingTheme === "sepia" ? "text-[#8a4a21]" :
                    readingTheme === "warm" ? "text-[#9a5d35]" :
                    "text-indigo-400"
                  } ${lang === "en" ? "text-left" : "text-right"}`}>
                    {lang === "en" ? "Key Study Takeaways:" : "النقاط الذهبية المستخلصة:"}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summary.takeaways.map((point, index) => (
                      <div key={index} className={`border p-3.5 rounded-xl text-xs md:text-sm leading-relaxed flex gap-2.5 shadow-xs transition duration-300 hover:translate-y-[-1px] ${
                        readingTheme === "default" ? "bg-white border-blue-100 text-slate-700" :
                        readingTheme === "sepia" ? "bg-[#faf6e8] border-[#e2d4b2] text-[#4d3c2c]" :
                        readingTheme === "warm" ? "bg-[#faf7f0] border-[#ebdcb9] text-[#4f4237]" :
                        "bg-slate-900 border-slate-800 text-slate-300"
                      } ${lang === "en" ? "text-left" : "text-right"}`}>
                        <span className={`flex-shrink-0 flex items-center justify-center w-5 h-5 font-bold text-[10px] rounded-full mt-0.5 transition-all duration-300 ${
                          readingTheme === "default" ? "bg-indigo-100 text-indigo-700" :
                          readingTheme === "sepia" ? "bg-[#eae0c6] text-[#80421d]" :
                          readingTheme === "warm" ? "bg-[#eedcb4] text-[#8b4f23]" :
                          "bg-indigo-950 text-indigo-300 border border-indigo-900/50"
                        }`}>
                          {index + 1}
                        </span>
                        <span className="w-full">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-600 text-white p-4 rounded-xl border border-indigo-700 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-black shrink-0 tracking-wider flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>{lang === "en" ? "Exam Tip ✍️" : "تلميحة امتحانية ✍️"}</span>
                  </div>
                  <p className={`text-xs md:text-sm font-semibold leading-relaxed w-full ${lang === "en" ? "text-left" : "text-right"}`}>
                    {summary.examTip}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Zoomed Diagram Modal */}
      {isDiagramZoomed && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-fadeIn" dir={lang === "en" ? "ltr" : "rtl"}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl relative border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setIsDiagramZoomed(false)}
              className="absolute top-4 left-4 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition active:scale-95 border border-slate-200"
              title={lang === "en" ? "Close Zoom" : "إغلاق التكبير"}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header info */}
            <div className={`mb-6 pr-2 border-r-4 border-indigo-600 ${lang === "en" ? "text-left" : "text-right"}`}>
              <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full">
                {lang === "en" ? selectedChapter.title.split(":")[0] : (selectedChapter.arabicTitle ? selectedChapter.arabicTitle.split(":")[0] : "المنهج الدراسي")}
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                {lang === "en" ? "Technical Diagram: " + ((lang === "en" && LESSON_TRANSLATIONS[currentLesson.id]) ? LESSON_TRANSLATIONS[currentLesson.id].title : currentLesson.title) : "مخطط توضيحي: " + currentLesson.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "en" ? "High-definition zoomed view to examine orthographic lines and engineering details." : "عرض مكبر عالي الدقة لفهم وتأمل تفاصيل الرسم الهندسي"}
              </p>
            </div>

            {/* Zoomed Diagram Content */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center w-full min-h-[300px] mb-6">
              <div className="w-full max-w-2xl transform scale-105 md:scale-110 transition duration-300">
                {renderLessonDiagram(currentLesson.id)}
              </div>
            </div>

            {/* Action buttons / asking AI about it */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 w-full">
              <p className={`text-xs text-slate-500 max-w-md leading-relaxed ${lang === "en" ? "text-left" : "text-right"}`}>
                {lang === "en" ? "Study symbols, projection views, and dimensions to prepare for the Sudan National Examination." : "تفحّص الرموز، المساقط، والتعليقات المكتوبة لمساعدتك على الإجابة الدقيقة في امتحان الشهادة السودانية."}
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsDiagramZoomed(false);
                    onAskAi(lang === "en" ? `Explain the engineering drawing diagram in detail for lesson: ${LESSON_TRANSLATIONS[currentLesson.id]?.title || currentLesson.title}` : `اشرح لي الرسم الهندسي والمخطط بالتفصيل لدرس: ${currentLesson.title}`);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition duration-300 active:scale-95 shadow-md"
                >
                  <Cpu className="h-4 w-4 animate-pulse" />
                  <span>{lang === "en" ? "Ask Tutor About This Diagram ✦" : "اسأل المعلم عن هذا المخطط ✦"}</span>
                </button>
                <button
                  onClick={() => setIsDiagramZoomed(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition duration-300 active:scale-95"
                >
                  {lang === "en" ? "Close Window" : "إغلاق النافذة"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
