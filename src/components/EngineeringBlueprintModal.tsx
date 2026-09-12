import React from "react";
import { X, BookOpen, Layers } from "lucide-react";
import { CarSystemsDiagramViewer, PistonCutawayDiagramViewer, CarSystemKey } from "./CarSystemsDiagramViewer";

interface EngineeringBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  activeCarSystem?: CarSystemKey;
  onAskAi?: (topic: string) => void;
}

export const EngineeringBlueprintModal: React.FC<EngineeringBlueprintModalProps> = ({
  isOpen,
  onClose,
  lessonId,
  activeCarSystem = "fuel",
  onAskAi,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black flex items-center gap-2">
                <span>المخطط الهندسي التوضيحي المعتمد</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  كتاب بخت الرضا
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lessonId === "car-engine-systems" 
                  ? "أنظمة محرك السيارة المساعدة الأربعة (الوقود، التبريد، التزييت، الاشتعال)" 
                  : "تشريح أجزاء المكبس وعمود المرفق لمحرك الاحتراق الداخلي"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {lessonId === "car-engine-systems" ? (
            <CarSystemsDiagramViewer 
              initialSystem={activeCarSystem}
              onAskAi={onAskAi}
            />
          ) : (
            <PistonCutawayDiagramViewer 
              onAskAi={onAskAi}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-bold">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span>مطابق بنسبة 100% لمنهج العلوم الهندسية للصف الثاني ثانوي</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-sm"
          >
            الرجوع للتجربة ثلاثية الأبعاد 3D
          </button>
        </div>
      </div>
    </div>
  );
};
