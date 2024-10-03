'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DynamicBanner = () => {
  const [pathName, setPathName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setPathName(pathname);
  }, [pathname]);

  if (pathName === null) {
    return (
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 opacity-20"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          DevOps/Coder Blogs
        </h1>
        <h2 className="text-2xl font-semibold text-blue-300">
          {pathName.replace(/\//g, ' / ')}
        </h2>
        <div className="mt-4 flex space-x-2">
          {['Docker', 'Kubernetes', 'CI/CD', 'Cloud'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-700 text-blue-100 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicBanner;