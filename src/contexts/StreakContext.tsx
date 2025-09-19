import React, { createContext, useContext, useState, useEffect } from 'react';
import { Streak, StreakActivity } from '../types';
import { useAuth } from './AuthContext';

interface StreakContextType {
  streak: Streak;
  recordActivity: (type: 'lesson' | 'homework' | 'exam' | 'study') => void;
  getStreakStatus: () => 'active' | 'broken' | 'new';
  resetStreak: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<Streak>(() => {
    const saved = localStorage.getItem(`streak_${user?.id || 'anonymous'}`);
    return saved ? JSON.parse(saved) : {
      current: 0,
      longest: 0,
      lastActivityDate: '',
      activities: [],
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`streak_${user.id}`, JSON.stringify(streak));
    }
  }, [streak, user]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`streak_${user.id}`);
      if (saved) {
        setStreak(JSON.parse(saved));
      }
    }
  }, [user]);

  const recordActivity = (type: 'lesson' | 'homework' | 'exam' | 'study') => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    setStreak(prev => {
      const newStreak = { ...prev };
      const lastActivityDate = prev.lastActivityDate ? new Date(prev.lastActivityDate).toDateString() : '';

      // Check if we need to update or create today's activity
      const todayActivity = prev.activities.find(a => new Date(a.date).toDateString() === today);
      
      if (todayActivity) {
        // Increment today's activity count
        newStreak.activities = prev.activities.map(a => 
          new Date(a.date).toDateString() === today 
            ? { ...a, count: a.count + 1 }
            : a
        );
      } else {
        // Create new activity for today
        newStreak.activities = [...prev.activities, {
          date: new Date().toISOString(),
          type,
          count: 1,
        }];

        // Update streak logic
        if (lastActivityDate === yesterdayStr || prev.current === 0) {
          // Continue streak or start new one
          newStreak.current = prev.current + 1;
        } else if (lastActivityDate !== today) {
          // Streak broken, reset to 1
          newStreak.current = 1;
        }

        // Update longest streak
        if (newStreak.current > prev.longest) {
          newStreak.longest = newStreak.current;
        }

        newStreak.lastActivityDate = new Date().toISOString();
      }

      // Keep only last 30 days of activities
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      newStreak.activities = newStreak.activities.filter(
        a => new Date(a.date) >= thirtyDaysAgo
      );

      return newStreak;
    });
  };

  const getStreakStatus = (): 'active' | 'broken' | 'new' => {
    if (!streak.lastActivityDate) return 'new';
    
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const lastActivityDate = new Date(streak.lastActivityDate).toDateString();
    
    if (lastActivityDate === today || lastActivityDate === yesterdayStr) {
      return 'active';
    }
    
    return 'broken';
  };

  const resetStreak = () => {
    if (window.confirm('Are you sure you want to reset your study streak? This action cannot be undone.')) {
      setStreak({
        current: 0,
        longest: streak.longest, // Keep the longest streak record
        lastActivityDate: '',
        activities: [],
      });
    }
  };

  return (
    <StreakContext.Provider value={{
      streak,
      recordActivity,
      getStreakStatus,
      resetStreak,
    }}>
      {children}
    </StreakContext.Provider>
  );
};