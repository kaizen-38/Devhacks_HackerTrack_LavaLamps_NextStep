// FILE: src/pages/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom';
import { Edit2, MapPin, Linkedin, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from "axios";

// --- Mock Data ---
const initialUserData = {
    name: 'Alex Doe',
    avatarUrl: 'https://placehold.co/128x128/E0E0E0/333?text=AD',
    bio: 'Future Software Developer at Google',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/alexdoe',
};

const userCourses = [
    { title: 'Advanced TypeScript', provider: 'Udemy', progress: 80, thumbnail: 'https://placehold.co/600x400/000000/FFFFFF?text=Course+1' },
    { title: 'Next.js for Production', provider: 'Vercel Academy', progress: 45, thumbnail: 'https://placehold.co/600x400/171717/FFFFFF?text=Course+2' },
    { title: 'Machine Learning Foundations', provider: 'Coursera', progress: 15, thumbnail: 'https://placehold.co/600x400/383838/FFFFFF?text=Course+3' },
];

const generateStreakData = () => {
    const data = new Map();
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        data.set(dateString, {
            activityLevel: Math.floor(Math.random() * 5),
        });
    }
    return data;
};
const streakData = generateStreakData();


// --- Reusable Components ---
const CourseCard = ({ course }: any) => (
    <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl shadow-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h3 className="text-md font-bold text-black mb-1 truncate">{course.title}</h3>
            <p className="text-sm text-black/70 mb-3">{course.provider}</p>
            <div className="w-full bg-black/10 rounded-full h-2">
                <div className="bg-black h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
        </div>
    </div>
);

// --- MODIFIED Streak Calendar Component ---
// Define a type for the month object to fix the TypeScript error
interface MonthData {
    monthIndex: number;
    days: Date[];
}

const StreakCalendar = ({ data }: { data: Map<string, { activityLevel: number }> }) => {
    const today = new Date();
    const yearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const colors = ['bg-black/20', 'bg-black/40', 'bg-black/60', 'bg-black'];

    const days = [];
    for (let i = 0; i < 366; i++) {
        const date = new Date(yearAgo);
        date.setDate(yearAgo.getDate() + i);
        if (date > today) break;
        days.push(date);
    }

    // Explicitly type the months array
    const months: MonthData[] = [];
    let currentMonth = -1;
    days.forEach(day => {
        if (day.getMonth() !== currentMonth) {
            currentMonth = day.getMonth();
            months.push({ monthIndex: currentMonth, days: [] });
        }
        months[months.length - 1].days.push(day);
    });

    return (
        <div>
            <div className="flex gap-3">
                <div className="grid grid-rows-7 gap-1 text-xs text-black/50 mt-6 shrink-0">
                    {weekDays.map((day, i) => (
                        <span key={day+Date().toString()} className={`h-3.5 flex items-center ${i % 2 === 0 ? 'invisible' : ''}`}>{day}</span>
                    ))}
                </div>
                <div className="overflow-x-auto pb-2 w-full">
                    <div className="flex gap-4">
                        {months.map(({ monthIndex, days }) => {
                            const firstDayOfMonth = days[0].getDay();
                            return (
                                <div key={monthIndex} className="flex flex-col">
                                    <div className="text-xs text-black/50 mb-1">{monthLabels[monthIndex]}</div>
                                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`spacer-${monthIndex}-${i}`} className="w-3.5 h-3.5" />)}
                                        {days.map((date, index) => {
                                            const dateString = date.toISOString().split('T')[0];
                                            const dayData = data.get(dateString) || { activityLevel: 0 };
                                            return (
                                                <div
                                                    key={index}
                                                    className={`w-3.5 h-3.5 rounded-sm group relative ${dayData.activityLevel > 0 ? colors[dayData.activityLevel - 1] : 'bg-black/5'}`}
                                                >
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                                        {`${dayData.activityLevel} contributions on ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end mt-2 text-xs text-black/60 gap-2">
                <span>Less</span>
                <div className="w-3.5 h-3.5 rounded-sm bg-black/5 border border-black/10"></div>
                <div className="w-3.5 h-3.5 rounded-sm bg-black/20 border border-black/20"></div>
                <div className="w-3.5 h-3.5 rounded-sm bg-black/40 border border-black/40"></div>
                <div className="w-3.5 h-3.5 rounded-sm bg-black/60 border border-black/60"></div>
                <div className="w-3.5 h-3.5 rounded-sm bg-black border border-black"></div>
                <span>More</span>
            </div>
        </div>
    );
};


// --- NEW Edit Profile Modal ---
const EditProfileModal = ({ user, onClose, onSave }: any) => {
    const [editedUser, setEditedUser] = useState(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(editedUser);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-6 relative">
                <h2 className="text-2xl font-bold text-black">Edit Your Profile</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-black transition-colors"><X /></button>
                <div>
                    <label className="text-sm font-bold text-black mb-2 block">Avatar URL</label>
                    <input type="text" name="avatarUrl" value={editedUser.avatarUrl} onChange={handleChange} className="w-full p-2 border border-black/10 rounded-xl" />
                </div>
                 <div>
                    <label className="text-sm font-bold text-black mb-2 block">Full Name</label>
                    <input type="text" name="name" value={editedUser.name} onChange={handleChange} className="w-full p-2 border border-black/10 rounded-xl" />
                </div>
                 <div>
                    <label className="text-sm font-bold text-black mb-2 block">Bio</label>
                    <input type="text" name="bio" value={editedUser.bio} onChange={handleChange} className="w-full p-2 border border-black/10 rounded-xl" />
                </div>
                <div>
                    <label className="text-sm font-bold text-black mb-2 block">Location</label>
                    <input type="text" name="location" value={editedUser.location} onChange={handleChange} className="w-full p-2 border border-black/10 rounded-xl" />
                </div>
                 <div>
                    <label className="text-sm font-bold text-black mb-2 block">LinkedIn Profile</label>
                    <input type="text" name="linkedIn" value={editedUser.linkedIn} onChange={handleChange} className="w-full p-2 border border-black/10 rounded-xl" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="bg-black/5 text-black font-bold py-3 px-6 rounded-xl hover:bg-black/10 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-black text-white font-bold py-3 px-6 rounded-xl hover:bg-black/80 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
function DashboardPage() {
    useEffect(() => {
        document.title = 'NextStep | Dashboard';
        window.scrollTo(0, 0);
        axios.post("http://127.0.0.1:5000/course_suggestions",{user: "demo"})
            .then(res => {
                console.log(res)
                setResourcesData(res.data);
            })

        const { formData } = location.state || { formData: { user: { first_name: 'User'}, skills: ['Sample Skill'] } };

        if (formData.user.first_name != null && formData.user.first_name != "" && formData.user.first_name != 'User') {
            console.log(formData)
            setUserData(formData);
        }
    }, []);


    
    // MODIFICATION: User data is now in state
    const [userData, setUserData] = useState(initialUserData);
    const [isEditing, setIsEditing] = useState(false);
    const [resourcesData,setResourcesData] = useState(userCourses);
    const location = useLocation();


    return (
        <>
            {isEditing && <EditProfileModal user={userData} onSave={setUserData} onClose={() => setIsEditing(false)} />}
            <div className="min-h-screen bg-gray-50 text-black flex flex-col">
                <Header />
                <main className="flex-grow px-4 pt-32 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                            {/* --- Left Column: User Profile --- */}
                            <aside className="lg:col-span-1">
                                <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-lg text-center sticky top-32">
                                    <img src={userData.avatarUrl} alt={userData.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover" />
                                    <h1 className="text-3xl font-bold text-black">{userData.name}</h1>
                                    <div className="relative mt-2">
                                        <p className="text-black/70 italic px-4">{userData.bio}</p>
                                    </div>
                                    
                                    <div className="text-left mt-8 space-y-4">
                                        <h2 className="text-xl font-bold text-black border-b border-black/10 pb-2">Your Details</h2>
                                        <div className="flex items-center text-black/80">
                                            <MapPin size={18} className="mr-3 flex-shrink-0" />
                                            <span>{userData.location}</span>
                                        </div>
                                        <div className="flex items-center text-black/80">
                                            <Linkedin size={18} className="mr-3 flex-shrink-0" />
                                            <a href={`https://${userData.linkedIn}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{userData.linkedIn}</a>
                                        </div>
                                        <button onClick={() => setIsEditing(true)} className="w-full mt-4 bg-black/5 text-black font-bold py-3 px-4 rounded-xl hover:bg-black/10 transition-colors flex items-center justify-center space-x-2">
                                            <Edit2 size={16} />
                                            <span>Edit Profile</span>
                                        </button>
                                    </div>
                                </div>
                            </aside>

                            {/* --- Right Column: Courses & Streaks --- */}
                            <div className="lg:col-span-2">
                                <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-8 shadow-lg space-y-12">
                                    <div>
                                        <h2 className="text-3xl font-bold text-black mb-6">Your Courses</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {resourcesData.map((course, index) => (
                                                <CourseCard key={index} course={course} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-3xl font-bold text-black mb-6">Your Activity</h2>
                                        <div className="bg-black/5 p-4 rounded-2xl">
                                            <StreakCalendar data={streakData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default DashboardPage;

