module.exports = {
  // Other rules...
  resolve: {
    fallback: { util: require.resolve('util/') },
  },
};
