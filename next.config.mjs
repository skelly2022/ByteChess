/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import pkg from "webpack";
const { DefinePlugin } = pkg;
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, { dev }) => {
    // Set production mode for Webpack
    if (!dev) {
      config.mode = "production";
      config.plugins.push(
        new DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
      );
    }

    return config;
  },
};

export default config;
