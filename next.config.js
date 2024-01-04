/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["sfzbucket.s3.ca-central-1.amazonaws.com"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**sfzbucket.s3.ca-central-1.amazonaws.com**",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
