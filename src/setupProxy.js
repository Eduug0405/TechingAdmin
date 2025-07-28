const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://teching.tech',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remueve /api del path
      },
      logLevel: 'debug'
    })
  );
};
