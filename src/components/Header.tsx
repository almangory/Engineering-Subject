import React, { useState, useEffect } from "react";
import { BookOpen, HelpCircle, Activity, Sparkles, Printer, Award, FileText, Book, Eye, EyeOff, Minimize2 } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiTutor: () => void;
  isHeaderCollapsed: boolean;
  setIsHeaderCollapsed: (collapsed: boolean) => void;
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  openAiTutor,
  isHeaderCollapsed,
  setIsHeaderCollapsed,
  lang,
  setLang,
}: HeaderProps) {
  const [time, setTime] = useState("");
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (lang === "ar") {
        setTime(now.toLocaleTimeString("ar-SD", { hour12: true, hour: "2-digit", minute: "2-digit" }));
      } else {
        setTime(now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [lang]);

  const navItems = [
    { id: "curriculum", nameAr: "المنهج الدراسي", nameEn: "Curriculum", icon: BookOpen },
    { id: "lab", nameAr: "المعمل الهندسي", nameEn: "Virtual Lab", icon: Activity },
    { id: "worksheets", nameAr: "أوراق العمل", nameEn: "Worksheets", icon: FileText },
    { id: "terms", nameAr: "قاموس المصطلحات", nameEn: "Glossary", icon: Book },
  ];

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-40 shadow-lg">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHeaderCollapsed ? "hidden md:block" : "block"}`}>
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Vibe */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-white/20 text-white p-2.5 rounded-xl border border-white/30 shadow-md">
              <Award className="h-6 w-6" id="header-logo-icon" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>{lang === "ar" ? "العلوم الهندسية" : "Engineering Sciences"}</span>
                  <span className="text-[10px] bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                    {lang === "ar" ? "الصف الثاني ثانوي" : "Grade 11 / Secondary 2"}
                  </span>
                </h1>
                
                {/* Collapse button for mobile/tablet */}
                <button
                  onClick={() => setIsHeaderCollapsed(true)}
                  className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white md:hidden transition active:scale-95 flex items-center gap-1 text-[9px] font-bold border border-white/20 shadow-sm whitespace-nowrap mr-1"
                  title={lang === "ar" ? "إخفاء شريط العنوان لزيادة المساحة" : "Collapse header bar"}
                >
                  <EyeOff className="h-3 w-3" />
                  <span>{lang === "ar" ? "تصغير ✕" : "Minimize ✕"}</span>
                </button>
              </div>
              <p className="text-xs text-blue-100 uppercase tracking-wider">
                {lang === "ar" ? "جمهورية السودان | المنهج التفاعلي" : "Republic of Sudan | Interactive Curriculum"}
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex space-x-2 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const displayName = lang === "ar" ? item.nameAr : item.nameEn;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md scale-105"
                      : "text-blue-50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{displayName}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-xs font-bold transition duration-300 cursor-pointer text-white"
              id="language-switcher-btn"
            >
              <span className="text-sm">🌐</span>
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Offline indicator */}
            {!isOnline && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black border border-amber-300 animate-pulse whitespace-nowrap shadow-sm">
                <span className="w-2 h-2 rounded-full bg-slate-950" />
                <span>{lang === "ar" ? "وضع أوفلاين" : "Offline"}</span>
              </span>
            )}
            
            {/* Clock */}
            <div className="hidden lg:flex flex-col text-left items-end px-3 py-1 border-r border-white/20">
              <span className="text-[10px] text-blue-200 font-mono">{lang === "ar" ? "توقيت الخرطوم" : "Khartoum Time"}</span>
              <span className="text-xs font-bold font-mono text-white">{time || (lang === "ar" ? "١٢:٠٠ م" : "12:00 PM")}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation bar */}
      <div className="md:hidden flex justify-around bg-blue-700 py-3 border-t border-blue-500/30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const displayName = lang === "ar" ? item.nameAr : item.nameEn;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-white font-bold bg-white/10" : "text-blue-100 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{displayName}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
