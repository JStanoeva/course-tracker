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
        className="backdrop-blur-lg bg-gradient-to-br from-glass-light to-glass-main dark:from-glass-dark dark:to-glass-main rounded-xl border border-white/20 dark:border-white/10 p-4 sm:p-6 hover:border-primary-main/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-main/10 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-main transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
              {course.description}
            </p>
          </div>
          <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button
              onClick={handleBulkOps}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-primary-dark/20 text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-all"
              title="Bulk Operations"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => onEdit(course)}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-primary-main/20 text-gray-600 dark:text-gray-400 hover:text-primary-main transition-all"
              title="Edit Course"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-primary-accent/20 text-gray-600 dark:text-gray-400 hover:text-primary-accent transition-all"
              title="Delete Course"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-xs sm:text-sm font-medium text-primary-main">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-main to-primary-accent rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1" title={`${course.lessons.length} lessons`}>
            <BookOpen size={14} />
            <span className="font-medium text-xs sm:text-sm">{course.lessons.length}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1" title={`${course.exams.length} exams`}>
            <FileText size={14} />
            <span className="font-medium text-xs sm:text-sm">{course.exams.length}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1" title={`${course.lessons.filter(l => l.completed).length} completed lessons`}>
            <CheckCircle size={14} />
            <span className="font-medium text-xs sm:text-sm">{course.lessons.filter(l => l.completed).length}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1" title={`${course.goals?.length || 0} goals`}>
            <Target size={14} />
            <span className="font-medium text-xs sm:text-sm">{course.goals?.length || 0}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Calendar size={12} />
            <span className="truncate">{formatDate(course.startDate)}</span>
          </div>
          <span className="text-gray-400 mx-1 sm:mx-2">•</span>
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Calendar size={12} />
            <span className="truncate">{formatDate(course.endDate)}</span>
          </div>
        </div>

        {/* Color indicator */}
        <div className="mt-3 sm:mt-4 flex justify-end">
          <div
            className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full"
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