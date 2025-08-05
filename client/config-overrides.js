const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util"),
    "crypto": require.resolve("crypto-browserify"),
    "vm": require.resolve("vm-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "assert": require.resolve("assert"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "net": false,
    "tls": false,
  };
  
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];
  
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Critical dependency: the request of a dependency is an expression/,
  ];
  
  return config;
};