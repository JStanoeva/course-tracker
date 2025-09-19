import React, { createContext, useContext, useState, useEffect } from 'react';
import { Goal, Achievement } from '../types';
import { useAuth } from './AuthContext';

interface GoalsContextType {
  goals: Goal[];
  achievements: Achievement[];
  addGoal: (goal: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (goalId: string, increment: number) => void;
  unlockAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedAt'>) => void;
  checkAchievements: () => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

// Predefined achievements
const PREDEFINED_ACHIEVEMENTS = [
  {
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👶',
    category: 'completion' as const,
    condition: (data: any) => data.completedLessons >= 1
  },
  {
    title: 'Study Streak',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'streak' as const,
    condition: (data: any) => data.currentStreak >= 7
  },
  {
    title: 'Goal Achiever',
    description: 'Complete your first goal',
    icon: '🎯',
    category: 'goal' as const,
    condition: (data: any) => data.completedGoals >= 1
  },
  {
    title: 'Dedicated Student',
    description: 'Complete 10 lessons',
    icon: '📚',
    category: 'completion' as const,
    condition: (data: any) => data.completedLessons >= 10
  },
  {
    title: 'Week Warrior',
    description: 'Complete 5 lessons in one week',
    icon: '⚔️',
    category: 'study' as const,
    condition: (data: any) => data.weeklyLessons >= 5
  },
];

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(`goals_${user?.id || 'anonymous'}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`achievements_${user?.id || 'anonymous'}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`goals_${user.id}`, JSON.stringify(goals));
    }
  }, [goals, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
    }
  }, [achievements, user]);

  useEffect(() => {
    if (user) {
      const savedGoals = localStorage.getItem(`goals_${user.id}`);
      const savedAchievements = localStorage.getItem(`achievements_${user.id}`);
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    }
  }, [user]);

  const addGoal = (goalData: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      current: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const updated = { ...goal, ...updates };
        // Check if goal is completed
        if (updated.current >= updated.target && !updated.completed) {
          updated.completed = true;
          // Trigger achievement check
          setTimeout(checkAchievements, 100);
        }
        return updated;
      }
      return goal;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        const completed = newCurrent >= goal.target;
        if (completed && !goal.completed) {
          setTimeout(checkAchievements, 100);
        }
        return { ...goal, current: newCurrent, completed };
      }
      return goal;
    }));
  };

  const unlockAchievement = (achievementData: Omit<Achievement, 'id' | 'unlockedAt'>) => {
    // Check if achievement already exists
    const exists = achievements.some(a => a.title === achievementData.title);
    if (exists) return;

    const newAchievement: Achievement = {
      ...achievementData,
      id: Date.now().toString(),
      unlockedAt: new Date().toISOString(),
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const checkAchievements = () => {
    // Get current stats from localStorage
    const coursesData = localStorage.getItem(`courses_${user?.id || 'anonymous'}`);
    const streakData = localStorage.getItem(`streak_${user?.id || 'anonymous'}`);
    
    let completedLessons = 0;
    let weeklyLessons = 0;
    let currentStreak = 0;
    let completedGoals = goals.filter(g => g.completed).length;

    if (coursesData) {
      const courses = JSON.parse(coursesData);
      completedLessons = courses.reduce((acc: number, course: any) => 
        acc + (course.lessons?.filter((l: any) => l.completed) || []).length, 0);
      
      // Calculate weekly lessons (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      courses.forEach((course: any) => {
        course.lessons?.forEach((lesson: any) => {
          if (lesson.completed && new Date(lesson.date) >= weekAgo) {
            weeklyLessons++;
          }
        });
      });
    }

    if (streakData) {
      const streak = JSON.parse(streakData);
      currentStreak = streak.current || 0;
    }

    const data = {
      completedLessons,
      weeklyLessons,
      currentStreak,
      completedGoals,
    };

    // Check each predefined achievement
    PREDEFINED_ACHIEVEMENTS.forEach(achievement => {
      if (achievement.condition(data)) {
        unlockAchievement(achievement);
      }
    });
  };

  return (
    <GoalsContext.Provider value={{
      goals,
      achievements,
      addGoal,
      updateGoal,
      deleteGoal,
      updateGoalProgress,
      unlockAchievement,
      checkAchievements,
    }}>
      {children}
    </GoalsContext.Provider>
  );
};