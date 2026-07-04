import React, { useState, useEffect } from "react";
import { Chapter, Lesson } from "../types";
import { curriculumData } from "../data/curriculumData";
import { FileText, Download, Printer, CheckCircle, ChevronRight, Bookmark, Sparkles, BookOpen, Clock, Settings, X, Eye, EyeOff, CheckSquare, Square, FileCheck } from "lucide-react";

interface ReviewSummaryExporterProps {
  reviewedLessons: string[];
  favorites: string[];
  onSelectLesson: (chapterId: string, lessonId: string) => void;
  lang?: "ar" | "en";
}

export default function ReviewSummaryExporter({
  reviewedLessons,
  favorites,
  onSelectLesson,
}: ReviewSummaryExporterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<"reviewed" | "favorites" | "all">("reviewed");
  const [layoutStyle, setLayoutStyle] = useState<"classic" | "modern">("modern");
  const [selectedLessons, setSelectedLessons] = useState<Record<string, boolean>>({});
  const [showIncludeSettings, setShowIncludeSettings] = useState(false);

  // Flatten curriculum data for easier access
  const allLessons = curriculumData.flatMap((c) =>
    c.lessons.map((l) => ({
      ...l,
      chapterId: c.id,
      chapterTitle: c.arabicTitle,
    }))
  );

  const totalLessonsCount = allLessons.length;
  const reviewedLessonsCount = allLessons.filter((l) => reviewedLessons.includes(l.id)).length;
  const completionPercentage = Math.round((reviewedLessonsCount / totalLessonsCount) * 100);

  // Initialize selected lessons when scope or modal changes
  useEffect(() => {
    const initialSelection: Record<string, boolean> = {};
    allLessons.forEach((l) => {
      if (exportScope === "reviewed") {
        initialSelection[l.id] = reviewedLessons.includes(l.id);
      } else if (exportScope === "favorites") {
        initialSelection[l.id] = favorites.includes(l.id);
      } else {
        initialSelection[l.id] = true;
      }
    });
    setSelectedLessons(initialSelection);
  }, [exportScope, reviewedLessons, favorites, isModalOpen]);

  // Toggle selection of a single lesson
  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  // Select/Deselect all in current scope
  const toggleAllInScope = () => {
    const activeLessons = getLessonsInScope();
    const allSelected = activeLessons.every((l) => selectedLessons[l.id]);
    const updated = { ...selectedLessons };
    activeLessons.forEach((l) => {
      updated[l.id] = !allSelected;
    });
    setSelectedLessons(updated);
  };

  const getLessonsInScope = () => {
    if (exportScope === "reviewed") {
      return allLessons.filter((l) => reviewedLessons.includes(l.id));
    } else if (exportScope === "favorites") {
      return allLessons.filter((l) => favorites.includes(l.id));
    } else {
      return allLessons;
    }
  };

  const getSelectedLessonsData = () => {
    const scopeLessons = getLessonsInScope();
    return scopeLessons.filter((l) => selectedLessons[l.id]);
  };

  // Generate and download standalone interactive printable HTML guide
  const handleDownloadOfflineGuide = () => {
    const selectedLessonsData = getSelectedLessonsData();
    if (selectedLessonsData.length === 0) {
      alert("الرجاء اختيار درس واحد على الأقل للتصدير.");
      return;
    }

    const exportTitle =
      exportScope === "reviewed"
        ? "ملخص الدروس المستعرضة والمراجعة"
        : exportScope === "favorites"
        ? "ملخص الدروس المفضلة ومذكرتي"
        : "ملخص المنهج الهندسي الكامل للشهادة السودانية";

    const dateStr = new Date().toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const isModern = layoutStyle === "modern";

    const lessonsHTML = selectedLessonsData
      .map((lesson) => {
        const formulasHTML =
          lesson.formulas && lesson.formulas.length > 0
            ? `
          <div class="formulas-section">
            <h4>📐 القوانين والمعادلات الهندسية الواردة:</h4>
            <table>
              <thead>
                <tr>
                  <th>اسم القانون</th>
                  <th>المعادلة الرياضية</th>
                  <th>التوضيح والتطبيق</th>
                </tr>
              </thead>
              <tbody>
                ${lesson.formulas
                  .map(
                    (f: any) => `
                  <tr>
                    <td class="formula-name"><strong>${f.name}</strong></td>
                    <td class="formula-code"><code>${f.formula}</code></td>
                    <td class="formula-exp">${f.explanation}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
            : "";

        return `
        <div class="lesson-card">
          <div class="lesson-header">
            <span class="chapter-tag">${lesson.chapterTitle}</span>
            <h3 class="lesson-title">${lesson.title}</h3>
            ${lesson.subtitle ? `<p class="lesson-subtitle">${lesson.subtitle}</p>` : ""}
          </div>
          <div class="lesson-content">
            ${lesson.content.map((p: string) => `<p>${p}</p>`).join("")}
          </div>
          ${formulasHTML}
        </div>
      `;
      })
      .join("");

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${exportTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
    
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: ${isModern ? "#f8fafc" : "#ffffff"};
      color: #1e293b;
      margin: 0;
      padding: 40px;
      line-height: 1.8;
      font-size: 14px;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      ${isModern ? "padding: 50px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;" : ""}
    }

    .header-banner {
      text-align: center;
      border-bottom: 3px double #cbd5e1;
      padding-bottom: 25px;
      margin-bottom: 40px;
    }

    .header-banner h1 {
      font-size: 26px;
      font-weight: 800;
      color: ${isModern ? "#1e3a8a" : "#0f172a"};
      margin: 0 0 10px 0;
    }

    .header-banner p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 40px;
      padding: 15px;
      background-color: ${isModern ? "#f1f5f9" : "#fafafa"};
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      text-align: center;
    }

    .metadata-item h5 {
      margin: 0 0 5px 0;
      color: #64748b;
      font-size: 11px;
      text-transform: uppercase;
    }

    .metadata-item p {
      margin: 0;
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }

    .lesson-card {
      margin-bottom: 40px;
      page-break-inside: avoid;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 30px;
    }

    .lesson-card:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .lesson-header {
      margin-bottom: 20px;
    }

    .chapter-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: ${isModern ? "#2563eb" : "#475569"};
      background-color: ${isModern ? "#eff6ff" : "#f1f5f9"};
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .lesson-title {
      font-size: 19px;
      font-weight: 700;
      color: ${isModern ? "#1e3a8a" : "#0f172a"};
      margin: 0 0 5px 0;
    }

    .lesson-subtitle {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .lesson-content p {
      text-align: justify;
      margin: 12px 0;
      color: #334155;
    }

    .formulas-section {
      margin-top: 20px;
      background-color: ${isModern ? "#fafafa" : "#fcfcfc"};
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 15px;
    }

    .formulas-section h4 {
      margin: 0 0 12px 0;
      font-size: 13px;
      font-weight: 700;
      color: ${isModern ? "#0f172a" : "#334155"};
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
    }

    th, td {
      padding: 10px;
      font-size: 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      font-weight: 700;
      color: #475569;
      background-color: #f8fafc;
    }

    .formula-name {
      color: #0f172a;
    }

    .formula-code {
      font-family: 'JetBrains Mono', Courier, monospace;
      color: #b91c1c;
      font-weight: 700;
      background-color: #fef2f2;
      padding: 2px 6px;
      border-radius: 4px;
      direction: ltr;
      display: inline-block;
    }

    .formula-exp {
      color: #475569;
    }

    .footer-stamp {
      text-align: center;
      margin-top: 60px;
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
      font-size: 11px;
      color: #94a3b8;
    }

    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
        font-size: 12px;
      }
      .container {
        max-width: 100%;
        padding: 0;
        border: none;
        box-shadow: none;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <h1>${exportTitle}</h1>
      <p>بوابة العلوم الهندسية التفاعلية - تماشياً مع كراسة الشرح والامتحانات المعتمدة للشهادة السودانية</p>
    </div>

    <div class="metadata-grid">
      <div class="metadata-item">
        <h5>تاريخ المراجعة والتصدير</h5>
        <p>${dateStr}</p>
      </div>
      <div class="metadata-item">
        <h5>عدد الدروس المتضمنة</h5>
        <p>${selectedLessonsData.length} درساً</p>
      </div>
      <div class="metadata-item">
        <h5>مستوى الإنجاز الدراسي</h5>
        <p>${Math.round((selectedLessonsData.length / 22) * 100)}%</p>
      </div>
    </div>

    <div class="lessons-container">
      ${lessonsHTML}
    </div>

    <div class="footer-stamp">
      <p>تم إصدار هذا الملخص التعليمي تلقائياً عبر بوابة العلوم الهندسية التفاعلية المخصصة لطلاب امتحانات الشهادة الثانوية السودانية.</p>
      <p>© ٢٠٢٦ - البوابة الإلكترونية للعلوم الهندسية</p>
    </div>
  </div>

  <script>
    // Trigger print automatically after loading
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ملخص_العلوم_الهندسية_${exportScope}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsModalOpen(false);
  };

  const activeLessonsInScope = getLessonsInScope();
  const selectedCount = activeLessonsInScope.filter((l) => selectedLessons[l.id]).length;

  return (
    <>
      {/* Side Card displaying reviewed progress and export triggers */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden" id="review-progress-card">
        {/* Subtle decorative mesh background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-5 w-5 text-emerald-400" />
              <h4 className="text-sm font-black text-white">سجل المراجعة والتحصيل العلمي</h4>
            </div>
            <p className="text-[11px] text-slate-400">تابع نسبة قراءتك واستحضر ملخصاتك كاملة</p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-900 text-emerald-400 px-2 py-0.5 rounded-md">
            {completionPercentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5" id="completion-progress-bar">
          <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden border border-slate-800 flex">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>تم استعراض {reviewedLessonsCount} من {totalLessonsCount} درساً</span>
            <span>المنهج الكلي</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
          id="export-pdf-modal-trigger"
        >
          <Printer className="h-4 w-4 text-emerald-300" />
          <span>تصدير ملخص المراجعة والتحصيل كـ PDF</span>
        </button>

        {/* Small quick link list of last reviewed lessons if any */}
        {reviewedLessonsCount > 0 && (
          <div className="border-t border-slate-800/80 pt-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>آخر الدروس المستعرضة:</span>
              </span>
            </div>
            <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1 text-right">
              {allLessons
                .filter((l) => reviewedLessons.includes(l.id))
                .slice(-3)
                .reverse()
                .map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.chapterId, lesson.id)}
                    className="w-full text-right block py-1 px-2 rounded-lg text-[10px] font-semibold text-slate-300 hover:bg-slate-800/50 hover:text-white transition truncate"
                  >
                    • {lesson.title}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Exporter Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs text-slate-800 overflow-y-auto animate-fadeIn" dir="rtl">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-black">تهيئة تصدير الملخص الدراسي كملف PDF</h3>
                  <p className="text-xs text-slate-400">تخصيص الدروس والمقاسات المطلوبة للطباعة</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
                id="close-export-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Option 1: Export Scope */}
              <div className="space-y-2 text-right">
                <label className="text-xs font-black text-slate-700 block">نطاق تصدير الدروس:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportScope("reviewed")}
                    className={`flex items-center justify-between p-3.5 border rounded-xl transition text-right ${
                      exportScope === "reviewed"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs block">الدروس المستعرضة</span>
                      <span className="text-[10px] text-slate-500 block font-normal">تمت قراءتها: {reviewedLessonsCount}</span>
                    </div>
                    {exportScope === "reviewed" && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope("favorites")}
                    className={`flex items-center justify-between p-3.5 border rounded-xl transition text-right ${
                      exportScope === "favorites"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs block">الدروس المفضلة</span>
                      <span className="text-[10px] text-slate-500 block font-normal">المجموع: {favorites.length}</span>
                    </div>
                    {exportScope === "favorites" && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope("all")}
                    className={`flex items-center justify-between p-3.5 border rounded-xl transition text-right ${
                      exportScope === "all"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs block">كامل المنهج</span>
                      <span className="text-[10px] text-slate-500 block font-normal">الإجمالي: {totalLessonsCount} درساً</span>
                    </div>
                    {exportScope === "all" && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* Option 2: Style Selection */}
              <div className="space-y-2 text-right">
                <label className="text-xs font-black text-slate-700 block">نمط وتنسيق ملف الـ PDF:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLayoutStyle("modern")}
                    className={`flex flex-col gap-1 p-3 border rounded-xl text-right transition ${
                      layoutStyle === "modern"
                        ? "border-blue-600 bg-blue-50/30 text-blue-800 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs">المخطط الهندسي التفاعلي الملون</span>
                    <span className="text-[10px] font-normal text-slate-500">مظهر ملوّن وحديث، يتضمن خطوطاً وظلالاً أنيقة وهو الأنسب للاستعراض الرقمي.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayoutStyle("classic")}
                    className={`flex flex-col gap-1 p-3 border rounded-xl text-right transition ${
                      layoutStyle === "classic"
                        ? "border-blue-600 bg-blue-50/30 text-blue-800 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs">مخطط كلاسيكي اقتصادي (أبيض وأسود)</span>
                    <span className="text-[10px] font-normal text-slate-500">مُصمم لتوفير الحبر عند طباعته ورقياً، بخطوط واضحة وبسيطة خالية من الخلفيات الملونة.</span>
                  </button>
                </div>
              </div>

              {/* Toggle to include/exclude specific lessons within the selected scope */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowIncludeSettings(!showIncludeSettings)}
                  className="w-full text-right bg-slate-50 hover:bg-slate-100 p-3 flex items-center justify-between text-xs font-bold text-slate-700 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="h-4 w-4 text-slate-500 animate-spin-slow" />
                    <span>تخصيص الدروس المتضمنة في هذا الملف ({selectedCount} من {activeLessonsInScope.length})</span>
                  </span>
                  <span>{showIncludeSettings ? "إخفاء التفاصيل ▴" : "تعديل القائمة ▾"}</span>
                </button>

                {showIncludeSettings && (
                  <div className="p-4 bg-white space-y-3 max-h-[220px] overflow-y-auto border-t border-slate-100 text-right">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[10px] text-slate-500">اختر الدروس الفردية التي ترغب بإضافتها أو إلغائها:</span>
                      <button
                        type="button"
                        onClick={toggleAllInScope}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        {selectedCount === activeLessonsInScope.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
                      </button>
                    </div>

                    {activeLessonsInScope.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-4">لا توجد دروس مطابقة للنطاق الحالي بعد.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeLessonsInScope.map((lesson) => {
                          const isSelected = !!selectedLessons[lesson.id];
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => toggleLessonSelection(lesson.id)}
                              className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-right transition"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-300 shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold block text-slate-800 truncate">{lesson.title}</span>
                                <span className="text-[9px] text-slate-400 block truncate">{lesson.chapterTitle.split(":")[0]}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Informative Help Text Box */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3.5 flex items-start gap-2.5 text-right">
                <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-amber-900">💡 توجيهات الحفظ كملف PDF على جهازك:</h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    عند النقر على زر التصدير بالأسفل، سيتم توليد وتنزيل ملف دراسي مدمج (.html) ويفتح مباشرة نافذة الطباعة الخاصة بمتصفحك. 
                    للحصول على ملف <strong>PDF</strong>، اختر الوجهة <strong>"حفظ بتنسيق PDF" (Save as PDF)</strong> من خيارات نافذة الطباعة بدلاً من الطابعة الحقيقية.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className="text-[11px] text-slate-500 text-center sm:text-right font-semibold">
                سيتم تصدير <strong>{selectedCount}</strong> درساً بناءً على إعداداتك المحددة.
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 sm:w-auto px-4 py-2 border border-slate-300 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleDownloadOfflineGuide}
                  disabled={selectedCount === 0}
                  className={`w-1/2 sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition cursor-pointer ${
                    selectedCount === 0
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                  id="start-export-pdf-btn"
                >
                  <Download className="h-4 w-4" />
                  <span>توليد وتصدير PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
