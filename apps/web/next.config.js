const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NEXT_PUBLIC_PROJECT_ENV !== "PRODUCTION",
  register: true,
  reloadOnOnline: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
};

module.exports = withPWA(nextConfig);
