import React, { useState, useEffect } from "react";
import { BookOpen, HelpCircle, Activity, Sparkles, Printer, Award, FileText, Book, Eye, EyeOff, Minimize2 } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiTutor: () => void;
  isHeaderCollapsed: boolean;
  setIsHeaderCollapsed: (collapsed: boolean) => void;
}

export default function Header({ activeTab, setActiveTab, openAiTutor, isHeaderCollapsed, setIsHeaderCollapsed }: HeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("ar-SD", { hour12: true, hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "curriculum", name: "المنهج الدراسي", icon: BookOpen },
    { id: "lab", name: "المعمل الهندسي", icon: Activity },
    { id: "worksheets", name: "أوراق العمل", icon: FileText },
    { id: "terms", name: "قاموس المصطلحات", icon: Book },
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
                  <span>العلوم الهندسية</span>
                  <span className="text-[10px] bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                    الصف الثاني ثانوي
                  </span>
                </h1>
                
                {/* Collapse button for mobile/tablet */}
                <button
                  onClick={() => setIsHeaderCollapsed(true)}
                  className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white md:hidden transition active:scale-95 flex items-center gap-1 text-[9px] font-bold border border-white/20 shadow-sm whitespace-nowrap mr-1"
                  title="إخفاء شريط العنوان لزيادة المساحة"
                >
                  <EyeOff className="h-3 w-3" />
                  <span>تصغير ✕</span>
                </button>
              </div>
              <p className="text-xs text-blue-100 uppercase tracking-wider">جمهورية السودان | المنهج التفاعلي</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex space-x-2 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
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
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Clock */}
            <div className="hidden lg:flex flex-col text-left items-end px-3 py-1 border-r border-white/20">
              <span className="text-[10px] text-blue-200 font-mono">توقيت الخرطوم</span>
              <span className="text-xs font-bold font-mono text-white">{time || "١٢:٠٠ م"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation bar */}
      <div className="md:hidden flex justify-around bg-blue-700 py-3 border-t border-blue-500/30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-white font-bold bg-white/10" : "text-blue-100 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
