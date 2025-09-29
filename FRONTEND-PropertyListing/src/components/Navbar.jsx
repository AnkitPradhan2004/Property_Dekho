import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User, LogOut, Heart, Scale } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-extrabold text-[color:var(--brand-coral,#FF5533)] min-w-0">
            <span className="w-8 h-8 rounded-lg bg-[color:var(--brand-peach,#FFC3B8)] flex items-center justify-center text-[color:var(--brand-espresso,#1A0400)]">PD</span>
            <span className="truncate">Property-Dekho</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/#listings" 
              className="text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Browse Properties
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                {/* Quick Actions (visible on all sizes) */}
                <div className="flex items-center gap-1 lg:gap-2">
                  <button className="p-1.5 lg:p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button className="p-1.5 lg:p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Scale className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 lg:gap-2 text-gray-600 hover:text-red-600 transition-colors p-1 lg:p-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <Link
                  to="/login"
                  className="text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
              className="bg-[color:var(--brand-coral,#FF5533)] text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-colors font-medium text-sm lg:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
