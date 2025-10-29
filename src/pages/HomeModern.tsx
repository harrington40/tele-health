import React from 'react';
import Navbar from '../components/Layout/NavbarModern';

const HomeModern: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* HeroSection, StatsSection, AIHighlight, ServiceGrid, Testimonials, AppDownload, Footer will be added here */}
      <main className="pt-20">
        {/* Placeholder for sections */}
        <section className="h-96 flex items-center justify-center text-3xl text-gray-400">Hero Section Placeholder</section>
        <section className="h-40 flex items-center justify-center text-xl text-gray-400">Stats Section Placeholder</section>
        <section className="h-60 flex items-center justify-center text-xl text-gray-400">AI Highlight Placeholder</section>
        <section className="h-80 flex items-center justify-center text-xl text-gray-400">Service Grid Placeholder</section>
        <section className="h-60 flex items-center justify-center text-xl text-gray-400">Testimonials Placeholder</section>
        <section className="h-40 flex items-center justify-center text-xl text-gray-400">App Download Placeholder</section>
        <footer className="h-32 flex items-center justify-center text-lg text-gray-500 bg-gradient-to-b from-blue-900 to-blue-700">Footer Placeholder</footer>
      </main>
    </div>
  );
};

export default HomeModern;
