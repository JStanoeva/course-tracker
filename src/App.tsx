import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-main/20 dark:from-gray-900 dark:via-gray-800 dark:to-primary-dark/20 flex items-center justify-center">
        <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark rounded-xl border border-white/20 dark:border-white/10 p-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary-main/20 border-t-primary-main rounded-full animate-spin" />
            <span className="text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return user ? (
    <CourseProvider>
      <Dashboard />
    </CourseProvider>
  ) : (
    <AuthForm />
  );
};
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;