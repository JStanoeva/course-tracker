import React, { useState } from 'react';
import { Plus, Target, Calendar, Trophy, Trash2, Edit2, CheckCircle, Clock, Check } from 'lucide-react';
import { useGoals } from '../contexts/GoalsContext';
import { useCourses } from '../contexts/CourseContext';
import { useCourses } from '../contexts/CourseContext';
import { Goal } from '../types';

export const GoalManager: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { courses, updateCourse } = useCourses();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'weekly' as Goal['type'],
    target: 1,
    deadline: '',
    courseId: '',
  });

  // Combine general goals with course-specific goals
  const allGoals = [
    ...goals,
    ...courses.flatMap(course => 
      (course.goals || []).map(goal => ({
        ...goal,
        courseTitle: course.title,
        isCourseGoal: true
      }))
    )
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.deadline) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
      setEditingGoal(undefined);
    } else {
      addGoal(formData);
    }
    
    setFormData({
      title: '',
      description: '',
      type: 'weekly',
      target: 1,
      deadline: '',
      courseId: '',
    });
    setShowForm(false);
  };

  const handleEdit = (goal: Goal) => {
    // Don't allow editing course-specific goals from the Goals tab
    if ((goal as any).isCourseGoal) {
      alert('Course-specific goals can only be edited from the course editor. Please edit the goal from the course details.');
      return;
    }
    
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      type: goal.type,
      target: goal.target,
      deadline: goal.deadline,
      courseId: goal.courseId || '',
    });
    setShowForm(true);
  };

  const handleIncrementProgress = (goal: Goal) => {
    if ((goal as any).isCourseGoal) {
      // Handle course-specific goal
      const course = courses.find(c => c.id === goal.courseId);
      if (course) {
        const updatedGoals = course.goals!.map(g => {
          if (g.id === goal.id) {
            const newCurrent = Math.min(g.current + 1, g.target);
            const completed = newCurrent >= g.target;
            return { ...g, current: newCurrent, completed };
          }
          return g;
        });
        updateCourse(course.id, { goals: updatedGoals });
      }
    } else {
      // Handle general goal
      const newCurrent = Math.min(goal.current + 1, goal.target);
      const completed = newCurrent >= goal.target;
      updateGoal(goal.id, { current: newCurrent, completed });
    }
  };

  const handleMarkComplete = (goal: Goal) => {
    if ((goal as any).isCourseGoal) {
      // Handle course-specific goal
      const course = courses.find(c => c.id === goal.courseId);
      if (course) {
        const updatedGoals = course.goals!.map(g => {
          if (g.id === goal.id) {
            return { ...g, current: g.target, completed: true };
          }
          return g;
        });
        updateCourse(course.id, { goals: updatedGoals });
      }
    } else {
      // Handle general goal
      updateGoal(goal.id, { current: goal.target, completed: true });
    }
  };

  const handleDeleteGoal = (goal: Goal) => {
    if ((goal as any).isCourseGoal) {
      // Handle course-specific goal deletion
      const course = courses.find(c => c.id === goal.courseId);
      if (course) {
        const updatedGoals = course.goals!.filter(g => g.id !== goal.id);
        updateCourse(course.id, { goals: updatedGoals });
      }
    } else {
      // Handle general goal deletion
      deleteGoal(goal.id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(undefined);
    setFormData({
      title: '',
      description: '',
      type: 'weekly',
      target: 1,
      deadline: '',
      courseId: '',
    });
  };

  const getProgressColor = (current: number, target: number, completed: boolean) => {
    if (completed) return 'text-green-600 bg-green-500/20';
    const percentage = (current / target) * 100;
    if (percentage >= 80) return 'text-primary-main bg-primary-main/20';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-500/20';
    return 'text-gray-600 bg-gray-500/20';
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    return `${diffDays} days remaining`;
  };

  const activeGoals = allGoals.filter(g => !g.completed);
  const completedGoals = allGoals.filter(g => g.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Learning Goals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your learning milestones ({goals.length} general, {courses.reduce((acc, course) => acc + (course.goals?.length || 0), 0)} course-specific)
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-main to-primary-accent text-white rounded-lg hover:from-primary-main/80 hover:to-primary-accent/80 transition-all"
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Active Goals ({activeGoals.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-6 animate-scale-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {goal.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        goal.type === 'daily' ? 'bg-primary-accent/20 text-primary-accent' :
                        goal.type === 'weekly' ? 'bg-primary-main/20 text-primary-main' :
                        goal.type === 'monthly' ? 'bg-primary-dark/20 text-primary-dark' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {goal.type}
                      </span>
                      {(goal as any).isCourseGoal && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-600 border border-blue-500/30 mt-2">
                          📚 {(goal as any).courseTitle}
                        </span>
                      )}
                      {(goal as any).isCourseGoal && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-600 border border-blue-500/30">
                          📚 {(goal as any).courseTitle}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>{formatDeadline(goal.deadline)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleIncrementProgress(goal)}
                      disabled={goal.current >= goal.target}
                      className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Increment progress (+1)"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => handleMarkComplete(goal)}
                      disabled={goal.completed}
                      className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mark as complete"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(goal as Goal)}
                      className={`p-2 rounded-lg transition-colors ${
                        (goal as any).isCourseGoal 
                          ? 'text-gray-300 cursor-not-allowed opacity-50' 
                          : 'text-gray-400 hover:text-primary-main hover:bg-white/10'
                      }`}
                      title="Edit goal"
                      disabled={(goal as any).isCourseGoal}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal as Goal)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Progress: {goal.current} / {goal.target}
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${getProgressColor(goal.current, goal.target, goal.completed)}`}>
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-main to-primary-accent rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Completed Goals ({completedGoals.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="backdrop-blur-lg bg-green-500/10 rounded-xl border border-green-500/20 p-6 animate-scale-in"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {goal.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.description}
                    </p>
                    <div className="text-sm text-green-600 font-medium">
                      Completed {goal.current} / {goal.target}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal as Goal)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {allGoals.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
            No goals set yet
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Create your first learning goal to start tracking your progress
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-main to-primary-accent text-white rounded-lg hover:from-primary-main/80 hover:to-primary-accent/80 transition-all"
          >
            <Plus size={20} />
            Create First Goal
          </button>
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/20 dark:border-white/10">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                  placeholder="e.g., Complete 5 lessons this week"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main/50 resize-none"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Goal['type'] }))}
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="course">Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                  required
                />
              </div>

              {formData.type === 'course' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course (optional)
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-primary-main to-primary-accent text-white hover:from-primary-main/80 hover:to-primary-accent/80 transition-all"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};