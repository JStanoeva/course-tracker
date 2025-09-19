import React from 'react';
import { Calendar, BookOpen, Edit2, Trash2, CheckCircle, FileText, Target, Settings } from 'lucide-react';
import { Course } from '../types';
import { useCourses } from '../contexts/CourseContext';
import { BulkOperations } from './BulkOperations';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onSelect }) => {
  const { deleteCourse } = useCourses();
  const [showBulkOps, setShowBulkOps] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(course.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger selection if clicking on edit/delete buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onSelect(course);
  };

  const handleBulkOps = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBulkOps(true);
  };

  return (
    <>
      <div className="group animate-scale-in">
      <div 
        className="backdrop-blur-lg bg-gradient-to-br from-glass-light to-glass-main dark:from-glass-dark dark:to-glass-main rounded-xl border border-white/20 dark:border-white/10 p-6 hover:border-primary-main/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-main/10 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-main transition-colors">
              {course.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleBulkOps}
              className="p-2 rounded-lg bg-white/10 hover:bg-primary-dark/20 text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-all"
              title="Bulk Operations"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => onEdit(course)}
              className="p-2 rounded-lg bg-white/10 hover:bg-primary-main/20 text-gray-600 dark:text-gray-400 hover:text-primary-main transition-all"
              title="Edit Course"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-white/10 hover:bg-primary-accent/20 text-gray-600 dark:text-gray-400 hover:text-primary-accent transition-all"
              title="Delete Course"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-primary-main">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-main to-primary-accent rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{course.lessons.length} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={16} />
            <span>{course.exams.length} exams</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle size={16} />
            <span>{course.lessons.filter(l => l.completed).length} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Target size={16} />
            <span>{course.goals?.length || 0} goals</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(course.startDate)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(course.endDate)}</span>
          </div>
        </div>

        {/* Color indicator */}
        <div className="mt-4 flex justify-end">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: course.color }}
          />
        </div>
      </div>
    </div>

      {/* Bulk Operations Modal */}
      {showBulkOps && (
        <BulkOperations 
          course={course} 
          onClose={() => setShowBulkOps(false)} 
        />
      )}
    </>
  );
};