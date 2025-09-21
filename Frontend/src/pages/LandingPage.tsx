// FILE: src/pages/LandingPage.tsx

import React from 'react';

// MODIFICATION: Changed './' to '../' to correctly locate the components folder
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeatureShowcase from '../components/FeatureShowcase';
import UseCases from '../components/UseCases';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

function LandingPage() {
    return (
      <div className="min-h-screen bg-white text-black overflow-x-hidden">
        {/* ... */}
        <Header />
        {/* MODIFICATION: Added padding-top to offset the fixed header */}
        <main className="pt-24">
          <Hero />
          <HowItWorks />
          <FeatureShowcase />
          <UseCases />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    );
  }

export default LandingPage;