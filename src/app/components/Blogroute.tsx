// components/DynamicBanner.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DynamicBanner = () => {
  const [pathName, setPathName] = useState<string | null>(null);
  const pathname = usePathname(); // Get the current pathname from usePathname

  useEffect(() => {
    setPathName(pathname); // Update pathName whenever pathname changes
  }, [pathname]);

  if (pathName === null) {
    return (
      <div className="relative w-full h-50 bg-fixed bg-center bg-cover">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 text-center py-20">
          <h1 className="text-4xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    ); // Return a loading state while pathName is not set
  }

  return (
    <div
      className="relative w-full h-50 bg-fixed bg-center bg-cover"
      style={{ backgroundImage: 'url(/assets/background-image.jpg)' }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 text-center py-20">
        <h1 className="text-4xl font-bold text-white">DevOps/Coder Blogs</h1>
        <h2 className="text-3xl font-bold text-white">{pathName.replace(/\//g, ' / ')}</h2>
      </div>
    </div>
  );
};

export default DynamicBanner;
