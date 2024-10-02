/** @type {import('next').NextConfig} */
import typography from '@tailwindcss/typography';
const nextConfig = {
    // Enable static export
    // output: 'export',
    reactStrictMode: false,
    trailingSlash: true,
    plugins: [typography],
    images: {
      unoptimized: true,  // Disable image optimization for static export
    },
  };
  
  export default nextConfig;
  