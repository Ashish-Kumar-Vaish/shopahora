import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

declare global {
  var mongoose:
    | {
        conn: any;
        promise: any;
      }
    | undefined;
}

export default nextConfig;
