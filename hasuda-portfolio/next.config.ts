import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.st-note.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/artworks/:id.html", destination: "/artworks/:id", permanent: true },
      { source: "/ComingSoon.html", destination: "/coming-soon", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/artworks/artworks.html", destination: "/artworks", permanent: true },
      { source: "/blogs/blogs.html", destination: "/blogs", permanent: true },
    ];
  },
};

export default nextConfig;
