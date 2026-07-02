import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { X, Send, Sparkles, Cpu, Bot, User, Trash2 } from "lucide-react";

interface AiTutorProps {
  isOpen: boolean;
  onClose: () => void;
  presetTopic?: string;
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

  // When a preset topic is passed, trigger a greeting message from the tutor
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = presetTopic
        ? `أهلاً بك يا بطل! يسعدني جداً مساعدتك اليوم في فهم درس: "${presetTopic}". ما النقاط التي تجد فيها صعوبة وتريد مني تبسيطها لك بالرسومات أو المعادلات؟`
        : "مرحباً بك يا باشمهندس المستقبل! 🇸🇩 أنا معلمك الهندسي الذكي لتبسيط منهج العلوم الهندسية للصف الثاني ثانوي. تفضل بطرح أي سؤال أو قانون أو تمرين ترغب في شرحه وسأجيبك بأمثلة سودانية مبسطة!";
      
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("ar-SD", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentTopic: presetTopic || "عام",
        }),
      });

      if (!response.ok) {
        throw new Error("فشل الخادم في الرد بالشكل المطلوب.");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date().toLocaleTimeString("ar-SD", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء التواصل مع المعلم الذكي. يرجى التحقق من الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
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
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 text-white p-2 rounded-xl shadow-md shadow-indigo-600/10">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>المعلم الهندسي الذكي</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-[10px] text-slate-500">مرشدك الذكي لتبسيط القوانين وحل التمارين</p>
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
            تم ضبط مرجع المعلم حالياً لشرح درس: <strong>{presetTopic}</strong>
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
                  <span>{isAssistant ? "المعلم الذكي" : "أنت"}</span>
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
              <span className="text-[10px] text-slate-400 mb-1">يكتب الآن...</span>
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
          placeholder="اسأل المعلم عن القوانين أو مسألة..."
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
