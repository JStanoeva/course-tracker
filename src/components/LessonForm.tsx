import React, { useState } from 'react';
import { Plus, X, Calendar, CheckSquare, Square, FileText, Edit3 } from 'lucide-react';
import { Lesson, Homework, Note } from '../types';
import { NoteEditor } from './NoteEditor';

interface LessonFormProps {
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({ lessons, onLessonsChange }) => {
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'lab' | 'exercise'>('exercise');
  const [newLessonDate, setNewLessonDate] = useState('');
  const [editingNote, setEditingNote] = useState<{ lessonId: string; note?: Note } | null>(null);

  const addLesson = () => {
    if (!newLessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: newLessonTitle,
      type: newLessonType,
      date: newLessonDate,
      completed: false,
      homework: [],
      notes: [],
    };

    onLessonsChange([...lessons, newLesson]);
    setNewLessonTitle('');
    setNewLessonDate('');
  };

  const removeLesson = (lessonId: string) => {
    onLessonsChange(lessons.filter(l => l.id !== lessonId));
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    onLessonsChange(lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l));
  };

  const addHomework = (lessonId: string) => {
    const newHomework: Homework = {
      id: Date.now().toString(),
      title: 'New Homework',
      dueDate: '',
      completed: false,
      submitted: false,
    };
    updateLesson(lessonId, {
      homework: [...(lessons.find(l => l.id === lessonId)?.homework || []), newHomework]
    });
  };

  const updateHomework = (lessonId: string, homeworkId: string, updates: Partial<Homework>) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const updatedHomework = lesson.homework.map(h => h.id === homeworkId ? { ...h, ...updates } : h);
    updateLesson(lessonId, { homework: updatedHomework });
  };

  const removeHomework = (lessonId: string, homeworkId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    updateLesson(lessonId, { homework: lesson.homework.filter(h => h.id !== homeworkId) });
  };

  const addNote = (lessonId: string) => {
    setEditingNote({ lessonId });
  };

  const saveNote = (lessonId: string, content: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const now = new Date().toISOString();
    let updatedNotes;

    if (editingNote?.note) {
      // Update existing note
      updatedNotes = lesson.notes.map(note => 
        note.id === editingNote.note!.id 
          ? { ...note, content, updatedAt: now }
          : note
      );
    } else {
      // Add new note
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        createdAt: now,
        updatedAt: now,
      };
      updatedNotes = [...lesson.notes, newNote];
    }

    updateLesson(lessonId, { notes: updatedNotes });
    setEditingNote(null);
  };

  const editNote = (lessonId: string, note: Note) => {
    setEditingNote({ lessonId, note });
  };

  const deleteNote = (lessonId: string, noteId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    updateLesson(lessonId, { notes: lesson.notes.filter(n => n.id !== noteId) });
  };

  return (
    <>
      <div className="space-y-6">
      {/* Add new lesson */}
      <div className="backdrop-blur-md bg-glass-light dark:bg-glass-dark rounded-lg border border-white/20 dark:border-white/10 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="Lesson title"
            className="md:col-span-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main/50"
          />
          <select
            value={newLessonType}
            onChange={(e) => setNewLessonType(e.target.value as 'lab' | 'exercise')}
            className="px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
          >
            <option value="exercise">Exercise</option>
            <option value="lab">Lab</option>
          </select>
          <input
            type="date"
            value={newLessonDate}
            onChange={(e) => setNewLessonDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main/50"
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={addLesson}
            className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/80 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Lessons list */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="backdrop-blur-md bg-glass-light dark:bg-glass-dark rounded-lg border border-white/20 dark:border-white/10 p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateLesson(lesson.id, { completed: !lesson.completed })}
                  className="text-primary-main hover:text-primary-accent transition-colors"
                >
                  {lesson.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                      className="font-medium text-gray-800 dark:text-white bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary-main/50 rounded px-1 flex-1"
                      placeholder="Lesson title"
                    />
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      lesson.type === 'lab' 
                        ? 'bg-primary-accent/20 text-primary-accent' 
                        : 'bg-primary-main/20 text-primary-main'
                    }`}>
                      {lesson.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={12} />
                    <input
                      type="date"
                      value={lesson.date}
                      onChange={(e) => updateLesson(lesson.id, { date: e.target.value })}
                      className="bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-main/50 rounded px-1"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeLesson(lesson.id)}
                className="text-gray-400 hover:text-primary-accent transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</h5>
                <button
                  type="button"
                  onClick={() => addNote(lesson.id)}
                  className="text-xs text-primary-main hover:text-primary-accent transition-colors flex items-center gap-1"
                >
                  <Plus size={12} />
                  Add Note
                </button>
              </div>
              <div className="space-y-2">
                {lesson.notes && lesson.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-white/20 dark:bg-gray-800/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => editNote(lesson.id, note)}
                          className="text-gray-400 hover:text-primary-main transition-colors"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNote(lesson.id, note.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {note.content.substring(0, 100)}
                      {note.content.length > 100 && '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Homework */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Homework</h5>
                <button
                  type="button"
                  onClick={() => addHomework(lesson.id)}
                  className="text-xs text-primary-main hover:text-primary-accent transition-colors flex items-center gap-1"
                >
                  <Plus size={12} />
                  Add Homework
                </button>
              </div>
              <div className="space-y-2">
                {lesson.homework.map((hw) => (
                  <div key={hw.id} className="flex items-center gap-2 p-2 bg-white/30 dark:bg-gray-800/30 rounded">
                    <button
                      type="button"
                      onClick={() => updateHomework(lesson.id, hw.id, { completed: !hw.completed })}
                      className="text-primary-main"
                    >
                      {hw.completed ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                    <input
                      type="text"
                      value={hw.title}
                      onChange={(e) => updateHomework(lesson.id, hw.id, { title: e.target.value })}
                      className="flex-1 text-sm bg-transparent text-gray-800 dark:text-white focus:outline-none"
                    />
                    <input
                      type="date"
                      value={hw.dueDate}
                      onChange={(e) => updateHomework(lesson.id, hw.id, { dueDate: e.target.value })}
                      className="text-xs bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateHomework(lesson.id, hw.id, { submitted: !hw.submitted })}
                      className={`px-2 py-1 text-xs rounded ${
                        hw.submitted 
                          ? 'bg-green-500/20 text-green-600' 
                          : 'bg-gray-500/20 text-gray-600'
                      }`}
                    >
                      {hw.submitted ? 'Submitted' : 'Pending'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeHomework(lesson.id, hw.id)}
                      className="text-gray-400 hover:text-primary-accent"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Note Editor Modal */}
      {editingNote && (
        <NoteEditor
          note={editingNote.note}
          onSave={(content) => saveNote(editingNote.lessonId, content)}
          onCancel={() => setEditingNote(null)}
        />
      )}
    </>
  );
};