// FILE: src/pages/CareerPathPage.tsx

import React, {useEffect, useState} from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Briefcase, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from "axios";

// --- Mock Data (replace with API calls later) ---
const relevantJobs = [
    { id: 'frontend-developer-innovate-inc', title: 'Frontend Developer', company: 'Innovate Inc.', location: 'Remote', score: 75, requiredSkills: ['React', 'TypeScript', 'Next.js'] },
    { id: 'react-engineer-creative-solutions', title: 'React Engineer', company: 'Creative Solutions', location: 'New York, NY', score: 68, requiredSkills: ['React', 'Redux', 'JavaScript'] },
    { id: 'ui-ux-engineer-datadriven-co', title: 'UI/UX Engineer', company: 'DataDriven Co.', location: 'San Francisco, CA', score: 55, requiredSkills: ['Figma', 'React', 'CSS'] },
];

const recommendedCourses = [
    { title: 'Advanced TypeScript', provider: 'Udemy', thumbnail: 'https://placehold.co/600x400/000000/FFFFFF?text=Course+1' },
    { title: 'Next.js for Production', provider: 'Vercel Academy', thumbnail: 'https://placehold.co/600x400/171717/FFFFFF?text=Course+2' },
    { title: 'State Management with Zustand', provider: 'Codecademy', thumbnail: 'https://placehold.co/600x400/383838/FFFFFF?text=Course+3' },
    { title: 'Advanced State Management', provider: 'Frontend Masters', thumbnail: 'https://placehold.co/600x400/4a4a4a/FFFFFF?text=Course+4' },

];

// --- Reusable Components ---
const SkillTag = ({ skill, userHas }: { skill: string, userHas: boolean }) => (
    <div className={`font-semibold rounded-lg px-3 py-1 text-sm ${userHas ? 'bg-black text-white' : 'bg-black/10 text-black'}`}>
        {skill}
    </div>
);

const CircularProgress = ({ score }: { score: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;


    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-black/10" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <circle
                    className="text-black transition-all duration-1000"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-black">
                {score}%
            </span>
        </div>
    );
};

// --- Main Page Component ---
function CareerPathPage() {
    useEffect(() => {
        document.title = 'NextStep | Your Career Path';
        window.scrollTo(0, 0);
    }, []);

    const location = useLocation();
    const { formData } = location.state || { formData: { user: { first_name: 'User'}, skills: ['Sample Skill'] } };
    const userSkills = formData.skills || [];
    const compatibilityScore = relevantJobs[0].score;
    const [jobsData,setJobsData] = useState(relevantJobs);
    const [resourcesData,setResourcesData] = useState(recommendedCourses);

    useEffect(() => {
        axios.post("http://127.0.0.1:5000/course_suggestions",{user: "demo", skills: formData.skills, career_path: formData.career_path})
            .then(res => {
                console.log(res)
                setResourcesData(res.data);
            })

        axios.post("http://127.0.0.1:5000/job_search",{user: "demo", skills: formData.skills, career_path: formData.career_path})
            .then(res => {
                console.log(res)
                setJobsData(res.data);
            })



    }, []);


    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />
            <main className="flex-grow px-4 pt-32 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-4">
                            Your Personalized Career Path, {formData.user.first_name}
                        </h1>
                        <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto">
                            Based on your profile, here are the most relevant opportunities and a plan to help you succeed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                         {/* --- Left Column: Your Skills --- */}
                        <aside className="lg:col-span-1">
                            <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-lg sticky top-32">
                                <h2 className="text-2xl font-bold text-black mb-6">Your Current Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {userSkills.map((skill: string) => <SkillTag key={skill} skill={skill} userHas={true} />)}
                                </div>
                            </div>
                        </aside>

                        {/* --- Right Column: Jobs & Courses --- */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Relevant Jobs Section */}
                            <div>
                                <h2 className="text-3xl font-bold text-black mb-6 flex items-center"><Briefcase className="w-8 h-8 mr-3" /> Relevant Jobs</h2>
                                <div className="space-y-6">
                                    {jobsData.map((job, index) => (
                                        <div key={index} className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-lg space-y-4">
                                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                                <div className="flex-shrink-0">
                                                    <CircularProgress score={job.score} />
                                                </div>
                                                <div className="flex-grow text-center sm:text-left">
                                                    <h3 className="text-2xl font-bold text-black">{job.title}</h3>
                                                    <p className="text-lg text-black/80 font-semibold">{job.company}</p>
                                                    <p className="text-black/60">{job.location}</p>
                                                </div>
                                                <Link to={`/job/${job.id}`} className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform text-center block">
                                                    View Job
                                                </Link>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-black mb-2">Skill Match</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.requiredSkills.map(skill => (
                                                        <SkillTag key={skill} skill={skill} userHas={userSkills.includes(skill)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* "BUT" Divider */}
                            <div className="text-center bg-black text-white rounded-3xl p-8 my-12 shadow-2xl">
                                <p className="text-7xl md:text-9xl font-black opacity-40">BUT</p>
                                <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mt-4">
                                    Your compatibility for the top job is only <span className="text-yellow-300">{compatibilityScore}%</span>.
                                    Go through these courses to upskill yourself and get hired faster!
                                </p>
                            </div>
                            
                            {/* Recommended Courses Section */}
                            <div>
                                <h2 className="text-3xl font-bold text-black mb-6 flex items-center"><Zap className="w-8 h-8 mr-3" /> Recommended Courses</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {resourcesData.map((course, index) => (
                                        <a href="#" key={index} className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl shadow-lg overflow-hidden group block hover:scale-105 hover:shadow-2xl transition-all duration-300">
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-black mb-2">{course.title}</h3>
                                                <p className="text-black/70">{course.provider}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CareerPathPage;

