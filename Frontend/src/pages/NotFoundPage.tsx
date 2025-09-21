// FILE: src/pages/NotFoundPage.tsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function NotFoundPage() {
    useEffect(() => {
        document.title = 'NextStep | Page Not Found';
    }, []);

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-12 pt-32">
                <div className="text-center">
                    <div className="relative inline-block">
                        <h1 className="text-9xl font-black text-black">404</h1>
                        <div className="absolute inset-0 bg-black/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    </div>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-black">Page Not Found</h2>
                    <p className="mt-4 text-lg text-black/70 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have taken a different path.
                    </p>
                    <div className="mt-10">
                        <Link to="/">
                             <button className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                <div className="relative flex items-center justify-center space-x-3">
                                    <ArrowLeft className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-2" />
                                    <span>Go Back Home</span>
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default NotFoundPage;
