import Image from 'next/image'
import { FaTwitter, FaInstagram, FaSkype, FaLinkedin } from 'react-icons/fa'

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
      {/* Navigation */}
      <header className="w-full flex justify-between p-8">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo.png" // Your logo image here
            alt="The Cloud Mechanic Logo"
            width={60}
            height={60}
          />
          <h1 className="text-2xl font-bold">The Cloud Mechanic</h1>
        </div>
        <nav className="flex space-x-8 text-lg">
          <a href="#" className="hover:text-green-500">Home</a>
          <a href="#about" className="hover:text-green-500">About</a>
          <a href="#resume" className="hover:text-green-500">Resume</a>
          <a href="#services" className="hover:text-green-500">Services</a>
          <a href="#portfolio" className="hover:text-green-500">Portfolio</a>
          <a href="#blog" className="hover:text-green-500">Blog</a>
          <a href="#contact" className="hover:text-green-500">Contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center text-center mt-20">
        <h2 className="text-6xl font-bold mb-4">Umesh Khatiwada</h2>
        <p className="text-3xl font-semibold mb-6"> Im a DevOps Engineer</p>

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
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-black bg-opacity-75 text-center">
        <p className="text-gray-400">&copy; 2024 The Cloud Mechanic</p>
      </footer>
    </div>
  )
}
