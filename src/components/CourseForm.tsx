import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Plus, CheckSquare, Square, Target, Trash2 } from 'lucide-react';
import { Course, Lesson, Exam, Goal } from '../types';
import { LessonForm } from './LessonForm';
import { useCourses } from '../contexts/CourseContext';

interface CourseFormProps {
  course?: Course;
  onSave: (course: Omit<Course, 'id' | 'progress'>) => void;
  onCancel: () => void;
}

const colorOptions = [
  '#36eee0', '#f652a0', '#4c5270', '#bcece0',
  '#6366f1', '#10b981', '#f59e0b', '#ef4444'
];

export const CourseForm: React.FC<CourseFormProps> = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    startDate: course?.startDate || '',
    endDate: course?.endDate || '',
    color: course?.color || colorOptions[0],
  });
  const [lessons, setLessons] = useState<Lesson[]>(course?.lessons || []);
  const [exams, setExams] = useState<Exam[]>(course?.exams || []);
  const [courseGoals, setCourseGoals] = useState<Goal[]>(course?.goals || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startDate || !formData.endDate) return;

    onSave({
      ...formData,
      lessons,
      exams,
      goals: courseGoals,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExam = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      title: 'New Exam',
      date: '',
      completed: false,
    };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (examId: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(exam => exam.id === examId ? { ...exam, ...updates } : exam));
  };

  const removeExam = (examId: string) => {
    setExams(prev => prev.filter(exam => exam.id !== examId));
  };

  const addCourseGoal = () => {
    const newGoal: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt'> & { id: string; current: number; completed: boolean; createdAt: string } = {
      id: Date.now().toString(),
      title: 'New Course Goal',
      description: '',
      type: 'course',
      target: 1,
      current: 0,
      deadline: '',
      completed: false,
      createdAt: new Date().toISOString(),
      courseId: course?.id || 'new-course',
    };
    setCourseGoals(prev => [...prev, newGoal as Goal]);
  };

  const updateCourseGoal = (goalId: string, updates: Partial<Goal>) => {
    setCourseGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updates } : goal));
  };

  const removeCourseGoal = (goalId: string) => {
    setCourseGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl animate-scale-in">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main/50 transition-all"
                placeholder="Enter course title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Theme
              </label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-800 dark:border-white scale-110'
                        : 'border-white/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main/50 transition-all resize-none"
              placeholder="Course description"
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Exams */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Course Exams
              </h3>
              <button
                type="button"
                onClick={addExam}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors"
              >
                <Plus size={16} />
                Add Exam
              </button>
            </div>
            <div className="space-y-3 backdrop-blur-md bg-glass-light dark:bg-glass-dark rounded-lg border border-white/20 dark:border-white/10 p-4">
              {exams.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No exams added yet
                </p>
              ) : (
                exams.map((exam) => (
                  <div key={exam.id} className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateExam(exam.id, { completed: !exam.completed })}
                      className="text-primary-main hover:text-primary-accent transition-colors"
                    >
                      {exam.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                    <input
                      type="text"
                      value={exam.title}
                      onChange={(e) => updateExam(exam.id, { title: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                      placeholder="Exam title"
                    />
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <input
                        type="date"
                        value={exam.date}
                        onChange={(e) => updateExam(exam.id, { date: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExam(exam.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary-accent hover:bg-white/10 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Course Goals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Course Goals
              </h3>
              <button
                type="button"
                onClick={addCourseGoal}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors"
              >
                <Plus size={16} />
                Add Goal
              </button>
            </div>
            <div className="space-y-3 backdrop-blur-md bg-glass-light dark:bg-glass-dark rounded-lg border border-white/20 dark:border-white/10 p-4">
              {courseGoals.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No course-specific goals added yet
                </p>
              ) : (
                courseGoals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateCourseGoal(goal.id, { title: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                          placeholder="Goal title"
                        />
                        <button
                          type="button"
                          onClick={() => removeCourseGoal(goal.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary-accent hover:bg-white/10 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Target</label>
                          <input
                            type="number"
                            min="1"
                            value={goal.target}
                            onChange={(e) => updateCourseGoal(goal.id, { target: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Deadline</label>
                          <input
                            type="date"
                            value={goal.deadline}
                            onChange={(e) => updateCourseGoal(goal.id, { deadline: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Progress</label>
                          <input
                            type="number"
                            min="0"
                            max={goal.target}
                            value={goal.current}
                            onChange={(e) => updateCourseGoal(goal.id, { current: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                          />
                        </div>
                      </div>
                      <textarea
                        value={goal.description}
                        onChange={(e) => updateCourseGoal(goal.id, { description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-main/50 resize-none"
                        placeholder="Goal description (optional)"
                        rows={2}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lessons */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Course Lessons
            </h3>
            <LessonForm lessons={lessons} onLessonsChange={setLessons} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-white/20 dark:border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-primary-main to-primary-accent text-white hover:from-primary-main/80 hover:to-primary-accent/80 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Save size={20} />
              {course ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};