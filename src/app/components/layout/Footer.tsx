"use client";
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaCode } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 relative overflow-hidden">
      <div className="container mx-auto px-8 sm:px-16 lg:px-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center text-white">
              <FaCode className="mr-2 text-purple-500" />
              Digital Footprint
            </h2>
            <p className="text-gray-400">Crafting digital experiences that leave a lasting impression.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transform hover:scale-110 transition-transform">
                <FaFacebook className="text-gray-500 hover:text-purple-500" size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transform hover:scale-110 transition-transform">
                <FaTwitter className="text-gray-500 hover:text-purple-500" size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transform hover:scale-110 transition-transform">
                <FaInstagram className="text-gray-500 hover:text-purple-500" size={24} />
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`https://umeshkhatiwada.com.np/${item.toLowerCase()}.html`} className="hover:text-purple-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Newsletter</h3>
            <p className="text-gray-400">Stay updated with our latest news and offers.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="p-2 rounded-l-md flex-grow bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                type="submit" 
                className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} umeshkhatiwada.com.np. All rights reserved.</p>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(139, 92, 246, 0.05)" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,181.3C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </footer>
  );
}