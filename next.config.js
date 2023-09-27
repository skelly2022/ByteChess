// next.config.js
// next.config.js
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "static/media/[name].[ext]", // Update the path as needed
          },
        },
      ],
    });
    return config;
  },
};
