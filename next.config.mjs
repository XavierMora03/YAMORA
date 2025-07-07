/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '**',
        }
      ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '20mb',
      },
    },
  };
  
  export default nextConfig;
  
