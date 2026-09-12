import React, { useState, useRef } from "react";
import { X, Video, Play, Pause, RotateCcw, Volume2, Maximize, FastForward, Check, ExternalLink } from "lucide-react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterId?: string;
  lang?: "ar" | "en";
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}

export const UNIT_VIDEOS: Record<
  string,
  {
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    youtubeUrl: string;
    driveUrl: string;
    duration: string;
  }
> = {
  "chapter-1": {
    titleAr: "الباب الأول: أساسيات الرسم الهندسي",
    titleEn: "Unit 1: Engineering Drawing Fundamentals",
    descAr: "الإسقاط المتعامد، مساقط النقطة والمستقيم والسطح، المنظور الأيزومتري بزاوية 30° والمائل 45°، ورسم الأبعاد والتكريك.",
    descEn: "Orthographic projection, points, lines, surfaces, isometric & oblique projection, dimensioning and freehand sketching.",
    youtubeUrl: "https://youtu.be/ePN5TYPrYSw",
    driveUrl: "https://drive.google.com/file/d/1zJFZNcScTSp_Vt0ykfHYBG43uqsDrzsI/preview",
    duration: "شرح شامل",
  },
  "chapter-2": {
    titleAr: "الباب الثاني: أساسيات الهندسة الميكانيكية",
    titleEn: "Unit 2: Mechanical Engineering Fundamentals",
    descAr: "علم الفلزات وسبائكها، أفران الصهر (الفرن العالي والكيوبولا والصلب والدرفلة)، محركات الاحتراق الداخلي ودورة أوتو وأنظمة محرك السيارة.",
    descEn: "Metals, blast furnace, cupola, steel rolling, alloys, four-stroke Otto cycle, and automobile engine systems.",
    youtubeUrl: "https://youtu.be/VUi1WYWCGrg",
    driveUrl: "https://drive.google.com/file/d/1OP-xcYtE90oC43jCRV_aMy07D43oFJjO/preview",
    duration: "شرح شامل",
  },
  "chapter-3": {
    titleAr: "الباب الثالث: أساسيات الهندسة الكهربائية والإلكترونية",
    titleEn: "Unit 3: Electrical & Electronic Engineering",
    descAr: "الكميات والوحدات الكهربائية، قانون كولوم، المكثفات، الحث الكهرومغناطيسي، المحاثة، الإلكترونيات، وبلورات أشباه الموصلات والتشويب.",
    descEn: "Electrical units, Coulomb's law, capacitors, electromagnetic induction, self-inductance, semiconductors and doping.",
    youtubeUrl: "https://youtu.be/kGhjlR5wJ34",
    driveUrl: "https://drive.google.com/file/d/17_g6bEPc9jw9t0Juwzx9pBhFRfrLueCP/preview",
    duration: "شرح شامل",
  },
  "chapter-4": {
    titleAr: "الباب الرابع: أساسيات الهندسة المدنية والبيئة",
    titleEn: "Unit 4: Civil & Environmental Engineering",
    descAr: "المنشآت والعوارض والجملونات، الأحمال والتربة والأساسات، ميكانيكا المواد وقانون هوك، ضغط الموائع واللزوجة، والهندسة البيئية وموارد المياه.",
    descEn: "Structures, beams, trusses, arches, foundations, Hooke's law, fluid mechanics, viscosity, and environmental water resources.",
    youtubeUrl: "https://youtu.be/jiR2kMguSIE",
    driveUrl: "https://drive.google.com/file/d/1cM1mEUZdiuVc7ltQoYnpDxbqHWAcQmD7/preview",
    duration: "شرح شامل",
  },
};

export default function VideoPlayerModal({
  isOpen,
  onClose,
  initialChapterId = "chapter-1",
  lang = "ar",
}: VideoPlayerModalProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>(initialChapterId);
  const [sourceType, setSourceType] = useState<"youtube" | "drive">("youtube");

  if (!isOpen) return null;

  const currentVideo = UNIT_VIDEOS[selectedUnit] || UNIT_VIDEOS["chapter-1"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      dir={lang === "ar" ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="bg-slate-900 text-white rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/20 text-rose-400 p-2 rounded-xl border border-rose-500/30">
              <Video className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{lang === "ar" ? "قاعة الفيديو التعليمي:" : "Video Classroom:"}</span>
                <span className="text-rose-400">
                  {lang === "ar" ? currentVideo.titleAr : currentVideo.titleEn}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === "ar"
                  ? "حصة مصورة وشرح هندسي معتمد لطلاب الشهادة الثانوية"
                  : "Certified video lecture for secondary engineering certificate"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Source Switcher */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setSourceType("youtube")}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                  sourceType === "youtube" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "ar" ? "بث YouTube ⚡" : "YouTube ⚡"}
              </button>
              <button
                onClick={() => setSourceType("drive")}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                  sourceType === "drive" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "ar" ? "بث Drive 🌐" : "Drive Stream 🌐"}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white hover:rotate-90 duration-200"
              title={lang === "ar" ? "إغلاق" : "Close"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Units Navigation Tabs */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          {Object.entries(UNIT_VIDEOS).map(([unitId, data]) => {
            const isSelected = selectedUnit === unitId;
            return (
              <button
                key={unitId}
                onClick={() => setSelectedUnit(unitId)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                <Play className="h-3 w-3" />
                <span>{lang === "ar" ? data.titleAr.split(":")[0] : data.titleEn.split(":")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Video Player Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {sourceType === "youtube" ? (
            <iframe
              key={currentVideo.youtubeUrl}
              src={getYouTubeEmbedUrl(currentVideo.youtubeUrl) || ""}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={lang === "ar" ? currentVideo.titleAr : currentVideo.titleEn}
            />
          ) : (
            <iframe
              key={currentVideo.driveUrl}
              src={`${currentVideo.driveUrl}?autoplay=1`}
              className="w-full h-full border-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Drive Video"
            />
          )}
        </div>

        {/* Footer controls & info */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-300 text-xs truncate max-w-xl">
            <span className="font-bold text-white">
              {lang === "ar" ? currentVideo.titleAr : currentVideo.titleEn}:{" "}
            </span>
            <span className="text-slate-400">
              {lang === "ar" ? currentVideo.descAr : currentVideo.descEn}
            </span>
          </p>

          <a
            href={currentVideo.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "مشاهدة على YouTube" : "Watch on YouTube"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
