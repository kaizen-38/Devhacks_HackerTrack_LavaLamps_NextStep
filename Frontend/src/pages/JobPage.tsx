// FILE: src/pages/JobPage.tsx

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Mock Data (in a real app, you'd fetch this based on jobId) ---
const jobData = {
    id: 'frontend-developer-innovate-inc',
    title: 'Frontend Developer',
    company: 'Innovate Inc.',
    location: 'Remote',
    description: 'Innovate Inc. is seeking a passionate Frontend Developer to join our dynamic team. You will be responsible for building beautiful, high-performance user interfaces for our next-generation web applications. We value creativity, collaboration, and a commitment to quality.',
    responsibilities: [
        'Develop and maintain user-facing features using React and TypeScript.',
        'Collaborate with product managers and designers to translate wireframes into reality.',
        'Optimize applications for maximum speed and scalability.',
        'Write clean, maintainable, and well-tested code.',
    ],
    qualifications: [
        '2+ years of experience in frontend development.',
        'Proficiency in JavaScript, TypeScript, React, HTML, and CSS.',
        'Experience with state management libraries like Redux or Zustand.',
        'Familiarity with RESTful APIs and modern authorization mechanisms.',
    ],
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'CSS'],
};


function JobPage() {
    const { jobId } = useParams(); // In a real app, you would use this ID to fetch data


    useEffect(() => {
        document.title = `NextStep | ${jobData.title}`;
        window.scrollTo(0, 0);



    }, []);

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />
            <main className="flex-grow px-4 pt-32 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <Link to="/career-path" className="flex items-center text-black/70 hover:text-black font-bold transition-colors">
                            <ArrowLeft size={20} className="mr-2" />
                            Back to Career Path
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* --- Main Job Content --- */}
                        <div className="lg:col-span-2 backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-8 shadow-lg">
                            <h1 className="text-4xl sm:text-5xl font-black text-black mb-2">{jobData.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg text-black/80 mb-8">
                                <p className="flex items-center"><Briefcase size={18} className="mr-2" /> {jobData.company}</p>
                                <p className="flex items-center"><MapPin size={18} className="mr-2" /> {jobData.location}</p>
                            </div>

                            <section className="space-y-6 text-black/80 text-lg leading-relaxed">
                                <h2 className="text-2xl font-bold text-black border-b border-black/10 pb-2">Job Description</h2>
                                <p>{jobData.description}</p>
                                
                                <h2 className="text-2xl font-bold text-black border-b border-black/10 pb-2">Responsibilities</h2>
                                <ul className="space-y-2 list-inside">
                                    {jobData.responsibilities.map((item, i) => <li key={i} className="flex items-start"><CheckCircle className="w-5 h-5 mr-3 mt-1 text-black flex-shrink-0" />{item}</li>)}
                                </ul>

                                <h2 className="text-2xl font-bold text-black border-b border-black/10 pb-2">Qualifications</h2>
                                <ul className="space-y-2 list-inside">
                                    {jobData.qualifications.map((item, i) => <li key={i} className="flex items-start"><CheckCircle className="w-5 h-5 mr-3 mt-1 text-black flex-shrink-0" />{item}</li>)}
                                </ul>
                            </section>
                        </div>

                        {/* --- Sidebar --- */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                <button className="w-full group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                    <div className="relative flex items-center justify-center space-x-3">
                                        <span>Apply Now</span>
                                        <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                                    </div>
                                </button>
                                <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-lg">
                                    <h3 className="text-xl font-bold text-black mb-4 flex items-center"><Zap size={20} className="mr-2" /> Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {jobData.requiredSkills.map(skill => (
                                            <div key={skill} className="bg-black/10 text-black font-semibold rounded-lg px-3 py-1 text-sm">{skill}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default JobPage;
