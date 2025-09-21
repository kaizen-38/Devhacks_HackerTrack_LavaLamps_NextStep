// FILE: src/pages/PomodoroPage.tsx

import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Pomodoro Timer Component ---
const PomodoroTimer = () => {
    const FOCUS_DURATION = 25 * 60;
    const BREAK_DURATION = 5 * 60;

    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // @ts-ignore
            if (window.Tone) {
                // @ts-ignore
                const synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease("C5", "8n");
            }
            setIsActive(false);
            const newMode = mode === 'focus' ? 'break' : 'focus';
            setMode(newMode);
            setTimeLeft(newMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const progress = (mode === 'focus' ? (FOCUS_DURATION - timeLeft) / FOCUS_DURATION : (BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100;

    return (
        <div className="text-center backdrop-blur-xl bg-white/60 border border-black/10 rounded-3xl p-8 shadow-lg max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-black mb-2">{mode === 'focus' ? 'Focus Session' : 'Break Time'}</h2>
            <p className="text-black/70 mb-8">{mode === 'focus' ? 'Stay on task and be productive.' : 'Relax and recharge.'}</p>
            
            <div className="relative w-64 h-64 mx-auto">
                 <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle className="text-black/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="54" cx="60" cy="60" />
                    <circle
                        className={`transition-all duration-500 ${mode === 'focus' ? 'text-black' : 'text-green-500'}`}
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={(2 * Math.PI * 54) * (1 - progress / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="54"
                        cx="60"
                        cy="60"
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-mono font-bold text-black">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
                <button onClick={resetTimer} className="text-black/60 hover:text-black transition-colors p-3">
                    <RefreshCw size={24} />
                </button>
                <button onClick={toggleTimer} className="bg-black text-white rounded-full p-6 hover:scale-110 transition-transform shadow-lg">
                    {isActive ? <Pause size={32} /> : <Play size={32} />}
                </button>
                 <div className="w-12 h-12"></div>
            </div>
        </div>
    );
};

function PomodoroPage() {
    useEffect(() => {
        document.title = 'NextStep | Focus Timer';
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-black flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-12">
                <PomodoroTimer />
            </main>
            <Footer />
        </div>
    );
}

export default PomodoroPage;
