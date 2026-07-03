import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { X, Send, Sparkles, Bot, Trash2, HelpCircle, BookOpen, Lightbulb, Award } from "lucide-react";
import { curriculumData } from "../data/curriculumData";
import { termsData } from "./TermsSection";
import { lessonSummaries } from "./CurriculumExplorer";
import { QUESTION_POOL } from "../data/worksheetsData";

interface AiTutorProps {
  isOpen: boolean;
  onClose: () => void;
  presetTopic?: string;
}

// Normalize Arabic text helper to ignore diacritics, different alefs, teh marbutas, and make search extremely flexible
function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u0652]/g, "") // Remove all Arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase();
}

// Highly intelligent local offline search and reply generator
function searchLocalContent(userQuery: string, currentTopic?: string): string {
  const normQuery = normalizeArabicText(userQuery.trim());

  if (!normQuery) {
    return "الرجاء كتابة سؤال أو قانون للبحث عنه!";
  }

  // 1. Simple Greetings Match
  const greetings = [
    "مرحبا", "سلام", "السلام عليكم", "هلا", "اهلين", "صباح الخير", "مساء الخير", 
    "تست", "تجربه", "كيفك", "من انت", "من تكون", "هاي", "hello", "hi"
  ];
  if (greetings.some(g => normQuery === g || normQuery.includes(g))) {
    return `وعليكم السلام ورحمة الله وبركاته يا مهندس المستقبل! 🇸🇩

أنا **المساعد الهندسي ومحرك البحث المحلي**. تم تصميمي لمساعدتك في فهم مادة العلوم الهندسية للصف الثاني ثانوي ميكانيكا، كهرباء، رسم هندسي، ومواد، والرد على استفساراتك فوراً وبشكل مجاني تماماً وبدون أي استهلاك لبيانات الإنترنت أو استخدام الذكاء الاصطناعي المكلف!

**💡 كيف يمكنك الاستفادة مني؟**
1. 📐 **البحث عن الدروس والشروحات:** اكتب اسم أي درس (مثال: "الإسقاط المتعامد"، "المنظور الأيزومتري"، "الدرفلة"، "الفرن اللافح"، "المكثفات"، "الجملونات"، "قانون هوك").
2. 📚 **تعريف المصطلحات الفنية:** اسأل عن أي مصطلح (مثال: "ما هو الحديد الغفل؟"، "تعريف اللزوجة"، "ما معنى البرنز؟").
3. 📐 **القوانين الهندسية:** اطلب قانوناً (مثال: "قانون المكثف"، "معادلة معامل هوك"، "الممانعة المغناطيسية").
4. ❓ **أسئلة تدريبية تفاعلية:** اكتب كلمة "**سؤال**" أو "**تمرين**" وسأقوم فوراً بسحب أسئلة حقيقية من كراسة العمل مع الحل التفصيلي لتتدرب عليها!

ما هو الموضوع أو القانون الذي تود مراجعته الآن؟`;
  }

  // Collect matched items
  let foundTerms: typeof termsData = [];
  let foundLessons: any[] = [];
  let foundQuestions: typeof QUESTION_POOL = [];

  // A. Search terms data
  termsData.forEach(term => {
    const normWordAr = normalizeArabicText(term.wordAr);
    const normWordEn = normalizeArabicText(term.wordEn);
    const normDef = normalizeArabicText(term.definition);

    if (
      normQuery.includes(normWordAr) || 
      normWordAr.includes(normQuery) || 
      normQuery.includes(normWordEn) ||
      (normQuery.length > 3 && normDef.includes(normQuery))
    ) {
      foundTerms.push(term);
    }
  });

  // B. Search curriculum lessons
  curriculumData.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      const normTitle = normalizeArabicText(lesson.title);
      const normSubtitle = lesson.subtitle ? normalizeArabicText(lesson.subtitle) : "";
      const normContent = normalizeArabicText(lesson.content.join(" "));

      if (
        normQuery.includes(normTitle) || 
        normTitle.includes(normQuery) || 
        (normSubtitle && (normQuery.includes(normSubtitle) || normSubtitle.includes(normQuery))) ||
        (normQuery.length > 4 && normContent.includes(normQuery))
      ) {
        foundLessons.push({
          ...lesson,
          chapterTitle: chapter.arabicTitle
        });
      }
    });
  });

  // C. Search questions/exercises
  const triggersQuestion = normQuery.includes("سؤال") || normQuery.includes("تمرين") || normQuery.includes("مساله") || normQuery.includes("امتحان") || normQuery.includes("اختبرني");
  QUESTION_POOL.forEach(q => {
    const normText = normalizeArabicText(q.questionText);
    const normExpl = q.explanation ? normalizeArabicText(q.explanation) : "";
    
    if (triggersQuestion || normText.includes(normQuery) || normExpl.includes(normQuery)) {
      foundQuestions.push(q);
    }
  });

  // Now build a highly detailed, professional educational reply
  let responseText = "";

  // 1. Term Definition response
  if (foundTerms.length > 0 && !triggersQuestion) {
    const term = foundTerms[0]; // Show the primary matching term
    responseText += `📚 **قاموس المصطلحات الهندسية المعتمد:**\n`;
    responseText += `🏷️ **المصطلح:** *${term.wordAr}* (${term.wordEn})\n`;
    responseText += `📂 **الموقع من المنهج:** ${term.categoryAr}\n\n`;
    responseText += `✍️ **التعريف الهندسي الفعلي:**\n« ${term.definition} »\n\n`;

    if (foundTerms.length > 1) {
      responseText += `🔍 **مصطلحات مفتاحية مشابهة عثرت عليها:**\n`;
      foundTerms.slice(1, 4).forEach((t) => {
        responseText += `• **${t.wordAr}** (${t.wordEn}): ${t.definition.slice(0, 85)}...\n`;
      });
      responseText += `\n`;
    }
  }

  // 2. Lesson content match
  if (foundLessons.length > 0) {
    const lesson = foundLessons[0];
    const summary = lessonSummaries[lesson.id];

    if (responseText) {
      responseText += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    responseText += `📖 **شرح تفصيلي لدرس: ${lesson.title}**\n`;
    responseText += `📂 **الباب:** ${lesson.chapterTitle}\n`;
    if (lesson.subtitle) {
      responseText += `🔹 **الموضوع:** ${lesson.subtitle}\n`;
    }
    responseText += `\n`;

    responseText += `📝 **الحقائق الهندسية والمحتوى العلمي المعتمد للشهادة:**\n`;
    lesson.content.forEach((para: string) => {
      responseText += `• ${para}\n`;
    });
    responseText += `\n`;

    // Formulas
    if (lesson.formulas && lesson.formulas.length > 0) {
      responseText += `📐 **القوانين والمعادلات المقررة:**\n`;
      lesson.formulas.forEach((form: any) => {
        responseText += `👉 **${form.name}**\n`;
        responseText += `   📝 الصيغة: \` ${form.formula} \`\n`;
        responseText += `   ℹ️ التفسير: ${form.explanation}\n\n`;
      });
    }

    // Summary Takeaways & Exam Tips
    if (summary) {
      responseText += `📋 **بطاقة التلخيص والمذاكرة الذكية للدرس:**\n`;
      summary.takeaways.forEach((takeaway: string, idx: number) => {
        responseText += `  [${idx + 1}] ${takeaway}\n`;
      });
      responseText += `\n`;

      responseText += `💡 **تنبيه امتحاني هام للشهادة السودانية:**\n`;
      responseText += `⚠️ *${summary.examTip}*\n\n`;
    }
  }

  // 3. Question / Exercise Response
  if (triggersQuestion || (foundQuestions.length > 0 && responseText === "")) {
    const finalPool = foundQuestions.length > 0 ? foundQuestions : QUESTION_POOL;
    const qIndex = Math.floor(Math.random() * Math.min(finalPool.length, 12));
    const q = finalPool[qIndex];

    if (responseText) {
      responseText += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    responseText += `✍️ **تمرين مقترح من كراسة التقييم الذاتي:**\n`;
    responseText += `❓ **السؤال:** ${q.questionText}\n\n`;

    if (q.options && q.options.length > 0) {
      responseText += `⚙️ **الخيارات المتاحة:**\n`;
      q.options.forEach((opt, idx) => {
        responseText += `   [${idx + 1}] ${opt}\n`;
      });
      responseText += `\n`;
    }

    responseText += `🔑 **الإجابة الصحيحة النموذجية:**\n👉 **"${q.correctAnswer}"**\n\n`;

    if (q.hint) {
      responseText += `💡 **تلميحة للمساعدة:** ${q.hint}\n`;
    }
    if (q.explanation) {
      responseText += `📖 **الشرح التفصيلي للحل والقانون:** ${q.explanation}\n`;
    }
  }

  // Fallback if no exact content matches
  if (!responseText) {
    responseText = `🔍 **لم أستطع العثور على مطابقة دقيقة لعبارة "${userQuery}" في المنهج.**

لكن لا تقلق! يمكنك مراجعة المنهج بالبحث عن أحد المواضيع الرئيسية التالية:

📐 **الرسم الهندسي:** الإسقاط المتعامد، الزاوية الأولى، المنظور الأيزومتري، المنظور المائل، قواعد وضع الأبعاد، الرسم الكروكي.
⚙️ **الهندسة الميكانيكية:** الفلزات، الفرن اللافح، حديد الزهر، الصلب الكربوني، النحاس الأصفر، البرنز، البابيت، الدرفلة، محرك السيارة، الأشواط الأربعة.
🧱 **هندسة المواد والإنشاءات:** الجملونات، ركائز التثبيت، الركيزة الدحروج، الأقواس والأساسات، الإجهاد والانفعال، قانون هوك، معامل المرونة.
⚡ **الهندسة الكهربائية والموائع:** المكثف الكهربائي، الفاراد، الحث الكهرومغناطيسي، الحث الذاتي، قانون لينز، أشباه الموصلات، التشويب، اللزوجة، تلوث المياه، المطر الحمضي.

*💡 تلميحة: اكتب مثلاً: "ما هو قانون هوك؟" أو "اعطني سؤالاً عن المكثفات" لكي أجيبك فوراً بالتفصيل المعتمد!*`;
  }

  return responseText;
}

export default function AiTutor({ isOpen, onClose, presetTopic }: AiTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = presetTopic
        ? `أهلاً بك يا بطل! لقد قمت بفتح المساعد بمرجع لدرس: "${presetTopic}".

لقد قمت فوراً بمسح وبحث محتوى المنهج لهذا الموضوع. ما النقاط أو القوانين التي تجد فيها صعوبة وتريد مني تبسيطها لك بالمعادلات والشرح الهندسي؟`
        : "مرحباً بك يا باشمهندس المستقبل! 🇸🇩 أنا مرشدك ومساعدك الهندسي الذكي لتبسيط منهج العلوم الهندسية للصف الثاني ثانوي.\n\nتفضل بطرح أي سؤال، قانون، تمرين، أو مصطلح علمي ترغب في شرحه، وسأقوم بالبحث الفوري في محتوى كراسة الشرح والمنهج والرد عليك بأمثلة دقيقة مبسطة ومجانية تماماً بدون إنترنت!";
      
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeText,
          timestamp: new Date().toLocaleTimeString("ar-SD", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [isOpen, presetTopic]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString("ar-SD", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    // Simulate realistic interactive search delay (800ms) for high-quality tactile feedback
    setTimeout(() => {
      try {
        const reply = searchLocalContent(userInput, presetTopic);
        
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: reply,
            timestamp: new Date().toLocaleTimeString("ar-SD", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } catch (err: any) {
        console.error(err);
        setError("حدث خطأ غير متوقع أثناء معالجة البحث.");
      } finally {
        setLoading(false);
      }
    }, 750);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 lg:left-auto lg:w-[480px] bg-white border-r border-slate-200 shadow-2xl z-50 flex flex-col justify-between">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 text-white p-2 rounded-xl shadow-md shadow-indigo-600/10">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>البحث الهندسي الذكي والمساعد</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-[10px] text-slate-500">مساعد محلي فوري غير مكلف للرد من المنهج المعتمد</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={handleClearChat}
            title="مسح المحادثة"
            className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200/50 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-140px)]">
        {presetTopic && (
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 mb-2">
            تم ضبط مرجع البحث والمساعد لدرس: <strong>{presetTopic}</strong>
          </div>
        )}

        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-right ${isAssistant ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex flex-col max-w-[85%] ${isAssistant ? "items-start" : "items-end"}`}>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                  <span>{isAssistant ? "المساعد الهندسي (مبحث محلي)" : "أنت"}</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isAssistant
                      ? "bg-slate-50 text-slate-800 rounded-tr-none border border-slate-200 shadow-sm"
                      : "bg-indigo-600 text-white font-medium rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex flex-col items-start max-w-[80%]">
              <span className="text-[10px] text-slate-400 mb-1">يجري البحث الفوري...</span>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl rounded-tr-none flex items-center space-x-1.5 space-x-reverse shadow-sm">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl text-center shadow-sm">
            {errorMsg}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="bg-slate-50 border-t border-slate-200 p-4 flex gap-2">
        <input
          type="text"
          placeholder="ابحث عن درس، قانون، مصطلح، أو اكتب 'تمرين'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 text-right px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition active:scale-95 shadow-sm"
        >
          <Send className="h-4.5 w-4.5 rotate-180" />
        </button>
      </form>
    </div>
  );
}
