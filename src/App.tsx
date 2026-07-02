import React, { useState } from "react";
import Header from "./components/Header";
import CurriculumExplorer from "./components/CurriculumExplorer";
import LabSection from "./components/LabSection";
import WorksheetSection from "./components/WorksheetSection";
import AiTutor from "./components/AiTutor";
import { Award, Compass, Zap, BookOpen, Activity, FileText, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("curriculum");
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [presetTopic, setPresetTopic] = useState<string | undefined>(undefined);
  const [activeLab, setActiveLab] = useState<"projection" | "engine" | "elasticity" | "capacitor">("projection");

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
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiTutor={() => {
          setPresetTopic(undefined);
          setAiTutorOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Home Welcome Banner - Dynamic based on view */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 overflow-hidden shadow-lg" id="welcome-banner">
          {/* Subtle glowing accents */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-yellow-300 font-mono tracking-wide bg-white/15 px-3 py-1 rounded-full">المنهج القومي لجمهورية السودان</span>
              <h2 className="text-xl md:text-3xl font-black text-white">منصة العلوم الهندسية التفاعلية المباشرة</h2>
              <p className="text-xs md:text-sm text-blue-100 max-w-2xl leading-relaxed">
                مرحباً بك في بوابتك التفاعلية لدراسة العلوم الهندسية للصف الثاني ثانوي. استكشف فصول المنهج الأربعة، تفاعل مع المعامل والرسومات الهندسية الحية، تدرب على أوراق العمل، واسأل المعلم الذكي في أي وقت!
              </p>
            </div>

            {/* Micro bento highlights */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl text-center border border-white/20">
                <span className="text-sm md:text-base font-extrabold text-yellow-300 block font-mono">٤ أبواب</span>
                <span className="text-[10px] text-blue-100 block mt-0.5">كامل المنهج</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl text-center border border-white/20">
                <span className="text-sm md:text-base font-extrabold text-cyan-200 block font-mono">٤ معامل</span>
                <span className="text-[10px] text-blue-100 block mt-0.5">تفاعلية حية</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl text-center border border-white/20">
                <span className="text-sm md:text-base font-extrabold text-emerald-300 block font-mono">أوراق</span>
                <span className="text-[10px] text-blue-100 block mt-0.5">عمل مجهزة</span>
              </div>
            </div>
          </div>
        </div>

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
      </main>

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
