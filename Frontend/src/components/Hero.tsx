// FILE: src/components/Hero.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Import Link
import { Upload, Brain, Play, ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black text-black leading-none tracking-tight">
                <span>FIND </span>
                <span>YOUR </span>
                <span>PATH </span>
                <span className="text-black/60">IN TECH</span>
              </h1>
              <p className="text-xl lg:text-2xl text-black/70 leading-relaxed max-w-2xl">
                Whether you're a beginner exploring options or a student with a resume, our AI will build your personalized learning plan.
              </p>
            </div>
            
            {/* MODIFICATION: Wrapped the button in a Link component */}
            <div className="animate-fade-in-up delay-1000">
              <Link to="/home"> {/* <-- 2. Add Link wrapper */}
                <button className="group relative overflow-hidden bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center space-x-3">
                    <span>Create My Roadmap</span>
                    <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                  <div className="absolute inset-0 bg-black rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                </button>
              </Link>
            </div>
          </div>
          
          {/* Glassmorphism Illustration */}
          <div className="relative animate-fade-in-up delay-1200">
            {/* ... (rest of the component is unchanged) ... */}
            <div className="relative backdrop-blur-xl bg-white/10 border border-black/10 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <div className="relative space-y-8">
                {[
                  { icon: Upload, title: "Share Your Goals or Resume", desc: "Tell us about your interests", delay: "delay-0" },
                  { icon: Brain, title: "Receive AI Recommendations", desc: "Personalized career paths", delay: "delay-300" },
                  { icon: Play, title: "Start Learning with Clear Roadmap", desc: "Curated resources & milestones", delay: "delay-600" }
                ].map((step, index) => (
                  <div key={index} className={`flex items-center space-x-4 animate-slide-in-right ${step.delay}`}>
                    <div className="relative group">
                      <div className={`w-14 h-14 ${index === 2 ? 'bg-black' : 'bg-white/20 backdrop-blur-sm'} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <step.icon className={`w-7 h-7 ${index === 2 ? 'text-white' : 'text-black'}`} />
                      </div>
                      <div className="absolute inset-0 bg-black/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-black">{step.title}</div>
                      <div className="text-sm text-black/60">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;