"use client";
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaCode } from 'react-icons/fa';
import axios from 'axios';
import React from 'react';

export default function Footer() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}newsletters`,
        {
          data: {
            Email: email,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_KEY}`,
          },
        }
      );

      setMessage(response.status === 201 ? 'Subscription successful!' : 'Subscription failed.');
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className=" text-gray-300 py-12 relative overflow-hidden">
      <div className="container mx-auto px-8 sm:px-16 lg:px-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center text-white">
              <FaCode className="mr-2 text-green-400" />
              Digital Footprint
            </h2>
            <p className="text-white-400">Crafting digital experiences that leave a lasting impression.</p>
            <div className="flex space-x-4">
              {[
                { href: 'https://facebook.com', icon: <FaFacebook /> },
                { href: 'https://twitter.com', icon: <FaTwitter /> },
                { href: 'https://instagram.com', icon: <FaInstagram /> },
              ].map(({ href, icon }, index) => (
                <a key={index} href={href} target="_blank" rel="noopener noreferrer" aria-label="Social Media" className="transform hover:scale-110 transition-transform">
                  {React.cloneElement(icon, { className: 'text-white-500 hover:text-green-400', size: 24 })}
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`https://umeshkhatiwada.com.np/${item.toLowerCase()}.html`} className="hover:text-green-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Newsletter</h3>
            <p className="text-white-400">Stay updated with our latest news and offers.</p>
            <form className="flex" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 rounded-l-md flex-grow bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && <p className="text-white-500 mt-2">{message}</p>}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-white-500">© {new Date().getFullYear()} umeshkhatiwada.com.np. All rights reserved.</p>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(139, 92, 246, 0.05)" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,181.3C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </footer>
  );
}