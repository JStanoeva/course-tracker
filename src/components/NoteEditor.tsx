import React, { useState, useRef, useEffect } from 'react';
import { Save, Edit3, Eye, Bold, Italic, List, Link, X } from 'lucide-react';
import { Note } from '../types';

interface NoteEditorProps {
  note?: Note;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [content, setContent] = useState(note?.content || '');
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newText);
    
    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + selectedText.length;
        textarea.focus();
      }
    }, 0);
  };

  const renderPreview = (text: string) => {
    // Simple markdown parsing for preview
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
    
    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/(<li>.*<\/li>)+/g, (match) => `<ul>${match}</ul>`);
    
    return html;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {note ? 'Edit Note' : 'Add Note'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(false)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  !isPreview
                    ? 'bg-primary-main text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-main'
                }`}
              >
                <Edit3 size={16} className="inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  isPreview
                    ? 'bg-primary-main text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-main'
                }`}
              >
                <Eye size={16} className="inline mr-1" />
                Preview
              </button>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        {!isPreview && (
          <div className="flex items-center gap-2 p-4 border-b border-white/20 dark:border-white/10 bg-white/20 dark:bg-gray-800/20">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-main hover:bg-white/20 transition-colors"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-main hover:bg-white/20 transition-colors"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => insertMarkdown('- ')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-main hover:bg-white/20 transition-colors"
              title="List"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => insertMarkdown('[Link Text](', ')')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-main hover:bg-white/20 transition-colors"
              title="Link"
            >
              <Link size={16} />
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
              Supports: **bold**, *italic*, - lists, [links](url)
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-auto min-h-96">
          {isPreview ? (
            <div
              className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 break-words"
              dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-96 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none resize-none focus:outline-none text-sm leading-relaxed"
              placeholder="Write your notes here... 

You can use markdown formatting:
**Bold text**
*Italic text*
- List items
[Links](https://example.com)"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-white/20 dark:border-white/10">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-primary-main to-primary-accent text-white hover:from-primary-main/80 hover:to-primary-accent/80 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Save size={20} />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};