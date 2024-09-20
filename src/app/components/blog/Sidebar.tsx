import React, { ReactNode } from 'react';
import Link from 'next/link';
import { FaCode, FaGitAlt, FaTerminal, FaCogs } from 'react-icons/fa'; // Import from react-icons

export default function SidebarWithContent({ children }: { children: ReactNode }) {
  const reactTutorials = [
    'React Home', 'React Setup', 'React Getting Started', 'React ES6',
    'React Render HTML', 'React JSX', 'React Components', 'React Class',
    'React Props', 'React Events', 'React Conditional', 'React Lists',
    'React Forms', 'React Router', 'React Memo', 'React CSS Styling'
  ];
  const reactHooks = [
    'What is a Hook?', 'React useState Hook', 'React useEffect Hook',
    'React useContext', 'React useRef', 'React useReducer', 'React useCallback'
  ];
  const additionalLinks = [
    'New Feature 1', 'New Feature 2', 'New Feature 3'
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black">
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 overflow-y-auto md:h-screen md:sticky md:top-0 hide-scrollbar">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <FaCode className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-blue-400">React Docs</h2>
          </div>
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaTerminal className="text-green-400" size={18} />
              <h3 className="text-lg font-semibold text-green-400">Tutorials</h3>
            </div>
            <ul className="space-y-1 pl-6">
              {reactTutorials.map((tutorial, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-400 hover:text-white block py-1 text-sm">
                    {tutorial}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaGitAlt className="text-purple-400" size={18} />
              <h3 className="text-lg font-semibold text-purple-400">Hooks</h3>
            </div>
            <ul className="space-y-1 pl-6">
              {reactHooks.map((hook, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-400 hover:text-white block py-1 text-sm">
                    {hook}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaCogs className="text-yellow-400" size={18} />
              <h3 className="text-lg font-semibold text-yellow-400">New Section</h3>
            </div>
            <ul className="space-y-1 pl-6">
              {additionalLinks.map((link, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-400 hover:text-white block py-1 text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-3 md:p-3 hide-scrollbar">
        <div className="max-w-full">
          {children}
        </div>
      </main>
      {/* <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style> */}
    </div>
  );
}
