import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Flame, BookOpen, X } from 'lucide-react';
import { useGoals } from '../contexts/GoalsContext';
import { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-scale-in">
      <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white rounded-xl border border-yellow-400/30 p-4 shadow-2xl max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{achievement.icon}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} className="text-yellow-300" />
                <span className="font-bold text-sm">Achievement Unlocked!</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">{achievement.title}</h4>
              <p className="text-sm text-yellow-100">{achievement.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-200 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AchievementDisplay: React.FC = () => {
  const { achievements } = useGoals();
  const [showAll, setShowAll] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Check for new achievements (simple implementation)
  useEffect(() => {
    const lastShownId = localStorage.getItem('lastShownAchievement');
    const newestAchievement = achievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())[0];
    
    if (newestAchievement && newestAchievement.id !== lastShownId) {
      setNewAchievement(newestAchievement);
      localStorage.setItem('lastShownAchievement', newestAchievement.id);
    }
  }, [achievements]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study': return BookOpen;
      case 'completion': return Target;
      case 'streak': return Flame;
      case 'goal': return Star;
      default: return Trophy;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'completion': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'streak': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'goal': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 6);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Achievements</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Your learning accomplishments ({achievements.length} unlocked)
            </p>
          </div>
          {achievements.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-primary-main hover:text-primary-accent transition-colors text-sm sm:text-base touch-manipulation whitespace-nowrap"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedAchievements.map((achievement) => {
              const IconComponent = getCategoryIcon(achievement.category);
              return (
                <div
                  key={achievement.id}
                  className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-lg sm:rounded-xl border border-white/20 dark:border-white/10 p-4 sm:p-6 animate-scale-in hover:scale-105 transition-all"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl flex-shrink-0">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {achievement.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getCategoryColor(achievement.category)} w-fit`}>
                          <IconComponent size={10} />
                          {achievement.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatDate(achievement.unlockedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Trophy size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
              No achievements yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-6 px-4">
              Start completing lessons and setting goals to unlock your first achievement!
            </p>
          </div>
        )}
      </div>

      {/* Achievement Notification */}
      {newAchievement && (
        <AchievementNotification
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </>
  );
};