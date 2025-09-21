// FILE: src/pages/PomodoroPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Settings, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Animated Flip Unit Component ---
const FlipUnit = ({ digit }: { digit: string }) => {
    const [currentDigit, setCurrentDigit] = useState(digit);
    const [previousDigit, setPreviousDigit] = useState(digit);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (currentDigit !== digit) {
            setPreviousDigit(currentDigit);
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentDigit(digit);
                setIsFlipping(false);
            }, 600); // Animation duration
        }
    }, [digit, currentDigit]);

    return (
        <div className="relative w-28 h-40 md:w-40 md:h-56 rounded-lg shadow-xl" style={{ perspective: '1000px' }}>
            {/* Static bottom half */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black rounded-b-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-7xl md:text-9xl font-mono font-bold -translate-y-1/2">
                    {currentDigit}
                </div>
            </div>
             {/* Static top half */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-black rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-7xl md:text-9xl font-mono font-bold translate-y-1/2">
                    {currentDigit}
                </div>
            </div>
            {/* Flipping top half */}
            <div
                className={`absolute inset-x-0 top-0 h-1/2 bg-black rounded-t-lg overflow-hidden origin-bottom transition-transform duration-500 ease-in-out ${isFlipping ? 'animate-flip-top' : ''}`}
                style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-7xl md:text-9xl font-mono font-bold translate-y-1/2">
                    {previousDigit}
                </div>
            </div>
             {/* Flipping bottom half */}
            <div
                className={`absolute inset-x-0 bottom-0 h-1/2 bg-black rounded-b-lg overflow-hidden origin-top transition-transform duration-500 ease-in-out ${isFlipping ? 'animate-flip-bottom' : ''}`}
                style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-7xl md:text-9xl font-mono font-bold -translate-y-1/2">
                    {currentDigit}
                </div>
            </div>
            {/* Divider */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-px h-0.5 bg-gray-800 z-10"></div>
        </div>
    );
};


// --- Settings Modal Component ---
const SettingsModal = ({ isOpen, onClose, durations, setDurations }: any) => {
    if (!isOpen) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        setDurations({
            focus: Math.max(1, Number(formData.get('focus'))) * 60,
            shortBreak: Math.max(1, Number(formData.get('shortBreak'))) * 60,
            longBreak: Math.max(1, Number(formData.get('longBreak'))) * 60,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6 relative animate-fade-in-up">
                <h2 className="text-2xl font-bold text-black">Timer Settings</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-black transition-colors"><X /></button>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-black mb-2 block">Focus (minutes)</label>
                        <input type="number" name="focus" defaultValue={durations.focus / 60} min="1" className="w-full p-3 border border-black/10 rounded-xl" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-black mb-2 block">Short Break (minutes)</label>
                        <input type="number" name="shortBreak" defaultValue={durations.shortBreak / 60} min="1" className="w-full p-3 border border-black/10 rounded-xl" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-black mb-2 block">Long Break (minutes)</label>
                        <input type="number" name="longBreak" defaultValue={durations.longBreak / 60} min="1" className="w-full p-3 border border-black/10 rounded-xl" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-black/5 text-black font-bold py-3 px-6 rounded-xl hover:bg-black/10 transition-colors">Cancel</button>
                        <button type="submit" className="bg-black text-white font-bold py-3 px-6 rounded-xl hover:bg-black/80 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Pomodoro Component ---
function PomodoroPage() {
    useEffect(() => {
        document.title = 'NextStep | Focus Timer';
        // Add keyframe animations to the document head
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes flip-top { 0% { transform: rotateX(0deg); } 100% { transform: rotateX(-90deg); } }
            @keyframes flip-bottom { 0% { transform: rotateX(90deg); } 100% { transform: rotateX(0deg); } }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    const [durations, setDurations] = useState({ focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 });
    const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
    const [timeLeft, setTimeLeft] = useState(durations.focus);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const intervalRef = useRef<number | null>(null);

    // Update timer when durations change from settings
    useEffect(() => {
        setIsActive(false);
        switch (mode) {
            case 'focus': setTimeLeft(durations.focus); break;
            case 'shortBreak': setTimeLeft(durations.shortBreak); break;
            case 'longBreak': setTimeLeft(durations.longBreak); break;
        }
    }, [durations, mode]);

    // Core timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            if (isActive) { // Only switch modes if timer was running
                const newSessionCount = mode === 'focus' ? sessionCount + 1 : sessionCount;
                setSessionCount(newSessionCount);
                const nextMode = mode === 'focus' ? (newSessionCount % 4 === 0 ? 'longBreak' : 'shortBreak') : 'focus';
                setMode(nextMode);
            }
            setIsActive(false);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isActive, timeLeft, mode, sessionCount]);


    const selectMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
        if (isActive) {
            if (!window.confirm('The timer is running. Are you sure you want to switch?')) return;
        }
        setMode(newMode);
        setIsActive(false);
    };

    const formatTime = (seconds: number) => ({
        minutes: Math.floor(seconds / 60).toString().padStart(2, '0'),
        seconds: (seconds % 60).toString().padStart(2, '0'),
    });

    const { minutes, seconds } = formatTime(timeLeft);
    const modes = { focus: "Pomodoro", shortBreak: "Short Break", longBreak: "Long Break" };

    return (
        <>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} durations={durations} setDurations={setDurations} />
            <div className="min-h-screen bg-gray-50 text-black flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-12">
                    <div className="w-full max-w-4xl p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-black/10 rounded-3xl shadow-lg flex flex-col items-center">
                        {/* Mode Selectors */}
                        <div className="flex items-center gap-2 bg-black/5 p-2 rounded-xl mb-8">
                            {Object.keys(modes).map(m => (
                                <button key={m} onClick={() => selectMode(m as any)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === m ? 'bg-black text-white' : 'text-black/60 hover:bg-black/10'}`}>
                                    {modes[m as keyof typeof modes]}
                                </button>
                            ))}
                        </div>

                        {/* Flip Clock */}
                        <div className="flex justify-center items-center gap-2 md:gap-4 mb-8">
                            <FlipUnit digit={minutes[0]} />
                            <FlipUnit digit={minutes[1]} />
                            <span className="text-black text-6xl md:text-8xl font-bold animate-pulse">:</span>
                            <FlipUnit digit={seconds[0]} />
                            <FlipUnit digit={seconds[1]} />
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center gap-4">
                             <button onClick={() => { setIsActive(false); setTimeLeft(durations[mode]); }} className="p-4 text-black/60 hover:text-black transition-colors" title="Reset"><RefreshCw size={24} /></button>
                            <button onClick={() => setIsActive(!isActive)} className="bg-black text-white px-12 py-4 rounded-xl font-bold text-xl uppercase tracking-widest hover:scale-105 transition-transform">
                                {isActive ? 'Pause' : 'Start'}
                            </button>
                             <button onClick={() => setIsSettingsOpen(true)} className="p-4 text-black/60 hover:text-black transition-colors" title="Settings"><Settings size={24} /></button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default PomodoroPage;