import { useState, useEffect } from 'react';
import { User, Menu, X, LogOut, Settings, Download } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLoginClick = () => {
    onLoginClick();
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setIsUserMenuOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Digital Marketing</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Testimonials
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </a>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=10b981&color=fff`}
                      alt={session.user?.name || 'User'}
                    />
                    <span className="ml-2 text-gray-700 font-medium">{session.user?.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <p className="font-medium">{session.user?.name}</p>
                          <p className="text-gray-500">{session.user?.email}</p>
                        </div>
                        <a
                          href="#profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Profile Settings
                        </a>
                        <a
                          href="#downloads"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          My Downloads
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLoginClick}
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleLoginClick}
                    className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>
              <a href="#features" className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium">
                Testimonials
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium">
                About
              </a>
              
              {!session && (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <button
                    onClick={handleLoginClick}
                    className="w-full text-left text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleLoginClick}
                    className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {session && (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=10b981&color=fff`}
                      alt={session.user?.name || 'User'}
                    />
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                      <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <a href="#profile" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </a>
                    <a href="#downloads" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600">
                      <Download className="w-4 h-4 mr-2" />
                      My Downloads
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
