import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light' as const, icon: Sun, label: 'Light' },
    { key: 'dark' as const, icon: Moon, label: 'Dark' },
    { key: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 backdrop-blur-md bg-glass-light dark:bg-glass-dark rounded-lg border border-white/20 dark:border-white/10">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === key
              ? 'bg-primary-main text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-main hover:bg-white/10'
          }`}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};