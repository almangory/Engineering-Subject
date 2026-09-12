import React from "react";
import { BookOpen, Activity, FileText, Book, Sparkles } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiTutor: () => void;
  lang?: "ar" | "en";
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  openAiTutor,
  lang = "ar",
}) => {
  const navItems = [
    {
      id: "curriculum",
      nameAr: "الدروس",
      nameEn: "Lessons",
      icon: BookOpen,
    },
    {
      id: "lab",
      nameAr: "المعمل 3D",
      nameEn: "3D Lab",
      icon: Activity,
      badge: "3D",
    },
    {
      id: "worksheets",
      nameAr: "أوراق العمل",
      nameEn: "Worksheets",
      icon: FileText,
    },
    {
      id: "terms",
      nameAr: "المصطلحات",
      nameEn: "Glossary",
      icon: Book,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      dir="rtl"
    >
      <div className="grid grid-cols-5 items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = lang === "ar" ? item.nameAr : item.nameEn;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 relative ${
                isActive
                  ? "text-blue-600 font-black"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 bg-blue-600 rounded-full shadow-sm" />
              )}

              <div className="relative flex items-center justify-center">
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "bg-transparent text-slate-500 group-hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                </div>

                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-500 text-white text-[8px] font-black rounded-full leading-tight shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${isActive ? "font-bold text-blue-600" : "text-slate-500"}`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* 5th Tab: Naqla AI Bot Quick Trigger */}
        <button
          onClick={openAiTutor}
          className="group flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 active:scale-90 relative"
          title={lang === "ar" ? "اسأل ذكاء نقلة 🇸🇩" : "Ask Naqla AI 🇸🇩"}
        >
          <div className="relative w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 border border-amber-400 shadow-md flex items-center justify-center overflow-hidden">
            <img
              src="/assets/naqla_bot_avatar.png"
              alt="ذكاء نقلة"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/naqla_bot_avatar.png";
              }}
            />
            {/* Pulsing indicator */}
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-white animate-ping" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </div>

          <span className="text-[10px] font-black text-emerald-700 tracking-tight mt-0.5 whitespace-nowrap flex items-center gap-0.5">
            <span>ذكاء نقلة</span>
            <Sparkles className="h-2.5 w-2.5 text-amber-500" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
