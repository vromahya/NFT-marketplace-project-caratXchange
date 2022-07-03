const webpack = require('webpack');

module.exports = {
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  // Other rules...
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      buffer: require.resolve('buffer'),
    },
  },
};
