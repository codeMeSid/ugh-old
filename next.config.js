const withImages = require("next-images");
const withSourceMaps = require("@zeit/next-source-maps");

module.exports = withSourceMaps(
  withImages({
    devIndicators: {
      autoPrerender: false,
    },
    webpackDevMiddleware: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
  })
);
