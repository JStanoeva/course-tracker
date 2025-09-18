import React from 'react';
import { Calendar, BookOpen, FileText, CheckCircle, Clock, Home } from 'lucide-react';
import { Course } from '../types';

interface TimelineProps {
  course: Course;
  onClose: () => void;
}

interface TimelineEvent {
  id: string;
  type: 'lesson' | 'exam' | 'homework';
  title: string;
  date: string;
  completed: boolean;
  lessonType?: 'lab' | 'exercise';
  submitted?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ course, onClose }) => {
  const events: TimelineEvent[] = [
    // Add lessons
    ...course.lessons.map(lesson => ({
      id: `lesson-${lesson.id}`,
      type: 'lesson' as const,
      title: lesson.title,
      date: lesson.date,
      completed: lesson.completed,
      lessonType: lesson.type,
    })),
    // Add exams
    ...course.exams.map(exam => ({
      id: `exam-${exam.id}`,
      type: 'exam' as const,
      title: exam.title,
      date: exam.date,
      completed: exam.completed,
    })),
    // Add homework
    ...course.lessons.flatMap(lesson =>
      lesson.homework.map(hw => ({
        id: `homework-${hw.id}`,
        type: 'homework' as const,
        title: `${lesson.title} - ${hw.title}`,
        date: hw.dueDate,
        completed: hw.completed,
        submitted: hw.submitted,
      }))
    )
  ]
  .filter(event => event.date) // Only show events with dates
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today;
    const isFuture = date > today;

    return {
      formatted: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      }),
      isToday,
      isPast,
      isFuture
    };
  };

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case 'lesson':
        return event.lessonType === 'lab' ? <Home size={16} /> : <BookOpen size={16} />;
      case 'exam':
        return <FileText size={16} />;
      case 'homework':
        return <Clock size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.completed) return 'text-green-600 bg-green-500/20 border-green-500/30';
    
    const dateInfo = formatDate(event.date);
    if (dateInfo.isPast) return 'text-red-600 bg-red-500/20 border-red-500/30';
    if (dateInfo.isToday) return 'text-primary-accent bg-primary-accent/20 border-primary-accent/30';
    return 'text-primary-main bg-primary-main/20 border-primary-main/30';
  };

  return (
    <div className="mt-8 animate-slide-up">
      <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-white/10 bg-white/30 dark:bg-gray-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {course.title} Timeline
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Course schedule with lessons, exams, and homework
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-all"
            >
              Close Timeline
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No scheduled events for this course
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => {
                const dateInfo = formatDate(event.date);
                const eventColor = getEventColor(event);
                
                return (
                  <div key={event.id} className="flex items-start gap-4">
                    {/* Date */}
                    <div className="w-20 text-right">
                      <div className={`text-xs font-medium ${
                        dateInfo.isToday ? 'text-primary-accent' :
                        dateInfo.isPast ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {dateInfo.formatted}
                      </div>
                      {dateInfo.isToday && (
                        <div className="text-xs text-primary-accent font-bold">Today</div>
                      )}
                    </div>

                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${eventColor}`}>
                        {getEventIcon(event)}
                      </div>
                      {index < events.length - 1 && (
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mt-2" />
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 pb-4">
                      <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 border border-white/20 dark:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {/* Event Type Badge */}
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              event.type === 'lesson' && event.lessonType === 'lab' ? 
                                'bg-primary-accent/20 text-primary-accent' :
                              event.type === 'lesson' ? 
                                'bg-primary-main/20 text-primary-main' :
                              event.type === 'exam' ?
                                'bg-primary-dark/20 text-primary-dark dark:bg-primary-light/20 dark:text-primary-light' :
                                'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                            }`}>
                              {event.type === 'lesson' ? event.lessonType : event.type}
                            </span>
                            
                            {/* Status Badges */}
                            {event.completed && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-600">
                                <CheckCircle size={12} />
                                Completed
                              </span>
                            )}
                            
                            {event.type === 'homework' && event.submitted && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-600">
                                Submitted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};