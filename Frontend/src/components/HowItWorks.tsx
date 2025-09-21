// FILE: src/components/HowItWorks.tsx

import React from 'react';
import { Upload, Brain, Play } from 'lucide-react';

function HowItWorks() {
  return (
    <section className="relative py-20 lg:py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-7xl font-black mb-6 animate-fade-in-up">
            How It Works
          </h2>
          <p className="text-2xl text-white/70 animate-fade-in-up delay-200">Your journey starts in 3 simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: Upload, title: "Provide Your Input", desc: "Upload your resume or simply tell us your interests. No resume? No problem. We'll guide you from scratch.", delay: "delay-0" },
            { icon: Brain, title: "Get Your AI Roadmap", desc: "Our AI analyzes your skills and goals to generate a personalized, step-by-step roadmap.", delay: "delay-300" },
            { icon: Play, title: "Start Learning", desc: "Receive a curated list of the best free courses, GitHub projects, and resources to master each skill.", delay: "delay-600" }
          ].map((step, index) => (
            <div key={index} className={`text-center group animate-fade-in-up ${step.delay}`}>
              <div className="relative mb-8 inline-block">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <step.icon className="w-12 h-12 text-black" />
                </div>
                <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-3xl font-bold mb-6">{step.title}</h3>
              <p className="text-white/70 leading-relaxed text-lg">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;