import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course } from '../types';
import { useAuth } from './AuthContext';
import { useGoals } from './GoalsContext';
import { useStreak } from './StreakContext';

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'progress'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourse: (id: string) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { updateGoalProgress, checkAchievements } = useGoals();
  const { recordActivity } = useStreak();
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`courses_${user?.id || 'anonymous'}`);
    if (saved) {
      const parsedCourses = JSON.parse(saved);
      // Normalize loaded data to ensure lessons and exams are always arrays
      return parsedCourses.map((course: any) => ({
        ...course,
        lessons: Array.isArray(course.lessons) ? course.lessons : [],
        exams: Array.isArray(course.exams) ? course.exams : [],
      }));
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`courses_${user.id}`, JSON.stringify(courses));
    }
  }, [courses, user]);

  // Load user-specific courses when user changes
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`courses_${user.id}`);
      if (saved) {
        const parsedCourses = JSON.parse(saved);
        setCourses(parsedCourses.map((course: any) => ({
          ...course,
          lessons: Array.isArray(course.lessons) ? course.lessons : [],
          exams: Array.isArray(course.exams) ? course.exams : [],
          goals: Array.isArray(course.goals) ? course.goals : [],
          goals: Array.isArray(course.goals) ? course.goals : [],
        })));
      } else {
        setCourses([]);
      }
    }
  }, [user]);

  const calculateProgress = (course: Omit<Course, 'id' | 'progress'>): number => {
    if (!Array.isArray(course.lessons) || course.lessons.length === 0) return 0;
    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / course.lessons.length) * 100);
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'progress'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      lessons: Array.isArray(courseData.lessons) ? courseData.lessons : [],
      exams: Array.isArray(courseData.exams) ? courseData.exams : [],
      goals: Array.isArray(courseData.goals) ? courseData.goals : [],
      progress: calculateProgress(courseData),
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    setCourses(prev => prev.map(course => {
      if (course.id === id) {
        const updated = { ...course, ...courseData };
        // Ensure lessons and exams are always arrays
        if (updated.lessons && !Array.isArray(updated.lessons)) {
          updated.lessons = [];
        }
        if (updated.exams && !Array.isArray(updated.exams)) {
          updated.exams = [];
        }
        if (updated.goals && !Array.isArray(updated.goals)) {
          updated.goals = [];
        }
        
        // Sync course-specific goals with the global goals context
        if (updated.goals && updated.goals.length > 0) {
          updated.goals.forEach((goal: Goal) => {
            // Update goal's courseId to match the course
            if (goal.courseId !== id) {
              goal.courseId = id;
            }
          });
        }
        
        // Check for completed lessons/exams and update goals/achievements
        if (courseData.lessons) {
          const oldCompletedLessons = course.lessons.filter(l => l.completed).length;
          const newCompletedLessons = updated.lessons.filter(l => l.completed).length;
          
          if (newCompletedLessons > oldCompletedLessons) {
            const increment = newCompletedLessons - oldCompletedLessons;
            // Record streak activity
            for (let i = 0; i < increment; i++) {
              recordActivity('lesson');
            }
            // Update relevant goals
            updateGoalProgress('lesson-goal', increment);
            // Check for new achievements
            setTimeout(checkAchievements, 100);
          }
        }
        
        if (courseData.exams) {
          const oldCompletedExams = course.exams.filter(e => e.completed).length;
          const newCompletedExams = updated.exams.filter(e => e.completed).length;
          
          if (newCompletedExams > oldCompletedExams) {
            const increment = newCompletedExams - oldCompletedExams;
            for (let i = 0; i < increment; i++) {
              recordActivity('exam');
            }
          }
        }
        
        if (courseData.lessons) {
          updated.progress = calculateProgress(updated);
        }
        return updated;
      }
      return course;
    }));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const getCourse = (id: string) => {
    return courses.find(course => course.id === id);
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse, getCourse }}>
      {children}
    </CourseContext.Provider>
  );
};