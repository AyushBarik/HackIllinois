module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        enforce: 'pre',
        loader: 'source-map-loader',
        exclude: [
          /@solana\/buffer-layout/,
          /superstruct/
        ],
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/],
};
