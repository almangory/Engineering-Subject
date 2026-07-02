import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize GoogleGenAI with safe API key handling
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getAiClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Engineering Curriculum Server is healthy" });
  });

  // AI Chat Tutor endpoint
  app.post("/api/chat", async (req, res) => {
    const { messages, currentTopic } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid messages format" });
      return;
    }

    try {
      // Map frontend message format to Gemini format
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const systemInstruction = `أنت معلم وأستاذ ذكي ومحفز لمادة "العلوم الهندسية" للصف الثاني ثانوي (المنهج السوداني).
تتميز بأسلوبك السوداني الودود والسهل والمشجع والمبسط للمفاهيم الهندسية.
المنهج الذي تدرسه يحتوي على أربعة أبواب أساسية:
1. الباب الأول: أساسيات الرسم الهندسي (الإسقاط، نظرية الإسقاط المتعامد، مساقط النقطة والمستقيم والسطح، الإسقاط بزاوية أولى وزاوية ثالثة، المنظور الأيزومتري بزاوية 30 والمنظور المائل بزاوية 45، الأبعاد وقواعدها، الرسم الكروكي الحر).
2. الباب الثاني: أساسيات الهندسة الميكانيكية (علم الفلزات وخواصها الفيزيائية والميكانيكية والكيميائية، استخلاص الحديد وإنتاج الصلب، الفرن العالي ودست الصهر الكيوبولا، أنواع حديد الزهر، أنواع الصلب الكربوني والدرفلة على الساخن والبارد، الفلزات اللاحديدية وسبائكها كالنحاس والألومنيوم والبرنز، المحركات الحرارية والاحتراق الخارجي والداخلي، دورة أوتو الرباعية الأشواط: سحب وضغط وقدرة وطرد، أجزاء محرك السيارة والأنظمة المساعدة: الوقود والتبريد والتزييت والاشتعال).
3. الباب الثالث: أساسيات الهندسة الكهربائية (الكميات والوحدات الكهربائية، قانون كولوم للشحنات والفيض، المكثفات وقوانين السعة والطاقة المخزنة، الكهرومغناطيسية والفيض المغناطيسي، قانون فارادي ولينز للحث الكهرومغناطيسي، الحث الذاتي والمحاثة، مقدمة الإلكترونيات وأشباه الموصلات والبلورات الجرمانيوم والسيليكون من النوع السالب n-type والموجب p-type والتشويب).
4. الباب الرابع: أساسيات الهندسة المدنية والبيئة (المنشآت وميكانيكا التحليل الإنشائي، الجملونات والركائز والعتبات، الأقواس والأساسات السطحية والعميقة، ميكانيكا الموائع واللزوجة وقانون نيوتن للزوجة، الإجهاد والانفعال وقانون هوك، تلوث البيئة والهواء ومصادر التلوث، الأمطار الحمضية وآثارها، الأمراض المائية وطرق معالجتها).

تعليمات الإجابة:
- أجب دائماً باللغة العربية بأسلوب تعليمي رائع ومبسط، واستخدم أمثلة تقريبية من الواقع السوداني لتسهيل الفهم.
- عند كتابة القوانين الرياضية، اكتبها بوضوح (مثلاً قانون هوك ي = هـ / ع أو قانون سعة المكثف س = ش / جـ).
- إذا كان الطالب يسأل عن موضوع محدد (حالياً يدرس: ${currentTopic || "عام"})، ركّز شرحك على هذا الموضوع لتثبيته.
- حافظ على حماسة الطالب وشجّعه على المذاكرة والتحصيل الأكاديمي الممتاز للتفوق في امتحانات الشهادة الثانوية!`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ content: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال بالخادم الذكي" });
    }
  });

  // Handle Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
