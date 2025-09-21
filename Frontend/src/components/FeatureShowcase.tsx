// FILE: src/components/FeatureShowcase.tsx

import React from 'react';
import { CheckCircle, Star, Users } from 'lucide-react';

function FeatureShowcase() {
  return (
    <section className="relative py-16 md:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          {/* MODIFICATION: Responsive font sizes */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black mb-6 animate-fade-in-up">
            More Than a Plan—
            <br />
            <span className="text-black/60">It's Your Personal Mentor</span>
          </h2>
          <p className="text-lg md:text-2xl text-black/70 animate-fade-in-up delay-200">See what makes NextStep different</p>
        </div>
        
        <div className="relative animate-fade-in-up delay-400">
          <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
            {/* MODIFICATION: Responsive padding */}
            <div className="relative p-6 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-8">
                  {[
                    { icon: CheckCircle, title: "AI-Generated Milestones", desc: "Clear, achievable goals tailored to your timeline", color: "bg-black/10" },
                    { icon: Star, title: "Curated Free Resources", desc: "Hand-picked courses, tutorials, and projects", color: "bg-black/10" },
                    { icon: Users, title: "Track Progress & Stay Motivated", desc: "Gamified learning with streaks and achievements", color: "bg-black/10" }
                  ].map((feature, index) => (
                    <div key={index} className={`flex items-start space-x-4 group animate-slide-in-left delay-${index * 200}`}>
                      <div className="relative">
                        <div className={`w-12 h-12 ${feature.color} backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0`}>
                          <feature.icon className="w-6 h-6 text-black" />
                        </div>
                        <div className="absolute inset-0 bg-black/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
                        <p className="text-black/70">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="relative">
                  <div className="backdrop-blur-sm bg-black/5 border border-black/10 rounded-2xl p-6 md:p-8 hover:bg-black/10 transition-all duration-500">
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-lg font-bold text-black">Frontend Developer Path</span>
                        <span className="text-sm text-black/70 font-semibold">70% Complete</span>
                      </div>
                      <div className="w-full bg-black/10 rounded-full h-3 overflow-hidden">
                        <div className="bg-black h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '70%'}}></div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { title: "HTML & CSS Fundamentals", completed: true },
                          { title: "JavaScript Basics", completed: true },
                          { title: "React.js Framework", completed: false, current: true },
                          { title: "Backend Integration", completed: false }
                        ].map((milestone, index) => (
                          <div key={index} className="flex items-center space-x-3 group">
                            <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                              milestone.completed ? 'bg-black' : 
                              milestone.current ? 'bg-black/50 animate-pulse' : 'bg-black/20'
                            } group-hover:scale-125`}></div>
                            <span className={`text-sm ${
                              milestone.completed ? 'text-black' : 
                              milestone.current ? 'text-black font-semibold' : 'text-black/50'
                            }`}>{milestone.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureShowcase;