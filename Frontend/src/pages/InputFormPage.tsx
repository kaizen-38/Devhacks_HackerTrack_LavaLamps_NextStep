// FILE: src/pages/InputFormPage.tsx

import React, { useState, useEffect } from 'react';
// MODIFICATION: Import useNavigate
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Briefcase, Award, Plus, Trash2, ArrowRight, ChevronLeft, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Reusable Input Component ---
const FormInput = ({ id, label, type = 'text', placeholder, value, onChange, required = false }: any) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-black mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type} id={id} name={id} value={value} onChange={onChange}
            placeholder={placeholder} required={required}
            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/50 transition-all duration-300"
        />
    </div>
);

// --- Reusable Tag Input Component ---
const TagInput = ({ items, setItems, placeholder }: { items: string[], setItems: (items: string[]) => void, placeholder: string }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!items.includes(inputValue.trim())) {
                setItems([...items, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeItem = (itemToRemove: string) => {
        setItems(items.filter(item => item !== itemToRemove));
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/50 transition-all duration-300"
            />
            <div className="flex flex-wrap gap-2 mt-3">
                {items.map(item => (
                    <div key={item} className="flex items-center bg-black text-white rounded-full px-3 py-1 text-sm">
                        <span>{item}</span>
                        <button onClick={() => removeItem(item)} className="ml-2 text-white/70 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Step 1: User Details ---
const UserStep = ({ data, setData, nextStep }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, user: { ...data.user, [e.target.name]: e.target.value } });
    };
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid sm:grid-cols-2 gap-6">
                <FormInput id="first_name" label="First Name" placeholder="Jane" value={data.user.first_name || ''} onChange={handleChange} required />
                <FormInput id="last_name" label="Last Name" placeholder="Doe" value={data.user.last_name || ''} onChange={handleChange} required />
            </div>
             <div className="grid sm:grid-cols-2 gap-6">
                <FormInput id="email" label="Email" type="email" placeholder="jane.doe@email.com" value={data.user.email || ''} onChange={handleChange} required />
                <FormInput id="contact_no" label="Contact Number" type="tel" placeholder="123-456-7890" value={data.user.contact_no || ''} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="domain" className="block text-sm font-bold text-black mb-2">
                    Domain Specialization <span className="text-red-500">*</span>
                </label>
                <select
                    id="domain"
                    name="domain"
                    value={data.user.domain || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/50 transition-all duration-300 appearance-none"
                >
                    <option value="" disabled>Select a domain...</option>
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Development</option>
                    <option value="fullstack">Full-Stack Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="machine-learning">Machine Learning</option>
                    <option value="devops">DevOps</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="mobile">Mobile Development</option>
                </select>
            </div>
            <div className="pt-4">
                <button onClick={nextStep} className="w-full group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105">
                    <div className="relative flex items-center justify-center space-x-3">
                        <span>Next: Education</span>
                        <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- Step 2: Education ---
const EducationStep = ({ data, setData, nextStep, prevStep }: any) => {
    const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedEducation = [...data.education];
        updatedEducation[index] = { ...updatedEducation[index], [e.target.name]: e.target.value };
        setData({ ...data, education: updatedEducation });
    };

    const addEducation = () => {
        setData({ ...data, education: [...data.education, {}] });
    };

    const removeEducation = (index: number) => {
        const updatedEducation = data.education.filter((_: any, i: number) => i !== index);
        setData({ ...data, education: updatedEducation });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {data.education.map((edu: any, index: number) => (
                <div key={index} className="space-y-6 p-6 bg-black/5 rounded-2xl relative">
                    <FormInput id={`university-${index}`} name="university" label="University" placeholder="State University" value={edu.university || ''} onChange={(e: any) => handleEducationChange(index, e)} />
                    <div className="grid sm:grid-cols-2 gap-6">
                        <FormInput id={`degree-${index}`} name="degree" label="Degree" placeholder="Bachelor of Science" value={edu.degree || ''} onChange={(e: any) => handleEducationChange(index, e)} />
                        <FormInput id={`major-${index}`} name="major" label="Major" placeholder="Computer Science" value={edu.major || ''} onChange={(e: any) => handleEducationChange(index, e)} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <FormInput id={`cgpa-${index}`} name="cgpa" label="CGPA" placeholder="3.8" value={edu.cgpa || ''} onChange={(e: any) => handleEducationChange(index, e)} />
                        <FormInput id={`scale-${index}`} name="scale" label="Scale" placeholder="4.0" value={edu.scale || ''} onChange={(e: any) => handleEducationChange(index, e)} />
                        <FormInput id={`graduation_date-${index}`} name="graduation_date" label="Graduation Date" type="date" value={edu.graduation_date || ''} onChange={(e: any) => handleEducationChange(index, e)} />
                    </div>
                    {data.education.length > 1 && (
                        <button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-black/40 hover:text-red-500 transition-colors">
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            ))}
            <button onClick={addEducation} className="w-full flex items-center justify-center space-x-2 text-black font-bold py-3 px-4 rounded-xl hover:bg-black/10 transition-colors">
                <Plus size={20} />
                <span>Add Education</span>
            </button>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={prevStep} className="w-full flex items-center justify-center bg-black/10 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:bg-black/20">
                    <ChevronLeft className="w-6 h-6 mr-2" /> Back
                </button>
                <button onClick={nextStep} className="w-full group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105">
                    <div className="relative flex items-center justify-center space-x-3">
                        <span>Next: Experience</span> <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- Step 3: Experience ---
const ExperienceStep = ({ data, setData, nextStep, prevStep }: any) => {
    const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedExperience = [...data.experience];
        updatedExperience[index] = { ...updatedExperience[index], [e.target.name]: e.target.value };
        setData({ ...data, experience: updatedExperience });
    };

    const addExperience = () => {
        setData({ ...data, experience: [...data.experience, {}] });
    };

    const removeExperience = (index: number) => {
        const updatedExperience = data.experience.filter((_: any, i: number) => i !== index);
        setData({ ...data, experience: updatedExperience });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {data.experience.map((exp: any, index: number) => (
                <div key={index} className="space-y-6 p-6 bg-black/5 rounded-2xl relative">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <FormInput id={`company-${index}`} name="company" label="Company" placeholder="Tech Solutions Inc." value={exp.company || ''} onChange={(e: any) => handleExperienceChange(index, e)} />
                        <FormInput id={`position-${index}`} name="position" label="Position" placeholder="Software Engineer" value={exp.position || ''} onChange={(e: any) => handleExperienceChange(index, e)} />
                    </div>
                    <div>
                        <label htmlFor={`description-${index}`} className="block text-sm font-bold text-black mb-2">Description</label>
                        <textarea id={`description-${index}`} name="description" rows={4} value={exp.description || ''} onChange={(e: any) => handleExperienceChange(index, e)}
                            placeholder="Describe your role and achievements..."
                            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/50 transition-all duration-300"
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <FormInput id={`start_date-${index}`} name="start_date" label="Start Date" type="date" value={exp.start_date || ''} onChange={(e: any) => handleExperienceChange(index, e)} />
                        <FormInput id={`end_date-${index}`} name="end_date" label="End Date" type="date" value={exp.end_date || ''} onChange={(e: any) => handleExperienceChange(index, e)} />
                    </div>
                    {data.experience.length > 1 && (
                         <button onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-black/40 hover:text-red-500 transition-colors">
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            ))}
            <button onClick={addExperience} className="w-full flex items-center justify-center space-x-2 text-black font-bold py-3 px-4 rounded-xl hover:bg-black/10 transition-colors">
                <Plus size={20} />
                <span>Add Experience</span>
            </button>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button onClick={prevStep} className="w-full flex items-center justify-center bg-black/10 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:bg-black/20">
                     <ChevronLeft className="w-6 h-6 mr-2" /> Back
                </button>
                <button onClick={nextStep} className="w-full group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105">
                     <div className="relative flex items-center justify-center space-x-3">
                        <span>Next: Skills</span> <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- Step 4: Skills & Certifications ---
const SkillsCertsStep = ({ data, setData, prevStep, submitForm }: any) => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <label className="block text-sm font-bold text-black mb-2">Skills</label>
                <TagInput
                    items={data.skills || []}
                    setItems={(skills: string[]) => setData({ ...data, skills })}
                    placeholder="Type a skill and press Enter"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-black mb-2">Certifications</label>
                 <TagInput
                    items={data.certifications || []}
                    setItems={(certs: string[]) => setData({ ...data, certifications: certs })}
                    placeholder="Type a certification and press Enter"
                />
            </div>
             <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button onClick={prevStep} className="w-full flex items-center justify-center bg-black/10 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:bg-black/20">
                     <ChevronLeft className="w-6 h-6 mr-2" /> Back
                </button>
                <button onClick={submitForm} className="w-full group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105">
                     <div className="relative flex items-center justify-center space-x-3">
                        <span>Generate My Roadmap</span>
                        <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </button>
            </div>
        </div>
    );
};


// --- Main Form Component ---
function InputFormPage() {
    useEffect(() => {
        document.title = 'NextStep | Complete Your Profile';
    }, []);

    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        user: {},
        education: [{}],
        experience: [{}],
        skills: [],
        certifications: []
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    
    const submitForm = () => {
        console.log("Final Form Data:", JSON.stringify(formData, null, 2));
        navigate('/career-path', { state: { formData } });
    };

    const steps = [
        { number: 1, title: 'Personal', icon: User },
        { number: 2, title: 'Education', icon: BookOpen },
        { number: 3, title: 'Experience', icon: Briefcase },
        { number: 4, title: 'Skills', icon: Award }
    ];

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-12 pt-32">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-3">
                            Complete Your Profile
                        </h1>
                        <p className="text-base sm:text-lg text-black/70">
                            This information helps us build the most accurate career roadmap for you.
                        </p>
                    </div>

                    <div className="flex items-center justify-center w-full max-w-xl mx-auto mb-12">
                         {steps.map((s, index) => (
                            <React.Fragment key={s.number}>
                                <div className="flex flex-col items-center text-center">
                                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.number ? 'bg-black text-white border-black' : 'bg-white text-black/50 border-black/20'}`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <p className={`mt-2 text-xs sm:text-sm font-bold w-20 ${step >= s.number ? 'text-black' : 'text-black/50'}`}>{s.title}</p>
                                </div>
                                {index < steps.length - 1 && (
                                     <div className={`flex-1 h-1 rounded-full mx-2 ${step > s.number ? 'bg-black' : 'bg-black/10'}`}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-6 sm:p-10 shadow-lg">
                        {step === 1 && <UserStep data={formData} setData={setFormData} nextStep={nextStep} />}
                        {step === 2 && <EducationStep data={formData} setData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
                        {step === 3 && <ExperienceStep data={formData} setData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
                        {step === 4 && <SkillsCertsStep data={formData} setData={setFormData} prevStep={prevStep} submitForm={submitForm} />}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default InputFormPage;

