/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: 24,
            typescript: true,
            removeDimensions: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
