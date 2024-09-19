import { Sidebar } from 'lucide-react';
import Image from 'next/image';
import { FaTwitter, FaInstagram, FaSkype, FaLinkedin } from 'react-icons/fa';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between text-white"
      style={{
        backgroundImage: 'url("/background-hexagons.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
     
      
      {/* Main Content */}
      {/* <main className="flex flex-col items-center text-center mt-20">
        <h2 className="text-6xl font-bold mb-4">Umesh Khatiwada</h2>
        <p className="text-3xl font-semibold mb-6">I am a DevOps Engineer</p>

        <div className="flex space-x-6">
          <a href="https://twitter.com" target="_blank" className="hover:text-blue-500">
            <FaTwitter size={40} />
          </a>
          <a href="https://instagram.com" target="_blank" className="hover:text-pink-500">
            <FaInstagram size={40} />
          </a>
          <a href="https://skype.com" target="_blank" className="hover:text-blue-300">
            <FaSkype size={40} />
          </a>
          <a href="https://linkedin.com" target="_blank" className="hover:text-blue-700">
            <FaLinkedin size={40} />
          </a>
        </div>

        <div className="mt-12">
          <Image
            src="/profile-pic.png" // Replace with your profile image
            alt="Umesh Khatiwada"
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>
      </main> */}

    </div>
  );
}
