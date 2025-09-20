import React from 'react';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { GoalsProvider } from './contexts/GoalsContext';
import { StreakProvider } from './contexts/StreakContext';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { PasswordResetForm } from './components/PasswordResetForm';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    // Check if this is a password reset callback
    // Check both URL search params and hash params (Supabase uses hash)
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove # from hash
    
    // Check search params first, then hash params
    const type = searchParams.get('type') || hashParams.get('type');
    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    
    if (type === 'recovery' && accessToken) {
      setIsPasswordReset(true);
      // Clear both search and hash parameters for security
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handlePasswordResetSuccess = () => {
    setIsPasswordReset(false);
    // User will be automatically logged in after password reset
  };

  const handlePasswordResetCancel = () => {
    setIsPasswordReset(false);
  };

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

  // Show password reset form if in password reset flow
  if (isPasswordReset) {
    return (
      <PasswordResetForm
        onSuccess={handlePasswordResetSuccess}
        onCancel={handlePasswordResetCancel}
      />
    );
  }
  return user ? (
    <GoalsProvider>
      <StreakProvider>
        <CourseProvider>
          <Dashboard />
        </CourseProvider>
      </StreakProvider>
    </GoalsProvider>
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