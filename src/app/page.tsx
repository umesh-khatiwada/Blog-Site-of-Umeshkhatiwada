"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /article when the component mounts
    router.push('/article');
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between text-white"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
    </div>
  );
}
