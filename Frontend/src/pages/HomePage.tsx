// FILE: src/pages/HomePage.tsx

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, File, X, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragState: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragState);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      {/* MODIFICATION: Re-added padding to offset the fixed header */}
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-12">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-4">
            Let's Get Started
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black/70 mb-10 max-w-2xl mx-auto">
            Upload your resume for the fastest results, or fill out your details manually.
          </p>

          <div 
            className={`
              relative w-full border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
              ${isDragging ? 'border-black bg-black/5 scale-105' : 'border-black/20 hover:border-black/40'}
              p-6 md:p-8
            `}
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => handleDragEvents(e, true)}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            {!file ? (
              <div className="flex flex-col items-center justify-center space-y-4 text-black/60">
                <UploadCloud className="w-12 h-12 md:w-16 md:h-16" />
                <p className="text-base md:text-lg font-semibold">
                  <span className="text-black font-bold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs md:text-sm">PDF, DOC, or DOCX (max 5MB)</p>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center space-y-4 text-black">
                <File className="w-12 h-12 md:w-16 md:h-16 text-black" />
                <p className="text-base md:text-lg font-semibold truncate w-full px-12">{file.name}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent re-opening file dialog
                    removeFile();
                  }}
                  className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* MODIFICATION: Restructured the CTA section */}
          <div className="mt-8 flex flex-col items-center">
            <Link to={file ? "/input-form" : "#"} className="w-full sm:w-auto">
              <button 
                className={`
                  w-full sm:w-auto group relative overflow-hidden bg-black text-white rounded-2xl font-bold
                  transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  ${!file && 'opacity-50 cursor-not-allowed'}
                  px-8 py-4 text-base md:px-10 md:py-5 md:text-lg
                `}
                disabled={!file}
              >
                <div className="relative flex items-center justify-center space-x-3">
                  <span>Continue with Resume</span>
                  <ArrowRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </button>
            </Link>

            {/* MODIFICATION: Made lines longer and "OR" text bigger */}
            <div className="flex items-center justify-center w-full max-w-lg my-8">
              <div className="h-px bg-black/10 flex-grow"></div>
              <span className="mx-6 text-base font-semibold text-black/50">OR</span>
              <div className="h-px bg-black/10 flex-grow"></div>
            </div>

            <Link to="/input-form" className="w-full sm:w-auto">
              {/* MODIFICATION: Changed button to match primary style */}
              <button 
                className={`
                  w-full sm:w-auto group relative overflow-hidden bg-black text-white rounded-2xl font-bold
                  transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  px-8 py-4 text-base md:px-10 md:py-5 md:text-lg
                `}
              >
                <div className="relative flex items-center justify-center space-x-3">
                  <span>Enter Details Manually</span>
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

export default HomePage;
