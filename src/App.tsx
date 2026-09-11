import React, { useState } from "react";
import Header from "./components/Header";
import CurriculumExplorer from "./components/CurriculumExplorer";
import LabSection from "./components/LabSection";
import WorksheetSection from "./components/WorksheetSection";
import TermsSection from "./components/TermsSection";
import AiTutor from "./components/AiTutor";
import PdfTextbookModal from "./components/PdfTextbookModal";
import VideoPlayerModal from "./components/VideoPlayerModal";
import { Award, Compass, Zap, BookOpen, Activity, FileText, ArrowLeft, ArrowRight, ShieldCheck, Eye, Sparkles, Bot, Video } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("curriculum");
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoChapter, setActiveVideoChapter] = useState("chapter-1");
  const [presetTopic, setPresetTopic] = useState<string | undefined>(undefined);
  const [activeLab, setActiveLab] = useState<string>("projection");
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [lang, setLang] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("app_language");
    return (saved === "ar" || saved === "en") ? saved : "ar";
  });

  const handleSetLang = (newLang: "ar" | "en") => {
    setLang(newLang);
    localStorage.setItem("app_language", newLang);
  };

  const handleAskAi = (topic: string) => {
    setPresetTopic(topic);
    setAiTutorOpen(true);
  };

  const handleGoToLab = (labId: string) => {
    setActiveLab(labId);
    setActiveTab("lab");
    // Scroll smoothly to top when switching tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white transition-all duration-300"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Floating Restore Navigation Pill for Mobile/Tablet */}
      {isHeaderCollapsed && (
        <button
          onClick={() => setIsHeaderCollapsed(false)}
          className="fixed top-3 z-50 md:hidden flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg border border-blue-400 active:scale-95 transition-all duration-300 ltr:left-3 rtl:right-3"
          title={lang === "ar" ? "عرض شريط العنوان" : "Show navigation bar"}
        >
          <Eye className="h-4 w-4" />
          <span>{lang === "ar" ? "إظهار شريط التنقل ▽" : "Show Navigation ▽"}</span>
        </button>
      )}

      {/* 🇸🇩 شريط السيو والروابط العكسية المعتمد لمنظومة المناهج السودانية التفاعلية | منصة نقلة */}
      <div
        className="print:hidden border-b border-emerald-500/20 shadow-sm"
        style={{
          background: "linear-gradient(90deg, #064E3B 0%, #047857 50%, #065f46 100%)",
          color: "#ffffff",
          padding: "7px 16px",
          fontSize: "12.5px",
          fontFamily: "'Tajawal', 'Cairo', system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
          <span className="text-base">🇸🇩</span>
          <span>{lang === "ar" ? "ضمن منظومة المناهج السودانية التفاعلية | منصة نقلة" : "Sudanese Interactive Curricula Ecosystem | Naqla Platform"}</span>
        </div>
        <a
          href="https://sudan-interactive-curricula.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#6ee7b7",
            fontWeight: 800,
            textDecoration: "none",
            fontSize: "11.5px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.2s",
          }}
          className="hover:underline hover:text-emerald-200"
        >
          <span>{lang === "ar" ? "العودة للمنصة الرئيسية" : "Back to Main Portal"}</span>
          <span className="text-xs">↗</span>
        </a>
      </div>

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiTutor={() => {
          setPresetTopic(undefined);
          setAiTutorOpen(true);
        }}
        openPdfModal={() => setPdfModalOpen(true)}
        openVideoModal={() => setVideoModalOpen(true)}
        isHeaderCollapsed={isHeaderCollapsed}
        setIsHeaderCollapsed={setIsHeaderCollapsed}
        lang={lang}
        setLang={handleSetLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Core Sections Switcher Display */}
        {activeTab === "curriculum" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-blue-600 rtl:border-r-4 ltr:border-l-4 rtl:pr-3.5 ltr:pl-3.5">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">
                  {lang === "ar" ? "المكتشف الدراسي ومحتوى المنهج" : "Interactive Curriculum & Lesson Explorer"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === "ar"
                    ? "اختر الباب والدرس لمطالعة الشروحات والقوانين الهندسية بدقة"
                    : "Choose a chapter and lesson to read explanations, equations, and engineering concepts"}
                </p>
              </div>
            </div>
            <CurriculumExplorer
              onAskAi={handleAskAi}
              onGoToLab={handleGoToLab}
              openPdfModal={() => setPdfModalOpen(true)}
              openVideoModal={(chapterId?: string) => {
                if (chapterId) setActiveVideoChapter(chapterId);
                setVideoModalOpen(true);
              }}
              lang={lang}
            />
          </div>
        )}

        {activeTab === "lab" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-emerald-600 rtl:border-r-4 ltr:border-l-4 rtl:pr-3.5 ltr:pl-3.5">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">
                  {lang === "ar" ? "المعمل الافتراضي للهندسة" : "Virtual Engineering Laboratory"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === "ar"
                    ? "قم بإجراء تجارب تفاعلية على الإسقاط، المحركات، إجهاد المواد، والمكثفات"
                    : "Conduct interactive experiments on projection, engines, stress-strain, and capacitors"}
                </p>
              </div>
            </div>
            <LabSection activeLab={activeLab} setActiveLab={setActiveLab} lang={lang} />
          </div>
        )}

        {activeTab === "worksheets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-orange-500 rtl:border-r-4 ltr:border-l-4 rtl:pr-3.5 ltr:pl-3.5">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">
                  {lang === "ar" ? "مركز أوراق العمل والتقييم الذاتي" : "Interactive Worksheets & Assessment Center"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === "ar"
                    ? "حل المسائل الهندسية تفاعلياً وتأكد من الحل مع التوضيح التفصيلي للقوانين"
                    : "Solve engineering problems interactively and verify answers with detailed step-by-step math"}
                </p>
              </div>
            </div>
            <WorksheetSection lang={lang} />
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-4 animate-fadeIn">
            <TermsSection onAskAi={handleAskAi} lang={lang} />
          </div>
        )}
      </main>

      {/* Floating Smart AI Tutor & Search Button (Bottom-Left/Right depending on lang) */}
      <div className={`fixed bottom-6 z-50 print:hidden ${lang === "ar" ? "left-6" : "right-6"}`}>
        <button
          onClick={() => {
            setPresetTopic(undefined);
            setAiTutorOpen(true);
          }}
          className="group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white rounded-full shadow-2xl shadow-indigo-500/40 border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 relative"
          title={lang === "ar" ? "البحث والمساعد الهندسي 💬" : "Search & Engineering AI Assistant 💬"}
          id="floating-search-tutor-btn"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-white group-hover:rotate-12 transition duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        </button>
      </div>

      {/* Floating Smart AI Tutor Sidebar Panel */}
      <AiTutor
        isOpen={aiTutorOpen}
        onClose={() => setAiTutorOpen(false)}
        presetTopic={presetTopic}
        lang={lang}
      />

      {/* Official Curriculum Textbook PDF Modal */}
      <PdfTextbookModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        lang={lang}
      />

      {/* Official Certified Unit Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        initialChapterId={activeVideoChapter}
        lang={lang}
      />

      {/* Footer bar */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 print:hidden" id="footer-branding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="flex items-center justify-center gap-1">
            <span className="text-slate-600 font-medium">
              {lang === "ar"
                ? "تم التطوير تماشياً مع كراسة الشرح والتوجيهات المعتمدة لامتحان الشهادة السودانية"
                : "Developed in alignment with the official Sudan Secondary School Certificate syllabus"}
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            {lang === "ar"
              ? "© ٢٠٢٦ - بوابة العلوم الهندسية التفاعلية"
              : "© 2026 - Interactive Engineering Sciences Portal"}
          </p>
        </div>
      </footer>
    </div>
  );
}
