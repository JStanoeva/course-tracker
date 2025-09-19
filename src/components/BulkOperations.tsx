import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Edit2, Calendar, X } from 'lucide-react';
import { Course, Lesson, Exam } from '../types';
import { useCourses } from '../contexts/CourseContext';

interface BulkOperationsProps {
  course: Course;
  onClose: () => void;
}

interface SelectableItem {
  id: string;
  type: 'lesson' | 'exam';
  title: string;
  completed: boolean;
  date?: string;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({ course, onClose }) => {
  const { updateCourse } = useCourses();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [operation, setOperation] = useState<'complete' | 'incomplete' | 'delete' | 'reschedule'>('complete');
  const [newDate, setNewDate] = useState('');

  // Combine lessons and exams into selectable items
  const selectableItems: SelectableItem[] = [
    ...course.lessons.map(lesson => ({
      id: `lesson-${lesson.id}`,
      type: 'lesson' as const,
      title: lesson.title,
      completed: lesson.completed,
      date: lesson.date,
    })),
    ...course.exams.map(exam => ({
      id: `exam-${exam.id}`,
      type: 'exam' as const,
      title: exam.title,
      completed: exam.completed,
      date: exam.date,
    })),
  ];

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === selectableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(selectableItems.map(item => item.id));
    }
  };

  const applyOperation = () => {
    if (selectedItems.length === 0) return;

    const updatedCourse = { ...course };

    selectedItems.forEach(itemId => {
      const [type, id] = itemId.split('-');
      
      if (type === 'lesson') {
        const lessonIndex = updatedCourse.lessons.findIndex(l => l.id === id);
        if (lessonIndex !== -1) {
          switch (operation) {
            case 'complete':
              updatedCourse.lessons[lessonIndex].completed = true;
              break;
            case 'incomplete':
              updatedCourse.lessons[lessonIndex].completed = false;
              break;
            case 'delete':
              updatedCourse.lessons.splice(lessonIndex, 1);
              break;
            case 'reschedule':
              if (newDate) updatedCourse.lessons[lessonIndex].date = newDate;
              break;
          }
        }
      } else if (type === 'exam') {
        const examIndex = updatedCourse.exams.findIndex(e => e.id === id);
        if (examIndex !== -1) {
          switch (operation) {
            case 'complete':
              updatedCourse.exams[examIndex].completed = true;
              break;
            case 'incomplete':
              updatedCourse.exams[examIndex].completed = false;
              break;
            case 'delete':
              updatedCourse.exams.splice(examIndex, 1);
              break;
            case 'reschedule':
              if (newDate) updatedCourse.exams[examIndex].date = newDate;
              break;
          }
        }
      }
    });

    updateCourse(course.id, updatedCourse);
    onClose();
  };

  const getOperationText = () => {
    switch (operation) {
      case 'complete': return 'Mark as Complete';
      case 'incomplete': return 'Mark as Incomplete';
      case 'delete': return 'Delete Items';
      case 'reschedule': return 'Reschedule Items';
      default: return 'Apply';
    }
  };

  const getOperationColor = () => {
    switch (operation) {
      case 'complete': return 'bg-green-600 hover:bg-green-700';
      case 'incomplete': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'delete': return 'bg-red-600 hover:bg-red-700';
      case 'reschedule': return 'bg-blue-600 hover:bg-blue-700';
      default: return 'bg-primary-main hover:bg-primary-main/80';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-auto backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Bulk Operations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select items and apply bulk changes to {course.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-primary-main hover:text-primary-accent transition-colors"
            >
              {selectedItems.length === selectableItems.length ? (
                <CheckSquare size={18} />
              ) : (
                <Square size={18} />
              )}
              {selectedItems.length === selectableItems.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedItems.length} of {selectableItems.length} selected
            </span>
          </div>

          {/* Items List */}
          <div className="max-h-64 overflow-auto space-y-2 border border-white/20 dark:border-white/10 rounded-lg p-3">
            {selectableItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedItems.includes(item.id)
                    ? 'bg-primary-main/20 border border-primary-main/30'
                    : 'bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30'
                }`}
                onClick={() => handleItemSelect(item.id)}
              >
                <button className="text-primary-main">
                  {selectedItems.includes(item.id) ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {item.title}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'lesson'
                        ? 'bg-primary-main/20 text-primary-main'
                        : 'bg-primary-accent/20 text-primary-accent'
                    }`}>
                      {item.type}
                    </span>
                    {item.completed && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-600">
                        Completed
                      </span>
                    )}
                  </div>
                  {item.date && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={12} />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Operation Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Operation
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOperation('complete')}
                  className={`p-3 rounded-lg border transition-colors ${
                    operation === 'complete'
                      ? 'border-green-500 bg-green-500/20 text-green-600'
                      : 'border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:border-green-500/50'
                  }`}
                >
                  <CheckSquare size={20} className="mx-auto mb-1" />
                  <div className="text-sm font-medium">Complete</div>
                </button>
                
                <button
                  onClick={() => setOperation('incomplete')}
                  className={`p-3 rounded-lg border transition-colors ${
                    operation === 'incomplete'
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-600'
                      : 'border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:border-yellow-500/50'
                  }`}
                >
                  <Square size={20} className="mx-auto mb-1" />
                  <div className="text-sm font-medium">Incomplete</div>
                </button>
                
                <button
                  onClick={() => setOperation('reschedule')}
                  className={`p-3 rounded-lg border transition-colors ${
                    operation === 'reschedule'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-600'
                      : 'border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:border-blue-500/50'
                  }`}
                >
                  <Calendar size={20} className="mx-auto mb-1" />
                  <div className="text-sm font-medium">Reschedule</div>
                </button>
                
                <button
                  onClick={() => setOperation('delete')}
                  className={`p-3 rounded-lg border transition-colors ${
                    operation === 'delete'
                      ? 'border-red-500 bg-red-500/20 text-red-600'
                      : 'border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:border-red-500/50'
                  }`}
                >
                  <Trash2 size={20} className="mx-auto mb-1" />
                  <div className="text-sm font-medium">Delete</div>
                </button>
              </div>
            </div>

            {/* Date picker for reschedule */}
            {operation === 'reschedule' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
                  required
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/20 dark:border-white/10">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyOperation}
              disabled={selectedItems.length === 0 || (operation === 'reschedule' && !newDate)}
              className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getOperationColor()}`}
            >
              {getOperationText()} ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};