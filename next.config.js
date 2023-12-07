/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["sfzbucket.s3.ca-central-1.amazonaws.com"],
    minimumCacheTTL: 60,
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
