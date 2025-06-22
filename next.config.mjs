/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api-blog.do.umeshkhatiwada.com.np',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'api-blog-image-assests.s3.us-east-1.amazonaws.com',
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
  