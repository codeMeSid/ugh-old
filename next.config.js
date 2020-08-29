const withImages = require("next-images");
module.exports = withImages({
  devIndicators: {
    autoPrerender: false,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
});
