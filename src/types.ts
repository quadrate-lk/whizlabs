export interface Exam {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ExamResult {
  examId: number;
  score: number;
  totalQuestions: number;
  date: Date;
  userAnswers: Record<number, string>;
}