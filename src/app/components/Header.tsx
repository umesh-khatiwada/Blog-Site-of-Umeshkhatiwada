"use client"; // Add this line to mark the component as a Client Component

import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col md:flex-row justify-between p-8 bg-black relative"> {/* Relative positioning for the header */}
      <div className="flex items-center justify-between">
        <Image
          src="/assets/logo.png" // Your logo image here
          alt="The Cloud Mechanic Logo"
          width={140}
          height={140}
        />
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl text-white" // Set text color to white for visibility
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
      {/* Responsive menu for both mobile and desktop */}
      <nav
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:flex md:space-x-8 space-y-4 md:space-y-0 text-lg bg-black md:bg-transparent w-full md:w-auto text-white mt-4 md:mt-0 md:relative p-4 md:p-0 transition-all duration-300 ease-in-out md:static`}>
        {/* Boxed style applied for mobile, flex style for desktop */}
        <div className={`p-4 rounded-lg shadow-lg md:shadow-none bg-gray-100 md:bg-transparent flex flex-col md:flex-row md:items-center md:space-x-8`}>
          <a href="https://umeshkhatiwada.com.np" className="block md:inline-block text-black md:text-white hover:text-green-500">Home</a>
          <a href="https://umeshkhatiwada.com.np/about.html" className="block md:inline-block text-black md:text-white hover:text-green-500">About</a>
          <a href="https://umeshkhatiwada.com.np/resume.html" className="block md:inline-block text-black md:text-white hover:text-green-500">Resume</a>
          <a href="https://umeshkhatiwada.com.np/services.html" className="block md:inline-block text-black md:text-white hover:text-green-500">Services</a>
          <a href="https://umeshkhatiwada.com.np/portfolio.html" className="block md:inline-block text-black md:text-white hover:text-green-500">Portfolio</a>
          <a href="/article/" className="block md:inline-block text-black md:text-white hover:text-green-500">Blog</a>
          <a href="https://umeshkhatiwada.com.np/contact.html" className="block md:inline-block text-black md:text-white hover:text-green-500">Contact</a>
        </div>
      </nav>
    </header>
  );
}
