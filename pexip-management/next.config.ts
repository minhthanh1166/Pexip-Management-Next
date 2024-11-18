// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//   },
//   async redirects() {
//     return [
//       {
//         source: "/unauthorized",
//         destination: "/",
//         permanent: false, // Tạo redirect tạm thời (302)
//       },
//     ];
//   },
// };

// export const config = {
//   matcher: ["/operation/:path*", "/administrator/:path*"], // Middleware chỉ áp dụng cho các route này
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Kích hoạt chế độ React Strict Mode

  // Cấu hình rewrites để proxy API requests
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Đường dẫn frontend
        destination: "https://10.9.30.10/api/:path*", // Đích thực tế của API
      },
    ];
  },
};

export default nextConfig;
