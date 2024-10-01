/** @type {import('next').NextConfig} */
import typography from '@tailwindcss/typography';
const nextConfig = {
    // Enable static export
    // output: 'export',
    reactStrictMode: false,
    // Specify any additional settings as needed
    // Example: base path for GitHub Pages or subdirectories
    // basePath: '/my-subdirectory',
  
    // Handle trailing slashes in URLs
    trailingSlash: true,
    plugins: [typography],
    // Image optimization settings for static export
    images: {
      unoptimized: true,  // Disable image optimization for static export
    },
  };
  
  export default nextConfig;
  