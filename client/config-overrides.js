const path = require('path');

module.exports = function override(config, env) {
  // Use the webpack.config.js for dev server settings
  config.devServer = require('./webpack.config').devServer;
  
  return config;
};