import React from 'react';
import { Flame, Calendar, TrendingUp, Award, RotateCcw } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

export const StreakDisplay: React.FC = () => {
  const { streak, getStreakStatus, resetStreak } = useStreak();
  const status = getStreakStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-orange-600 bg-orange-500/20 border-orange-500/30';
      case 'broken': return 'text-gray-600 bg-gray-500/20 border-gray-500/30';
      case 'new': return 'text-blue-600 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-600 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Active Streak';
      case 'broken': return 'Streak Broken';
      case 'new': return 'Start Your Streak';
      default: return 'No Activity';
    }
  };

  const getRecentActivities = () => {
    return streak.activities
      .slice(-7) // Last 7 activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            <Flame size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Study Streak
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
            {status === 'active' ? `${streak.current} days` : status}
          </div>
          {streak.current > 0 && (
            <button
              onClick={resetStreak}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Reset Streak"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-main mb-1">
            {streak.current}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Current Streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-accent mb-1">
            {streak.longest}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Longest Streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-1">
            {streak.activities.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Activities
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {streak.activities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {getRecentActivities().map((activity, index) => (
              <div
                key={`${activity.date}-${index}`}
                className="flex items-center justify-between p-2 rounded-lg bg-white/20 dark:bg-gray-800/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-main rounded-full" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.count} {activity.type}{activity.count > 1 ? 's' : ''} completed
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatActivityDate(activity.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      {status === 'active' && streak.current >= 3 && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary-main/10 to-primary-accent/10 border border-primary-main/20">
          <div className="flex items-center gap-2 text-primary-main">
            <Award size={16} />
            <span className="text-sm font-medium">
              {streak.current >= 7 ? "Amazing dedication! Keep it going!" :
               streak.current >= 5 ? "Great job! You're on fire!" :
               "Good momentum! Keep building your habit!"}
            </span>
          </div>
        </div>
      )}

      {status === 'broken' && (
        <div className="mt-4 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <TrendingUp size={16} />
            <span className="text-sm">
              Don't give up! Start a new streak today.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};