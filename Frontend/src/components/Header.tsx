// FILE: src/components/Header.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png'; // Assuming logo is in src/assets

// MODIFICATION: Removed 'Home' link
const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About Us', path: '/about-us' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrollY > 50 
        ? 'backdrop-blur-xl bg-white/80 border-b border-black/10 shadow-lg' 
        : 'backdrop-blur-sm bg-white/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          
          <Link to="/" className="flex items-center">
            <img src={logo} alt="NextStep Logo" className="h-10 w-auto" />
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="relative text-black/70 hover:text-black transition-all duration-300 font-medium group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl backdrop-blur-sm bg-black/5 hover:bg-black/10 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-500 ${
        isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden backdrop-blur-xl bg-white/90`}>
        <div className="px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className="block text-black/70 hover:text-black transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;

