import React, { useState } from 'react';
import { Plus, BookOpen, TrendingUp, Calendar, Target, Trophy, Flame, BarChart3 } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import { useGoals } from '../contexts/GoalsContext';
import { useStreak } from '../contexts/StreakContext';
import { Course } from '../types';
import { CourseCard } from './CourseCard';
import { CourseForm } from './CourseForm';
import { ThemeToggle } from './ThemeToggle';
import { Timeline } from './Timeline';
import { UserMenu } from './UserMenu';
import { GoalManager } from './GoalManager';
import { AchievementDisplay } from './AchievementDisplay';
import { StreakDisplay } from './StreakDisplay';

export const Dashboard: React.FC = () => {
  const { courses, addCourse, updateCourse } = useCourses();
  const { goals, achievements } = useGoals();
  const { streak } = useStreak();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [activeTab, setActiveTab] = useState<'courses' | 'goals' | 'achievements'>('courses');

  const handleAddCourse = (courseData: Omit<Course, 'id' | 'progress'>) => {
    addCourse(courseData);
    setShowForm(false);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleUpdateCourse = (courseData: Omit<Course, 'id' | 'progress'>) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      setEditingCourse(undefined);
      setShowForm(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCourse(undefined);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseTimeline = () => {
    setSelectedCourse(undefined);
  };

  const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0);
  const completedLessons = courses.reduce((acc, course) => 
    acc + course.lessons.filter(lesson => lesson.completed).length, 0);
  const averageProgress = courses.length > 0 
    ? courses.reduce((acc, course) => acc + course.progress, 0) / courses.length 
    : 0;

  const activeGoals = goals.filter(g => !g.completed).length;
  const currentStreak = streak.current;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-main/20 dark:from-gray-900 dark:via-gray-800 dark:to-primary-dark/20 transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-main/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-white/10 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-main to-primary-accent text-white">
                  <BookOpen size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Course Tracker
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-primary-main">{courses.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary-main/10">
                  <BookOpen className="text-primary-main" size={24} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6 animate-slide-up delay-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lessons Progress</p>
                  <p className="text-3xl font-bold text-primary-accent">
                    {completedLessons}/{totalLessons}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary-accent/10">
                  <Calendar className="text-primary-accent" size={24} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6 animate-slide-up delay-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Progress</p>
                  <p className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                    {averageProgress.toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary-dark/10 dark:bg-primary-light/10">
                  <TrendingUp className="text-primary-dark dark:text-primary-light" size={24} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6 animate-slide-up delay-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Goals</p>
                  <p className="text-3xl font-bold text-green-600">
                    {activeGoals}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-600/10">
                  <Target className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6 animate-slide-up delay-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Streak</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {currentStreak}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-600/10">
                  <Flame className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'courses'
                  ? 'bg-primary-main text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-main'
              }`}
            >
              <BookOpen size={20} />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'goals'
                  ? 'bg-primary-main text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-main'
              }`}
            >
              <Target size={20} />
              Goals
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'achievements'
                  ? 'bg-primary-main text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-main'
              }`}
            >
              <Trophy size={20} />
              Achievements
              {achievements.length > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {achievements.length}
                </span>
              )}
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'courses' && (
            <>
          {/* Add Course Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Your Courses
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-main to-primary-accent text-white rounded-lg hover:from-primary-main/80 hover:to-primary-accent/80 transition-all shadow-lg hover:shadow-primary-main/25 transform hover:scale-105"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>

          {/* Courses Grid */}
          {courses.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="contents">
                    <CourseCard
                      course={course}
                      onEdit={handleEditCourse}
                      onSelect={handleSelectCourse}
                    />
                    {/* Timeline appears directly below selected course on mobile/tablet */}
                    {selectedCourse && selectedCourse.id === course.id && (
                      <div className="md:hidden col-span-full">
                        <Timeline 
                          course={selectedCourse} 
                          onClose={handleCloseTimeline}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Timeline appears at bottom on desktop */}
              {selectedCourse && (
                <div className="hidden md:block">
                  <Timeline 
                    course={selectedCourse} 
                    onClose={handleCloseTimeline}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-8 inline-block animate-fade-in">
                <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                  No courses yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Start tracking your learning journey by adding your first course
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-main to-primary-accent text-white rounded-lg hover:from-primary-main/80 hover:to-primary-accent/80 transition-all mx-auto"
                >
                  <Plus size={20} />
                  Add Your First Course
                </button>
              </div>
            </div>
          )}

            </>
          )}

          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GoalManager />
              </div>
              <div>
                <StreakDisplay />
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AchievementDisplay />
              </div>
              <div className="space-y-6">
                <StreakDisplay />
                <div className="text-sm text-gray-600 dark:text-gray-400 backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-4">
                  <p className="mb-2">🏆 Keep studying to unlock more achievements!</p>
                  <p>Complete lessons, maintain streaks, and achieve your goals to earn badges.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Course Form Modal */}
        {showForm && (
          <CourseForm
            course={editingCourse}
            onSave={editingCourse ? handleUpdateCourse : handleAddCourse}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};