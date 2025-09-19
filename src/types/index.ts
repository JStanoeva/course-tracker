export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'course';
  target: number;
  current: number;
  deadline: string;
  completed: boolean;
  courseId?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'study' | 'completion' | 'streak' | 'goal';
}

export interface Streak {
  current: number;
  longest: number;
  lastActivityDate: string;
  activities: StreakActivity[];
}

export interface StreakActivity {
  date: string;
  type: 'lesson' | 'homework' | 'exam' | 'study';
  count: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'lab' | 'exercise';
  date: string;
  completed: boolean;
  homework: Homework[];
  notes: Note[];
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
  goals: Goal[];
}

export type ThemeMode = 'light' | 'dark' | 'system';