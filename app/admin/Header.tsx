'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  onLogout: () => void;
}

export default function Header({ 
  userEmail, 
  userName, 
  userAvatar, 
  onLogout
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (userName) {
      return userName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return userEmail[0].toUpperCase();
  };

  const handleBackToAdmin = () => {
    router.push('/admin');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={handleBackToAdmin}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
              aria-label="Back to Admin"
            >
              <svg 
                className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              {/* Optional logo placeholder */}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                aria-label="User menu"
              >
                {/* Avatar */}
                <div className="relative">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName || userEmail}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200">
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userName || userEmail.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>

                {/* Dropdown arrow */}
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userName || userEmail}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}