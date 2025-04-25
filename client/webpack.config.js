const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  // Customize webpack-dev-server
  devServer: {
    // Use setupMiddlewares instead of the deprecated options
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      
      // You can add custom middleware here if needed
      
      return middlewares;
    },
    
    // Proxy API requests to your backend server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
};