import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">TeleHealth</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition">Services</a>
          <a href="#ai" className="text-gray-700 hover:text-blue-600 font-medium transition">AI</a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition">Testimonials</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition">Contact</a>
          <a href="#download" className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow hover:scale-105 transition">Book Now</a>
        </div>
        {/* Modern menu button for mobile */}
        <button className="md:hidden group relative w-10 h-10 flex flex-col items-center justify-center" aria-label="Open menu">
          <span className="block w-7 h-1 bg-blue-600 rounded transition-all duration-300 group-hover:w-8"></span>
          <span className="block w-7 h-1 bg-blue-600 rounded mt-1.5 transition-all duration-300 group-hover:w-8"></span>
          <span className="block w-7 h-1 bg-blue-600 rounded mt-1.5 transition-all duration-300 group-hover:w-8"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
