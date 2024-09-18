"use client"; // Add this line to mark the component as a Client Component

import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col md:flex-row justify-between p-6 bg-gray-900 shadow-md relative">
      <div className="flex items-center justify-between">
        <Image
          src="/assets/logo.png" // Your logo image here
          alt="The Cloud Mechanic Logo"
          width={140}
          height={140}
        />
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl text-white"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
      <nav
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:flex md:space-x-8 space-y-4 md:space-y-0 text-lg bg-gray-800 md:bg-transparent w-full md:w-auto text-white mt-4 md:mt-0 md:relative p-4 md:p-0 transition-all duration-300 ease-in-out`}
      >
        <div className={`p-4 rounded-lg shadow-lg md:shadow-none bg-gray-800 md:bg-transparent flex flex-col md:flex-row md:items-center md:space-x-8`}>
          {[
            { href: "https://umeshkhatiwada.com.np", label: "Home" },
            { href: "https://umeshkhatiwada.com.np/about.html", label: "About" },
            { href: "https://umeshkhatiwada.com.np/resume.html", label: "Resume" },
            { href: "https://umeshkhatiwada.com.np/services.html", label: "Services" },
            { href: "https://umeshkhatiwada.com.np/portfolio.html", label: "Portfolio" },
            { href: "/article/", label: "Blog" },
            { href: "https://umeshkhatiwada.com.np/contact.html", label: "Contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block md:inline-block text-gray-200 hover:text-green-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}