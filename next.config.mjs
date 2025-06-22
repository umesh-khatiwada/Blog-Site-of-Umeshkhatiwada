/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      domains: ['api-blog.do.umeshkhatiwada.com.np'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api-blog.do.umeshkhatiwada.com.np',
          pathname: '/**',
        },
      ],
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  