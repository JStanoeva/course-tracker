export interface Lesson {
  id: string;
  title: string;
  type: 'lab' | 'exercise';
  date: string;
  completed: boolean;
  homework: Homework[];
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  score?: number;
}

export interface Homework {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  submitted: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  lessons: Lesson[];
  exams: Exam[];
  progress: number;
  color: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';