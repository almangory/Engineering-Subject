import React, { useState } from "react";
import Header from "./components/Header";
import CurriculumExplorer from "./components/CurriculumExplorer";
import LabSection from "./components/LabSection";
import WorksheetSection from "./components/WorksheetSection";
import TermsSection from "./components/TermsSection";
import AiTutor from "./components/AiTutor";
import { Award, Compass, Zap, BookOpen, Activity, FileText, ArrowLeft, ArrowRight, ShieldCheck, Eye, Sparkles, Bot } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("curriculum");
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [presetTopic, setPresetTopic] = useState<string | undefined>(undefined);
  const [activeLab, setActiveLab] = useState<"projection" | "engine" | "elasticity" | "capacitor">("projection");
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const handleAskAi = (topic: string) => {
    setPresetTopic(topic);
    setAiTutorOpen(true);
  };

  const handleGoToLab = (labId: "projection" | "engine" | "elasticity" | "capacitor") => {
    setActiveLab(labId);
    setActiveTab("lab");
    // Scroll smoothly to top when switching tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white" dir="rtl">
      {/* Floating Restore Navigation Pill for Mobile/Tablet */}
      {isHeaderCollapsed && (
        <button
          onClick={() => setIsHeaderCollapsed(false)}
          className="fixed top-3 right-3 z-50 md:hidden flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg border border-blue-400 active:scale-95 transition-all duration-300"
          title="عرض شريط العنوان"
        >
          <Eye className="h-4 w-4" />
          <span>إظهار شريط التنقل ▽</span>
        </button>
      )}

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiTutor={() => {
          setPresetTopic(undefined);
          setAiTutorOpen(true);
        }}
        isHeaderCollapsed={isHeaderCollapsed}
        setIsHeaderCollapsed={setIsHeaderCollapsed}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Core Sections Switcher Display */}
        {activeTab === "curriculum" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-r-4 border-blue-600 pr-3.5">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">المكتشف الدراسي ومحتوى المنهج</h3>
                <p className="text-xs text-slate-500 mt-0.5">اختر الباب والدرس لمطالعة الشروحات والقوانين الهندسية بدقة</p>
              </div>
            </div>
            <CurriculumExplorer onAskAi={handleAskAi} onGoToLab={handleGoToLab} />
          </div>
        )}

        {activeTab === "lab" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-r-4 border-emerald-600 pr-3.5">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">المعمل الافتراضي للهندسة</h3>
                <p className="text-xs text-slate-500 mt-0.5">قم بإجراء تجارب تفاعلية على الإسقاط، المحركات، إجهاد المواد، والمكثفات</p>
              </div>
            </div>
            <LabSection activeLab={activeLab} setActiveLab={setActiveLab} />
          </div>
        )}

        {activeTab === "worksheets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-r-4 border-orange-500 pr-3.5">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">مركز أوراق العمل والتقييم الذاتي</h3>
                <p className="text-xs text-slate-500 mt-0.5">حل المسائل الهندسية تفاعلياً وتأكد من الحل مع التوضيح التفصيلي للقوانين</p>
              </div>
            </div>
            <WorksheetSection />
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-4 animate-fadeIn">
            <TermsSection onAskAi={handleAskAi} />
          </div>
        )}
      </main>

      {/* Floating Smart AI Tutor & Search Button (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-50 print:hidden">
        <button
          onClick={() => {
            setPresetTopic(undefined);
            setAiTutorOpen(true);
          }}
          className="group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white rounded-full shadow-2xl shadow-indigo-500/40 border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 relative"
          title="البحث والمساعد الهندسي 💬"
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
      />

      {/* Footer bar */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 print:hidden" id="footer-branding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="flex items-center justify-center gap-1">
            <span className="text-slate-600 font-medium">تم التطوير تماشياً مع كراسة الشرح والتوجيهات المعتمدة لامتحان الشهادة السودانية</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </p>
          <p className="font-mono text-[10px] text-slate-400">© ٢٠٢٦ - بوابة العلوم الهندسية التفاعلية</p>
        </div>
      </footer>
    </div>
  );
}
