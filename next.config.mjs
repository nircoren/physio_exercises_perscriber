/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            // Routes this applies to
            source: "/api/(.*)",
            // Headers
            headers: [
              // Allow for specific domains to have access or * for all
              {
                key: "Access-Control-Allow-Origin",
                value: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS}, https://www.youtube.com`,
                // value: process.env.ALLOWED_ORIGIN,
              },
              // Allows for specific methods accepted
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              // Allows for specific headers accepted (These are a few standard ones)
              {
                key: "Access-Control-Allow-Headers",
                value: "Content-Type, Authorization",
              },
            ],
          },
        ];
      },
};

export default nextConfig;
