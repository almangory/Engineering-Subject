import React, { useState } from "react";
import { X, Download, ExternalLink, BookOpen, ChevronRight, FileText, Sparkles } from "lucide-react";

interface PdfTextbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "ar" | "en";
}

const CHAPTER_PAGES = [
  { id: "intro", nameAr: "المقدمة والفهرس", nameEn: "Intro & Index", page: 1 },
  { id: "ch1", nameAr: "الباب الأول: أساسيات الرسم الهندسي", nameEn: "Ch 1: Engineering Drawing", page: 9 },
  { id: "ch2", nameAr: "الباب الثاني: أساسيات الهندسة الميكانيكية", nameEn: "Ch 2: Mechanical Engineering", page: 45 },
  { id: "ch3", nameAr: "الباب الثالث: أساسيات الهندسة الكهربائية", nameEn: "Ch 3: Electrical Engineering", page: 100 },
  { id: "ch4", nameAr: "الباب الرابع: أساسيات الهندسة المدنية", nameEn: "Ch 4: Civil & Environmental", page: 142 },
];

export default function PdfTextbookModal({ isOpen, onClose, lang = "ar" }: PdfTextbookModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pdfUrl = "/pdf/engineering-grade11-textbook.pdf";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      dir={lang === "ar" ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl border border-white/20">
              <BookOpen className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {lang === "ar"
                    ? "الكتاب المدرسي المعتمد: أساسيات العلوم الهندسية"
                    : "Official Curriculum Textbook: Engineering Sciences"}
                </h3>
                <span className="text-[10px] bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {lang === "ar" ? "بخت الرضا" : "Bakht Al-Ruda"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90">
                {lang === "ar"
                  ? "جمهورية السودان - وزارة التربية والتعليم - المركز القومي للمناهج"
                  : "Republic of Sudan - Ministry of Education - National Curriculum Center"}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download="العلوم_الهندسية_الصف_الثاني_ثانوي.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition text-white"
              title={lang === "ar" ? "تحميل نسخة PDF" : "Download PDF"}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === "ar" ? "تحميل الكتاب" : "Download"}</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition text-white"
              title={lang === "ar" ? "فتح في تبويب مستقل" : "Open in New Tab"}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === "ar" ? "نافذة جديدة" : "New Tab"}</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-xl transition text-white hover:rotate-90 duration-200"
              title={lang === "ar" ? "إغلاق" : "Close"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Chapter Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-600 whitespace-nowrap flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            {lang === "ar" ? "الانتقال السريع للأبواب:" : "Quick Jump:"}
          </span>
          {CHAPTER_PAGES.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setCurrentPage(ch.page)}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition text-xs flex items-center gap-1 ${
                currentPage === ch.page
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200"
              }`}
            >
              <span>{lang === "ar" ? ch.nameAr : ch.nameEn}</span>
              <span className="text-[10px] opacity-75 font-mono">({ch.page})</span>
            </button>
          ))}
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-900 relative">
          <iframe
            key={currentPage}
            src={`${pdfUrl}#page=${currentPage}&toolbar=1&navpanes=1`}
            className="w-full h-full border-none"
            title="كتاب العلوم الهندسية"
          />
        </div>
      </div>
    </div>
  );
}
