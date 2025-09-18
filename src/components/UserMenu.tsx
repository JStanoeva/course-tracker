import React, { useState } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileModal } from './ProfileModal';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md bg-glass-light dark:bg-glass-dark border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-main to-primary-accent flex items-center justify-center text-white text-sm font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-medium">
            {user?.username}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-lg border border-white/20 dark:border-white/10 shadow-xl z-50 animate-scale-in">
            <div className="p-2">
              <div className="px-3 py-2 border-b border-white/20 dark:border-white/10">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-lg transition-colors mt-2"
              >
                <Settings size={16} />
                Edit Profile
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};