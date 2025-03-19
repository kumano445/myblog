/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // "export" を削除
  webpack: (config) => {
    config.watchOptions = {
      poll: 300,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
