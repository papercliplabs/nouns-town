/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "*",
            port: "",
            pathname: "/**"
          },
        ]
    },
    redirects: () => {
      return [
        {
          source: '/',
          destination: '/2024',
          permanent: false,
        },
      ]
    }
};

export default nextConfig;
