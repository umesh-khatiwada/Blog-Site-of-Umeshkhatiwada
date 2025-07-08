"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col md:flex-row justify-between p-4 shadow-md relative z-50">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Image
          src="/assets/profile.png"
          alt="Umesh Khatiwada"
          width={50}
          height={100}
          className="md:w-[60px] md:h-[90px]"
        />
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobile menu overlay/backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden animate-fadeIn"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav
        className={`
          ${isMenuOpen ? 'fixed top-0 left-0 w-4/5 max-w-xs h-full bg-gray-900 dark:bg-gray-800 text-white z-50 p-8 flex flex-col gap-6 animate-slideIn' : 'hidden'}
          md:static md:flex md:flex-row md:items-center md:space-x-8 md:bg-transparent md:w-auto md:p-0 md:gap-0
          transition-all duration-300 ease-in-out
        `}
        style={isMenuOpen ? { boxShadow: '2px 0 16px rgba(0,0,0,0.15)' } : {}}
        aria-label="Main navigation"
      >
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 w-full md:w-auto">
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
              className="block py-3 px-4 rounded md:inline-block md:p-0 text-gray-900 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 focus:text-green-600 dark:focus:text-green-400 transition-colors text-lg"
              tabIndex={isMenuOpen || typeof window === 'undefined' ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      {/* Animations for mobile menu */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.25s cubic-bezier(0.4,0,0.2,1); }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
      `}</style>
    </header>
  );
}