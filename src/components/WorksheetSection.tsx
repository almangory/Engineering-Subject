import React, { useState, useEffect } from "react";
import { QUESTION_POOL, worksheetsData } from "../data/worksheetsData";
import { curriculumData } from "../data/curriculumData";
import { Worksheet, Question } from "../types";
import { 
  FileText, Printer, CheckCircle, XCircle, RotateCcw, Award, Sparkles, 
  Lock, Unlock, Heart, Filter, Settings, HelpCircle, Check, Eye, BookOpen, 
  ChevronDown, HelpCircle as HelpIcon 
} from "lucide-react";

// Password for removing watermark: "20302060"
const WATERMARK_PASSWORD = [50, 48, 51, 48, 50, 48, 54, 48].map(c => String.fromCharCode(c)).join("");

export default function WorksheetSection() {
  // Config state
  const [scope, setScope] = useState<string>("all"); // "all" | "favorites" | "chapter-1" | "chapter-2" | ...
  const [lessonId, setLessonId] = useState<string>("all");
  const [preferredType, setPreferredType] = useState<string>("all"); // "all" | "multiple-choice" | ...
  const [targetCount, setTargetCount] = useState<number>(5); // slider from 1 to 20

  // Control panel visibility toggle (hidden by default to improve mobile/tablet viewing experience)
  const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(false);

  // Favorites state
  const [favoriteLessonIds, setFavoriteLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorite_lessons");
    return saved ? JSON.parse(saved) : [];
  });

  // Current generated worksheet
  const [currentWs, setCurrentWs] = useState<Worksheet>(worksheetsData[0]);
  
  // Interactive answers state: key is either "questionId" or "questionId_subIndex"
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPointsPossible, setTotalPointsPossible] = useState(0);

  // Watermark state
  const [isWatermarkRemoved, setIsWatermarkRemoved] = useState<boolean>(() => {
    return sessionStorage.getItem("watermark_removed") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Sync favorites from localStorage dynamically (e.g. if updated in other tab)
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      const saved = localStorage.getItem("favorite_lessons");
      setFavoriteLessonIds(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener("favorites_updated", handleFavoritesUpdate);
    return () => window.removeEventListener("favorites_updated", handleFavoritesUpdate);
  }, []);

  // Generate dynamic worksheet based on current configurations
  const handleGenerateWorksheet = () => {
    // 1. Filter pool by scope (chapter or favorites)
    let filtered = [...QUESTION_POOL];

    if (scope === "favorites") {
      filtered = filtered.filter(q => favoriteLessonIds.includes(q.lessonId));
    } else if (scope.startsWith("chapter-")) {
      filtered = filtered.filter(q => q.chapterId === scope);
      if (lessonId !== "all") {
        filtered = filtered.filter(q => q.lessonId === lessonId);
      }
    }

    // 2. Filter by preferred type
    if (preferredType !== "all") {
      filtered = filtered.filter(q => q.type === preferredType);
    }

    // 3. Prevent duplicate questions by shuffling unique items
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    
    // 4. Slice to desired quantity (up to 20)
    const selectedQuestions = shuffled.slice(0, targetCount);

    // If empty, fallback gracefully to any questions in the pool to avoid blank screen
    if (selectedQuestions.length === 0) {
      // Find any questions
      const fallbackQuestions = [...QUESTION_POOL]
        .sort(() => Math.random() - 0.5)
        .slice(0, targetCount);
      
      setCurrentWs({
        id: "generated-fallback",
        title: "ورقة عمل مولدة تلقائياً (عامة)",
        chapterId: "all",
        description: "لم نجد أسئلة كافية تطابق خيارات التصفية الخاصة بك تماماً، لذا قمنا بتوليد ورقة عمل عامة من المنهج لتجربتها.",
        questions: fallbackQuestions
      });
    } else {
      let title = "ورقة عمل مولدة مخصصة";
      let desc = "ورقة عمل مجهزة تفاعلياً بناءً على تفضيلاتك من محتوى المنهج المعتمد.";

      if (scope === "favorites") {
        title = `ورقة عمل من دروسك المفضلة (${selectedQuestions.length} سؤال)`;
        desc = "تضم هذه الورقة أسئلة متنوعة مستخرجة حصرياً من الدروس التي قمت بإضافتها للمفضلة.";
      } else if (scope.startsWith("chapter-")) {
        const chap = curriculumData.find(c => c.id === scope);
        const chapName = chap ? chap.arabicTitle.split(":")[1] || chap.arabicTitle : "";
        title = `اختبار مخصص: ${chapName}`;
        if (lessonId !== "all") {
          const les = chap?.lessons.find(l => l.id === lessonId);
          if (les) title = `اختبار مخصص: درس ${les.title}`;
        }
      } else {
        title = `اختبار شامل لكامل المنهج (${selectedQuestions.length} سؤال)`;
      }

      setCurrentWs({
        id: `generated-${Date.now()}`,
        title,
        chapterId: scope,
        description: desc,
        questions: selectedQuestions
      });
    }

    // Reset solving state
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // Run initial generation on component load or scope change
  useEffect(() => {
    handleGenerateWorksheet();
  }, [scope, lessonId, preferredType, targetCount]);

  // Handle standard choice selecting (MC & True/False)
  const handleAnswerSelect = (questionId: string, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Handle text typing (Fill blank & calculation)
  const handleTextChange = (questionId: string, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Reset interactive test state
  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTotalPointsPossible(0);
  };

  // Correct and grade the current worksheet
  const handleSubmit = () => {
    let earnedPoints = 0;
    let maxPossiblePoints = 0;

    currentWs.questions.forEach((q) => {
      if (q.type === "matching" && q.matchingPairs) {
        // Each pair counts as 1 point
        maxPossiblePoints += q.matchingPairs.length;
        q.matchingPairs.forEach((pair, pairIdx) => {
          const userAns = answers[`${q.id}_match_${pairIdx}`] || "";
          if (userAns.trim().toLowerCase() === pair.left.trim().toLowerCase()) {
            earnedPoints++;
          }
        });
      } else if (q.type === "diagram-labeling" && q.diagramLabels) {
        // Each label counts as 1 point
        maxPossiblePoints += q.diagramLabels.length;
        q.diagramLabels.forEach((lbl) => {
          const userAns = answers[`${q.id}_label_${lbl.number}`] || "";
          if (userAns.trim().toLowerCase() === lbl.label.trim().toLowerCase()) {
            earnedPoints++;
          }
        });
      } else {
        // Single answer questions
        maxPossiblePoints += 1;
        const userAns = (answers[q.id] || "").trim().toLowerCase();
        const correctAns = q.correctAnswer.trim().toLowerCase();
        if (userAns === correctAns) {
          earnedPoints++;
        }
      }
    });

    setScore(earnedPoints);
    setTotalPointsPossible(maxPossiblePoints);
    setSubmitted(true);
  };

  // Trigger print mode
  const handlePrint = () => {
    window.print();
  };

  // Handle password submission to unlock watermark
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === WATERMARK_PASSWORD) {
      setIsWatermarkRemoved(true);
      sessionStorage.setItem("watermark_removed", "true");
      setPasswordError("");
      setShowPasswordModal(false);
    } else {
      setPasswordError("كلمة المرور غير صحيحة، يرجى إدخال الباسورد الصحيح لإزالة العلامة المائية.");
    }
  };

  // Get matching chapter's lessons for scope selection dropdown
  const selectedChapterObj = curriculumData.find(c => c.id === scope);
  const showLessonSelector = scope.startsWith("chapter-") && selectedChapterObj;

  // Custom interactive diagram renderer
  const renderInteractiveDiagram = (diagramId: string) => {
    switch (diagramId) {
      case "capacitor":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-4 my-3 max-w-sm mx-auto shadow-inner relative">
            <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
              <rect x="50" y="40" width="300" height="15" fill="#f1f5f9" stroke="#475569" strokeWidth="2" rx="4" />
              <rect x="50" y="140" width="300" height="15" fill="#f1f5f9" stroke="#475569" strokeWidth="2" rx="4" />
              <rect x="50" y="55" width="300" height="85" fill="#eff6ff" opacity="0.6" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3" />
              <path d="M200,15 L200,40 M200,155 L200,190 M100,190 L300,190" stroke="#475569" strokeWidth="2" fill="none" />
              <rect x="175" y="180" width="50" height="20" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
              <text x="200" y="194" textAnchor="middle" className="text-xs font-bold fill-slate-700">+- مصدر جهد</text>
              
              {/* Badges for labeling */}
              <g transform="translate(110, 48)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">1</text>
              </g>
              <g transform="translate(200, 95)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">2</text>
              </g>
              <g transform="translate(200, 190)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">3</text>
              </g>
            </svg>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-semibold">مخطط المكثف اللوحي المتوازي: حدد الأرقام من الخيارات بالأسفل</p>
          </div>
        );
      case "engine":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-4 my-3 max-w-sm mx-auto shadow-inner relative">
            <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
              {/* Cylinder outer walls */}
              <path d="M120,40 L120,180 M280,40 L280,180" stroke="#475569" strokeWidth="4" />
              {/* Piston */}
              <rect x="124" y="110" width="152" height="50" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              {/* Spark plug */}
              <rect x="190" y="10" width="20" height="30" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
              <circle cx="200" cy="40" r="3" fill="#ef4444" />
              {/* Inlet valve */}
              <path d="M140,40 L160,25" stroke="#10b981" strokeWidth="3" />
              {/* Exhaust valve */}
              <path d="M260,40 L240,25" stroke="#ef4444" strokeWidth="3" />
              
              {/* Badges for labeling */}
              <g transform="translate(150, 20)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">1</text>
              </g>
              <g transform="translate(250, 20)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">2</text>
              </g>
              <g transform="translate(200, 20)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">3</text>
              </g>
              <g transform="translate(200, 135)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">4</text>
              </g>
            </svg>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-semibold">مخطط أسطوانة المحرك رباعي الأشواط: طابق الأرقام بأجزائها</p>
          </div>
        );
      case "stress-strain-hooke":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-4 my-3 max-w-sm mx-auto shadow-inner relative">
            <svg viewBox="0 0 400 220" className="w-full h-auto text-slate-500">
              <line x1="50" y1="180" x2="350" y2="180" stroke="#475569" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="190" stroke="#475569" strokeWidth="2" />
              <path d="M50,180 L140,100 Q160,90 190,70 T230,40 T270,70 L300,100" fill="none" stroke="#2563eb" strokeWidth="2.5" />
              
              {/* Badges for labeling */}
              <g transform="translate(140, 100)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">1</text>
              </g>
              <g transform="translate(190, 70)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">2</text>
              </g>
              <g transform="translate(250, 45)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">3</text>
              </g>
              <g transform="translate(300, 100)">
                <circle r="12" fill="#ef4444" className="animate-pulse" />
                <text textAnchor="middle" y="4" fill="white" className="text-xs font-black font-mono">4</text>
              </g>
            </svg>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-semibold">منحنى الإجهاد والانفعال الإنشائي: حدد قيم ومسميات الأرقام</p>
          </div>
        );
      default:
        return null;
    }
  };

  const percentage = totalPointsPossible > 0 ? Math.round((score / totalPointsPossible) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="worksheets-section">
      
      {/* Dynamic Worksheet Generator & Configuration Panel */}
      <div className={`transition-all duration-300 print:hidden ${
        isPanelExpanded 
          ? "lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm block animate-fadeIn" 
          : "hidden"
      }`}>
        
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Filter className="h-5 w-5 text-orange-500 animate-pulse" />
            <span>لوحة التحكم وتخصيص الاختبار</span>
          </h3>
          <button
            onClick={() => setIsPanelExpanded(false)}
            className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
            title="إخفاء لوحة التحكم"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-100 pb-2">
          خصص مادة ومنهج ورقة العمل، واختر نوع الأسئلة وعددها لتوليد اختبار تفاعلي فوري بمواصفات حقيقية دون تكرار.
        </p>

        {/* 1. Scope Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">نطاق الأسئلة ومستوى المادة:</label>
          <div className="relative">
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value);
                setLessonId("all");
              }}
              className="w-full text-right px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500 focus:bg-white transition"
            >
              <option value="all">كامل المنهج الدراسي</option>
              <option value="favorites">⭐ الدروس المفضلة فقط ({favoriteLessonIds.length})</option>
              {curriculumData.map(c => (
                <option key={c.id} value={c.id}>
                  {c.arabicTitle.split(":")[0]} : {c.arabicTitle.split(":")[1] || c.arabicTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Secondary Lesson Selector */}
        {showLessonSelector && (
          <div className="space-y-2 animate-fadeIn">
            <label className="block text-xs font-bold text-slate-700">اختر درساً معيناً:</label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className="w-full text-right px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500 focus:bg-white transition"
            >
              <option value="all">جميع دروس هذا الباب</option>
              {selectedChapterObj.lessons.map(l => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Question Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">نوع الأسئلة المفضل:</label>
          <select
            value={preferredType}
            onChange={(e) => setPreferredType(e.target.value)}
            className="w-full text-right px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500 focus:bg-white transition"
          >
            <option value="all">جميع أنواع الأسئلة المتوفرة</option>
            <option value="multiple-choice">اختيار من متعدد (أ، ب، جـ، د)</option>
            <option value="true-false">صح وخطأ (تفاعلي)</option>
            <option value="fill-blank">أكمل الفراغ بالعبارات الصحيحة</option>
            <option value="matching">وصل الكلمات ومزاوجة المفاهيم</option>
            <option value="diagram-labeling">إيضاح مكونات الرسم الهندسي</option>
            <option value="calculation">مسائل وحسابات رياضية هندسية</option>
          </select>
        </div>

        {/* 4. Target count slider up to 20 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700">عدد الأوراق / الأسئلة المطلوبة:</label>
            <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full font-mono">{targetCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={targetCount}
            onChange={(e) => setTargetCount(parseInt(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>١</span>
            <span>١٠</span>
            <span>٢٠ ورقة</span>
          </div>
        </div>

        {/* 5. Trigger Button */}
        <button
          onClick={handleGenerateWorksheet}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <Sparkles className="h-4 w-4" />
          <span>توليد ورقة عمل تفاعلية جديدة</span>
        </button>

        {/* Favorites Prompt if empty and scope chosen */}
        {scope === "favorites" && favoriteLessonIds.length === 0 && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center text-[11px] text-rose-600 leading-relaxed font-semibold">
            ⚠️ لم تقم بتفضيل أي مواد في المفضلة بعد. انتقل إلى "المكتشف الدراسي" واضغط على "أضف للمفضلة" في الدروس التي تريدها لتتمكن من توليد اختبار منها هنا!
          </div>
        )}

        {/* Watermark Management status */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">العلامة المائية المطبوعة:</span>
            {isWatermarkRemoved ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-black">
                <Unlock className="h-3.5 w-3.5" />
                <span>تمت الإزالة</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-orange-600 font-black">
                <Lock className="h-3.5 w-3.5" />
                <span>مقفلة ونشطة 🔒</span>
              </span>
            )}
          </div>
          
          <p className="text-[10px] text-slate-400 leading-relaxed">
            تتم طباعة أوراق العمل تلقائياً بعلامة مائية رسمية موثقة تسمى "نقلة للمناهج الإلكترونية". يمكنك تعطيلها مؤقتاً عبر إدخال الباسورد المخفي للمنصة.
          </p>

          {!isWatermarkRemoved ? (
            <button
              onClick={() => {
                setPasswordInput("");
                setPasswordError("");
                setShowPasswordModal(true);
              }}
              className="w-full py-2 bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition"
            >
              إدخال كلمة المرور لإزالة العلامة
            </button>
          ) : (
            <button
              onClick={() => {
                setIsWatermarkRemoved(false);
                sessionStorage.removeItem("watermark_removed");
              }}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-lg text-[10px] transition"
            >
              إعادة تفعيل العلامة المائية
            </button>
          )}
        </div>

      </div>

      {/* Main Interactive Worksheet Canvas */}
      <div className={`${isPanelExpanded ? "lg:col-span-8" : "lg:col-span-12"} space-y-6 print:col-span-12 transition-all duration-300 relative`}>
        
        {/* The Printable Container styled like A4 Sheet */}
        <div 
          className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden print:w-[210mm] print:min-h-[297mm] print:m-0 print:p-[15mm] print:shadow-none print:border-none print:box-border" 
          id="printable-a4-sheet"
        >
          {/* Elegant repeating diagonal watermarks behind entire content */}
          {!isWatermarkRemoved && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-wrap justify-center items-center opacity-[0.05] select-none z-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="text-slate-900 font-black text-2xl md:text-3xl -rotate-45 whitespace-nowrap m-16">
                  نقلة للمناهج الإلكترونية
                </div>
              ))}
            </div>
          )}

          {/* Printable Header - Standard Sudan Secondary Curriculum Layout */}
          <div className="hidden print:block text-center border-b-2 border-slate-400 pb-4 mb-6 text-slate-800 relative z-10">
            <h1 className="text-xl font-black">الجمهورية السودانية - وزارة التربية والتعليم</h1>
            <h2 className="text-sm font-bold mt-1">مكتب المناهج والمحاور الوطنية والتوجيهية</h2>
            <h2 className="text-base font-extrabold mt-1.5">مادة العلوم الهندسية - الصف الثاني ثانوي</h2>
            <h3 className="text-md font-bold text-orange-600 mt-1">{currentWs.title}</h3>
            
            <div className="grid grid-cols-3 text-xs mt-4 border border-slate-200 p-2 rounded-lg bg-slate-50/50">
              <span className="text-right">اسم الطالب: ................................................</span>
              <span>الفصل: ......................</span>
              <span className="text-left">التاريخ: ..../..../........م</span>
            </div>
          </div>

          {/* Screen Interactive Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 mb-6 print:hidden relative z-10">
            <div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
                <Sparkles className="h-3 w-3 text-orange-500" />
                <span>اختبار تفاعلي مولد حيّ</span>
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-2">{currentWs.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{currentWs.description}</p>
            </div>
            
            <div className="mt-3 sm:mt-0 flex flex-wrap gap-2 w-full sm:w-auto">
              {/* Toggle Panel Button */}
              <button
                onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm border ${
                  isPanelExpanded
                    ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 border-transparent text-white hover:opacity-90 animate-pulse hover:animate-none"
                }`}
              >
                <Settings className={`h-4 w-4 ${isPanelExpanded ? "animate-spin" : ""}`} />
                <span>{isPanelExpanded ? "إخفاء لوحة التحكم" : "تخصيص وتوليد الأسئلة"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition active:scale-95 shadow-sm"
              >
                <Printer className="h-4 w-4" />
                <span>طباعة (حجم A4)</span>
              </button>
            </div>
          </div>

          {/* Question List Rendering */}
          <div className="space-y-6 relative z-10">
            {currentWs.questions.map((q, idx) => {
              const questionNum = idx + 1;
              const hasPassed = submitted;

              return (
                <div 
                  key={q.id} 
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4 shadow-sm relative print:bg-white print:border-slate-300 print:shadow-none"
                >
                  
                  {/* Question Index Bar */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 print:border-slate-200">
                    <span className="text-xs font-bold text-slate-500">
                      الباب: <span className="text-orange-600 font-mono">{q.chapterId === "chapter-1" ? "الرسم" : q.chapterId === "chapter-2" ? "الميكانيكا" : q.chapterId === "chapter-3" ? "الكهرباء" : "المدنية والبيئة"}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">سؤال {questionNum} من {currentWs.questions.length}</span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1.5">
                    <p className="text-sm md:text-base font-bold text-slate-800 text-right leading-relaxed flex items-start gap-1">
                      <span className="text-orange-500 ml-1">س{questionNum}:</span>
                      <span>{q.questionText}</span>
                    </p>
                  </div>

                  {/* A. MULTIPLE CHOICE */}
                  {q.type === "multiple-choice" && q.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt;
                        const isCorrect = opt === q.correctAnswer;
                        
                        let optionStyle = "border-slate-200 bg-white hover:bg-slate-100/60 text-slate-600";
                        if (isSelected) optionStyle = "border-orange-500 bg-orange-50 text-orange-600 font-bold";
                        
                        if (submitted) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-600 font-black";
                          } else if (isSelected) {
                            optionStyle = "border-rose-500 bg-rose-50 text-rose-600 font-bold";
                          } else {
                            optionStyle = "border-slate-100 bg-white opacity-60 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerSelect(q.id, opt)}
                            className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-300 flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {submitted && isCorrect && <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mr-1" />}
                            {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mr-1" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* B. TRUE-FALSE */}
                  {q.type === "true-false" && (
                    <div className="grid grid-cols-2 gap-3 max-w-xs pt-2">
                      {["صح", "خطأ"].map((opt) => {
                        const isSelected = answers[q.id] === opt;
                        const isCorrect = opt === q.correctAnswer;

                        let optionStyle = "border-slate-200 bg-white hover:bg-slate-100/60 text-slate-600";
                        if (isSelected) optionStyle = "border-orange-500 bg-orange-50 text-orange-600 font-bold";

                        if (submitted) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-600 font-black";
                          } else if (isSelected) {
                            optionStyle = "border-rose-500 bg-rose-50 text-rose-600 font-bold";
                          } else {
                            optionStyle = "border-slate-100 bg-white opacity-60 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerSelect(q.id, opt)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition text-center flex items-center justify-center gap-1.5 ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {submitted && isCorrect && <CheckCircle className="h-4 w-4" />}
                            {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* C. FILL BLANK & D. CALCULATION */}
                  {(q.type === "fill-blank" || q.type === "calculation") && (
                    <div className="space-y-2 pt-2">
                      <input
                        type="text"
                        disabled={submitted}
                        placeholder={q.type === "calculation" ? "اكتب القيمة العددية الناتجة فقط..." : "اكتب الكلمة أو العبارة المناسبة هنا..."}
                        value={answers[q.id] || ""}
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        className={`w-full max-w-md px-4 py-2.5 bg-white text-slate-800 border rounded-xl text-sm focus:outline-none transition ${
                          submitted
                            ? (answers[q.id] || "").trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
                              ? "border-emerald-500 text-emerald-600 font-black bg-emerald-50"
                              : "border-rose-500 text-rose-600 bg-rose-50 font-bold"
                            : "border-slate-200 focus:border-orange-500"
                        }`}
                      />
                      {submitted && (answers[q.id] || "").trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase() && (
                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          <span>العبارة الصحيحة للامتحان هي: {q.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* E. MATCHING (وصل الكلمات) */}
                  {q.type === "matching" && q.matchingPairs && (
                    <div className="space-y-4 pt-2">
                      <div className="bg-orange-50 border border-orange-100 text-orange-800 p-2.5 rounded-lg text-xs leading-relaxed font-bold print:hidden">
                        👉 اختر من القائمة المنسدلة لكل مصطلح بالعمود الأيمن التعريف المناسب له من العمود الأيسر.
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Right column (Terms with Select dropdowns) */}
                        <div className="space-y-2.5">
                          <span className="text-xs font-black text-slate-500 block border-b border-slate-200 pb-1">العمود الأول (المصطلح)</span>
                          {q.matchingPairs.map((pair, pIdx) => {
                            const selectedMatch = answers[`${q.id}_match_${pIdx}`] || "";
                            const isPairCorrect = selectedMatch.trim().toLowerCase() === pair.left.trim().toLowerCase();

                            return (
                              <div key={pIdx} className="bg-white border border-slate-200 p-3 rounded-lg space-y-1.5 shadow-sm">
                                <span className="text-xs font-bold text-slate-800 block">{pair.right}</span>
                                
                                <div className="relative">
                                  <select
                                    disabled={submitted}
                                    value={selectedMatch}
                                    onChange={(e) => handleTextChange(`${q.id}_match_${pIdx}`, e.target.value)}
                                    className={`w-full text-right px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:border-orange-500 transition ${
                                      submitted
                                        ? isPairCorrect
                                          ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                          : "border-rose-500 text-rose-600 bg-rose-50"
                                        : "border-slate-200"
                                    }`}
                                  >
                                    <option value="">-- اختر المصطلح المناسب --</option>
                                    {q.matchingPairs.map((p, itemIdx) => (
                                      <option key={itemIdx} value={p.left}>{p.left}</option>
                                    ))}
                                  </select>
                                </div>

                                {submitted && !isPairCorrect && (
                                  <span className="text-[10px] text-emerald-600 font-black block mt-1">
                                    المطابقة الصحيحة: {pair.left}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Left column (Definitions for visual reference) */}
                        <div className="space-y-2 bg-slate-100 p-3.5 rounded-xl border border-slate-200 h-max self-center">
                          <span className="text-xs font-black text-slate-500 block border-b border-slate-200 pb-1 mb-2">العمود الثاني (التعريفات المراد وصلها)</span>
                          {q.matchingPairs.map((pair, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-1.5 bg-white p-2 border border-slate-200 rounded-lg text-xs text-slate-700">
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500">أ</span>
                              <span>{pair.left}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* F. DIAGRAM LABELING (إيضاح مكونات الرسمة) */}
                  {q.type === "diagram-labeling" && q.diagramLabels && q.diagramId && (
                    <div className="space-y-4 pt-2">
                      
                      {/* Responsive dynamic SVG canvas with numbered badges */}
                      {renderInteractiveDiagram(q.diagramId)}

                      {/* Input / Dropdown Form below the drawing */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-3.5 shadow-sm">
                        <span className="text-xs font-black text-slate-500 block border-b border-slate-100 pb-1.5">حدد الأجزاء الهندسية المقابلة للأرقام في الرسم:</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {q.diagramLabels.map((lbl) => {
                            const userAns = answers[`${q.id}_label_${lbl.number}`] || "";
                            const isCorrectLabel = userAns.trim().toLowerCase() === lbl.label.trim().toLowerCase();

                            return (
                              <div key={lbl.number} className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">الجزء رقم ({lbl.number}):</label>
                                <select
                                  disabled={submitted}
                                  value={userAns}
                                  onChange={(e) => handleTextChange(`${q.id}_label_${lbl.number}`, e.target.value)}
                                  className={`w-full text-right px-3 py-2 bg-slate-50 border rounded-lg text-xs font-bold text-slate-600 focus:outline-none transition ${
                                    submitted
                                      ? isCorrectLabel
                                        ? "border-emerald-500 text-emerald-600 bg-emerald-50 font-black"
                                        : "border-rose-500 text-rose-600 bg-rose-50 font-bold"
                                      : "border-slate-200 focus:border-orange-500"
                                  }`}
                                >
                                  <option value="">-- اختر مسمى الجزء --</option>
                                  {lbl.options.map((opt, optIdx) => (
                                    <option key={optIdx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                                
                                {submitted && !isCorrectLabel && (
                                  <p className="text-[10px] text-emerald-600 font-black block mt-0.5">
                                    الإجابة الصحيحة: {lbl.label}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Hint indicator */}
                  {q.hint && !submitted && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/40 border border-slate-100 px-3 py-1.5 rounded-lg w-max print:hidden">
                      <HelpIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>تلميحة الحل: <span className="italic">{q.hint}</span></span>
                    </div>
                  )}

                  {/* Explanations shown only on submit */}
                  {submitted && q.explanation && (
                    <div className="mt-3.5 p-4 bg-orange-50/50 border-r-4 border-orange-500 rounded-lg text-xs text-slate-600 leading-relaxed">
                      <div className="flex items-center gap-1 text-orange-700 font-extrabold mb-1">
                        <Award className="h-4 w-4" />
                        <span>توضيح الأثر والقانون الهندسي للامتحان:</span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Correcting & Solving Action footer */}
          <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl text-sm shadow-md shadow-orange-500/10 active:scale-95 transition"
              >
                تأكيد وحل الاختبار تفاعلياً وتصحيحه فوراً
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                
                <div className="flex items-center gap-4">
                  {/* Circular Score display badge */}
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white px-5 py-4 rounded-2xl flex flex-col items-center shadow-md">
                    <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">النتيجة النهائية</span>
                    <span className="text-2xl font-black font-mono leading-none mt-1">{percentage}%</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      لقد أحرزت {score} نقطة صحيحة من إجمالي {totalPointsPossible} نقاط
                    </h4>
                    <div className="text-xs mt-1">
                      {percentage === 100 ? (
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1 animate-bounce">🏆 درجة كاملة وممتازة! أنت جاهز تماماً لامتحان الشهادة السودانية!</span>
                      ) : percentage >= 75 ? (
                        <span className="text-indigo-600 font-bold">مهندس مبدع وممتاز! أداء راقٍ وفهم شامل للمسائل.</span>
                      ) : (
                        <span className="text-slate-500 leading-relaxed">أداء جيد، ننصحك بمراجعة قوانين الباب وحفظ المصطلحات والمحاولة مرة أخرى للتحسين!</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
                >
                  <RotateCcw className="h-4 w-4 text-orange-500" />
                  <span>أعد محاولة حل الاختبار</span>
                </button>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* Elegant Password Modal for Watermark Removal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-scaleUp">
            
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Lock className="h-5 w-5 text-orange-500" />
              <span>إدخال الباسورد المخفي للمنصة</span>
            </h4>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              لإزالة العلامة المائية "نقلة للمناهج الإلكترونية" من أوراق العمل أثناء العرض والطباعة، يرجى إدخال الباسورد المخصص للمدير التعليمي والمشرفين.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="أدخل الرمز السري..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-center font-mono tracking-widest text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1.5 text-right">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
                >
                  تأكيد وإزالة العلامة
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition"
                >
                  إلغاء
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
