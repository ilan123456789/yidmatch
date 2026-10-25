/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};
const nextConfig = {
  serverExternalPackages: [
    "firebase-admin",
    "jwks-rsa",
    "jose"
  ]
};
export default nextConfig;
