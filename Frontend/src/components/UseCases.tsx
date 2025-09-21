// FILE: src/components/UseCases.tsx

import React from 'react';
import { Brain, Users, ArrowRight } from 'lucide-react';

function UseCases() {
  return (
    <section className="relative py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-7xl font-black text-black mb-6 animate-fade-in-up">
            Built for Every Stage
            <br />
            <span className="text-black/60">of Your Journey</span>
          </h2>
          <p className="text-2xl text-black/70 animate-fade-in-up delay-200">No matter where you're starting from</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "The Explorer", desc: "Feeling lost in the world of tech? Tell us what you enjoy, and we'll show you career paths you'll love, complete with a beginner-friendly roadmap.", delay: "delay-0" },
            { icon: Users, title: "The Student", desc: "Turn your coursework into a career. Upload your resume to identify skill gaps and get a plan to become job-ready by graduation.", delay: "delay-300" },
            { icon: ArrowRight, title: "The Career Changer", desc: "Pivoting into tech? We'll leverage your existing experience to create the fastest, most efficient learning path to your new career.", delay: "delay-600" }
          ].map((useCase, index) => (
            <div key={index} className={`group animate-fade-in-up ${useCase.delay}`}>
              <div className="relative backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-8 h-full transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:bg-white/80">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/20">
                    <useCase.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-6">{useCase.title}</h3>
                  <p className="text-black/70 leading-relaxed">{useCase.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCases;