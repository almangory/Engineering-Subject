export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  content: string[]; // split in paragraphs
  formulas?: { name: string; formula: string; explanation: string }[];
  diagrams?: string[]; // simple SVG representation names
}

export interface Chapter {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-blank" | "calculation" | "matching" | "diagram-labeling";
  questionText: string;
  options?: string[]; // for multiple-choice
  correctAnswer: string; // for MC, true/false ("صح"/"خطأ"), or exact values
  hint?: string;
  explanation?: string;
  matchingPairs?: { left: string; right: string }[]; // for matching questions
  diagramId?: string; // for diagram labeling
  diagramLabels?: { number: number; label: string; options: string[] }[]; // for diagram labeling
}

export interface Worksheet {
  id: string;
  title: string;
  chapterId: string;
  description: string;
  questions: Question[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
