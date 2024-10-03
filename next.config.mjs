/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static export
    // output: 'export',
    reactStrictMode: false,
    trailingSlash: true,
    images: {
      unoptimized: true,  // Disable image optimization for static export
    },
  };
  
  export default nextConfig;
  