// FILE: src/components/Footer.tsx

import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import logo from '../assets/logo.png'; // <-- 1. Import your logo

function Footer() {
  return (
    <footer className="relative bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company */}
          <div className="space-y-6">
            
            {/* MODIFICATION: Replaced the styled div and text with the logo image */}
            <a href="#">
              <img src={logo} alt="NextStep Logo" className="h-10 w-auto" /> {/* <-- 2. Use the imported logo */}
            </a>
            
            <p className="text-black/70 text-lg">Your AI Career Companion</p>
            <div className="flex space-x-4">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <a key={index} href="#" className="group relative">
                  <div className="w-12 h-12 backdrop-blur-sm bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/10">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-bold text-black mb-6 text-lg">Product</h3>
            <ul className="space-y-3">
              {['Home', 'How it Works', 'About Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-black/70 hover:text-black transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-bold text-black mb-6 text-lg">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-black/70 hover:text-black transition-colors duration-300 relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-black mb-4 text-lg">Get Tech Career Insights</h3>
            <p className="text-black/70 mb-6">Weekly tips and resource recommendations</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 backdrop-blur-sm bg-black/5 border border-black/20 rounded-l-2xl focus:outline-none focus:border-black/40 transition-all duration-300"
              />
              <button className="bg-black text-white px-6 py-3 rounded-r-2xl hover:bg-black/80 transition-all duration-300 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-black/10 mt-16 pt-8 text-center">
          <p className="text-black/70">&copy; 2025 NextStep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;